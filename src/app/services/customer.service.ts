import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Customer } from "../models/customer.interface";
import { HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class CustomerService {
  private baseUri = "http://127.0.0.1:8000/api";
  //private baseUri = "https://api.web-invoice.be/api";

  http = inject(HttpClient);

  constructor() {}

  // Méthode pour récupérer la liste des clients par utilisateur
  listCustomersByUser(page: number = 1, perPage: number = 10, search: string = ""): Observable<any> {
    let params = new HttpParams().set("page", page.toString()).set("per_page", perPage.toString());
    if (search) {
      params = params.set("q", search);
    }
    return this.http.get<any>(`${this.baseUri}/customers`, { params });
  }

  // Méthode pour créer un client
  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.baseUri}/customers`, customer);
  }

  // Méthode pour modifier un client
  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUri}/customers/${id}`, customer);
  }

  // Méthode pour supprimer un client
  delete(id: number): Observable<Customer> {
    return this.http.delete<any>(`${this.baseUri}/customers/${id}`);
  }

  // Méhode pour récuper la liste des clients
  listCustomers(): Observable<any> {
    return this.http.get<Customer>(`${this.baseUri}/list-customers`);
  }
}
