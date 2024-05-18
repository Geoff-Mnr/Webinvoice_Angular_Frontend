import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { CanActivateFn } from "@angular/router";

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (localStorage.getItem("session")) {
    return true;
  } else {
    router.navigate(["/login"]);
    return false;
  }
};
