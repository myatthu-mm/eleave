import { Injectable } from '@angular/core';
import { TNSFancyAlert } from "nativescript-fancyalert";
import { isIOS } from "tns-core-modules/platform";
@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  showSuccess(_subtible: string) {
    if (isIOS) {
      TNSFancyAlert.showCustomImage(
        "check.png",
        "#fe2f2f",
        `Success`,
        `${_subtible} has been succeeded!`,
        "Done"
      );
    } else {
      TNSFancyAlert.showSuccess(
        "Success!", `${_subtible} has been succeeded!`, "Done"
      ).then(() => {
        /* user pressed the button */
      });

    }

  }

  showError(_subtible: string) {
    if (isIOS) {
      TNSFancyAlert.showCustomImage(
        "error.png",
        "#2d73f5",
        `Failed`,
        `${_subtible} has been failed!`,
        "Ok",
      );
    } else {
      TNSFancyAlert.showError(
        "Failed!", `${_subtible} has been failed!`, "Ok"
      ).then(() => {
        /* user pressed the button */
      });
    }

  }

  showServerError() {
    if (isIOS) {
      TNSFancyAlert.showCustomImage(
        "server.png",
        "#F3941D",
        `Error`,
        `Internal Server Error!`,
        "Ok",
      );
    } else {
      TNSFancyAlert.showNotice(
        "Error", `Internal Server Error!`, "Ok"
      ).then(() => {
        /* user pressed the button */
      });
    }

  }

  showCustomError(_subtible: string) {
    if (isIOS) {
      TNSFancyAlert.showCustomImage(
        "service.png",
        "#F15A2A",
        `Error`,
        `${_subtible}`,
        "Ok",
      );
    } else {
      TNSFancyAlert.showWarning(
        "Error", `${_subtible}`, "Ok"
      ).then(() => {
        /* user pressed the button */
      });
    }

  }
}
