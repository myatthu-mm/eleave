import { MonthName, LeaveStatus, LeaveType } from '../constants';
import { Injectable } from '@angular/core';
import { LeaveItem } from '../models/leave-item.model';
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

    getLeaveHistories(): LeaveItem[] {
        return [
            { date: "Sep 10, 2019 - Sep 13, 2019", type: "Annual leave (AL) 3 day(s)", leave_status: "rejected" },
            { date: "Aug 6, 2019 - Aug 7, 2019", type: "Annual leave (AL) 3 day(s)", leave_status: "pending" },
            { date: "July 31, 2019 - July 31, 2019", type: "Cascual leave (CL) 1 day(s)", leave_status: "approved" },
            { date: "Sep 10, 2019 - Sep 13, 2019", type: "Annual leave (AL) 3 day(s)", leave_status: "rejected" },
            { date: "Aug 6, 2019 - Aug 7, 2019", type: "Annual leave (AL) 3 day(s)", leave_status: "pending" },
            { date: "July 31, 2019 - July 31, 2019", type: "Cascual leave (CL) 1 day(s)", leave_status: "approved" },
            { date: "Sep 10, 2019 - Sep 13, 2019", type: "Annual leave (AL) 3 day(s)", leave_status: "rejected" },
            { date: "Aug 6, 2019 - Aug 7, 2019", type: "Annual leave (AL) 3 day(s)", leave_status: "pending" },
            { date: "July 31, 2019 - July 31, 2019", type: "Cascual leave (CL) 1 day(s)", leave_status: "approved" },
            { date: "Sep 10, 2019 - Sep 13, 2019", type: "Annual leave (AL) 3 day(s)", leave_status: "rejected" },
            { date: "Aug 6, 2019 - Aug 7, 2019", type: "Annual leave (AL) 3 day(s)", leave_status: "pending" },
            { date: "July 31, 2019 - July 31, 2019", type: "Cascual leave (CL) 1 day(s)", leave_status: "approved" },
            { date: "Sep 10, 2019 - Sep 13, 2019", type: "Annual leave (AL) 3 day(s)", leave_status: "rejected" },
            { date: "Aug 6, 2019 - Aug 7, 2019", type: "Annual leave (AL) 3 day(s)", leave_status: "pending" },
            { date: "July 31, 2019 - July 31, 2019", type: "Cascual leave (CL) 1 day(s)", leave_status: "approved" },
        ]
    }
}
