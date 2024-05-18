import { Component, Input, EventEmitter, Output, inject } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { FormsModule, FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Customer } from "../models/customer.interface";
import { CommonModule, DatePipe } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-customer-add-edit",
  standalone: true,
  imports: [FormsModule, CommonModule, DatePipe, ReactiveFormsModule],
  templateUrl: "./customer-add-edit.component.html",
  styleUrls: ["./customer-add-edit.component.scss"],
  providers: [DatePipe],
})
export class CustomerAddEditComponent {
  @Output() addEmmiter = new EventEmitter();
  @Output() updateEmiter = new EventEmitter();
  @Output() closeEmitter = new EventEmitter();

  @Input() selectedCustomer: Customer = {
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

  constructor(private datePipe: DatePipe) {}

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

  private clone(value: any) {
    return JSON.parse(JSON.stringify(value));
  }

  addCustomer() {
    this.addEmmiter.emit(this.selectedCustomer);
    this.router.navigate(["/customer"]);
  }

  updateCustomer() {
    const customer = this.clone(this.selectedCustomer);
    this.updateEmiter.emit(customer);
    this.router.navigate(["/customer"]);
  }

  closeForm() {
    this.closeEmitter.emit();
    this.router.navigate(["/customer"]);
  }
}
