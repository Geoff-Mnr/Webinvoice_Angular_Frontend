import { Component, inject } from "@angular/core";
import { RouterOutlet, RouterLink, RouterModule, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  // Injection du service Router
  router = inject(Router);
  // Injection du service AuthService
  authService = inject(AuthService);
  // Injection du service Toastr
  toastr = inject(ToastrService);

  // Création du formulaire de connexion
  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(8)]),
  });

  // Fonction de connexion
  login() {
    let email = this.loginForm.value.email;
    let password = this.loginForm.value.password;
    if (email && password) {
      this.authService.login(email, password).subscribe({
        next: (res) => {
          this.authService.setSession(res.data);
          this.router.navigate(["/home"]);
          this.toastr.success("Connexion réussie!");
        },
        error: (err) => {
          if (err.status === 403) {
            this.toastr.error("Vous êtes banni, veuillez contacter l'administrateur.");
          } else if (err.status === 401) {
            this.toastr.error("Email ou mot de passe incorrect.");
          } else {
            this.toastr.error("Une erreur est survenue, veuillez réessayer plus tard.");
          }
        },
      });
    } else {
      this.toastr.error("Veuillez remplir le formulaire correctement.");
    }
  }
}
