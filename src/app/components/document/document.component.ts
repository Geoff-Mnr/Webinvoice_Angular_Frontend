import { Component, inject } from "@angular/core";
import { RouterLink, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { Document } from "../../models/document.interface";
import { DocumentService } from "../../services/document.service";
import { NavigationExtras } from "@angular/router";
import { DocumentAddEditComponent } from "../document-add-edit/document-add-edit.component";
import { OnDestroy } from "@angular/core";

@Component({
  selector: "app-document",
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, HttpClientModule, DocumentAddEditComponent],
  templateUrl: "./document.component.html",
  styleUrl: "./document.component.scss",
})
export class DocumentComponent implements OnDestroy {
  documentService = inject(DocumentService);
  router = inject(Router);
  private subDelete: Subscription | undefined;
  toastr = inject(ToastrService);

  documents: Document[] = [];
  selectedDocument?: Document;

  currentPage = 1;
  totalPage = 1;
  totalItems = 1;
  itemsPerPage = 10;
  search = "";

  ngOnInit() {
    const savedItemsPerPage = localStorage.getItem("itemsPerPage");
    if (savedItemsPerPage) {
      this.itemsPerPage = parseInt(savedItemsPerPage, 10);
    }
    this.getListDocuments();
  }

  searchDocument() {
    this.getListDocuments(this.currentPage);
  }

  getListDocuments(page: number = 1) {
    console.log(page, this.itemsPerPage, this.search);
    this.subDelete = this.documentService.listDocumentsByUser(page, this.itemsPerPage, this.search).subscribe({
      next: (response) => {
        this.documents = response.data.data;
        console.log(this.documents);
        this.totalItems = response.data.total;
        this.totalPage = response.data.last_page;

        if (this.totalItems === 0) {
          this.toastr.info("Aucun document trouvé");
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error("Erreur lors du chargement des documents");
      },
    });
  }

  selectDocument(document: Document) {
    this.selectedDocument = document;
    const navigationExtras: NavigationExtras = {
      state: { document: document },
    };
    this.router.navigate(["/document/edit-document"], navigationExtras);
    console.log(this.selectedDocument);
  }

  addDocument() {
    this.router.navigate(["/document/add-document"]);
  }

  deleteDocument(item: Document) {
    this.subDelete = this.documentService.delete(item.id).subscribe({
      next: (response) => {
        this.toastr.success("Document supprimé avec succès");
        this.getListDocuments();
      },
      error: (error) => {
        this.toastr.error("Erreur lors de la suppression du document");
      },
    });
  }

  onItemsPerPageChange() {
    localStorage.setItem("itemsPerPage", this.itemsPerPage.toString());
    this.getListDocuments();
  }

  ngOnDestroy() {
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
  }
}
