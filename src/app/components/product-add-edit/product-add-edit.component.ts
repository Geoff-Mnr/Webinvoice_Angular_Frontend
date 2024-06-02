import { Component, inject } from "@angular/core";
import { FormsModule, FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Product } from "../../models/product.interface";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { ProductService } from "../../services/product.service";
import { ToastrService } from "ngx-toastr";
import { RouterLink } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { debounceTime } from "rxjs";

@Component({
  selector: "app-product-add-edit",
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./product-add-edit.component.html",
  styleUrl: "./product-add-edit.component.scss",
})
export class ProductAddEditComponent {
  selectedProduct: Product = {
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
  };

  router = inject(Router);
  productService = inject(ProductService);
  toastr = inject(ToastrService);
  form: any;

  constructor(private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.selectedProduct = navigation.extras.state["product"];
    }
  }

  ngOnInit() {
    this.selectedProduct = this.clone(this.selectedProduct);

    this.form = this.fb.group({
      name: ["", Validators.required],
      brand: ["", Validators.required],
      ean_code: ["", Validators.required],
      quantity: [0, Validators.required],
      buying_price: [0, Validators.required],
      margin: [0, Validators.required],
      selling_price: [0, Validators.required],
      discount: [0, Validators.required],
      description: ["", Validators.required],
      comment: ["", Validators.required],
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
  }

  fb = inject(FormBuilder);

  calculateSellingPrice() {
    const buyingPrice = this.form.value.buying_price;
    const margin = this.form.value.margin ?? 0;
    const discount = this.form.value.discount ?? 0;

    console.log(`buyingPrice: ${buyingPrice}, margin: ${margin}, discount: ${discount}`);

    if (buyingPrice !== null && buyingPrice !== undefined) {
      const priceAfterDiscount = buyingPrice * (1 - discount / 100);
      const sellingPrice = priceAfterDiscount * (1 + margin / 100);

      this.form.get("selling_price").setValue(sellingPrice.toFixed(0), { emitEvent: false });
    }
  }

  private clone(value: any): Product {
    return JSON.parse(JSON.stringify(value));
  }

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

  cancel() {
    this.router.navigate(["/product"]);
    this.toastr.info("Operation cancelled");
  }
}

// Path: src/app/components/product-add-edit/product-add-edit.component.html
