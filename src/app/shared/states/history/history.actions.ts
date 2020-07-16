export class RequestHistoryList {
    static readonly type = '[List] Update History';
}

export class AddHistoryItem {
    static readonly type = '[List] Add History Item';
    constructor(public readonly payload: any) { }
}