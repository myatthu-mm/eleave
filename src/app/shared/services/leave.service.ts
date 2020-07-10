import { MonthName, LeaveType } from '../constants';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { History } from '../models/history.model';
import { Balance } from '../models/balance.model';
import { PieSource } from '../models/pie-source.model';
import { Associate } from '../models/associate.model';
@Injectable()
export class LeaveService {

    private leaveType_Obs$: BehaviorSubject<any> = new BehaviorSubject(null);

    getLeaveTypeObs(): Observable<any> {
        return this.leaveType_Obs$.asObservable();
    }

    setLeaveTypeObs(_data: any) {
        this.leaveType_Obs$.next(_data);
    }


    getMinimalLeaves(list: History[]) {
        return this.getFormattedLeaveHistories(list.slice(0, 3));
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

    getFormattedLeaveBalances(list: Balance[]) {
        list.map(item => {
            const pieSource = <Array<PieSource>>[
                { name: 'balance', amount: Math.abs(Number(item.balance)) },
                { name: 'taken', amount: Math.abs(Number(item.taken)) }
            ];
            Object.assign(item, { pieSource: pieSource })
            Object.assign(item, { balance: Math.abs(Number(item.balance)) });
            Object.assign(item, { entitle: Math.abs(Number(item.entitle)) });
        });
        return list;
    }

    getFormattedLeaveRequests(list: Associate[]) {
        list.map(item => {
            const startDate = new Date(item.leave_start_date);
            const endDate = new Date(item.leave_end_date);
            const date = this.getFormattedDateMonth(startDate) + ' - ' + this.getFormattedDate(endDate);
            const type = this.getLeaveTypeByCode(item.leave_type_code);
            const nameAhead = item.employee_name.split(' ')[0];
            const image = nameAhead === 'U' ? '~/assets/images/employee-men.png' : '~/assets/images/employee.png';
            Object.assign(item, { date: date });
            Object.assign(item, { type: `${type}` });
            Object.assign(item, { startDate: this.getFormattedDate(startDate) });
            Object.assign(item, { endDate: this.getFormattedDate(endDate) });
            Object.assign(item, { duration: `${Number(item.duration)}` });
            Object.assign(item, { image: image });
            Object.assign(item, { half_type_description: (item.half_type == '1') ? 'Morning' : (item.half_type == '2') ? 'Evening' : '-' });
            Object.assign(item, { employee_name: item.employee_name.replace(/(Daw|U)\s+/, '') });
        });
        return list;
    }

    private getFormattedDate(_date: Date) {
        return `${MonthName[_date.getMonth() + 1]} ${_date.getDate()}, ${_date.getFullYear()}`
    }

    private getFormattedDateMonth(_date: Date) {
        return `${MonthName[_date.getMonth() + 1]} ${_date.getDate()}`;
    }


    private getLeaveTypeByCode = (_code: string) => LeaveType[Object.keys(LeaveType).find(key => key === _code)];

}
