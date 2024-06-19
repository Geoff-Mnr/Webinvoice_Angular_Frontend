import { Component, inject } from "@angular/core";
import { RouterLink, Router } from "@angular/router";
import { CustomerService } from "../../services/customer.service";
import { CustomerAddEditComponent } from "../customer-add-edit/customer-add-edit.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { HttpClientModule } from "@angular/common/http";
import { OnDestroy } from "@angular/core";
import { Customer } from "../../models/customer.interface";
import { NavigationExtras } from "@angular/router";
import { VatNumberPipe } from "../../pipes/vat-number.pipe";
import { PhoneNumberPipe } from "../../pipes/phone-number.pipe";

@Component({
  selector: "app-customer",
  standalone: true,
  imports: [CustomerAddEditComponent, RouterLink, CommonModule, FormsModule, HttpClientModule, VatNumberPipe, PhoneNumberPipe],
  templateUrl: "./customer.component.html",
  styleUrl: "./customer.component.scss",
})
export class CustomerComponent implements OnDestroy {
  //Injection des services customerService et router
  customerService = inject(CustomerService);
  router = inject(Router);
  toastr = inject(ToastrService);

  private subDelete: Subscription | undefined;
  customers: Customer[] = [];

  selectedCustomer?: Customer;

  //Déclaration des variables currentPage, totalPage, totalItems, itemsPerPage et search
  currentPage = 1;
  totalPage = 1;
  totalItems = 1;
  itemsPerPage = 10;
  search: string = "";
  isLoading = true;

  // Initialisation de la méthode ngOnInit
  ngOnInit() {
    const savedItemsPerPage = localStorage.getItem("itemsPerPage");
    if (savedItemsPerPage) {
      //Conversion de la valeur de savedItemsPerPage en entier
      this.itemsPerPage = parseInt(savedItemsPerPage, 10);
    }
    //Appel de la méthode getListCustomers
    this.getListCustomers();
  }

  //Déclaration de la méthode searchCustomer
  searchCustomer() {
    this.getListCustomers(this.currentPage);
  }

  //Déclaration de la méthode getListCustomers qui prend en paramètre la page et qui permet de récupérer la liste des clients
  getListCustomers(page: number = 1) {
    this.isLoading = true;
    this.subDelete = this.customerService.listCustomersByUser(page, this.itemsPerPage, this.search).subscribe({
      next: (response) => {
        this.customers = response.data;
        this.totalItems = response.meta.total;
        this.totalPage = response.meta.last_page;
        if (this.totalItems === 0) {
          this.toastr.info("Aucun client trouvé");
        }
        this.currentPage = page < 1 ? 1 : page > this.totalPage ? this.totalPage : page;
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error("Une erreur est survenue lors de la récupération des données", error);
        this.isLoading = false;
      },
    });
  }

  //Déclaration de la méthode selectCustomer qui prend en paramètre un client
  selectCustomer(customer: Customer) {
    this.selectedCustomer = customer;
    const navigationExtras: NavigationExtras = {
      state: { customer: customer },
    };
    //Redirection vers la page edit-customer
    this.router.navigate(["/customer/edit-customer"], navigationExtras);
  }
  //Déclaration de la méthode addCustomer qui permet d'ajouter un client
  addCustomer() {
    this.router.navigate(["/customer/add-customer"]);
  }

  deleteCustomer(item: Customer) {
    this.subDelete = this.customerService.delete(item.id).subscribe({
      next: () => {
        this.toastr.success("Client supprimé avec succès");
        this.getListCustomers();
      },
      error: (error) => {
        this.toastr.error("Une erreur est survenue lors de la suppression du client", error);
      },
    });
  }

  //Déclaration de la méthode onPageChange qui prend en paramètre la page et qui permet de changer de page
  //Garde en mémoire la page actuelle
  onItemsPerPageChange() {
    localStorage.setItem("itemsPerPage", this.itemsPerPage.toString());
    this.getListCustomers();
  }

  //Déclaration de la méthode getStatusClass qui prend en paramètre le status et qui permet de retourner la classe correspondante
  getStatusClass(status: string): string {
    switch (status) {
      case "Actif":
        return "status-active";
      case "Inactif":
        return "status-inactive";
      default:
        return "status-inactive";
    }
  }

  //Déclaration de la méthode ngOnDestroy qui permet de supprimer les abonnements
  ngOnDestroy() {
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
  }
}
