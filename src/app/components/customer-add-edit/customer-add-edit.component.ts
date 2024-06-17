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
  //Déclaration de la variable selectedCustomer de type Customer
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
    status: "",
    created_at: new Date(),
    updated_at: new Date(),
  };

  //Injection des services router, customerService et toastr
  router = inject(Router);
  customerService = inject(CustomerService);
  toastr = inject(ToastrService);
  fb = inject(FormBuilder);

  //Constructeur de la classe CustomerAddEditComponent avec le service ActivatedRoute en paramètre
  constructor(private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.selectedCustomer = navigation.extras.state["customer"];
      this.selectedCustomer.status = this.mapStatusToValue(this.selectedCustomer.status);
    }
  }
  //Déclaration de la variable form de type FormGroup
  form = this.fb.group({
    company_name: [this.selectedCustomer.company_name, Validators.required],
    email: [this.selectedCustomer.email, Validators.required],
    phone_number: [this.selectedCustomer.phone_number, Validators.required],
    billing_address: [this.selectedCustomer.billing_address, Validators.required],
    billing_city: [this.selectedCustomer.billing_city, Validators.required],
    billing_country: [this.selectedCustomer.billing_country, Validators.required],
    billing_zip_code: [this.selectedCustomer.billing_zip_code, Validators.required],
    billing_state: [this.selectedCustomer.billing_state, Validators.required],
    website: [this.selectedCustomer.website, Validators.required],
    status: [this.selectedCustomer.status],
    vat_number: [this.selectedCustomer.vat_number, [Validators.minLength(9), Validators.maxLength(10)]],
    created_at: [new Date(), Validators.required],
    updated_at: [new Date(), Validators.required],
  });

  //Initialisation de la méthode ngOnInit
  ngOnInit() {
    this.selectedCustomer = this.clone(this.selectedCustomer);
    if (this.selectedCustomer) {
      this.form.patchValue(this.selectedCustomer);
    }
  }

  // Clone qui permet de copier un objet
  private clone(value: any) {
    return JSON.parse(JSON.stringify(value));
  }

  //Méthode mapStatusToValue qui prend en paramètre status de type string et retourne une string
  mapStatusToValue(status: string): string {
    switch (status) {
      case "Actif":
        return "A";
      case "Inactif":
        return "I";
      default:
        return "";
    }
  }
  //Méthode mapValueToStatus qui prend en paramètre value de type string et retourne une string
  mapValueToStatus(value: string): string {
    switch (value) {
      case "A":
        return "Actif";
      case "I":
        return "Inactif";
      default:
        return "";
    }
  }

  //Méthode save qui permet de sauvegarder un client
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

  //Méthode createCustomer qui permet d'ajouter un client
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

  //Méthode cancel qui permet d'annuler l'opération
  cancel() {
    this.router.navigate(["/customer"]);
    this.toastr.info("Opération annulée");
  }
}
