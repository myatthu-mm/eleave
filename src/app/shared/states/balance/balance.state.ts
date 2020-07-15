import { State, Selector, Action, StateContext } from '@ngxs/store';
import { RequestBalanceList } from './balance.actions';
import { BackendService } from '../../services/backend.service';
import { LeaveService } from '../../services/leave.service';
import { tap } from 'rxjs/operators';

export interface BalanceListStateModel {
    list: any[] | [];
}

@State<BalanceListStateModel>({
    name: 'BalanceListState',
    defaults: {
        list: []
    }
})

export class BalanceListState {

    constructor(
        private _backendService: BackendService,
        private _leaveService: LeaveService) { }

    @Selector()
    static getBalances(state: BalanceListStateModel): any[] {
        return state.list;
    }

    @Action(RequestBalanceList)
    requestBalanceList(
        { getState, setState }: StateContext<BalanceListStateModel>) {
        return this._backendService.getLeaveBalance().pipe(tap((response) => {
            const status = response['status'];
            if (status.code === 200) {
                const leaveBalances = this._leaveService.getFormattedLeaveBalances(response['leave_balance_list']);
                const state = getState();
                setState({ ...state, list: leaveBalances });
                console.log('balance save state..');
            }
        }, (error) => {
            console.error('Error response:', error);
        }));
    }
}