import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { DocumentType } from "../models/documenttype.interface";
import { HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class DocumenttypeService {
  private baseUri = "http://127.0.0.1:8000/api";

  http = inject(HttpClient);

  constructor() {}

  // Méthode pour récupérer la liste des types de documents par utilisateur
  listDocumenttypesByUser(page: number = 1, perPage: number = 10, search: string = ""): Observable<any> {
    let params = new HttpParams().set("page", page.toString()).set("per_page", perPage.toString());
    if (search) {
      params = params.set("q", search);
    }
    return this.http.get<any>(`${this.baseUri}/documenttypes`, { params });
  }

  // Méthode pour créer un type de document
  createDocumenttype(documenttype: DocumentType): Observable<DocumentType> {
    return this.http.post<DocumentType>(`${this.baseUri}/documenttypes`, documenttype);
  }

  // Méthode pour modifier un type de document
  updateDocumenttype(id: number, documenttype: DocumentType): Observable<DocumentType> {
    return this.http.put<DocumentType>(`${this.baseUri}/documenttypes/${id}`, documenttype);
  }

  // Méthode pour supprimer un type de document
  delete(id: number): Observable<DocumentType> {
    return this.http.delete<any>(`${this.baseUri}/documenttypes/${id}`);
  }

  // Méthode pour récupérer la liste des types de documents
  listDocumenttypes(): Observable<any> {
    return this.http.get<DocumentType>(`${this.baseUri}/list-documenttypes`);
  }
}
