import { Component, OnInit, HostListener } from '@angular/core';
import { User } from '../shared/models/user.model';
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from "nativescript-angular/router";
import { BackendService } from '../shared/services/backend.service';
import { isIOS } from "tns-core-modules/platform"
import { setString } from "tns-core-modules/application-settings";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngxs/store';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  isLoggingIn = true;
  user: User;
  processing = false;
  public isIOS = isIOS;
  private _unsubscribe$ = new Subject();
  constructor(private page: Page,
    private routerExtensions: RouterExtensions,
    private _backendServie: BackendService,
    private _store: Store) {
    this.page.actionBarHidden = true;

  }

  ngOnInit() {
    this.user = new User();
    this.user.userId = '007326';
    this.user.password = '00007326';
  }

  @HostListener('loaded')
  pageOnInit() {
    console.log('login created***');

  }

  @HostListener('unloaded')
  pageOnDestroy() {
    console.log('login destroy-----');
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  login() {
    this.processing = true;
    const bodyPayload = {
      userId: this.user.userId,
      password: this.user.password
    };
    this._backendServie.loginNomfa(bodyPayload)
      .toPromise()
      .then((response) => {
        this._backendServie.login(bodyPayload, response['access_token'])
          .pipe(takeUntil(this._unsubscribe$))
          .subscribe(res => {
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
