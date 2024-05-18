import { Injectable, inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const LoginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si l'utilisateur n'est pas connecté, on le laisse passer
  if (!authService.isAuthenticated()) {
    return true;
  }
  router.navigate(["/home"]);
  return false;
};
