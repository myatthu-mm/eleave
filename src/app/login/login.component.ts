import { Component, OnInit, HostListener } from '@angular/core';
import { User } from '../shared/models/user.model';
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from "nativescript-angular/router";
import { BackendService } from '../shared/services/backend.service';
import { isIOS } from "tns-core-modules/platform"
import { setString, clear, getString } from "tns-core-modules/application-settings";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from '../shared/services/alert.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  isLoggingIn = true;
  user: User;
  processing = false;
  enabledButton: boolean = true;
  public isIOS = isIOS;
  private _unsubscribe$ = new Subject();

  constructor(private page: Page,
    private routerExtensions: RouterExtensions,
    private _backendServie: BackendService,
    private _alertService: AlertService) {
    this.page.actionBarHidden = true;

  }

  ngOnInit() {
    this.user = new User();
    this.user.userId = getString('userId') || '';
    // this.user.userId = '008076'; // kyawgyi - 007361
  }

  @HostListener('loaded')
  pageOnInit() {
    clear();
  }

  @HostListener('unloaded')
  pageOnDestroy() {
    this._unsubscribe$.next(true);
    this._unsubscribe$.unsubscribe();
  }

  login() {
    this.enabledButton = false;
    this.processing = true;
    const bodyPayload = {
      userId: this.user.userId,
      password: this.user.password
    };
    this._backendServie.loginNomfa(bodyPayload)
      .toPromise()
      .then((response) => {
        setString('token', response['access_token']);
        setString('userId', this.user.userId);
        this._backendServie.login(bodyPayload)
          .pipe(takeUntil(this._unsubscribe$))
          .subscribe(res => {
            const status = res['status'];
            if (status.code === 200) {
              const isApproval = res['data'].leave_approval;
              setString('isApproval', isApproval);
            }
            this.routerExtensions.navigate(['/home'], { clearHistory: true });
          }, (error) => {
            this._alertService.showCustomError('Access Denied');
            console.error('Error response:', error);
            this.processing = false;
            this.enabledButton = true;
          })
      })
      .catch((err) => {
        this._alertService.showServerError();
        this.processing = false;
        this.enabledButton = true;
      })
  }

}
