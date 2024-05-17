import { Component, inject } from "@angular/core";
import { RouterLink, Router } from "@angular/router";
import { CustomerService } from "../../services/customer.service";
import { CustomerAddEditComponent } from "../../customer-add-edit/customer-add-edit.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { HttpClientModule } from "@angular/common/http";
import { OnDestroy } from "@angular/core";
import { Customer } from "../../models/customer.interface";

@Component({
  selector: "app-customer",
  standalone: true,
  imports: [CustomerAddEditComponent, RouterLink, CommonModule, FormsModule],
  templateUrl: "./customer.component.html",
  styleUrl: "./customer.component.scss",
})
export class CustomerComponent implements OnDestroy {
  CustomerService = inject(CustomerService);
  router = inject(Router);
  private subDelete: Subscription | undefined;
  toastr = inject(ToastrService);

  customers: Customer[] = [];

  currentPage = 1;
  totalPage = 1;
  totalItems = 1;
  itemsPerPage = 10;
  search = "";

  ngOnInit() {
    const savedItemsPerPage = localStorage.getItem("itemsPerPage");
    if (savedItemsPerPage) {
      this.itemsPerPage = parseInt(savedItemsPerPage);
    }
    this.getListCustomers();
  }

  getListCustomers(page: number = 1) {
    this.subDelete = this.CustomerService.listCustomersByUser(page, this.itemsPerPage, this.search).subscribe({
      next: (response) => {
        this.customers = response.data.data;
        console.log(response.data);
        this.totalItems = response.data.total;
        this.totalPage = response.data.last_page;

        if (this.totalItems === 0) {
          this.toastr.warning("No data found");
        }
        this.currentPage = page < 1 ? 1 : page > this.totalPage ? this.totalPage : page;
      },
      error: (error) => {
        this.toastr.error("Une erreur est survenue lors de la récupération des données", error);
      },
    });
  }

  onItemsPerPageChange() {
    localStorage.setItem("itemsPerPage", this.itemsPerPage.toString());
    this.getListCustomers();
  }

  ngOnDestroy() {
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
  }
}
