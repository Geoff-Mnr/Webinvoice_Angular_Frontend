import { Component, inject } from "@angular/core";
import { FormsModule, FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Product } from "../../models/product.interface";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { ProductService } from "../../services/product.service";
import { ToastrService } from "ngx-toastr";
import { RouterLink } from "@angular/router";
import { ActivatedRoute } from "@angular/router";

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
    stock: 0,
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

  constructor(private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.selectedProduct = navigation.extras.state["product"];
    }
  }

  fb = inject(FormBuilder);

  form = this.fb.group({
    name: ["", Validators.required],
    brand: ["", Validators.required],
    ean_code: ["", Validators.required],
    stock: [0, Validators.required],
    buying_price: [0, Validators.required],
    margin: [0, Validators.required],
    selling_price: [0, Validators.required],
    discount: [0, Validators.required],
    description: ["", Validators.required],
    comment: ["", Validators.required],
  });

  ngOnInit() {
    this.selectedProduct = this.clone(this.selectedProduct);
  }

  private clone(value: any): Product {
    return JSON.parse(JSON.stringify(value));
  }

  updateProduct() {
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
