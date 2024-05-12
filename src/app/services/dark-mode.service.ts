import { Injectable, effect, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DarkModeService {
  darkModeSignal = signal<string>(JSON.parse(window.localStorage.getItem("darkModeSignal") ?? "null"));

  updateDarkMode() {
    this.darkModeSignal.update((value) => (value === "dark" ? "null" : "dark"));
  }

  constructor() {
    effect(() => {
      window.localStorage.setItem("darkModeSigal", JSON.stringify(this.darkModeSignal()));
    });
  }
}
