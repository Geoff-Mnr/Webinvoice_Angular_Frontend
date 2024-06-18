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
  //private baseUri = "https://api.web-invoice.be/api";

  http = inject(HttpClient);

  constructor() {}
  // Méthode pour récupérer la liste des documents par utilisateur
  listDocumentsByUser(page: number = 1, perPage: number = 10, search: string = ""): Observable<any> {
    let params = new HttpParams().set("page", page.toString()).set("per_page", perPage.toString());
    if (search) {
      params = params.set("q", search);
    }
    return this.http.get<any>(`${this.baseUri}/documents`, { params });
  }

  // Méthode pour récupérer la liste des documents
  listDocuments(): Observable<any> {
    return this.http.get<Document>(`${this.baseUri}/documents-by-customer`);
  }

  // Méthode pour créer un document
  createDocument(document: Document): Observable<Document> {
    return this.http.post<Document>(`${this.baseUri}/documents`, document);
  }

  // Méthode pour modifier un document
  updateDocument(id: number, document: Document): Observable<Document> {
    return this.http.put<Document>(`${this.baseUri}/documents/${id}`, document);
  }

  // Méthode pour supprimer un document
  delete(id: number): Observable<Document> {
    return this.http.delete<any>(`${this.baseUri}/documents/${id}`);
  }

  // Méthode pour récupérer la facture
  getInvoicePdf(id: number): Observable<Blob> {
    return this.http.get<any>(`${this.baseUri}/invoices/${id}`, { responseType: "blob" as "json" });
  }

  // Méthode pour récupérer les statistiques
  getstats(): Observable<any> {
    return this.http.get<any>(`${this.baseUri}/stats`);
  }
}
