import { Component, inject } from "@angular/core";
import { RouterLink, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { ProductService } from "../../services/product.service";
import { Product } from "../../models/product.interface";
import { OnDestroy } from "@angular/core";
import { NavigationExtras } from "@angular/router";
import { ProductAddEditComponent } from "../product-add-edit/product-add-edit.component";

@Component({
  selector: "app-product",
  standalone: true,
  imports: [ProductAddEditComponent, RouterLink, CommonModule, FormsModule, HttpClientModule],
  templateUrl: "./product.component.html",
  styleUrl: "./product.component.scss",
})
export class ProductComponent implements OnDestroy {
  productService = inject(ProductService);
  router = inject(Router);
  private subDelete: Subscription | undefined;
  toastr = inject(ToastrService);

  products: Product[] = [];
  selectedProduct?: Product;

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
    this.getListProducts();
  }

  searchProduct() {
    this.getListProducts(this.currentPage);
  }

  getListProducts(page: number = 1) {
    console.log(page, this.itemsPerPage, this.search);
    this.subDelete = this.productService.listProductsByUser(page, this.itemsPerPage, this.search).subscribe({
      next: (response) => {
        this.products = response.data;
        console.log(this.products);
        this.totalItems = response.meta.total;
        console.log(this.totalItems);
        this.totalPage = response.meta.last_page;
        console.log(this.totalPage);
        if (this.totalItems === 0) {
          this.toastr.info("Aucun produit trouvé");
        }
        this.currentPage = page < 1 ? 1 : page > this.totalPage ? this.totalPage : page;
        console.log(this.currentPage);
      },
      error: (error) => {
        this.toastr.error("Erreur lors de la récupération des produits");
      },
    });
  }

  selectProduct(product: Product) {
    this.selectedProduct = product;
    const navigationExtras: NavigationExtras = {
      state: { product: product },
    };
    this.router.navigate(["/product/edit-product"], navigationExtras);
    console.log(this.selectProduct);
  }

  addProduct() {
    this.router.navigate(["/product/add-product"]);
  }

  onItemsPerPageChange() {
    localStorage.setItem("itemsPerPage", this.itemsPerPage.toString());
    this.getListProducts(this.currentPage);
  }

  ngOnDestroy() {
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
  }
}
