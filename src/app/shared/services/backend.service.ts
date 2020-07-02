import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { getString } from "tns-core-modules/application-settings";
import { BackendSettings } from '../constants';
import { User } from '../models/user.model';
@Injectable()
export class BackendService {
    private loginEndpoint = "auth/login";
    private leavesEndpoint = "eleave-presentation-service/v1/eleave/associateLeave";

    constructor(private http: HttpClient) { }

    loginNomfa(data: User) {
        const header = this.createRequestOptions(true);
        return this.http.post(`${BackendSettings.LOGIN_NOMFA}`, data, { headers: header });
    }

    login(data: User, _token: string) {
        const header = this.createRequestOptions(false, _token);
        return this.http.post(`${BackendSettings.SERVER_URL}${BackendSettings.LOGIN_ENDPOINT}`, data, { headers: header });
    }

    getProfile() {
        const header = this.createRequestOptions(false, getString('token'));
        return this.http.post(`${BackendSettings.SERVER_URL}${BackendSettings.PROFILE_ENDPOINT}`, { employeeId: getString('userId') }, { headers: header })
    }

    getLeaveBalance() {
        const header = this.createRequestOptions(false, getString('token'));
        return this.http.post(`${BackendSettings.SERVER_URL}${BackendSettings.BALANCE_ENDPOINT}`, { employeeId: getString('userId') }, { headers: header })
    }

    getLeaveHistory(_startDate: string, _endDate: string) {
        const header = this.createRequestOptions(false, getString('token'));
        const body = {
            employeeId: getString('userId'),
            leaveTypeCode: "",
            startDate: _startDate,
            endDate: _endDate
        }
        return this.http.post(`${BackendSettings.SERVER_URL}${BackendSettings.HISTORY_ENDPOINT}`, body, { headers: header });
    }

    private createRequestOptions(hasDeviceID?: boolean, _token?: string) {
        const headerData = {
            "Content-Type": "application/json"
        };
        if (hasDeviceID) { Object.assign(headerData, { 'deviceid': 'elmapp' }); }
        if (_token) { Object.assign(headerData, { 'Authorization': `Bearer ${_token}` }) }
        const headers = new HttpHeaders(headerData);
        return headers;
    }
}