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
import { EanCodePipe } from "../../pipes/ean-code.pipe";

@Component({
  selector: "app-product",
  standalone: true,
  imports: [ProductAddEditComponent, RouterLink, CommonModule, FormsModule, HttpClientModule, EanCodePipe],
  templateUrl: "./product.component.html",
  styleUrl: "./product.component.scss",
})
export class ProductComponent implements OnDestroy {
  // Injection des services
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
  isLoading = true;

  // Methode d'initialisation des données
  ngOnInit() {
    const savedItemsPerPage = localStorage.getItem("itemsPerPage");
    if (savedItemsPerPage) {
      this.itemsPerPage = parseInt(savedItemsPerPage, 10);
    }
    this.getListProducts();
  }

  // Methode pour rechercher un produit
  searchProduct() {
    this.getListProducts(this.currentPage);
  }

  // Methode pour récupérer la liste des produits
  getListProducts(page: number = 1) {
    this.isLoading = true;
    this.subDelete = this.productService.listProductsByUser(page, this.itemsPerPage, this.search).subscribe({
      next: (response) => {
        this.products = response.data;
        this.totalItems = response.meta.total;
        this.totalPage = response.meta.last_page;
        if (this.totalItems === 0) {
          this.toastr.info("Aucun produit trouvé");
        }
        this.currentPage = page < 1 ? 1 : page > this.totalPage ? this.totalPage : page;
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error("Erreur lors de la récupération des produits");
        this.isLoading = false;
      },
    });
  }

  // Methode pour selectionner un produit
  selectProduct(product: Product) {
    this.selectedProduct = product;
    const navigationExtras: NavigationExtras = {
      state: { product: product },
    };
    this.router.navigate(["/product/edit-product"], navigationExtras);
  }

  // Methode qui renvoie vers le formulaire d'ajout de produit
  addProduct() {
    this.router.navigate(["/product/add-product"]);
  }

  // Methode pour garder la page courante
  onItemsPerPageChange() {
    localStorage.setItem("itemsPerPage", this.itemsPerPage.toString());
    this.getListProducts(this.currentPage);
  }

  // Methode pour se désinscrire de l'observable
  ngOnDestroy() {
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
  }
}
