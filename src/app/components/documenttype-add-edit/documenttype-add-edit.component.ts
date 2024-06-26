import { Component, inject } from "@angular/core";
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { DocumentType } from "../../models/documenttype.interface";
import { DocumenttypeService } from "../../services/documenttype.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-documenttype-add-edit",
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./documenttype-add-edit.component.html",
  styleUrl: "./documenttype-add-edit.component.scss",
})
export class DocumenttypeAddEditComponent {
  selectedDocumentType: DocumentType = {
    id: 0,
    reference: "",
    name: "",
    description: "",
    status: "",
    created_at: new Date(),
    updated_at: new Date(),
  };

  router = inject(Router);
  documenttypeService = inject(DocumenttypeService);
  toastr = inject(ToastrService);

  constructor(private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.selectedDocumentType = navigation.extras.state["documenttype"];
      this.selectedDocumentType.status = this.mapStatusToValue(this.selectedDocumentType.status);
    }
  }

  fb = inject(FormBuilder);

  form = this.fb.group({
    name: [this.selectedDocumentType.name, Validators.required],
    description: [this.selectedDocumentType.description, Validators.required],
    status: [this.selectedDocumentType.status, Validators.required],
  });

  ngOnInit() {
    if (this.selectedDocumentType) {
      this.form.patchValue(this.selectedDocumentType);
    }
    this.selectedDocumentType = this.clone(this.selectedDocumentType);
  }

  private clone(value: any) {
    return JSON.parse(JSON.stringify(value));
  }

  mapStatusToValue(status: string): string {
    switch (status) {
      case "Actif":
        return "A";
      case "Inactif":
        return "I";
      default:
        return "";
    }
  }

  mapValueToStatus(value: string): string {
    switch (value) {
      case "A":
        return "Actif";
      case "I":
        return "Inactif";
      default:
        return "";
    }
  }

  updateDocumentType() {
    const item: DocumentType = this.form.value as DocumentType;
    this.documenttypeService.updateDocumenttype(this.selectedDocumentType.id, item).subscribe({
      next: () => {
        this.toastr.success("Type de document modifié avec succès");
        this.router.navigate(["/documenttype"]);
      },
      error: (error) => {
        this.toastr.error("Une erreur est survenue lors de la modification du type de document", error);
      },
    });
  }

  createDocumentType() {
    const item: DocumentType = this.form.value as DocumentType;
    this.documenttypeService.createDocumenttype(item).subscribe({
      next: () => {
        this.toastr.success("Type de document créé avec succès");
        this.router.navigate(["/documenttype"]);
      },
      error: (error) => {
        this.toastr.error("Une erreur est survenue lors de la création du type de document", error);
      },
    });
  }

  cancel() {
    this.router.navigate(["/documenttype"]);
    this.toastr.info("Opération annulée");
  }
}
