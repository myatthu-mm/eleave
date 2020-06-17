import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { User } from '../shared/models/user.model';
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from "nativescript-angular/router";
import { FingerprintAuth, BiometricIDAvailableResult } from 'nativescript-fingerprint-auth';
import { BackendService } from '../shared/services/backend.service';
import { SecureStorage } from "nativescript-secure-storage";
import { isIOS } from "tns-core-modules/platform"
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [BackendService]
})
export class LoginComponent implements OnInit {

  isLoggingIn = true;
  user: User;
  processing = false;
  isPersonalLogin = false;
  secureStorge = new SecureStorage();
  public isIOS = isIOS;
  private fingerprintAuth: FingerprintAuth;
  constructor(private page: Page,
    private routerExtensions: RouterExtensions,
    private _backendServie: BackendService) {
    this.page.actionBarHidden = true;

    this.fingerprintAuth = new FingerprintAuth();
  }

  ngOnInit() {
    this.user = new User();
    this.secureStorge.get({
      key: "username"
    }).then(value => {
      console.log('Gotvalue:', value);

      if (value) this.isPersonalLogin = true;
    })
  }

  login() {
    this.routerExtensions.navigate(['/home'], { clearHistory: true });
    // this.routerExtensions.navigate(['/dashboard', response['access_token']], { clearHistory: true });
    // this._backendServie.login({ username: this.user.username, password: this.user.password })
    //   .subscribe(response => {
    //     this.secureStorge = new SecureStorage();
    //     this.secureStorge.set({
    //       key: "username",
    //       value: this.user.username
    //     }).then(success => console.log('Successfully set username? ', success));
    //     this.secureStorge.set({
    //       key: "password",
    //       value: this.user.password
    //     }).then(success => console.log('Successfully set password? ', success));
    //     this.routerExtensions.navigate(['/dashboard', response['access_token']]);
    //   }, (error) => {
    //     alert("Access Denied");
    //     console.log(error);

    //   });
  }

  loginWithFP() {
    this.fingerprintAuth.verifyFingerprintWithCustomFallback({
      message: 'Scan yer finger', // optional, shown in the fingerprint dialog (default: 'Scan your finger').
      fallbackMessage: 'Enter PIN', // optional, the button label when scanning fails (default: 'Enter password').
      authenticationValidityDuration: 10 // optional (used on Android, default 5)
    }).then(
      () => {
        const username = this.secureStorge.getSync({ key: "username" });
        const password = this.secureStorge.getSync({ key: "password" });
        this._backendServie.login({ username: username, password: password })
          .subscribe(response => {
            this.routerExtensions.navigate(['/dashboard', response['access_token']]);
          }, (error) => {
            alert("Access Denied");
          });
      },
      error => {
        // when error.code === -3, the user pressed the button labeled with your fallbackMessage
        console.log("Fingerprint NOT OK. Error code: " + error.code + ". Error message: " + error.message);
      }
    );
    // this.routerExtensions.navigate(['/dashboard']);
  }

}
