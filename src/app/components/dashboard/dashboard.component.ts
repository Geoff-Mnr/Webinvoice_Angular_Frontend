import { Component, inject } from "@angular/core";
import { RouterOutlet, RouterLink, RouterModule, Router } from "@angular/router";
import { RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DarkModeService } from "../../services/dark-mode.service";
import { AuthService } from "../../services/auth.service";
import { ToastrService } from "ngx-toastr";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterModule, RouterLinkActive, CommonModule],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent {
  router = inject(Router);
  darkModeService: DarkModeService = inject(DarkModeService);
  authService = inject(AuthService);
  userService = inject(UserService);
  toastr = inject(ToastrService);

  user: any;
  showMenu = false;

  toggleDarkMode() {
    this.darkModeService.updateDarkMode();
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  ngOnInit() {
    this.userService.getProfileUser().subscribe({
      next: (res) => {
        this.user = res;
        console.log("User profile", this.user);
      },
      error: (err) => {
        console.log("Error while fetching user profile", err);
      },
    });
    /*this.isAdmin = this.authService.isAdmin();*/
  }

  logout() {
    this.authService.logout();
    this.toastr.info("Deconnexion reussie");
    this.router.navigate(["/login"]);
  }
}
