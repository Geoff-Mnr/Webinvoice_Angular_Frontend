import { Component, inject } from "@angular/core";
import { FormsModule, FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Document } from "../../models/document.interface";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { DocumentService } from "../../services/document.service";
import { ToastrService } from "ngx-toastr";
import { RouterLink } from "@angular/router";
import { DatePipe } from "@angular/common";
import { CustomDatePipe } from "../../pipes/custom-date.pipe";
import { DocumenttypeService } from "../../services/documenttype.service";
import { DocumentType } from "../../models/documenttype.interface";

@Component({
  selector: "app-document-add-edit",
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, CustomDatePipe],
  providers: [DatePipe],
  templateUrl: "./document-add-edit.component.html",
  styleUrl: "./document-add-edit.component.scss",
})
export class DocumentAddEditComponent {
  documenttypes: DocumentType[] = [];
  documenttypeService = inject(DocumenttypeService);

  selectedDocument: Document = {
    id: 0,
    documenttype_id: 0,
    documenttype: {
      id: 0,
      reference: "",
      name: "",
      description: "",
      status: "",
      created_at: new Date(),
      updated_at: new Date(),
    },
    customer_id: 0,
    product_id: 0,
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
  datePipe = inject(DatePipe);

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
    product_id: [0, Validators.required],
    reference_number: ["", Validators.required],
    due_date: [new Date(), Validators.required],
    created_at: [new Date(), Validators.required],
    price_htva: [0, Validators.required],
    price_vvac: [0, Validators.required],
    price_total: [0, Validators.required],
    status: ["", Validators.required],
  });

  getListDocumenttypes() {
    this.documenttypeService.getListDocumenttypes().subscribe((response: any) => {
      this.documenttypes = response.data;
    });
  }

  ngOnInit() {
    this.selectedDocument = this.clone(this.selectedDocument);
    this.getListDocumenttypes();
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
