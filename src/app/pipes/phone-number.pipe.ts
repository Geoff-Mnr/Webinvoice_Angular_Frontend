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

    // enlever tous les caractères non numériques
    value = value.replace(/\D/g, "");

    // enlever le zéro initial
    if (value.startsWith("0")) {
      value = value.substring(1);
    }

    // rajoute le préfixe +32
    const prefix = "+32";

    // formatter le numéro de téléphone
    let formattedValue = value;
    if (value.length === 9) {
      formattedValue = value.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4");
    }
    return `${prefix} ${formattedValue}`;
  }
}
