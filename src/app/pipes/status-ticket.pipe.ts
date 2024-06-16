import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "statusTicket",
  standalone: true,
})
export class StatusTicketPipe implements PipeTransform {
  transform(value: string): string {
    if (value === "C") {
      return "Fermé";
    }
    return value;
  }
}
