import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../models/user.interface";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor() {}

  private baseUri = "http://localhost:8000/api";

  http = inject(HttpClient);

  getProfileUser(): Observable<any> {
    return this.http.get<User>(`${this.baseUri}/profile-user`);
  }

  updateProfileUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUri}/users/${id}`, user);
  }
}
