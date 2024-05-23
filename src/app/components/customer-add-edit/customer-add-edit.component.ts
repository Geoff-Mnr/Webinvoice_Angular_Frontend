import { Component, inject } from "@angular/core";
import { FormsModule, FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Customer } from "../../models/customer.interface";
import { CommonModule, DatePipe } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { CustomerService } from "../../services/customer.service";
import { ToastrService } from "ngx-toastr";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-customer-add-edit",
  standalone: true,
  imports: [FormsModule, CommonModule, DatePipe, ReactiveFormsModule, RouterLink],
  templateUrl: "./customer-add-edit.component.html",
  styleUrls: ["./customer-add-edit.component.scss"],
  providers: [DatePipe],
})
export class CustomerAddEditComponent {
  selectedCustomer: Customer = {
    id: 0,
    company_name: "",
    email: "",
    phone_number: "",
    billing_address: "",
    billing_city: "",
    billing_country: "",
    billing_zip_code: "",
    billing_state: "",
    website: "",
    vat_number: "",
    created_at: new Date(),
    updated_at: new Date(),
    status: "",
  };

  router = inject(Router);
  customerService = inject(CustomerService);
  toastr = inject(ToastrService);

  constructor(private datePipe: DatePipe, private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.selectedCustomer = navigation.extras.state["customer"];
    }
  }

  formatDate(date: Date) {
    return this.datePipe.transform(date, "HH:mm le dd-MM-yyyy");
  }

  fb = inject(FormBuilder);

  form = this.fb.group({
    company_name: ["", Validators.required],
    email: ["", Validators.required],
    phone_number: ["", Validators.required],
    billing_address: ["", Validators.required],
    billing_city: ["", Validators.required],
    billing_country: ["", Validators.required],
    billing_zip_code: ["", Validators.required],
    billing_state: ["", Validators.required],
    website: ["", Validators.required],
    vat_number: ["", Validators.required],
    created_at: [new Date(), Validators.required],
    updated_at: [new Date(), Validators.required],
    status: ["", Validators.required],
  });

  ngOnInit() {
    this.selectedCustomer = this.clone(this.selectedCustomer);
  }

  private clone(value: any) {
    return JSON.parse(JSON.stringify(value));
  }

  updateCustomer() {
    const item: Customer = this.form.value as Customer;
    this.customerService.updateCustomer(this.selectedCustomer.id, item).subscribe({
      next: () => {
        this.toastr.success("Client modifié avec succès");
        this.router.navigate(["/customer"]);
      },
      error: (error) => {
        this.toastr.error("Une erreur est survenue lors de la modification du client", error);
      },
    });
  }

  createCustomer() {
    const item: Customer = this.form.value as Customer;
    this.customerService.createCustomer(item).subscribe({
      next: () => {
        this.toastr.success("Client ajouté avec succès");
        this.router.navigate(["/customer"]);
      },
      error: (error) => {
        this.toastr.error("Une erreur est survenue lors de l'ajout du client", error);
      },
    });
  }

  cancel() {
    this.router.navigate(["/customer"]);
    this.toastr.info("Opération annulée");
  }
}
