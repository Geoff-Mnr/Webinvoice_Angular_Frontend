import { Component, inject } from "@angular/core";
import { RouterLink, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormGroup, FormControl, Validators, FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { UserService } from "../../services/user.service";
import { User } from "../../models/user.interface";
import { OnDestroy } from "@angular/core";
import { NavigationExtras } from "@angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-profile-user",
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, HttpClientModule],
  templateUrl: "./profile-user.component.html",
  styleUrl: "./profile-user.component.scss",
})
export class ProfileUserComponent implements OnDestroy {
  selectedUser: User = {
    id: 0,
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    address: "",
    city: "",
    country: "",
    zip_code: "",
    profile_picture: "",
    role: {
      id: 0,
      name: "",
      created_at: "",
      updated_at: "",
    },
    is_active: "",
    role_name: "",
  };

  userService = inject(UserService);
  router = inject(Router);
  private subDelete: Subscription | undefined;
  toastr = inject(ToastrService);

  constructor(private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.selectedUser = navigation.extras.state["user"];
    }
  }

  userForm = new FormGroup({
    username: new FormControl("", [Validators.required]),
    first_name: new FormControl("", [Validators.required]),
    last_name: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required, Validators.email]),
    phone_number: new FormControl("", [Validators.required]),
    address: new FormControl("", [Validators.required]),
    city: new FormControl("", [Validators.required]),
    country: new FormControl("", [Validators.required]),
    zip_code: new FormControl("", [Validators.required]),
  });

  ngOnInit() {
    this.selectedUser = this.clone(this.selectedUser);
  }

  private clone(value: any) {
    return JSON.parse(JSON.stringify(value));
  }

  updateProfile() {
    const item: User = this.userForm.value as User;
    this.userService.updateProfileUser(this.selectedUser.id, item).subscribe({
      next: () => {
        this.toastr.success("Profil modifié avec succès");
        this.router.navigate(["/dashboard"]);
      },
      error: (error) => {
        this.toastr.error("Erreur lors de la modification du profil");
      },
    });
  }

  cancel() {
    this.router.navigate(["/dashboard"]);
    this.toastr.info("Modification annulée");
  }

  ngOnDestroy() {
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
  }
}
