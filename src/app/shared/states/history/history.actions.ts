export class UpdateHistoryList {
    static readonly type = '[List] Update History';
    constructor(public readonly payload: any[]) { }
}