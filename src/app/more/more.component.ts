import { Component, OnInit, HostListener } from '@angular/core';
import { Page } from "tns-core-modules/ui/page";
import { getString } from "tns-core-modules/application-settings";
import { Store } from '@ngxs/store';
import { StateResetAll } from 'ngxs-reset-plugin';
import { ProfileState } from '../shared/states/profile/profile.state';
import { Profile } from '../shared/models/profile.model';

@Component({
  selector: 'app-more',
  templateUrl: './more.component.html',
  styleUrls: ['./more.component.scss']
})
export class MoreComponent implements OnInit {
  profile: Profile;

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

  ngOnInit() {
  }

  @HostListener('loaded')
  pageOnInit() {
    console.log('More created***');
    this._page.actionBarHidden = true;
    this.profile = this._store.selectSnapshot(ProfileState.getProfile);
  }

  @HostListener('unloaded')
  pageOnDestroy() {
    console.log('more destroy-----');
    this._store.dispatch(
      new StateResetAll()
    );
  }


}
