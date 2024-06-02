import { Component, SimpleChanges, inject } from "@angular/core";
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
import { CustomerService } from "../../services/customer.service";
import { Customer } from "../../models/customer.interface";
import { Product } from "../../models/product.interface";
import { ProductService } from "../../services/product.service";
import { MatIconModule } from "@angular/material/icon";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { provideNativeDateAdapter } from "@angular/material/core";
import { debounceTime } from "rxjs";

@Component({
  selector: "app-document-add-edit",
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, CustomDatePipe, MatIconModule, MatDatepickerModule, MatInputModule, MatFormFieldModule],
  providers: [DatePipe, provideNativeDateAdapter()],
  templateUrl: "./document-add-edit.component.html",
  styleUrl: "./document-add-edit.component.scss",
})
export class DocumentAddEditComponent {
  documenttypes: DocumentType[] = [];
  customers: Customer[] = [];
  products: Product[] = [];

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
    customer: {
      id: 0,
      company_name: "",
      email: "",
      billing_address: "",
      billing_city: "",
      billing_country: "",
      billing_zip_code: "",
      billing_state: "",
      website: "",
      vat_number: "",
      phone_number: "",
      created_at: new Date(),
      updated_at: new Date(),
      status: "",
    },
    product_id: 0,
    product: {
      id: 0,
      name: "",
      brand: "",
      ean_code: "",
      quantity: 0,
      buying_price: 0,
      selling_price: 0,
      discount: 0,
      margin: 0,
      description: "",
      comment: "",
      status: "",
      created_at: new Date(),
      updated_at: new Date(),
    },
    reference_number: "",
    document_date: new Date(),
    due_date: new Date(),
    price_htva: 0,
    price_vvat: 0,
    price_total: 0,
    created_at: new Date(),
    updated_at: new Date(),
    status: "",
  };

  router = inject(Router);
  documentService = inject(DocumentService);
  customerService = inject(CustomerService);
  documenttypeService = inject(DocumenttypeService);
  productService = inject(ProductService);

  toastr = inject(ToastrService);
  datePipe = inject(DatePipe);
  form: any;

  constructor(private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.selectedDocument = navigation.extras.state["document"];
    }
  }

  formatDate(date: Date) {
    return this.datePipe.transform(date, "HH:mm le dd-MM-yyyy");
  }

  ngOnInit() {
    this.selectedDocument = this.clone(this.selectedDocument);
    this.getListDocumenttypes();
    this.getListCustomers();
    this.getListProducts();

    this.form = this.fb.group({
      documenttype_id: [0, Validators.required],
      customer_id: [0, Validators.required],
      product_id: [0, Validators.required],
      due_date: [new Date(), Validators.required],
      document_date: [new Date(), Validators.required],
      created_at: [new Date(), Validators.required],
      price_htva: [0, Validators.required],
      price_vvat: [0, Validators.required],
      price_total: [0, Validators.required],
    });

    this.form
      .get("price_htva")
      .valueChanges.pipe(debounceTime(300))
      .subscribe(() => this.calculatePriceTotal());
    this.form
      .get("price_vvat")
      .valueChanges.pipe(debounceTime(300))
      .subscribe(() => this.calculatePriceTotal());
  }

  fb = inject(FormBuilder);

  getListDocumenttypes() {
    this.documenttypeService.listDocumenttypes().subscribe((response: any) => {
      this.documenttypes = response.data;
      console.log(this.documenttypes);
    });
  }

  getListCustomers() {
    this.customerService.listCustomers().subscribe((response: any) => {
      this.customers = response;
      console.log(this.customers);
    });
  }

  getListProducts() {
    this.productService.listProducts().subscribe((response: any) => {
      this.products = response;
      console.log(this.products);
    });
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
        if (error.error && error.error.message) {
          // Si le serveur a renvoyé un message d'erreur spécifique, affichez-le
          this.toastr.error(error.error.message);
        } else {
          // Sinon, affichez un message d'erreur générique
          this.toastr.error("Une erreur s'est produite lors de la création du document");
        }
      },
    });
  }

  calculatePriceTotal() {
    const price_htva = Number(this.form.value.price_htva);
    const price_vvat = Number(this.form.value.price_vvat ?? 0);

    console.log(`price_htva: ${price_htva}, price_vvat: ${price_vvat}`);

    if (!isNaN(price_htva) && !isNaN(price_vvat)) {
      const vvatAmount = price_htva * (price_vvat / 100);
      const price_total = price_htva + vvatAmount;
      this.form.get("price_total").setValue(price_total.toFixed(0), { emitEvent: false });
    }
  }

  cancel() {
    this.router.navigate(["/document"]);
    this.toastr.info("Opération annulée");
  }

  dateChanged($event: any) {
    console.log($event.target.value);
  }
}
