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

  ngOnDestroy() {
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
  }
}
