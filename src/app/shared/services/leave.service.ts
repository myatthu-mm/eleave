import { MonthName, LeaveStatus, LeaveType } from '../constants';
import { Injectable } from '@angular/core';
import { History } from '../models/leave-history.model';
@Injectable()
export class LeaveService {

    getMinimalLeaves(list: History[]) {
        const latestList = list.slice(0, 3);
        return this.getFormattedLeaveHistories(latestList);
    }

    getFormattedLeaveHistories(list: History[]) {
        list.map(item => {
            const startDate = new Date(item.leave_start_date);
            const endDate = new Date(item.leave_end_date);
            const date = this.getFormattedDate(startDate) + ' - ' + this.getFormattedDate(endDate);
            const type = this.getLeaveTypeByCode(item.leave_type_code);
            Object.assign(item, { date: date });
            Object.assign(item, { type: `${type}` });
            Object.assign(item, { duration: `${Number(item.duration)} day(s)` })
            Object.assign(item, { leave_status: item.leave_status.toLowerCase() });
        });
        return list;
    }

    private getFormattedDate(_date: Date) {
        return `${MonthName[_date.getMonth()]} ${_date.getDate()}, ${_date.getFullYear()}`
    }


    private getLeaveTypeByCode = (_code: string) => LeaveType[Object.keys(LeaveType).find(key => key === _code)];

}
