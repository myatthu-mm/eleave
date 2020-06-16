import { MonthName, LeaveStatus, LeaveType } from '../constants';
import { Injectable } from '@angular/core';

@Injectable()
export class LeaveInfoService {
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