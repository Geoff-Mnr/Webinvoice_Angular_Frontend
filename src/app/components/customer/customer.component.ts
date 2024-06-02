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

@Component({
  selector: "app-customer",
  standalone: true,
  imports: [CustomerAddEditComponent, RouterLink, CommonModule, FormsModule, HttpClientModule],
  templateUrl: "./customer.component.html",
  styleUrl: "./customer.component.scss",
})
export class CustomerComponent implements OnDestroy {
  customerService = inject(CustomerService);
  router = inject(Router);
  private subDelete: Subscription | undefined;
  toastr = inject(ToastrService);

  customers: Customer[] = [];
  selectedCustomer?: Customer;

  currentPage = 1;
  totalPage = 1;
  totalItems = 1;
  itemsPerPage = 10;
  search = "";

  ngOnInit() {
    const savedItemsPerPage = localStorage.getItem("itemsPerPage");
    if (savedItemsPerPage) {
      this.itemsPerPage = parseInt(savedItemsPerPage, 10);
    }
    this.getListCustomers();
  }

  searchCustomer() {
    this.getListCustomers(this.currentPage);
  }

  getListCustomers(page: number = 1) {
    console.log(page, this.itemsPerPage, this.search);
    this.subDelete = this.customerService.listCustomersByUser(page, this.itemsPerPage, this.search).subscribe({
      next: (response) => {
        this.customers = response.data.data;
        console.log(this.customers);
        this.totalItems = response.data.total;
        this.totalPage = response.data.last_page;

        if (this.totalItems === 0) {
          this.toastr.info("Aucun client trouvé");
        }
        this.currentPage = page < 1 ? 1 : page > this.totalPage ? this.totalPage : page;
      },
      error: (error) => {
        this.toastr.error("Une erreur est survenue lors de la récupération des données", error);
      },
    });
  }

  selectCustomer(customer: Customer) {
    this.selectedCustomer = customer;
    const navigationExtras: NavigationExtras = {
      state: { customer: customer },
    };
    this.router.navigate(["/customer/edit-customer"], navigationExtras);
    console.log(this.selectedCustomer);
  }

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

  onItemsPerPageChange() {
    localStorage.setItem("itemsPerPage", this.itemsPerPage.toString());
    this.getListCustomers();
  }

  private closeEditForm() {
    this.selectedCustomer = undefined;
  }

  ngOnDestroy() {
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
  }
}
