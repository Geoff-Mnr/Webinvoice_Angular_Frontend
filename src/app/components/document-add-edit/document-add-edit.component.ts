import { Component, inject } from "@angular/core";
import { FormsModule, FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Document } from "../../models/document.interface";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { DocumentService } from "../../services/document.service";
import { ToastrService } from "ngx-toastr";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-document-add-edit",
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./document-add-edit.component.html",
  styleUrl: "./document-add-edit.component.scss",
})
export class DocumentAddEditComponent {
  selectedDocument: Document = {
    id: 0,
    documenttype_id: 0,
    customer_id: 0,
    reference_number: "",
    document_date: new Date(),
    due_date: new Date(),
    price_htva: 0,
    price_vvac: 0,
    price_total: 0,
    created_at: new Date(),
    updated_at: new Date(),
    status: "",
  };

  router = inject(Router);
  documentService = inject(DocumentService);
  toastr = inject(ToastrService);

  constructor(private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.selectedDocument = navigation.extras.state["document"];
    }
  }

  fb = inject(FormBuilder);

  form = this.fb.group({
    documenttype_id: [0, Validators.required],
    customer_id: [0, Validators.required],
    reference_number: ["", Validators.required],
    document_date: [new Date(), Validators.required],
    due_date: [new Date(), Validators.required],
    price_htva: [0, Validators.required],
    price_vvac: [0, Validators.required],
    price_total: [0, Validators.required],
    created_at: [new Date(), Validators.required],
    updated_at: [new Date(), Validators.required],
    status: ["", Validators.required],
  });

  ngOnInit() {
    this.selectedDocument = this.clone(this.selectedDocument);
  }

  private clone(value: any) {
    return JSON.parse(JSON.stringify(value));
  }

  updateDocument() {
    const item: Document = this.form.value as Document;
    this.documentService.updateDocument(this.selectedDocument.id, item).subscribe({
      next: () => {
        this.toastr.success("Document modifié avec succès");
        this.router.navigate(["/document"]);
      },
      error: (error) => {
        this.toastr.error("Une erreur s'est produite lors de la modification du document");
      },
    });
  }

  createDocument() {
    const item: Document = this.form.value as Document;
    this.documentService.createDocument(item).subscribe({
      next: () => {
        this.toastr.success("Document créé avec succès");
        this.router.navigate(["/document"]);
      },
      error: (error) => {
        this.toastr.error("Une erreur s'est produite lors de la création du document");
      },
    });
  }

  cancel() {
    this.router.navigate(["/document"]);
    this.toastr.info("Opération annulée");
  }
}
