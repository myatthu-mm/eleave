import { State, Selector, Action, StateContext } from '@ngxs/store';
import { UpdateProfile } from './profile.actions';
import { Profile } from '../../models/profile.model';

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
    @Selector()
    static profile(state: ProfileStateModel): Profile {
        return state.data;
    }

    @Action(UpdateProfile)
    updateProfile(
        { setState }: StateContext<ProfileStateModel>,
        { payload }: UpdateProfile
    ) {
        console.log('store profile');
        setState({ data: payload });
    }
}