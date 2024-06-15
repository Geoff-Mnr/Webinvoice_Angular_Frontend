import { Component, OnDestroy, inject } from "@angular/core";
import { RouterLink, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { Subscription } from "rxjs";
import { TicketService } from "../../services/ticket.service";
import { Ticket } from "../../models/ticket.interface";
import { NavigationExtras } from "@angular/router";
import { UserService } from "../../services/user.service";
import { AuthService } from "../../services/auth.service";
import { SupportMessageComponent } from "../support-message/support-message.component";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-support-list-ticket-admin",
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, HttpClientModule, SupportMessageComponent],
  templateUrl: "./support-list-ticket-admin.component.html",
  styleUrl: "./support-list-ticket-admin.component.scss",
})
export class SupportListTicketAdminComponent {
  ticketService = inject(TicketService);
  userService = inject(UserService);
  authService = inject(AuthService);
  router = inject(Router);
  toastr = inject(ToastrService);
  private subDelete: Subscription | undefined;

  tickets: Ticket[] = [];
  user: any;
  showMenu = false;
  showComponent = false;
  toggleMessage: boolean = false;

  getProfile() {
    this.userService.getProfileUser().subscribe((response: any) => {
      this.user = response.data;
      console.log("User", this.user);
    });
  }

  toggleMenu(index: number): void {
    this.tickets[index].showMenu = !this.tickets[index].showMenu;
  }

  toggleComponent(index: number) {
    this.tickets[index].showComponent = !this.tickets[index].showComponent;
    this.tickets[index].showMenu = false;
  }

  respondToTicket(index: number): void {
    // Assurez-vous que le menu est fermé
    if (this.tickets[index].showMenu) {
      this.toggleMenu(index);
    }
    // Ajoutez ici la logique de réponse au ticket
  }

  ngOnInit() {
    this.getListTickets();
    console.log("Tickets", this.getListTickets);
    this.getProfile();
  }

  getListTickets() {
    this.ticketService.listTickets().subscribe((response: any) => {
      this.tickets = response.data;
      console.log("Tickets", this.tickets);
    });
  }

  OnMessageCreated(event: any) {
    if (event) {
      this.getListTickets();
    }
  }

  handleMessageCreated() {
    this.getListTickets();
    this.showComponent = false;
  }

  createTicket() {
    this.router.navigate(["/support/create-ticket"]);
  }

  inactiveTicket(index: number) {
    const ticket = this.tickets[index];
    ticket.is_active = "0";
    this.ticketService.updateTicket(ticket.id, ticket).subscribe({
      next: () => {
        this.toastr.success("Ticket désactivé avec succès");
        this.getListTickets();
      },
      error: (error) => {
        this.toastr.error("Une erreur est survenue lors de la désactivation du ticket", error);
      },
    });
  }

  getIsactiveClass(is_active: string): string {
    switch (is_active) {
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
