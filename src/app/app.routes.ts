import { Routes } from '@angular/router';
import { HomeComponent } from '@src/app/home/home.component';
import { LoginComponent } from '@src/app/login/login.component';
import { DashboardComponent } from '@src/app/dashboard/dashboard.component';
import { LeaveHistoryComponent } from '@src/app/leave-history/leave-history.component';
import { DatePickerComponent } from '@src/app/ui-components/date-picker/date-picker.component';
import { LeaveHistoryDetailsComponent } from '@src/app/leave-history/leave-history-details/leave-history-details.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'datepicker', component: DatePickerComponent }
    ]
  },
  {
    path: 'dashboard', component: DashboardComponent
  },
  {
    path: 'history', component: LeaveHistoryComponent,
  },
  {
    path: 'history-details',
    component: LeaveHistoryDetailsComponent
  }

];
