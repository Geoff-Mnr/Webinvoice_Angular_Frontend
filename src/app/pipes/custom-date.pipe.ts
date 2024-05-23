import { Pipe, PipeTransform } from "@angular/core";
import { DatePipe } from "@angular/common";
import { inject } from "@angular/core";

@Pipe({
  name: "customDate",
  standalone: true,
})
export class CustomDatePipe implements PipeTransform {
  datePipe = inject(DatePipe);

  transform(value: string | Date, format: string = "yyyy-MM-dd"): string | null {
    return this.datePipe.transform(value, format);
  }
}
