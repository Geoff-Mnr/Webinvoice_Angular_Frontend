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

@Component({
  selector: "app-support-list-ticket-admin",
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, HttpClientModule, SupportMessageAdminComponent],
  templateUrl: "./support-list-ticket-admin.component.html",
  styleUrl: "./support-list-ticket-admin.component.scss",
})
export class SupportListTicketAdminComponent implements OnDestroy {
  // Initialisation des services
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

  // Recupérer le profil de l'utilisateur
  getProfile() {
    this.subDelete = this.userService.getProfileUser().subscribe((response: any) => {
      this.user = response.data;
    });
  }

  // Afficher le menu
  toggleMenu(index: number): void {
    this.tickets[index].showMenu = !this.tickets[index].showMenu;
  }

  // Afficher le composant
  toggleComponent(index: number) {
    this.tickets[index].showComponent = !this.tickets[index].showComponent;
    this.tickets[index].showMenu = false;
  }

  // Répondre à un ticket
  respondToTicket(index: number): void {
    if (this.tickets[index].showMenu) {
      this.toggleMenu(index);
    }
  }

  // Initialisation des données
  ngOnInit() {
    this.getListTickets();
    this.getProfile();
  }

  // Récupérer la liste des tickets
  getListTickets() {
    this.subDelete = this.ticketService.listTickets().subscribe((response: any) => {
      this.tickets = response.data;
    });
  }
  // Quand un message est créé ça met à jour la liste des tickets
  OnMessageCreated(event: any) {
    if (event) {
      this.getListTickets();
    }
  }

  //ça enlève le composant quand le message est créé
  handleMessageCreated() {
    this.getListTickets();
    this.showComponent = false;
  }

  // désactiver un ticket
  inactiveTicket(index: number) {
    const ticket = this.tickets[index];
    this.pendingStatusChange[index] = true;
    this.subDelete = this.ticketService.updateTicket(ticket.id, { ...ticket, status: "C" }).subscribe({
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

  // status du ticket
  getStatusClass(status: string, index: number): string {
    if (this.pendingStatusChange[index]) {
      return "is_active-inactive";
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

  // status du ticket
  getStatusText(status: string, index: number): string {
    if (this.pendingStatusChange[index]) {
      return "Fermé";
    }
    return status;
  }

  // Désabonnement
  ngOnDestroy() {
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
  }
}
