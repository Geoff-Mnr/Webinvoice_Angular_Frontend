import { Component, OnDestroy, inject } from "@angular/core";
import { RouterLink, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { Subscription } from "rxjs";
import { TicketService } from "../../services/ticket.service";
import { Ticket } from "../../models/ticket.interface";
import { UserService } from "../../services/user.service";
import { AuthService } from "../../services/auth.service";
import { SupportMessageAdminComponent } from "../support-message-admin/support-message-admin.component";
import { ToastrService } from "ngx-toastr";
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "app-support-list-ticket-admin",
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, HttpClientModule, SupportMessageAdminComponent],
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

  pendingStatusChange: { [key: number]: boolean } = {};

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
    if (this.tickets[index].showMenu) {
      this.toggleMenu(index);
    }
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

  inactiveTicket(index: number) {
    const ticket = this.tickets[index];
    this.pendingStatusChange[index] = true;

    this.ticketService.updateTicket(ticket.id, { ...ticket, status: "C" }).subscribe({
      next: () => {
        this.toastr.success("Ticket désactivé avec succès");
        this.tickets[index].status = "Fermé";
        this.tickets[index].showMenu = false;
        delete this.pendingStatusChange[index];
      },
      error: (error) => {
        delete this.pendingStatusChange[index];
        this.tickets[index].showMenu = false;
        const errorMessage = error.error?.message || "Erreur inconnue lors de la désactivation du ticket";
        this.toastr.error(errorMessage, "Erreur lors de la désactivation du ticket");
      },
    });
  }

  getStatusClass(status: string, index: number): string {
    if (this.pendingStatusChange[index]) {
      return "is_active-inactive"; // Retourner la classe pour le statut "Fermé" en attente
    }

    switch (status) {
      case "Ouvert":
        return "is_active-active";
      case "Fermé":
        return "is_active-inactive";
      default:
        return "is_active-inactive";
    }
  }

  getStatusText(status: string, index: number): string {
    if (this.pendingStatusChange[index]) {
      return "Fermé";
    }

    return status;
  }

  ngOnDestroy() {
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
  }
}
