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
  router = inject(Router);
  darkModeService: DarkModeService = inject(DarkModeService);
  authService = inject(AuthService);
  userService = inject(UserService);
  toastr = inject(ToastrService);
  private subDelete: Subscription | undefined;
  globalStateService = inject(GlobalStateService);

  isAdmin: boolean = false;

  constructor(private route: ActivatedRoute) {}

  selectedUser?: User;

  user: any;
  showMenu = false;

  selectUser(user: User) {
    this.selectedUser = user;
    console.log("Selected user", this.selectedUser);
    const navigationExtras: NavigationExtras = {
      state: {
        user: user,
      },
    };
    this.router.navigate(["/user/edit-user"], navigationExtras);
  }

  toggleDarkMode() {
    this.darkModeService.updateDarkMode();
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  ngOnInit() {
    this.route.params.subscribe(() => {
      this.getProfile();
    });
    this.isAdmin = this.authService.isAdmin();
  }

  getProfile() {
    this.userService.getProfileUser().subscribe((response: any) => {
      this.user = response.data;
      console.log("User", this.user);
    });
  }

  logout() {
    this.authService.logout();
    this.toastr.info("Deconnexion reussie");
    this.router.navigate(["/login"]);
  }

  closeMenu() {
    this.showMenu = false;
  }

  ngOnDestroy() {
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
  }
}
