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

  http = inject(HttpClient);

  constructor() {}

  listCustomersByUser(page: number = 1, perPage: number = 10, search: string = ""): Observable<any> {
    let params = new HttpParams().set("page", page.toString()).set("perPage", perPage.toString());
    if (search) {
      params = params.set("q", search);
    }
    return this.http.get<any>(`${this.baseUri}/customers`, { params });
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.baseUri}/customers`, customer);
  }

  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUri}/customers/${id}`, customer);
  }

  delete(id: number): Observable<Customer> {
    return this.http.delete<any>(`${this.baseUri}/customers/${id}`);
  }

  listCustomers(): Observable<any> {
    return this.http.get<Customer>(`${this.baseUri}/list-customers`);
  }
}
