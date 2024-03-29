import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from '@src/app/app-routing.module';
import { AppComponent } from '@src/app/app.component';
import { HomeComponent } from '@src/app/home/home.component';
import { LoginComponent } from '@src/app/login/login.component';
import { DashboardComponent } from '@src/app/dashboard/dashboard.component';
import { LeaveHistoryComponent } from '@src/app/leave-history/leave-history.component';
import { LeaveListviewComponent } from '@src/app/ui-components/leave-listview/leave-listview.component';
import { ModalComponent } from '@src/app/ui-components/modal/modal.component';
import { DatePickerComponent } from '@src/app/ui-components/date-picker/date-picker.component';
import { RemovableChipComponent } from '@src/app/ui-components/removable-chip/removable-chip.component';
import { LeaveListviewDetailsComponent } from '@src/app/ui-components/leave-listview-details/leave-listview-details.component';
import { LeaveRequestComponent } from '@src/app/leave-request/leave-request.component';
import { LeaveTypesComponent } from '@src/app/leave-types/leave-types.component';
import { FilterModalComponent } from '@src/app/ui-components/filter-modal/filter-modal.component';
import { MoreComponent } from '@src/app/more/more.component';
import { PasswordChangeComponent } from '@src/app/password-change/password-change.component';
import { LeaveApprovalComponent } from '@src/app/leave-approval/leave-approval.component';
import { ApproveCommentModalComponent } from '@src/app/leave-approval/approve-comment-modal/approve-comment-modal.component';
import { LeaveApprovalDetailsComponent } from '@src/app/leave-approval-details/leave-approval-details.component';
import { CommentModalComponent } from '@src/app/ui-components/comment-modal/comment-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    LeaveHistoryComponent,
    LeaveListviewComponent,
    ModalComponent,
    DatePickerComponent,
    RemovableChipComponent,
    LeaveListviewDetailsComponent,
    LeaveRequestComponent,
    LeaveTypesComponent,
    FilterModalComponent,
    MoreComponent,
    PasswordChangeComponent,
    LeaveApprovalComponent,
    ApproveCommentModalComponent,
    LeaveApprovalDetailsComponent,
    CommentModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
