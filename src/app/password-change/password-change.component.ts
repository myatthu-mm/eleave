import { Component, OnInit, OnDestroy } from '@angular/core';
import { BackendService } from '../shared/services/backend.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent implements OnInit, OnDestroy {
  password: Password;
  private _unsubscribe$ = new Subject();
  constructor(private _backendService: BackendService) { }

  isValidNewPassword(): boolean {
    return this.password.new == this.password.confirm;
  }

  ngOnInit() {
    this.password = new Password();
    console.log('change password created***');

  }

  ngOnDestroy() {
    console.log('password change destoryed---');
    this._unsubscribe$.next(true);
    this._unsubscribe$.unsubscribe();
  }

  changePassword() {
    console.log('change password');
    this._backendService.changePassword(this.password.current, this.password.new)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(response => {
        const data = response['data'];
        if (data.changed_status == 'true') {
          alert('Success password change!')
          this.password = new Password();
        } else {
          alert('Change password error!..')
        }

      }, (error) => {
        console.log('Error password');
        console.error('Error response:', error)
      });

  }

}

class Password {
  current: string;
  new: string;
  confirm: string;
}