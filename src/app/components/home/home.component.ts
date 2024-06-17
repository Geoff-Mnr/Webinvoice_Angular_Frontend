import { Component, inject } from "@angular/core";
import { RouterLink, Router } from "@angular/router";
import { Document } from "../../models/document.interface";
import { DocumentService } from "../../services/document.service";
import { OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import { DatePipe } from "@angular/common";
import { TicketService } from "../../services/ticket.service";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [RouterLink, CommonModule, DatePipe],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent implements OnDestroy {
  // Injectection des services
  documentService = inject(DocumentService);
  ticketService = inject(TicketService);
  userService = inject(UserService);
  router = inject(Router);
  private subDelete: Subscription | undefined;
  documents: Document[] = [];
  ticket: any;
  user: any;
  stats: any;

  // Methode d'initialisation des données
  ngOnInit() {
    this.getListDocuments();
    this.getStats();
    this.getLastTicket();
    this.getProfile();
  }

  // Methode avec switch pour changer la couleur du status
  getStatusClass(status: string): string {
    switch (status) {
      case "Payé":
        return "status-paid";
      case "En cours":
        return "status-in-progress";
      case "Impayé":
        return "status-unpaid";
      default:
        return "status-unknown";
    }
  }

  // Methode avec switch pour changer la couleur du status du ticket
  getStatusTicketClass(status: string): string {
    switch (status) {
      case "Ouvert":
        return "is_active-active";
      case "Fermé":
        return "is_active-inactive";
      default:
        return "is_active-inactive";
    }
  }

  // Methode pour recuperer le profile de l'utilisateur
  getProfile() {
    this.subDelete = this.userService.getProfileUser().subscribe((response: any) => {
      this.user = response.data;
    });
  }

  // Methode pour recuperer la liste des documents
  getListDocuments() {
    this.subDelete = this.documentService.listDocuments().subscribe((data) => {
      this.documents = data.data;
    });
  }

  // Methode pour recuperer le dernier ticket
  getLastTicket() {
    this.subDelete = this.ticketService.getLastTicket().subscribe((data) => {
      this.ticket = data.data;
    });
  }

  // Methode pour recuperer les statistiques
  getStats() {
    this.subDelete = this.documentService.getstats().subscribe((data) => {
      this.stats = data.data;
    });
  }

  // Methode pour se désinscrire de l'observable
  ngOnDestroy() {
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
  }
}
