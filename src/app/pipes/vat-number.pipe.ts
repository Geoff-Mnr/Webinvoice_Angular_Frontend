import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "vatNumber",
  standalone: true,
})
export class VatNumberPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return "";
    }

    const vatPrefix = "BE";
    // Remove any existing 'BE' prefix to avoid duplication
    value = value.replace(/^BE/, "");

    // Remove any existing formatting to standardize the input
    value = value.replace(/\D/g, "");

    // Format the VAT number with dots after every 3 digits
    const formattedValue = value.replace(/(\d{4})(\d{3})(\d{3})/, "$1.$2.$3");

    return `${vatPrefix} ${formattedValue}`;
  }
}
