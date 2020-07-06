import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { ModalDialogService } from "nativescript-angular/modal-dialog";
import { ModalDatetimepicker } from "nativescript-modal-datetimepicker";
import { NativeScriptUICalendarModule } from 'nativescript-ui-calendar/angular';
import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';
import { NativeScriptUIChartModule } from "nativescript-ui-chart/angular";
import { NgxsModule } from '@ngxs/store';
import { NgxsResetPluginModule } from 'ngxs-reset-plugin';
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
import { HistoryListState } from '@src/app/shared/states/history/history.state';
import { ProfileState } from '@src/app/shared/states/profile/profile.state';
import { BalanceListState } from '@src/app/shared/states/balance/balance.state';
import { LeaveRequestComponent } from '@src/app/leave-request/leave-request.component';
import { LeaveTypesComponent } from '@src/app/leave-types/leave-types.component';
import { HistoryFilterModalComponent } from '@src/app/history-filter-modal/history-filter-modal.component';
import { LeaveService } from '@src/app/shared/services/leave.service';
import { BackendService } from '@src/app/shared/services/backend.service';
import { StateService } from '@src/app/shared/services/state.service';
import { MoreComponent } from '@src/app/more/more.component';
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
    HistoryFilterModalComponent,
    MoreComponent,
  ],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    NativeScriptFormsModule,
    NativeScriptUICalendarModule,
    NativeScriptHttpClientModule,
    NativeScriptUIChartModule,
    NgxsModule.forRoot([HistoryListState, ProfileState, BalanceListState], { developmentMode: true }),
    NgxsResetPluginModule.forRoot()
  ],
  providers: [
    ModalDialogService, ModalDatetimepicker, LeaveService, BackendService, StateService
  ],
  entryComponents: [ModalComponent],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
