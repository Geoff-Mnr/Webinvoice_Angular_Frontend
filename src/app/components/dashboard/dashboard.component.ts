import { Component, inject } from "@angular/core";
import { RouterOutlet, RouterLink, RouterModule, Router } from "@angular/router";
import { RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DarkModeService } from "../../services/dark-mode.service";

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

  toggleDarkMode() {
    this.darkModeService.updateDarkMode();
  }
}
