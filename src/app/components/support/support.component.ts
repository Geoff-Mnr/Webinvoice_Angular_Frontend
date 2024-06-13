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

@Component({
  selector: "app-support",
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, HttpClientModule],
  templateUrl: "./support.component.html",
  styleUrl: "./support.component.scss",
})
export class SupportComponent implements OnDestroy {
  ticketService = inject(TicketService);
  userService = inject(UserService);
  router = inject(Router);
  private subDelete: Subscription | undefined;

  tickets: Ticket[] = [];
  showMenu = false;
  user: any;

  toggleMenu(index: number): void {
    this.tickets[index].showMenu = !this.tickets[index].showMenu;
  }

  ngOnInit() {
    this.getListTicketsByUser();
    this.getProfile();
  }

  getUserProfilePicture(ticket: any) {
    const user = ticket.users.find((user: any) => user.id === ticket.created_by);
    return user ? user.profile_picture : "";
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

  ngOnDestroy() {
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
  }
}
