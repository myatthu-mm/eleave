import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpBackend } from "@angular/common/http";
import { getString } from "tns-core-modules/application-settings";
import { BackendSettings } from '../constants';
import { User } from '../models/user.model';
@Injectable()
export class BackendService {

    constructor(private http: HttpClient) { }

    loginNomfa(data: User) {
        const headerData = {
            "Content-Type": "application/json",
            'deviceid': 'elmapp'
        }
        const header = new HttpHeaders(headerData);
        return this.http.post(`${BackendSettings.LOGIN_NOMFA}`, data, { headers: header });
    }

    login(data: User) {
        const header = this.createHeaderOptions();
        return this.http.post(`${BackendSettings.SERVER_URL}${BackendSettings.LOGIN_ENDPOINT}`, data, { headers: header });
    }

    getProfile() {
        const header = this.createHeaderOptions();
        return this.http.post<any>(`${BackendSettings.SERVER_URL}${BackendSettings.PROFILE_ENDPOINT}`, { employeeId: getString('userId') }, { headers: header })
    }

    getLeaveBalance() {
        const header = this.createHeaderOptions();
        return this.http.post<any>(`${BackendSettings.SERVER_URL}${BackendSettings.BALANCE_ENDPOINT}`, { employeeId: getString('userId') }, { headers: header })
    }

    getLeaveHistory(_startDate: string, _endDate: string) {
        const header = this.createHeaderOptions();
        const body = {
            employeeId: getString('userId'),
            leaveTypeCode: "",
            startDate: _startDate,
            endDate: _endDate
        }
        return this.http.post<any>(`${BackendSettings.SERVER_URL}${BackendSettings.HISTORY_ENDPOINT}`, body, { headers: header });
    }

    saveLeave(_leaveTypeCode: string, startDate: string, _endDate: string, _duration: string, _remark: string) {
        const header = this.createHeaderOptions();
        const body = {
            employeeId: getString('userId'),
            leaveTypeCode: _leaveTypeCode,
            startDate: startDate,
            endDate: _endDate,
            half: "",
            duration: _duration,
            updatedBy: "008164",
            updatedDate: "2020-03-24",
            remarks: _remark,
            unit: "Security & Risk",
            status: ''
        };
        return this.http.post(`${BackendSettings.SERVER_URL}${BackendSettings.SAVELEAVE_ENDPOINT}`, body, { headers: header });
    }

    changePassword(_currentPassword: string, _newPassword: string) {
        const header = this.createHeaderOptions();
        const body = {
            oldPassword: _currentPassword,
            newPassword: _newPassword,
            userId: getString('userId')
        };
        return this.http.post(`${BackendSettings.SERVER_URL}${BackendSettings.CHANGEPASSWORD_ENDPOINT}`, body, { headers: header });
    }


    private createHeaderOptions() {
        const headerData = {
            "Content-Type": "application/json"
        };
        Object.assign(headerData, { 'Authorization': `Bearer ${getString('token')}` });
        const headers = new HttpHeaders(headerData);
        return headers;
    }
}