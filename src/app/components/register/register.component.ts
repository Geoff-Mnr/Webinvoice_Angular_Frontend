import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router, RouterOutlet } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { nospaceValidator } from "../../validators/nospace";
import { ValidatorFn } from "@angular/forms";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterLink],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.scss",
})
export class RegisterComponent {
  // Injection du service router
  router = inject(Router);
  // Injection du service authService
  authService = inject(AuthService);
  // Injection du service toastr
  toastr = inject(ToastrService);

  passwordMatch: ValidatorFn = (control) => {
    const password = control.get("password");
    const confirm_password = control.get("confirm_password");

    // Si les deux champs sont remplis et que les valeurs sont différentes
    if (password && confirm_password && password.value !== confirm_password.value) {
      if (confirm_password) {
        confirm_password.setErrors({ passwordMatch: true });
      }
      // Sinon, on réinitialise les erreurs
    } else {
      if (confirm_password) {
        confirm_password.setErrors(null);
      }
    }
    return null;
  };

  // Création du formulaire d'inscription
  registerForm = new FormGroup(
    {
      username: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required, Validators.minLength(8), nospaceValidator()]),
      confirm_password: new FormControl("", [Validators.required, Validators.minLength(8), nospaceValidator()]),
    },
    { validators: this.passwordMatch }
  );

  // Méthode appelée lors de la soumission du formulaire
  register() {
    let username = this.registerForm.value.username;
    let email = this.registerForm.value.email;
    let password = this.registerForm.value.password;
    let confirm_password = this.registerForm.value.confirm_password;

    if (username && email && password && confirm_password) {
      this.authService.register(username, email, password, confirm_password).subscribe({
        next: (response) => {
          this.toastr.success("Inscription réussie !", "Succès");
          this.router.navigate(["/login"]);
        },
        error: (error) => {
          this.toastr.error("Erreur lors de l'inscription.", "Erreur");
        },
      });
    }
  }
}
