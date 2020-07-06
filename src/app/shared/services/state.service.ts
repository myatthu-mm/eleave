import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { ProfileState } from '../states/profile/profile.state';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor(
    private _store: Store
  ) { }

  public getProfile() {
    this._store.select(ProfileState.profile).subscribe(value => {
      if (Object.keys(value).length > 0) {
        return value;
      }


    })
  }
}
