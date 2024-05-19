import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { HomeComponent } from "./components/home/home.component";
import { CustomerComponent } from "./components/customer/customer.component";
import { ProductComponent } from "./components/product/product.component";
import { DocumentComponent } from "./components/document/document.component";
import { DocumenttypeComponent } from "./components/documenttype/documenttype.component";
import { SupportComponent } from "./components/support/support.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { CustomerAddEditComponent } from "./customer-add-edit/customer-add-edit.component";
import { AuthGuard } from "./guards/auth-guard";
import { LoginGuard } from "./guards/login-guard";

export const routes: Routes = [
  { path: "login", component: LoginComponent, canActivate: [LoginGuard] },
  { path: "register", component: RegisterComponent },
  {
    path: "",
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", redirectTo: "home", pathMatch: "full" },
      { path: "home", component: HomeComponent },
      {
        path: "customer",
        children: [
          { path: "", component: CustomerComponent },
          { path: "add-customer", component: CustomerAddEditComponent },
          { path: "edit-customer", component: CustomerAddEditComponent },
        ],
      },
      { path: "product", component: ProductComponent },
      { path: "document", component: DocumentComponent },
      { path: "documenttype", component: DocumenttypeComponent },
      { path: "support", component: SupportComponent },
      { path: "settings", component: SettingsComponent },
    ],
  },
];
