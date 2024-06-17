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
import { OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

@Component({
  selector: "app-support-message",
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./support-message.component.html",
  styleUrl: "./support-message.component.scss",
})
export class SupportMessageComponent {
  // Inpiut et Output seront utilisés pour la communication entre les composants
  @Input() ticket!: Ticket;
  @Output() messageCreated = new EventEmitter<void>();
  user: any;

  // Initialisation des services
  userService = inject(UserService);
  ticketService = inject(TicketService);
  router = inject(Router);
  toastr = inject(ToastrService);
  fb = inject(FormBuilder);
  private subDelete: Subscription | undefined;

  // Initialisation du formulaire
  form = this.fb.group({
    message: ["", Validators.required],
  });

  // Créer un message
  createMessage() {
    const messageData = {
      message: this.form.value.message as string,
    };

    if (messageData.message) {
      this.subDelete = this.ticketService.createMessage(this.ticket.id, messageData).subscribe({
        next: (response: any) => {
          this.toastr.success("Message created successfully");
          this.router.navigate(["/support"]);
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

  //Initialisation des données
  ngOnInit() {
    this.getProfile();
  }

  // Recupérer le profil de l'utilisateur
  getProfile() {
    this.subDelete = this.userService.getProfileUser().subscribe((response: any) => {
      this.user = response.data;
    });
  }

  // Désabonnement de la souscription
  ngOnDestroy() {
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
  }
}
