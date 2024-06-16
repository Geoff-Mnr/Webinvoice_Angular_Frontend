import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Ticket } from "../../models/ticket.interface";
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { UserService } from "../../services/user.service";
import { inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { Router } from "@angular/router";
import { TicketService } from "../../services/ticket.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-support-message-admin",
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./support-message-admin.component.html",
  styleUrl: "./support-message-admin.component.scss",
})
export class SupportMessageAdminComponent {
  @Input() ticket!: Ticket;
  @Output() messageCreated = new EventEmitter<void>();
  user: any;

  userService = inject(UserService);
  ticketService = inject(TicketService);
  router = inject(Router);
  toastr = inject(ToastrService);
  fb = inject(FormBuilder);

  form = this.fb.group({
    message: ["", Validators.required],
  });

  createMessage() {
    const messageData = {
      message: this.form.value.message as string,
    };

    if (messageData.message) {
      this.ticketService.createMessage(this.ticket.id, messageData).subscribe({
        next: (response: any) => {
          this.toastr.success("Message created successfully");
          this.router.navigate(["/support-admin"]);
          this.messageCreated.emit();
        },
        error: (error: any) => {
          this.toastr.error("Error creating message");
        },
      });
    } else {
      this.toastr.error("Message is required");
    }
  }

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    this.userService.getProfileUser().subscribe((response: any) => {
      this.user = response.data;
      console.log("User", this.user);
    });
  }
}
