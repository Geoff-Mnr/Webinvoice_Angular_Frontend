import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { Ticket } from "../models/ticket.interface";

@Injectable({
  providedIn: "root",
})
export class TicketService {
  private baseUri = "http:///127.0.0.1:8000/api";
  http = inject(HttpClient);
  constructor() {}
  // Méthode pour récupérer la liste des tickets par utilisateur
  listTicketsByUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUri}/list-tickets-user`);
  }
  // Méthode pour récupérer la liste des tickets
  listTickets(): Observable<any> {
    return this.http.get<any>(`${this.baseUri}/tickets`);
  }
  // Méthode pour récupérer les 3 derniers ticket
  getLastTicket(): Observable<any> {
    return this.http.get<any>(`${this.baseUri}/tickets-by-user`);
  }
  // Méthode pour récupérer les tickets par utilisateur
  createMessage(ticketId: number, messageData: { message: string }): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.baseUri}/tickets/${ticketId}/messages`, messageData);
  }
  // Méthode pour récupérer les messages par ticket
  updateTicket(ticketId: number, ticket: Ticket): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.baseUri}/tickets/${ticketId}`, ticket);
  }

  createTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.baseUri}/tickets`, ticket);
  }
}
