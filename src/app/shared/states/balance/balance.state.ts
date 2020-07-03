import { State, Selector, Action, StateContext } from '@ngxs/store';
import { UpdateBalanceList } from './balance.actions';

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
    @Selector()
    static balanceList(state: BalanceListStateModel): any[] {
        return state.list;
    }

    @Action(UpdateBalanceList)
    updateBalanceList(
        { getState, setState }: StateContext<BalanceListStateModel>,
        { payload }: UpdateBalanceList
    ) {
        const state = getState();
        console.log('store balance list');
        setState({ list: [...state.list, payload] });
    }
}