import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { HttpInterceptorFn } from "@angular/common/http";
import { HttpRequest } from "@angular/common/http";
import { HttpHandlerFn } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpEvent } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  // Injection de AuthService via le constructeur
  const authService = inject(AuthService);

  const router = inject(Router);
  if (authService.isAuthenticated()) {
    let headers = req.headers;
    headers = headers.set("Authorization", `Bearer ${authService.getToken()}`);
    return next(req.clone({ headers: headers }));
  } else {
    return next(req).pipe(
      catchError((error) => {
        if (error.status === 401) {
          authService.logout();
          router.navigate(["/login"]);
        }
        throw error;
      })
    );
  }
};
