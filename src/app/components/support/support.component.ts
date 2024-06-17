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
import { SupportMessageComponent } from "../support-message/support-message.component";

@Component({
  selector: "app-support",
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, HttpClientModule, SupportMessageComponent],
  templateUrl: "./support.component.html",
  styleUrl: "./support.component.scss",
})
export class SupportComponent implements OnDestroy {
  // Initialisation des services
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
  toggleMessage: boolean = false;

  // afficher le menu
  toggleMenu(index: number): void {
    this.tickets[index].showMenu = !this.tickets[index].showMenu;
  }

  // répondre au ticket
  respondToTicket(index: number): void {
    if (this.tickets[index].showMenu) {
      this.toggleMenu(index);
    }
  }

  // Afficher le composant
  toggleComponent(index: number) {
    this.tickets[index].showComponent = !this.tickets[index].showComponent;
    this.tickets[index].showMenu = false;
  }

  // Initialisation des données
  ngOnInit() {
    this.getListTicketsByUser();
    this.getProfile();
    this.isAdmin = this.authService.isAdmin();
  }

  // Récupérer le profil de l'utilisateur
  getProfile() {
    this.subDelete = this.userService.getProfileUser().subscribe((response: any) => {
      this.user = response.data;
    });
  }

  // Récupérer la liste des tickets de l'utilisateur
  getListTicketsByUser() {
    this.subDelete = this.ticketService.listTicketsByUser().subscribe({
      next: (response) => {
        this.tickets = response.data;
      },
    });
  }

  // Un fois le message est créé
  OnMessageCreated(event: any) {
    if (event) {
      this.getListTicketsByUser();
    }
  }

  handleMessageCreated() {
    this.getListTicketsByUser();
    this.showComponent = false;
  }

  // Bouton pour créer un ticket
  createTicket() {
    this.router.navigate(["/support/create-ticket"]);
  }

  // Status de l'activité du ticket pour le css
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

  // Se désabonner de la souscription
  ngOnDestroy() {
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
  }
}
