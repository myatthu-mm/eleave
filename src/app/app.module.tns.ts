import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';

import { AppRoutingModule } from '@src/app/app-routing.module';
import { AppComponent } from '@src/app/app.component';
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { HomeComponent } from '@src/app/home/home.component';
import { LoginComponent } from '@src/app/login/login.component';
import { DashboardComponent } from '@src/app/dashboard/dashboard.component';
import { NativeScriptUICalendarModule } from 'nativescript-ui-calendar/angular';
import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';
import { NativeScriptUIChartModule } from "nativescript-ui-chart/angular";
import { LeaveHistoryComponent } from '@src/app/leave-history/leave-history.component';
import { LeaveListviewComponent } from '@src/app/ui-components/leave-listview/leave-listview.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    LeaveHistoryComponent,
    LeaveListviewComponent,
  ],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    NativeScriptFormsModule,
    NativeScriptUICalendarModule,
    NativeScriptHttpClientModule,
    NativeScriptUIChartModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
