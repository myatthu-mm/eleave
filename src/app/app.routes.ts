import { Routes } from '@angular/router';
import { HomeComponent } from '@src/app/home/home.component';
import { LoginComponent } from '@src/app/login/login.component';
import { DashboardComponent } from '@src/app/dashboard/dashboard.component';
import { LeaveHistoryComponent } from '@src/app/leave-history/leave-history.component';
import { FilterModalComponent } from '@src/app/ui-components/filter-modal/filter-modal.component';
import { LeaveListviewDetailsComponent } from '@src/app/ui-components/leave-listview-details/leave-listview-details.component';
import { LeaveRequestComponent } from '@src/app/leave-request/leave-request.component';
import { LeaveTypesComponent } from '@src/app/leave-types/leave-types.component';
import { PasswordChangeComponent } from '@src/app/password-change/password-change.component';
import { LeaveApprovalComponent } from '@src/app/leave-approval/leave-approval.component';
import { ApproveCommentModalComponent } from '@src/app/approve-comment-modal/approve-comment-modal.component';
import { LeaveApprovalDetailsComponent } from '@src/app/leave-approval-details/leave-approval-details.component';
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
      { path: 'filter-modal', component: FilterModalComponent }
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
    component: LeaveListviewDetailsComponent
  },
  {
    path: 'request',
    component: LeaveRequestComponent
  },
  {
    path: 'types',
    component: LeaveTypesComponent
  },
  {
    path: 'change-password',
    component: PasswordChangeComponent
  },
  {
    path: 'approval',
    component: LeaveApprovalComponent,
    children: [
      {
        path: 'approval-comment-modal',
        component: ApproveCommentModalComponent
      },

      {
        path: 'filter-modal',
        component: FilterModalComponent
      }
    ]
  },
  {
    path: 'approval-details',
    component: LeaveApprovalDetailsComponent
  }


];
