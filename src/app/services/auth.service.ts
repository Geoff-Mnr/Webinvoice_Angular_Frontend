import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../models/user.interface";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor() {}

  //Url for the api
  private baseUri = "http://127.0.0.1:8000/api";

  http = inject(HttpClient);

  isAuthenticated(): boolean {
    return !!localStorage.getItem("session");
  }

  getToken(): string {
    return JSON.parse(localStorage.getItem("session")!).access_token;
  }

  setSession(session: any): void {
    localStorage.setItem("session", JSON.stringify(session));
  }

  getUsername(): string {
    return JSON.parse(localStorage.getItem("session")!).user.username;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUri}/login`, {
      email,
      password,
    });
  }

  // Méthode d'inscription
  register(username: string, email: string, password: string, confirm_password: string): Observable<any> {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirm_password", confirm_password);
    return this.http.post<User>(`${this.baseUri}/register`, formData);
  }

  // Méthode de déconnexion
  logout(): void {
    localStorage.removeItem("session");
    localStorage.removeItem("tokenReceivedAt");
    localStorage.removeItem("user");
  }
}
