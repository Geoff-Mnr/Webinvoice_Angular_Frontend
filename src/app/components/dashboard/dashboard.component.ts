import { Component, OnDestroy, OnInit, ChangeDetectorRef, NgZone, inject } from "@angular/core";
import { RouterOutlet, RouterLink, RouterModule, Router, ActivatedRoute } from "@angular/router";
import { RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DarkModeService } from "../../services/dark-mode.service";
import { AuthService } from "../../services/auth.service";
import { ToastrService } from "ngx-toastr";
import { UserService } from "../../services/user.service";
import { User } from "../../models/user.interface";
import { NavigationExtras } from "@angular/router";
import { Subscription } from "rxjs";
import { GlobalStateService } from "../../services/global.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterModule, RouterLinkActive, CommonModule],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  //Injection des services router, darkModeService, authService, userService et toastr
  router = inject(Router);
  darkModeService: DarkModeService = inject(DarkModeService);
  authService = inject(AuthService);
  userService = inject(UserService);
  toastr = inject(ToastrService);
  private subDelete: Subscription | undefined;
  globalStateService = inject(GlobalStateService);
  isAdmin: boolean = false;

  //Constructeur de la classe DashboardComponent avec le service ActivatedRoute en paramètre
  constructor(private route: ActivatedRoute) {}

  //Déclaration de la variable selectedUser de type User
  selectedUser?: User;
  //Déclaration de la variable user
  user: any;
  //Déclaration de la variable showMenu de type boolean initialisée à false
  showMenu = false;

  //Déclaration de la variable isMenuOpen de type boolean initialisée à false
  isMenuOpen = false;

  //Déclaration de la méthode selectUser qui prend en paramètre un utilisateur de type User
  selectUser(user: User) {
    this.selectedUser = user;
    const navigationExtras: NavigationExtras = {
      state: {
        user: user,
      },
    };
    this.router.navigate(["/user/edit-user"], navigationExtras);
  }

  //Déclaration de la méthode toggleDarkMode qui permet de mettre à jour le mode sombre
  toggleDarkMode() {
    this.darkModeService.updateDarkMode();
  }

  //Déclaration de la méthode toggleMenuDashboard qui permet d'ouvrir ou de fermer le menu
  toggleMenuDashboard() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  //Déclaration de la méthode closeMenuDashboard qui permet de fermer le menu
  closeMenuDashboard() {
    this.isMenuOpen = false;
  }

  //Déclaration de la méthode toggleMenu qui permet d'ouvrir ou de fermer le menu
  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  //Initialisation de la méthode ngOnInit
  ngOnInit() {
    this.route.params.subscribe(() => {
      this.getProfile();
    });
    this.isAdmin = this.authService.isAdmin();
  }

  //Déclaration de la méthode getProfile qui permet de récupérer le profil de l'utilisateur
  getProfile() {
    this.subDelete = this.userService.getProfileUser().subscribe((response: any) => {
      this.user = response.data;
    });
  }

  //Déclaration de la méthode logout qui permet de se déconnecter
  logout() {
    this.authService.logout();
    this.toastr.info("Deconnexion reussie");
    this.router.navigate(["/login"]);
  }

  //Déclaration de la méthode closeMenu qui permet de fermer le menu
  closeMenu() {
    this.showMenu = false;
  }

  //Déclaration de la méthode ngOnDestroy
  ngOnDestroy() {
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
  }
}
