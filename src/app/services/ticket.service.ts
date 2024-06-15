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

  listTicketsByUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUri}/list-tickets-user`);
  }
  listTickets(): Observable<any> {
    return this.http.get<any>(`${this.baseUri}/tickets`);
  }

  createMessage(ticketId: number, messageData: { message: string }): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.baseUri}/tickets/${ticketId}/messages`, messageData);
  }

  createTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.baseUri}/tickets`, ticket);
  }
}
