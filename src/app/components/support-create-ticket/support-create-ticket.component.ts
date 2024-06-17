import { Component, inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { Ticket } from "../../models/ticket.interface";
import { TicketService } from "../../services/ticket.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

@Component({
  selector: "app-support-create-ticket",
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./support-create-ticket.component.html",
  styleUrl: "./support-create-ticket.component.scss",
})
export class SupportCreateTicketComponent implements OnDestroy {
  Ticket = {
    id: 0,
    title: "",
    description: "",
    status: "",
    created_at: new Date(),
    updated_at: new Date(),
  };

  // Initialisation des services
  router = inject(Router);
  ticketService = inject(TicketService);
  toastr = inject(ToastrService);
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  private subDelete: Subscription | undefined;

  // Constructeur pour les paramètres de route
  constructor(private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      navigation.extras.state["ticket"];
    }
  }

  // Initialisation des données
  form = this.fb.group({
    title: ["", Validators.required],
    description: ["", Validators.required],
  });

  // Créer un ticket
  createTicket() {
    const item: Ticket = this.form.value as Ticket;
    this.subDelete = this.ticketService.createTicket(item).subscribe({
      next: (response) => {
        this.toastr.success("Ticket created successfully");
        this.router.navigate(["/support"]);
      },
      error: (error) => {
        this.toastr.error("An error occurred while creating the ticket");
      },
    });
  }

  // Annuler la création du ticket
  cancel() {
    this.router.navigate(["/support"]);
  }

  // Désabonnement
  ngOnDestroy() {
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
  }
}
