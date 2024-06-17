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
    // Enlever tous les caractères non numériques
    value = value.replace(/\D/g, "");

    // Formater le code EAN
    let formattedValue = value;

    // Si le code EAN est de 13 chiffres
    if (value.length === 13) {
      formattedValue = value.replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, "$1 $2 $3 $4");
    }

    return formattedValue;
  }
}
