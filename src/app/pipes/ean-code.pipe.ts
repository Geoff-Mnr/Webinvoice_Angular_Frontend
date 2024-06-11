import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "eanCode",
  standalone: true,
})
export class EanCodePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return "";
    }

    // Remove any non-numeric characters
    value = value.replace(/\D/g, "");

    // Format the EAN code (example: 1234567890123 to 123 456 789 0123)
    let formattedValue = value;

    if (value.length === 13) {
      formattedValue = value.replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, "$1 $2 $3 $4");
    }

    return formattedValue;
  }
}
