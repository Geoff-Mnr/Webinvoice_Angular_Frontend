import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { User } from "../models/user.interface";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private baseUri = "http://localhost:8000/api";
  private userSource = new BehaviorSubject<User | null>(null);
  currentUser = this.userSource.asObservable();

  http = inject(HttpClient);

  constructor() {}

  getProfileUser(): Observable<any> {
    return this.http.get<User>(`${this.baseUri}/profile-user`);
  }

  updateProfileUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUri}/users/${id}`, user).pipe(
      tap((updatedUser) => {
        this.userSource.next(updatedUser);
      })
    );
  }
}
