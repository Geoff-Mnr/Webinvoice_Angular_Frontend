import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Product } from "../models/product.interface";
import { HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private baseUri = "http://127.0.0.1:8000/api";

  http = inject(HttpClient);
  constructor() {}
  // Méthode pour récupérer la liste des produits par utilisateur
  listProductsByUser(page: number = 1, perPage: number = 10, search: string = ""): Observable<any> {
    let params = new HttpParams().set("page", page.toString()).set("per_page", perPage.toString());
    if (search) {
      params = params.set("q", search);
    }
    return this.http.get<any>(`${this.baseUri}/products`, { params });
  }
  // Méthode pour créer un produit
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.baseUri}/products`, product);
  }
  // Méthode pour modifier un produit
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseUri}/products/${id}`, product);
  }
  // Méthode pour supprimer un produit
  delete(id: number): Observable<Product> {
    return this.http.delete<any>(`${this.baseUri}/products/${id}`);
  }
  // Méthode pour récupérer la liste des produits
  listProducts(): Observable<any> {
    return this.http.get<Product>(`${this.baseUri}/list-products`);
  }
}
