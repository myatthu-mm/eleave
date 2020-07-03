import { State, Selector, Action, StateContext } from '@ngxs/store';
import { UpdateHistoryList } from './history.actions';

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
    @Selector()
    static historyList(state: HistoryListStateModel): any[] {
        return state.list;
    }

    @Action(UpdateHistoryList)
    updateHistoryList(
        { getState, setState }: StateContext<HistoryListStateModel>,
        { payload }: UpdateHistoryList
    ) {
        const state = getState();
        console.log('store history list');
        setState({ list: [...state.list, payload] });
    }
}