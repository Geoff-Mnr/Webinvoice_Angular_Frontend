import { Component, OnDestroy, inject } from "@angular/core";
import { RouterLink, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { TicketService } from "../../services/ticket.service";
import { Ticket } from "../../models/ticket.interface";
import { NavigationExtras } from "@angular/router";
import { UserService } from "../../services/user.service";
import { AuthService } from "../../services/auth.service";
import { SupportMessageComponent } from "../support-message/support-message.component";

@Component({
  selector: "app-support",
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, HttpClientModule, SupportMessageComponent],
  templateUrl: "./support.component.html",
  styleUrl: "./support.component.scss",
})
export class SupportComponent implements OnDestroy {
  ticketService = inject(TicketService);
  userService = inject(UserService);
  authService = inject(AuthService);
  router = inject(Router);
  private subDelete: Subscription | undefined;

  tickets: Ticket[] = [];
  showMenu = false;
  showComponent = false;
  user: any;
  isAdmin: boolean = false;

  toggleMenu(index: number): void {
    this.tickets[index].showMenu = !this.tickets[index].showMenu;
  }

  respondToTicket(index: number): void {
    // Assurez-vous que le menu est fermé
    if (this.tickets[index].showMenu) {
      this.toggleMenu(index);
    }
    // Ajoutez ici la logique de réponse au ticket
  }

  toggleMessage: boolean = false;

  toggleComponent(index: number) {
    this.tickets[index].showComponent = !this.tickets[index].showComponent;
    this.tickets[index].showMenu = false;
  }

  ngOnInit() {
    this.getListTicketsByUser();
    console.log("Tickets", this.getListTicketsByUser);
    this.getProfile();
    this.isAdmin = this.authService.isAdmin();
  }

  getProfile() {
    this.userService.getProfileUser().subscribe((response: any) => {
      this.user = response.data;
      console.log("User", this.user);
    });
  }

  getListTicketsByUser() {
    this.subDelete = this.ticketService.listTicketsByUser().subscribe({
      next: (response) => {
        this.tickets = response.data;
        console.log(this.tickets);
      },
    });
  }

  OnMessageCreated(event: any) {
    if (event) {
      this.getListTicketsByUser();
    }
  }

  handleMessageCreated() {
    this.getListTicketsByUser();
    this.showComponent = false;
  }

  createTicket() {
    this.router.navigate(["/support/create-ticket"]);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case "Ouvert":
        return "is_active-active";
      case "Fermé":
        return "is_active-inactive";
      default:
        return "is_active-inactive";
    }
  }

  ngOnDestroy() {
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
  }
}
