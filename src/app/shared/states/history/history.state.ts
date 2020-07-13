import { State, Selector, Action, StateContext } from '@ngxs/store';
import { RequestHistoryList } from './history.actions';
import { BackendService } from '../../services/backend.service';
import { LeaveService } from '../../services/leave.service';
import { tap } from 'rxjs/operators';
export interface HistoryListStateModel {
    list: any[] | [];
}

@State<HistoryListStateModel>({
    name: 'HistoryListState',
    defaults: {
        list: [],
    }
})

export class HistoryListState {
    constructor(
        private _backendService: BackendService,
        private _leaveService: LeaveService) { }

    @Selector()
    static getHistories(state: HistoryListStateModel): any[] {
        return state.list;
    }

    @Action(RequestHistoryList)
    requestHistoryList(
        { getState, setState }: StateContext<HistoryListStateModel>) {
        return this._backendService.getLeaveHistory('2020-01-01', '2020-12-31').pipe(tap((response) => {
            const status = response['status'];
            if (status.code === 200) {
                const leaveHistories = this._leaveService.getFormattedLeaveHistories(response['leave_history_list']);
                const state = getState();
                setState({ ...state, list: leaveHistories });
                console.log('histories save state..');
            } else {
                const state = getState();
                setState({ ...state, list: [] });
                console.log('empty histoy');
            }
        }, (error) => {
            alert('history error');
            console.error('Error response:', error);
        }));
    }
}