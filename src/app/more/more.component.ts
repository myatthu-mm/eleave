import { Component, OnInit, HostListener } from '@angular/core';
import { Page } from "tns-core-modules/ui/page";
import { getString, clear } from "tns-core-modules/application-settings";
import { Store } from '@ngxs/store';
import { StateResetAll } from 'ngxs-reset-plugin';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProfileState } from '../shared/states/profile/profile.state';
import { Profile } from '../shared/models/profile.model';
import { RequestProfile } from '../shared/states/profile/profile.actions';

@Component({
  selector: 'app-more',
  templateUrl: './more.component.html',
  styleUrls: ['./more.component.scss']
})
export class MoreComponent implements OnInit {
  profile: Profile;
  processing: boolean;
  private _unsubscribe$ = new Subject();

  constructor(
    private _page: Page,
    private _store: Store) {
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
    console.log('More created***');
    this._page.actionBarHidden = true;
    this._unsubscribe$ = new Subject();
    this.callToProfile();
  }

  @HostListener('unloaded')
  pageOnDestroy() {
    console.log('more destroy-----');
    // clear();
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
    this._unsubscribe$.unsubscribe();
    this._store.dispatch(new StateResetAll());
  }

  private callToProfile() {
    this.processing = true;
    this._store.select(ProfileState.getProfile)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(value => {
        if (value && Object.keys(value).length > 1) {
          this.profile = value;
          this.processing = false;
        } else {
          this._store.dispatch(new RequestProfile());
        }
      }, (error) => {
        this.processing = false;
      });
  }






}
