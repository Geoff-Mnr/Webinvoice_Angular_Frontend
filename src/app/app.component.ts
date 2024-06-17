import { Component, inject } from "@angular/core";
import { RouterOutlet, RouterLink } from "@angular/router";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DarkModeService } from "./services/dark-mode.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "WebInvoice.";

  router = inject(Router);
  // Injection du service DarkModeService
  darkModeService: DarkModeService = inject(DarkModeService);
}
