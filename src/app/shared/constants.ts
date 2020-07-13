export enum LeaveType {
    AL = 'Annual Leave',
    CL = 'Casual Leave',
    CPL = 'Compassionate Leave',
    EXL = 'Examination Leave',
    MRL = 'Married Leave',
    MDL = 'Medical Leave',
    MTL = 'Maternity Leave',
    OD = 'On Duty',
    PTL = 'Paternity Leave',
    SL = 'Sick Leave',
    WPL = 'Without Pay'
}

export enum LeaveStatus {
    Applied = 'Applied',
    Rejected = 'Rejected',
    Approved = 'Approved'
}

export enum MonthName {
    Jan = 1,
    Feb,
    Mar,
    Apr,
    May,
    Jun,
    Jul,
    Aug,
    Sept,
    Oct,
    Nov,
    Dec
}


export class BackendSettings {
    public static SERVER_URL = 'https://dev-eleave-spring.yomabank.org/api/v1/eleave/';
    public static LOGIN_ENDPOINT = 'login';
    public static PROFILE_ENDPOINT = 'employee-profile';
    public static BALANCE_ENDPOINT = 'leave-balance';
    public static HISTORY_ENDPOINT = 'leave-hisotry';
    public static SAVELEAVE_ENDPOINT = 'save-leave';
    public static ASSOCIATELEAVE_ENDPOINT = 'associate-leave';
    public static APPROVELEAVE_ENDPOINT = 'approve-leave';
    public static CHANGEPASSWORD_ENDPOINT = 'change-password';
    public static LOGIN_NOMFA = 'https://dev-eleave-spring.yomabank.org/api/auth/login/no-mfa';
}