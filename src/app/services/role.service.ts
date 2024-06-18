import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Role } from "../models/role.interface";
import { HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class RoleService {
  private baseUri = "http://localhost:8000/api";
  //private baseUri = "https://api.web-invoice.be/api";
  constructor() {}

  http = inject(HttpClient);
  // Méthode pour récupérer la liste des rôles
  listRoles(): Observable<any> {
    return this.http.get<Role>(`${this.baseUri}/roles`);
  }
}
