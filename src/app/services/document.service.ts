import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Document } from "../models/document.interface";
import { HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class DocumentService {
  private baseUri = "http://127.0.0.1:8000/api";

  http = inject(HttpClient);

  constructor() {}

  listDocumentsByUser(page: number = 1, perPage: number = 10, search: string = ""): Observable<any> {
    let params = new HttpParams().set("page", page.toString()).set("per_page", perPage.toString());
    if (search) {
      params = params.set("q", search);
    }
    return this.http.get<any>(`${this.baseUri}/documents`, { params });
  }

  listDocuments(): Observable<any> {
    return this.http.get<Document>(`${this.baseUri}/documents-by-customer`);
  }

  createDocument(document: Document): Observable<Document> {
    return this.http.post<Document>(`${this.baseUri}/documents`, document);
  }

  updateDocument(id: number, document: Document): Observable<Document> {
    return this.http.put<Document>(`${this.baseUri}/documents/${id}`, document);
  }

  delete(id: number): Observable<Document> {
    return this.http.delete<any>(`${this.baseUri}/documents/${id}`);
  }

  getInvoicePdf(id: number): Observable<Blob> {
    return this.http.get<any>(`${this.baseUri}/invoices/${id}`, { responseType: "blob" as "json" });
  }
}
