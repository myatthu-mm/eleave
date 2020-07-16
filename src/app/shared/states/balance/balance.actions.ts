export class RequestBalanceList {
    static readonly type = '[List] Update Balance';
}

export class UpdateBalanceList {
    static readonly type = '[List] Modify Balance';
    constructor(public readonly payload: any[]) { }
}