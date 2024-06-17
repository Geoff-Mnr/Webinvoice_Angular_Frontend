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
    // Enlever le préfixe BE s'il est présent
    value = value.replace(/^BE/, "");

    // Enlever tous les caractères non numériques
    value = value.replace(/\D/g, "");

    // Formater le numéro de TVA
    const formattedValue = value.replace(/(\d{4})(\d{3})(\d{3})/, "$1.$2.$3");

    return `${vatPrefix} ${formattedValue}`;
  }
}
