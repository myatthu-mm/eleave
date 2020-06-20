import { MonthName, LeaveStatus, LeaveType } from '../constants';
import { Injectable } from '@angular/core';
import { LeaveItem } from '../models/leave-item.model';

@Injectable()
export class LeaveService {
    getPrepareLeaveData(_list: any[]): Array<LeaveInfo> {
        let leaves: Array<LeaveInfo> = new Array<LeaveInfo>();

        let leaveInfo: LeaveInfo;
        _list.map(item => {
            leaveInfo = new LeaveInfo(
                'ID:' + item.employee_id,
                item.employee_name,
                this.getLeaveTypeByCode(item.leave_type_code),
                parseInt(item.duration) + ' day(s)',
                this.getLeaveStatusByCode(item.status_description),
                new Date(item.leave_start_date),
                new Date(item.leave_end_date),
            );
            leaves.push(leaveInfo);
        });

        return leaves;
    }

    private getLeaveTypeByCode = (_code: string) => LeaveType[Object.keys(LeaveType).find(key => key === _code)];

    private getLeaveStatusByCode = (_code: string) => LeaveStatus[Object.keys(LeaveStatus).find(key => key === _code)];

    getCategoricalSource(): Country[] {
        return [
            { Country: "Germany", Amount: 4, SecondVal: 14, ThirdVal: 24, Impact: 0, Year: 0 },
            { Country: "France", Amount: 6, SecondVal: 23, ThirdVal: 25, Impact: 0, Year: 0 },
        ];
    }

    getLeaveHistories(): LeaveItem[] {
        return [
            { date: "Sep 10, 2019 - Sep 13, 2019", type: "Annual leave (AL) 3 day(s)", status: "rejected" },
            { date: "Aug 6, 2019 - Aug 7, 2019", type: "Annual leave (AL) 3 day(s)", status: "pending" },
            { date: "July 31, 2019 - July 31, 2019", type: "Cascual leave (CL) 1 day(s)", status: "approved" },
            { date: "Sep 10, 2019 - Sep 13, 2019", type: "Annual leave (AL) 3 day(s)", status: "rejected" },
            { date: "Aug 6, 2019 - Aug 7, 2019", type: "Annual leave (AL) 3 day(s)", status: "pending" },
            { date: "July 31, 2019 - July 31, 2019", type: "Cascual leave (CL) 1 day(s)", status: "approved" },
            { date: "Sep 10, 2019 - Sep 13, 2019", type: "Annual leave (AL) 3 day(s)", status: "rejected" },
            { date: "Aug 6, 2019 - Aug 7, 2019", type: "Annual leave (AL) 3 day(s)", status: "pending" },
            { date: "July 31, 2019 - July 31, 2019", type: "Cascual leave (CL) 1 day(s)", status: "approved" },
            { date: "Sep 10, 2019 - Sep 13, 2019", type: "Annual leave (AL) 3 day(s)", status: "rejected" },
            { date: "Aug 6, 2019 - Aug 7, 2019", type: "Annual leave (AL) 3 day(s)", status: "pending" },
            { date: "July 31, 2019 - July 31, 2019", type: "Cascual leave (CL) 1 day(s)", status: "approved" },
            { date: "Sep 10, 2019 - Sep 13, 2019", type: "Annual leave (AL) 3 day(s)", status: "rejected" },
            { date: "Aug 6, 2019 - Aug 7, 2019", type: "Annual leave (AL) 3 day(s)", status: "pending" },
            { date: "July 31, 2019 - July 31, 2019", type: "Cascual leave (CL) 1 day(s)", status: "approved" },
        ]
    }
}

export class LeaveInfo {
    employeeId: string;
    employeeName: string;
    dateRange: string;
    leaveTypeCode: string;
    duration: string;
    statusDescription: string;

    constructor(_employeeId: string,
        _employeeName: string,
        _leaveTypeCode: string,
        _duration: string,
        _statusDescription: string,
        startDate: Date, endDate: Date) {
        this.employeeId = _employeeId;
        this.employeeName = _employeeName;
        this.dateRange = MonthName[startDate.getMonth() + 1] + " " + startDate.getDate() + " - " + MonthName[endDate.getMonth() + 1] + " " + endDate.getDate() + ", " + endDate.getFullYear();
        this.leaveTypeCode = _leaveTypeCode;
        this.duration = _duration;
        this.statusDescription = _statusDescription;
    }

}

export class Country {
    constructor(public Country?: string, public Amount?: number, public SecondVal?: number, public ThirdVal?: number, public Impact?: number, public Year?: number) {
    }
}