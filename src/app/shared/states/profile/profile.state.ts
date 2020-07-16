import { State, Selector, Action, StateContext } from '@ngxs/store';
import { RequestProfile } from './profile.actions';
import { Profile } from '../../models/profile.model';
import { BackendService } from '../../services/backend.service';
import { tap } from 'rxjs/operators';

export interface ProfileStateModel {
    data: Profile;
}

@State<ProfileStateModel>({
    name: 'ProfileState',
    defaults: {
        data: new Profile(),
    }
})

export class ProfileState {

    constructor(private _backendService: BackendService) { }

    @Selector()
    static getProfile(state: ProfileStateModel): Profile {
        return state.data;
    }

    @Action(RequestProfile)
    requestProfile({ getState, setState }: StateContext<ProfileStateModel>) {
        return this._backendService.getProfile().pipe(tap((response) => {
            const status = response['status'];
            if (status.code === 200) {
                const profile = response['data'];
                const state = getState();
                setState({ ...state, data: profile });
            }
        }, (error) => {
            console.error('Error response:', error);
        }));
    }

}