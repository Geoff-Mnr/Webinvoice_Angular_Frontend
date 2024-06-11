import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "phoneNumber",
  standalone: true,
})
export class PhoneNumberPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return "";
    }

    // Remove any non-numeric characters
    value = value.replace(/\D/g, "");

    // Remove the leading 0 if it exists
    if (value.startsWith("0")) {
      value = value.substring(1);
    }

    // Add the international prefix
    const prefix = "+32";

    // Format the phone number (example: 123456789 to +32 123 45 67 89)
    let formattedValue = value;

    if (value.length === 9) {
      formattedValue = value.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4");
    }

    return `${prefix} ${formattedValue}`;
  }
}
