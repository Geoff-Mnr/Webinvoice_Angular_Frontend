import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { HomeComponent } from "./components/home/home.component";
import { CustomerComponent } from "./components/customer/customer.component";
import { ProductComponent } from "./components/product/product.component";
import { ProductAddEditComponent } from "./components/product-add-edit/product-add-edit.component";
import { DocumentComponent } from "./components/document/document.component";
import { DocumentAddEditComponent } from "./components/document-add-edit/document-add-edit.component";
import { DocumenttypeComponent } from "./components/documenttype/documenttype.component";
import { DocumenttypeAddEditComponent } from "./components/documenttype-add-edit/documenttype-add-edit.component";
import { SupportComponent } from "./components/support/support.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { CustomerAddEditComponent } from "./components/customer-add-edit/customer-add-edit.component";
import { AuthGuard } from "./guards/auth-guard";
import { LoginGuard } from "./guards/login-guard";
import { ProfileUserComponent } from "./components/profile-user/profile-user.component";
import { UserComponent } from "./components/user/user.component";
import { AdminGuard } from "./guards/admin-guard";
import { EditUserComponent } from "./components/user-edit/edit-user.component";

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
        path: "user",
        children: [
          { path: "", component: ProfileUserComponent },
          { path: "edit-user", component: ProfileUserComponent },
        ],
      },
      {
        path: "customer",
        children: [
          { path: "", component: CustomerComponent },
          { path: "add-customer", component: CustomerAddEditComponent },
          { path: "edit-customer", component: CustomerAddEditComponent },
        ],
      },
      {
        path: "product",
        children: [
          { path: "", component: ProductComponent },
          { path: "add-product", component: ProductAddEditComponent },
          { path: "edit-product", component: ProductAddEditComponent },
        ],
      },
      {
        path: "document",
        children: [
          { path: "", component: DocumentComponent },
          { path: "add-document", component: DocumentAddEditComponent },
          { path: "edit-document", component: DocumentAddEditComponent },
        ],
      },
      {
        path: "documenttype",
        children: [
          { path: "", component: DocumenttypeComponent },
          { path: "add-documenttype", component: DocumenttypeAddEditComponent },
          { path: "edit-documenttype", component: DocumenttypeAddEditComponent },
        ],
      },
      {
        path: "user-admin",
        children: [
          { path: "", component: UserComponent },
          { path: "edit-user", component: EditUserComponent },
        ],
      },
      { path: "support", component: SupportComponent },
      { path: "settings", component: SettingsComponent },
    ],
  },
];
