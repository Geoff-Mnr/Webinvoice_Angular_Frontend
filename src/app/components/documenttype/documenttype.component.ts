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
  // Injection des services
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

  // Initialisation du composant
  ngOnInit() {
    const savedItemsPerPage = localStorage.getItem("itemsPerPage");
    if (savedItemsPerPage) {
      this.itemsPerPage = parseInt(savedItemsPerPage, 10);
    }
    this.getListDocumentTypes();
  }

  // Méthode de recherche
  searchDocumentType() {
    this.getListDocumentTypes(this.currentPage);
  }

  //méthode pour récupérer la liste des types de documents
  getListDocumentTypes(page: number = 1) {
    this.subDelete = this.documenttypeService.listDocumenttypesByUser(page, this.itemsPerPage, this.search).subscribe({
      next: (response) => {
        this.documenttypes = response.data;
        this.totalItems = response.meta.total;
        this.totalPage = response.meta.last_page;
        if (this.totalItems === 0) {
          this.toastr.info("Aucun type de document trouvé");
        }
        this.currentPage = page < 1 ? 1 : page > this.totalPage ? this.totalPage : page;
      },
      error: (error) => {
        this.toastr.error("Erreur lors de la récupération des types de documents");
      },
    });
  }

  // Méthode pour sélectionner un type de document
  selectDocumentType(documenttype: DocumentType) {
    this.selectedDocumentType = documenttype;
    const navigationExtras: NavigationExtras = {
      state: { documenttype: documenttype },
    };
    this.router.navigate(["/documenttype/edit-documenttype"], navigationExtras);
  }

  // Méthode pour ajouter un type de document
  addDocumentType() {
    this.router.navigate(["/documenttype/add-documenttype"]);
  }

  // Méthode pour supprimer un type de document
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

  // Méthode pour changer le statut
  getStatusClass(status: string): string {
    switch (status) {
      case "Actif":
        return "status-active";
      case "Inactif":
        return "status-inactive";
      default:
        return "status-inactive";
    }
  }

  // Méthode pour changer le nombre d'éléments par page
  onItemsPerPageChange() {
    localStorage.setItem("itemsPerPage", this.itemsPerPage.toString());
    this.getListDocumentTypes();
  }

  // Méthode pour changer de page
  ngOnDestroy() {
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
  }
}
