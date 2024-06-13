import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { inject } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  toaster = inject(ToastrService);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const session = JSON.parse(localStorage.getItem("session") || "{}");
    const user = session.user;

    if (user && user.role_name === "Admin") {
      return true;
    } else {
      this.toaster.error("Vous n'avez pas les droits pour accéder à cette page", "Erreur");
      this.router.navigate(["/"]);
      return false;
    }
  }
}
