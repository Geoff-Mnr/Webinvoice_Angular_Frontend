import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { importProvidersFrom } from "@angular/core";
import { provideToastr } from "ngx-toastr";
import { provideAnimations } from "@angular/platform-browser/animations";
import { withInterceptors } from "@angular/common/http";
import { authInterceptor } from "./interceptors/auth-interceptor";
import { provideHttpClient } from "@angular/common/http";

import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(HttpClientModule), provideHttpClient(withInterceptors([authInterceptor])), provideToastr(), provideAnimations()],
};
