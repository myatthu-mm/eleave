import { Component, OnInit, HostListener } from '@angular/core';
import { Page } from "tns-core-modules/ui/page";
import { getString, setString } from "tns-core-modules/application-settings";
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RouterExtensions } from "nativescript-angular/router";
import { StateResetAll } from 'ngxs-reset-plugin';
import { ProfileState } from '../shared/states/profile/profile.state';
import { Profile } from '../shared/models/profile.model';
import { RequestProfile } from '../shared/states/profile/profile.actions';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-more',
  templateUrl: './more.component.html',
  styleUrls: ['./more.component.scss']
})
export class MoreComponent implements OnInit {
  private profile: Profile;
  processing: boolean;
  private _unsubscribe$ = new Subject();

  constructor(
    private _page: Page,
    private _store: Store,
    private _alertService: AlertService,
    private _routerExtension: RouterExtensions) {
    this.profile = new Profile();
  }

  get EmployeeID(): string {
    return getString('userId');
  }

  get EmployeeName(): string {
    return this.profile.last_name;
  }

  get JobPosition(): string {
    return this.profile.job_category_name + ', ' + this.profile.unit_name;
  }

  get ProfileImage(): string {
    if (this.profile.title === 'U') {
      return '~/assets/images/employee-men.png'
    }
    return '~/assets/images/employee.png';
  }

  get IsApproval(): boolean {
    return getString('isApproval') === 'true';
  }

  ngOnInit() {

  }

  @HostListener('loaded')
  pageOnInit() {
    this._page.actionBarHidden = true;
    this._unsubscribe$ = new Subject();
    this.callToProfile();
  }

  @HostListener('unloaded')
  pageOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
    this._unsubscribe$.unsubscribe();
  }

  logout() {
    this._store.dispatch(
      new StateResetAll()
    );

    this._routerExtension.navigate(['/'],
      {
        animated: true,
        transition: { name: 'slideBottom' },
        clearHistory: true
      });
  }

  private callToProfile() {
    this.processing = true;
    this._store.select(ProfileState.getProfile)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(value => {
        if (value && Object.keys(value).length > 1) {
          this.profile = value;
          setString('unit', value.unit_name);
          this.processing = false;
        } else {
          this._store.dispatch(new RequestProfile());
        }
      }, (error) => {
        this.processing = false;
        this._alertService.showCustomError('Profile Service Error!');
      });
  }






}
