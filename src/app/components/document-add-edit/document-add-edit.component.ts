import { Component, SimpleChanges, inject } from "@angular/core";
import { FormsModule, FormBuilder, ReactiveFormsModule, Validators, FormArray } from "@angular/forms";
import { Document } from "../../models/document.interface";
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
import { CommonModule } from "@angular/common";
import { Customer } from "../../models/customer.interface";
import { Product } from "../../models/product.interface";
import { ProductService } from "../../services/product.service";
import { MatIconModule } from "@angular/material/icon";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { provideNativeDateAdapter } from "@angular/material/core";
import { set } from "date-fns";

@Component({
  selector: "app-document-add-edit",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule, MatDatepickerModule, MatInputModule, MatFormFieldModule],
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
    product_id: [],
    products: [],
    product: {
      id: 0,
      name: "",
      brand: "",
      ean_code: "",
      buying_price: 0,
      selling_price: 0,
      margin: 0,
      description: "",
      comment: "",
      status: "",
      pivot: {
        document_id: 0,
        product_id: 0,
        selling_price: 0,
        quantity: 0,
        price_htva: 0,
        discount: 0,
        margin: 0,
        comment: "",
        description: "",
      },
      created_at: new Date(),
      updated_at: new Date(),
    },
    reference_number: "",
    document_date: new Date(),
    due_date: new Date(),
    price_htva: 0,
    price_vvat: 0,
    price_tvac: 0,
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
    console.log(this.selectedDocument);
    this.getListDocumenttypes();
    this.getListCustomers();
    this.getListProducts();

    this.form = this.fb.group({
      documenttype_id: [this.selectedDocument.documenttype_id || "", Validators.required],
      customer_id: [this.selectedDocument.customer_id || "", Validators.required],
      selectedProducts: this.fb.array([]),
      due_date: [new Date(this.selectedDocument.due_date), Validators.required],
      document_date: [new Date(this.selectedDocument.document_date), Validators.required],
      created_at: [new Date(this.selectedDocument.created_at), Validators.required],
      price_total: [this.selectedDocument.price_total || 0, Validators.required],
      price_htva: [this.selectedDocument.price_htva || 0, Validators.required],
      price_vvat: [this.selectedDocument.price_vvat || 0, Validators.required],
      price_tvac: [this.selectedDocument.price_tvac || 0, Validators.required],
    });

    if (this.selectedDocument && this.selectedDocument.products) {
      const productArray = this.form.get("selectedProducts") as FormArray;
      this.selectedDocument.products.forEach((product) => {
        const productGroup = this.fb.group({
          product_id: [product.pivot.product_id, Validators.required],
          quantity: [product.pivot.quantity, Validators.required],
          discount: [product.pivot.discount],
          price_total: [{ value: product.pivot.quantity * product.pivot.selling_price, disabled: false }],
        });
        productArray.push(productGroup);
      });
    }

    // Abonnement aux changements de valeur de selectedProducts
    this.form.get("selectedProducts").valueChanges.subscribe((products: { product_id: string; quantity: number; discount: number }[]) => {
      this.updatePrices();
    });

    // Abonnement aux changements de valeur de price_vvat
    this.form.get("price_vvat").valueChanges.subscribe(() => {
      this.updatePrices();
    });
    /*setTimeout(() => this.updatePrices());*/
  }

  updatePrices() {
    const products: { product_id: string; quantity: number; discount: number }[] = this.form.get("selectedProducts").value;
    if (products) {
      const productArray = this.form.get("selectedProducts") as FormArray;
      let totalPriceHtva = 0;
      products.forEach((product, index) => {
        const selectedProduct = this.getProductById(product.product_id);
        console.log("productId", product.product_id, selectedProduct);
        console.log("index", index, totalPriceHtva, selectedProduct);
        if (selectedProduct) {
          const price = Number(selectedProduct.selling_price);
          const quantity = product.quantity;
          const discount = product.discount;
          const discountedPrice = price - price * (discount / 100);
          const price_total = discountedPrice * quantity;
          totalPriceHtva += price_total;
          productArray.at(index).patchValue({ price_total }, { emitEvent: false });
        }
      });

      const vat_field = this.form.get("price_vvat");
      const vat_rate = vat_field ? Number(vat_field.value) : 0;
      const price_vvat = totalPriceHtva * (vat_rate / 100);
      const price_tvac = totalPriceHtva + price_vvat;

      this.form.controls.price_htva.setValue(totalPriceHtva, { emitEvent: false });
      this.form.controls.price_tvac.setValue(price_tvac, { emitEvent: false });

      console.log("Total Price HTVA Form:", this.form.controls.price_htva.value);

      /*  this.form.patchValue({ price_htva: totalPriceHtva, price_tvac }, { emitEvent: false });*/

      /*console.log("Total Price HTVA:", totalPriceHtva);
      console.log("VAT Rate:", vat_rate);
      console.log("Price VVAT:", price_vvat);
      console.log("Price TVAC:", price_tvac);*/
    }
  }

  getProductById(id: string) {
    const numId = Number(id);
    console.log("this.products", this.products);
    return this.products.find((product) => product.id === numId);
  }

  get selectedProducts(): FormArray {
    return this.form.get("selectedProducts") as FormArray;
  }

  addProduct() {
    this.selectedProducts.push(
      this.fb.group({
        product_id: [null, Validators.required],
        quantity: ["", Validators.required],
        discount: [""],
        price_total: [{ value: 0, disabled: false }],
      })
    );
  }

  removeProduct(index: number) {
    this.selectedProducts.removeAt(index);
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
      this.customers = response.data;
      console.log(this.customers);
    });
  }

  getListProducts() {
    this.productService.listProducts().subscribe((response: any) => {
      this.products = response.data;
      this.updatePrices();
      console.log(this.products);
    });
  }

  private clone(value: any) {
    return JSON.parse(JSON.stringify(value));
  }

  updateDocument() {
    const item: Document = this.form.value as Document;
    const product_ids = this.selectedProducts.controls.map((ctrl) => ctrl.get("product_id")?.value) as number[]; // Créer le tableau de product_id

    item.product_id = product_ids;
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
    const product_ids = this.selectedProducts.controls.map((ctrl) => ctrl.get("product_id")?.value) as number[]; // Créer le tableau de product_id
    // Assigner le tableau de produits
    item.product_id = product_ids;
    console.log(item);
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

  cancel() {
    this.router.navigate(["/document"]);
    this.toastr.info("Opération annulée");
  }

  dateChanged($event: any) {
    console.log($event.target.value);
  }
}
