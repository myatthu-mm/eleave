import { Profile } from '../../models/profile.model';
export class UpdateProfile {
    static readonly type = '[Record] Update Profile';
    constructor(public readonly payload: Profile) { }
}