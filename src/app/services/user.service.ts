import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { User } from "../models/user.interface";
import { tap } from "rxjs/operators";
import { HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class UserService {
  //private baseUri = "http://localhost:8000/api";
  private baseUri = "https://api.web-invoice.be/api";
  private userSource = new BehaviorSubject<User | null>(null);
  currentUser = this.userSource.asObservable();

  http = inject(HttpClient);

  constructor() {}
  // Récupérer le profil de l'utilisateur
  getProfileUser(): Observable<any> {
    return this.http.get<User>(`${this.baseUri}/profile-user`);
  }
  // Récupérer la liste des utilisateurs
  getAllUsers(page: number = 1, per_page: number = 10, search: string = ""): Observable<any> {
    let params = new HttpParams().set("page", page.toString()).set("per_page", per_page.toString());
    if (search) {
      params = params.set("q", search);
    }
    return this.http.get<any>(`${this.baseUri}/users`, { params });
  }
  // Modifier le profil de l'utilisateur
  updateProfileUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUri}/users/${id}`, user).pipe(
      tap((updatedUser) => {
        this.userSource.next(updatedUser);
      })
    );
  }
}
