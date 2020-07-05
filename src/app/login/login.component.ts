import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { User } from '../shared/models/user.model';
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from "nativescript-angular/router";
import { FingerprintAuth, BiometricIDAvailableResult } from 'nativescript-fingerprint-auth';
import { BackendService } from '../shared/services/backend.service';
import { SecureStorage } from "nativescript-secure-storage";
import { isIOS } from "tns-core-modules/platform"
import { setString } from "tns-core-modules/application-settings";
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
    this.user.userId = '007992';
    this.user.password = '00007992';
  }

  login() {
    this.routerExtensions.navigate(['/home'], { clearHistory: true }); return;
    this.processing = true;
    const bodyPayload = {
      userId: this.user.userId,
      password: this.user.password
    };
    this._backendServie.loginNomfa(bodyPayload)
      .toPromise()
      .then((response) => {
        this._backendServie.login(bodyPayload, response['access_token']).subscribe(res => {
          setString('token', response['access_token']);
          setString('userId', this.user.userId);
          this.routerExtensions.navigate(['/home'], { clearHistory: true });
        }, (error) => {
          alert("Access Denied");
          console.error('Error response:', error);
          this.processing = false;
        })
      })
      .catch((err) => {
        alert("Access Denied Nomfa");
        console.error('Error response:', err);
        this.processing = false;
      })
  }

}
