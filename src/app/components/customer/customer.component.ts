import { Component, inject } from "@angular/core";
import { RouterLink, Router } from "@angular/router";
import { CustomerAddEditComponent } from "../../customer-add-edit/customer-add-edit.component";

@Component({
  selector: "app-customer",
  standalone: true,
  imports: [CustomerAddEditComponent, RouterLink],
  templateUrl: "./customer.component.html",
  styleUrl: "./customer.component.scss",
})
export class CustomerComponent {
  router = inject(Router);
}
