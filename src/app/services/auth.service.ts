import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

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

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUri}/login`, {
      email,
      password,
    });
  }
}
