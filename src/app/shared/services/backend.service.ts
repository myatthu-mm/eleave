import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class BackendService {
    private serverUrl = "https://eleave-dev.yomabank.org/gateway/api/";
    private loginEndpoint = "auth/login";
    private leavesEndpoint = "eleave-presentation-service/v1/eleave/associateLeave";

    constructor(private http: HttpClient) { }

    login(data: any) {
        let header = this.createRequestOptions();
        return this.http.post(`${this.serverUrl}${this.loginEndpoint}`, data , { headers: header });
    }

    getLeaves(_token: any, _body: any) {
        const options = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + _token.tokenObject
        });
        return this.http.post(`${this.serverUrl}${this.leavesEndpoint}`, _body, { headers: options })
    }

    private createRequestOptions() {
        let headers = new HttpHeaders({
            "Content-Type": "application/json"
        });
        return headers;
    }
}