import { Component, inject } from "@angular/core";
import { RouterLink, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { UserService } from "../../services/user.service";
import { User } from "../../models/user.interface";
import { OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ValidatorFn } from "@angular/forms";
import { nospaceValidator } from "../../validators/nospace";
import { OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { RoleService } from "../../services/role.service";
import { Role } from "../../models/role.interface";

@Component({
  selector: "app-profile-user",
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: "./profile-user.component.html",
  styleUrl: "./profile-user.component.scss",
})
export class ProfileUserComponent implements OnDestroy {
  roles: Role[] = [];

  selectedUser: User = {
    id: 0,
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    company_name: "",
    vat_number: "",
    account_number: "",
    password: "",
    phone_number: "",
    address: "",
    city: "",
    country: "",
    zip_code: "",
    profile_picture: "",
    role_id: 0,
    role: {
      id: 0,
      name: "",
      created_at: "",
      updated_at: "",
    },
    is_active: "",
    role_name: "",
    status: "",
  };

  userService = inject(UserService);
  router = inject(Router);
  private subDelete: Subscription | undefined;
  toastr = inject(ToastrService);
  isAdmin = false;
  authService = inject(AuthService);
  roleService = inject(RoleService);

  constructor(private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.selectedUser = navigation.extras.state["user"];
    }
  }

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

  fb = inject(FormBuilder);

  userForm = this.fb.group(
    {
      username: [this.selectedUser.username, Validators.required],
      first_name: [this.selectedUser.first_name, Validators.required],
      last_name: [this.selectedUser.last_name, Validators.required],
      email: [this.selectedUser.email, Validators.required],
      password: ["", [Validators.minLength(8), nospaceValidator]],
      confirm_password: ["", [Validators.minLength(8), nospaceValidator]],
      company_name: [this.selectedUser.company_name, Validators.required],
      vat_number: [this.selectedUser.vat_number, [Validators.minLength(9), Validators.maxLength(10)]],
      account_number: [this.selectedUser.account_number, [Validators.minLength(16), Validators.maxLength(16)]],
      phone_number: [this.selectedUser.phone_number, Validators.required],
      address: [this.selectedUser.address, Validators.required],
      city: [this.selectedUser.city, Validators.required],
      country: [this.selectedUser.country, Validators.required],
      zip_code: [this.selectedUser.zip_code, Validators.required],
      profile_picture: [""],
    },
    { validators: this.passwordMatch }
  );

  ngOnInit() {
    this.selectedUser = this.clone(this.selectedUser);
    if (this.selectedUser) {
      this.userForm.patchValue(this.selectedUser);
    }
  }

  private clone(value: any) {
    return JSON.parse(JSON.stringify(value));
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (this.userForm.get("profile_picture")) {
          this.userForm.get("profile_picture")?.setValue(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  updateUser() {
    const item: User = this.userForm.value as unknown as User;

    if (item.password === "") {
      item.password = this.selectedUser.password;
    }

    if (item.profile_picture === "") {
      item.profile_picture = this.selectedUser.profile_picture;
    }

    this.userService.updateProfileUser(this.selectedUser.id, item).subscribe({
      next: () => {
        this.toastr.success("Profil modifié avec succès");
        console.log("User updated", item);
        this.router.navigate(["/home"]);
        this.reloadPage();
      },
      error: (error) => {
        this.toastr.error("Erreur lors de la modification du profil");
      },
    });
  }

  getListRoles() {
    this.roleService.listRoles().subscribe((response: any) => {
      this.roles = response.data;
      console.log(this.roles);
    });
  }

  reloadPage() {
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }

  cancel() {
    this.router.navigate(["/home"]);
    this.toastr.info("Modification annulée");
  }

  ngOnDestroy() {
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
  }
}
