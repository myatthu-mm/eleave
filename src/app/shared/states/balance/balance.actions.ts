export class UpdateBalanceList {
    static readonly type = '[List] Update Balance';
    constructor(public readonly payload: any[]) { }
}