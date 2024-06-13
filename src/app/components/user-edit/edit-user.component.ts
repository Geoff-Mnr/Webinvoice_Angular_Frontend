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
import { AuthService } from "../../services/auth.service";
import { RoleService } from "../../services/role.service";
import { Role } from "../../models/role.interface";
import { OnInit } from "@angular/core";

@Component({
  selector: "app-edit-user",
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: "./edit-user.component.html",
  styleUrl: "./edit-user.component.scss",
})
export class EditUserComponent implements OnDestroy {
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
  fb = inject(FormBuilder);

  constructor(private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.selectedUser = navigation.extras.state["user"];
      this.selectedUser.status = this.mapStatusToValue(this.selectedUser.status);
    }
  }

  userForm = this.fb.group({
    role_id: [this.selectedUser.role_id, [Validators.required]],
    status: [this.selectedUser.status, [Validators.required]],
  });

  ngOnInit() {
    if (this.selectedUser) {
      this.userForm.patchValue(this.selectedUser);
    }
    this.selectedUser = this.clone(this.selectedUser);
    this.getListRoles();
    this.isAdmin = this.authService.isAdmin();
  }

  mapStatusToValue(status: string): string {
    switch (status) {
      case "Actif":
        return "A";
      case "Inactif":
        return "B";
      default:
        return "";
    }
  }

  mapValueToStatus(value: string): string {
    switch (value) {
      case "A":
        return "Actif";
      case "B":
        return "Inactif";
      default:
        return "";
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

  private clone(value: any) {
    return JSON.parse(JSON.stringify(value));
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
