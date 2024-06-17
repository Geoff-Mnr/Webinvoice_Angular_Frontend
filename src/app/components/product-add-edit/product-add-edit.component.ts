import { Component, inject } from "@angular/core";
import { FormsModule, FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Product } from "../../models/product.interface";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { ProductService } from "../../services/product.service";
import { ToastrService } from "ngx-toastr";
import { RouterLink } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { debounceTime, min } from "rxjs";
import { EanCodePipe } from "../../pipes/ean-code.pipe";

@Component({
  selector: "app-product-add-edit",
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./product-add-edit.component.html",
  styleUrl: "./product-add-edit.component.scss",
})
export class ProductAddEditComponent {
  // Initialisation des données
  selectedProduct: Product = {
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
    created_at: new Date(),
    updated_at: new Date(),
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
  };

  // Injection des services
  router = inject(Router);
  productService = inject(ProductService);
  toastr = inject(ToastrService);
  form: any;
  fb = inject(FormBuilder);

  // Constructeur pour la navigation
  constructor(private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.selectedProduct = navigation.extras.state["product"];
    }
  }

  // Methode d'initialisation des données
  ngOnInit() {
    this.selectedProduct = this.clone(this.selectedProduct);
    setTimeout(() => {
      this.form = this.fb.group({
        name: [this.selectedProduct.name, Validators.required],
        brand: [this.selectedProduct.brand, Validators.required],
        ean_code: [this.selectedProduct.ean_code, [Validators.minLength(13), Validators.maxLength(13)]],
        buying_price: [this.selectedProduct.buying_price, Validators.required],
        margin: [this.selectedProduct.margin, Validators.required],
        selling_price: [this.selectedProduct.selling_price, Validators.required],
        description: [this.selectedProduct.description],
        comment: [this.selectedProduct.comment],
      });

      this.form
        .get("buying_price")
        .valueChanges.pipe(debounceTime(300))
        .subscribe(() => this.calculateSellingPrice());
      this.form
        .get("margin")
        .valueChanges.pipe(debounceTime(300))
        .subscribe(() => this.calculateSellingPrice());
      this.form
        .get("discount")
        .valueChanges.pipe(debounceTime(300))
        .subscribe(() => this.calculateSellingPrice());
    });
  }

  // Methode pour calculer le prix de vente
  calculateSellingPrice() {
    const buyingPrice = this.form.value.buying_price;
    const margin = this.form.value.margin ?? 0;
    const discount = this.form.value.discount ?? 0;
    if (buyingPrice !== null && buyingPrice !== undefined) {
      const priceAfterDiscount = buyingPrice * (1 - discount / 100);
      const sellingPrice = priceAfterDiscount * (1 + margin / 100);
      this.form.get("selling_price").setValue(sellingPrice.toFixed(0), { emitEvent: false });
    }
  }

  // Methode pour cloner un objet
  private clone(value: any): Product {
    return JSON.parse(JSON.stringify(value));
  }

  // Methode pour mettre à jour un produit
  updateProduct() {
    if (!this.selectedProduct.id) {
      this.toastr.error("Aucun produit sélectionné");
      return;
    }
    const item: Product = this.form.value as Product;
    this.productService.updateProduct(this.selectedProduct.id, item).subscribe({
      next: () => {
        this.toastr.success("Le produit a été mis à jour avec succès");
        this.router.navigate(["/product"]);
      },
      error: (error) => {
        this.toastr.error("Erreur lors de la mise à jour du produit");
      },
    });
  }

  // Methode pour créer un produit
  createProduct() {
    const item: Product = this.form.value as Product;
    this.productService.createProduct(item).subscribe({
      next: () => {
        this.toastr.success("Le produit a été créé avec succès");
        this.router.navigate(["/product"]);
      },
      error: (error) => {
        this.toastr.error("Erreur lors de la création du produit");
      },
    });
  }

  // Methode pour annuler l'opération
  cancel() {
    this.router.navigate(["/product"]);
    this.toastr.info("Operation cancelled");
  }
}
