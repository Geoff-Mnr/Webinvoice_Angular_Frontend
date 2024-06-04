import { Component, inject } from "@angular/core";
import { RouterLink, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { DocumenttypeService } from "../../services/documenttype.service";
import { DocumentType } from "../../models/documenttype.interface";
import { OnDestroy } from "@angular/core";
import { DocumenttypeAddEditComponent } from "../documenttype-add-edit/documenttype-add-edit.component";
import { NavigationExtras } from "@angular/router";

@Component({
  selector: "app-documenttype",
  standalone: true,
  imports: [DocumenttypeAddEditComponent, RouterLink, CommonModule, FormsModule, HttpClientModule],
  templateUrl: "./documenttype.component.html",
  styleUrl: "./documenttype.component.scss",
})
export class DocumenttypeComponent implements OnDestroy {
  documenttypeService = inject(DocumenttypeService);
  router = inject(Router);
  private subDelete: Subscription | undefined;
  toastr = inject(ToastrService);

  documenttypes: DocumentType[] = [];
  selectedDocumentType?: DocumentType;

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
    this.getListDocumentTypes();
  }

  searchDocumentType() {
    this.getListDocumentTypes(this.currentPage);
  }

  getListDocumentTypes(page: number = 1) {
    console.log(page, this.itemsPerPage, this.search);
    this.subDelete = this.documenttypeService.listDocumenttypesByUser(page, this.itemsPerPage, this.search).subscribe({
      next: (response) => {
        this.documenttypes = response.data;
        console.log(this.documenttypes);
        this.totalItems = response.meta.total;
        this.totalPage = response.meta.last_page;
        if (this.totalItems === 0) {
          this.toastr.info("Aucun type de document trouvé");
        }
        this.currentPage = page < 1 ? 1 : page > this.totalPage ? this.totalPage : page;
      },
      error: (error) => {
        console.error(error);
        this.toastr.error("Erreur lors de la récupération des types de documents");
      },
    });
  }

  selectDocumentType(documenttype: DocumentType) {
    this.selectedDocumentType = documenttype;
    console.log(this.selectedDocumentType);
    const navigationExtras: NavigationExtras = {
      state: { documenttype: documenttype },
    };
    this.router.navigate(["/documenttype/edit-documenttype"], navigationExtras);
  }

  addDocumentType() {
    this.router.navigate(["/documenttype/add-documenttype"]);
  }

  deleteDocumentType(item: DocumentType) {
    if (confirm("Voulez-vous vraiment supprimer ce type de document?")) {
      this.subDelete = this.documenttypeService.delete(item.id).subscribe({
        next: (response) => {
          this.toastr.success("Type de document supprimé avec succès");
          this.getListDocumentTypes(this.currentPage);
        },
        error: (error) => {
          console.error(error);
          this.toastr.error("Erreur lors de la suppression du type de document");
        },
      });
    }
  }

  onItemsPerPageChange() {
    localStorage.setItem("itemsPerPage", this.itemsPerPage.toString());
    this.getListDocumentTypes();
  }

  ngOnDestroy() {
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
  }
}
