import { Component } from "@angular/core";
import { inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UserService } from "../../services/user.service";
import { CommonModule } from "@angular/common";
import { User } from "../../models/user.interface";
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { Router, NavigationExtras } from "@angular/router";
import { OnDestroy } from "@angular/core";
import { EditUserComponent } from "../user-edit/edit-user.component";

@Component({
  selector: "app-user",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, EditUserComponent],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.scss",
})
export class UserComponent implements OnDestroy {
  // Initialisation des services
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

  // Initialisation du formulaire
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

  // Récupérer la liste des utilisateurs
  getListUsers(page: number = 1) {
    this.subDelete = this.userService.getAllUsers(page, this.itemsPerPage, this.search).subscribe({
      next: (response) => {
        this.users = response.data;
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

  // Selectionner un utilisateur
  selectUser(user: User) {
    this.selectedUser = user;
    const navigationExtras: NavigationExtras = {
      state: { user: user },
    };
    this.router.navigate(["/user-admin/edit-user"], navigationExtras);
  }

  // Désabonnement
  ngOnDestroy() {
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
  }

  //recuperer le status et adapter le style
  getStatusClass(status: string): string {
    switch (status) {
      case "Actif":
        return "status-active";
      case "Inactif":
        return "status-inactive";
      default:
        return "status-inactive";
    }
  }

  //changer le nombre d'éléments par page
  onItemsPerPageChange() {
    localStorage.setItem("itemsPerPage", this.itemsPerPage.toString());
    this.getListUsers();
  }
}
