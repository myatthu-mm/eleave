import { Injectable } from '@angular/core';
import { TNSFancyAlert } from "nativescript-fancyalert";
@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  showSuccess(_title: string, _subtible: string) {
    TNSFancyAlert.showCustomImage(
      "check.png",
      "red",
      `${_title}`,
      `${_subtible}`,
      "Ok",
      1.2
    );
  }

  showError(_title: string, _subtible: string) {
    TNSFancyAlert.showCustomImage(
      "error.png",
      "blue",
      `${_title}`,
      `${_subtible}`,
      "Ok",
      1.2
    );
  }

  showServerError() {
    TNSFancyAlert.showCustomImage(
      "server.png",
      "orange",
      `Failed`,
      `Server error!`,
      "Ok",
      1.2
    );
  }
}
