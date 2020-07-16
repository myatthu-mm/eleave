import { Component, OnInit, OnDestroy } from '@angular/core';
import { BackendService } from '../shared/services/backend.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AlertService } from '../shared/services/alert.service';
@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent implements OnInit, OnDestroy {
  password: Password;
  _unsubscribe$: Subject<boolean> = new Subject();
  constructor(private _backendService: BackendService, private _alertService: AlertService) { }


  get isConfirmPasswordValid(): boolean {
    return this.password.newpsw === this.password.confirm;
  }


  ngOnInit() {
    this.password = new Password();
  }

  ngOnDestroy() {
    this._unsubscribe$.next(true);
    this._unsubscribe$.unsubscribe();
  }

  changePassword() {
    this._backendService.changePassword(this.password.current, this.password.newpsw)
    this._backendService.changePassword('123', '123')
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(response => {
        const data = response['data'];
        if (data.changed_status == 'true') {
          this._alertService.showSuccess('Password change');
          this.password = new Password();
        } else {
          this._alertService.showError('Password change');
        }

      }, (error) => {
        this._alertService.showCustomError('Password Change Service Error!')
        console.error('Error response:', error)
      });

  }

}

class Password {
  current: string;
  newpsw: string;
  confirm: string;
}