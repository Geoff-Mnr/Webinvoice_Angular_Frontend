import { Component, inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { Ticket } from "../../models/ticket.interface";
import { TicketService } from "../../services/ticket.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-support-create-ticket",
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./support-create-ticket.component.html",
  styleUrl: "./support-create-ticket.component.scss",
})
export class SupportCreateTicketComponent {
  Ticket = {
    id: 0,
    title: "",
    description: "",
    status: "",
    created_at: new Date(),
    updated_at: new Date(),
  };

  router = inject(Router);
  ticketService = inject(TicketService);
  toastr = inject(ToastrService);
  fb = inject(FormBuilder);

  constructor(private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      navigation.extras.state["ticket"];
    }
  }

  form = this.fb.group({
    title: ["", Validators.required],
    description: ["", Validators.required],
  });

  createTicket() {
    const item: Ticket = this.form.value as Ticket;
    this.ticketService.createTicket(item).subscribe(
      (response) => {
        this.toastr.success("Ticket created successfully");
        this.router.navigate(["/support"]);
      },
      (error) => {
        this.toastr.error("An error occurred while creating the ticket");
      }
    );
  }

  cancel() {
    this.router.navigate(["/support"]);
  }
}
