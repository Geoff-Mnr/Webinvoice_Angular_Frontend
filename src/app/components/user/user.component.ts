import { Component } from "@angular/core";
import { inject } from "@angular/core";
import { FormsModule, FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { UserService } from "../../services/user.service";
import { CommonModule } from "@angular/common";
import { User } from "../../models/user.interface";
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { Router, NavigationExtras } from "@angular/router";
import { OnDestroy } from "@angular/core";

@Component({
  selector: "app-user",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.scss",
})
export class UserComponent implements OnDestroy {
  userService = inject(UserService);
  router = inject(Router);
  private subDelete: Subscription | undefined;
  toastr = inject(ToastrService);

  users: User[] = [];
  selectedUser?: User;

  currentPage = 1;
  totalPage = 1;
  totalItems = 1;
  itemsPerPage = 10;
  search = "";

  ngOnInit() {
    const savedItemsPerPage = localStorage.getItem("itemsPerPage");
    if (savedItemsPerPage) {
      this.itemsPerPage = parseInt(savedItemsPerPage, 10);
    }
    this.getListUsers();
  }

  searchUser() {
    this.getListUsers(this.currentPage);
  }

  getListUsers(page: number = 1) {
    this.subDelete = this.userService.getAllUsers(page, this.itemsPerPage, this.search).subscribe({
      next: (response) => {
        this.users = response.data;
        console.log(this.users);
        this.totalItems = response.meta.total;
        this.totalPage = response.meta.last_page;

        if (this.totalItems === 0) {
          this.toastr.info("Aucun utilisateur trouvé");
        }
        this.currentPage = page < 1 ? 1 : page > this.totalPage ? this.totalPage : page;
      },
      error: (error) => {
        this.toastr.error("Erreur lors de la récupération des utilisateurs");
      },
    });
  }

  selectUser(user: User) {
    this.selectedUser = user;
    const navigationExtras: NavigationExtras = {
      state: { user: user },
    };
    this.router.navigate(["/users/edit-user"], navigationExtras);
  }

  ngOnDestroy() {
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
  }

  onItemsPerPageChange() {
    localStorage.setItem("itemsPerPage", this.itemsPerPage.toString());
    this.getListUsers();
  }
}
