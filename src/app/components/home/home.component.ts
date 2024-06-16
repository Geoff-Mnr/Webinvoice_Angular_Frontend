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
  documentService = inject(DocumentService);
  ticketService = inject(TicketService);
  userService = inject(UserService);
  router = inject(Router);
  private subDelete: Subscription | undefined;
  documents: Document[] = [];
  ticket: any;
  user: any;
  stats: any;

  ngOnInit() {
    this.getListDocuments();
    this.getLastTicket();
    this.getProfile();
    this.getStats();
  }

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

  getProfile() {
    this.userService.getProfileUser().subscribe((response: any) => {
      this.user = response.data;
      console.log("User", this.user);
    });
  }

  getListDocuments() {
    this.subDelete = this.documentService.listDocuments().subscribe((data) => {
      this.documents = data.data;
      console.log(this.documents);
    });
  }

  getLastTicket() {
    this.subDelete = this.ticketService.getLastTicket().subscribe((data) => {
      this.ticket = data.data;
      console.log(this.ticket);
    });
  }

  getStats() {
    this.subDelete = this.documentService.getstats().subscribe((data) => {
      this.stats = data.data;
      console.log(this.stats);
    });
  }

  ngOnDestroy() {
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
  }
}
