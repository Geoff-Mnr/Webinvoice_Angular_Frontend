import { Component, inject } from "@angular/core";
import { RouterLink, Router } from "@angular/router";
import { Document } from "../../models/document.interface";
import { DocumentService } from "../../services/document.service";
import { OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [RouterLink, CommonModule, DatePipe],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent implements OnDestroy {
  documentService = inject(DocumentService);
  router = inject(Router);
  private subDelete: Subscription | undefined;
  documents: Document[] = [];

  ngOnInit() {
    this.getListDocuments();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case "Payé":
        return "status-paid";
      case "En cours":
        return "status-in-progress";
      case "Impayé":
        return "status-unpaid";
      default:
        return "status-unknown";
    }
  }

  getListDocuments() {
    this.subDelete = this.documentService.listDocuments().subscribe((data) => {
      this.documents = data.data;
      console.log(this.documents);
    });
  }

  ngOnDestroy() {
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
  }
}
