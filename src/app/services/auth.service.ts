import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../models/user.interface";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // URL de base de l'API
  private baseUri = "http://127.0.0.1:8000/api";

  // Injection de HttpClient via le constructeur
  http = inject(HttpClient);

  // Méthode pour vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return !!localStorage.getItem("session");
  }

  // Méthode pour récupérer le token
  getToken(): string {
    return JSON.parse(localStorage.getItem("session")!).access_token;
  }

  // Méthode pour vérifier si l'utilisateur est un administrateur
  isAdmin(): boolean {
    return JSON.parse(localStorage.getItem("session")!).user.role_name == "Admin";
  }

  // Méthode pour récupérer le nom d'utilisateur
  getUsername(): string {
    return JSON.parse(localStorage.getItem("session")!).user.username;
  }

  // Méthode pour stocker le token dans le localStorage
  setSession(session: any): void {
    localStorage.setItem("session", JSON.stringify(session));
  }

  // Méthode de connexion
  login(email: string, password: string): Observable<any> {
    return this.http.post<User>(`${this.baseUri}/login`, { email, password });
  }

  // Méthode pour récupérer le profil de l'utilisateur
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.baseUri}/user`).pipe(
      catchError((error) => {
        return throwError(() => new Error("An error occurred while fetching user profile"));
      })
    );
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
