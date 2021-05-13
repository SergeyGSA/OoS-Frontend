import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentRoutingModule } from './parent-routing.module';
import { ParentConfigComponent } from './parent-config/parent-config.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from 'src/app/shared/interceptors/http-token.interceptor';
import { NgxsModule } from '@ngxs/store';
import { ParentState } from 'src/app/shared/store/parent.state';
import { MatIconModule } from '@angular/material/icon';
import { ParentAddChildComponent } from './parent-add-child/parent-add-child.component';
import { ChildFormComponent } from './parent-add-child/child-form/child-form.component'
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ParentWorkshopsComponent } from './parent-workshops/parent-workshops.component';
import { ChildrenService } from 'src/app/shared/services/parent/children.service';

@NgModule({
  declarations: [
    ParentWorkshopsComponent,
    ParentConfigComponent,
    ParentAddChildComponent,
    ChildFormComponent,
  ],
  imports: [
    CommonModule,
    ParentRoutingModule,
    MatButtonToggleModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatRadioModule,
    HttpClientModule,
    NgxsModule.forFeature([ParentState]),
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  providers: [
    ChildrenService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true }

  ]

})
export class ParentModule { }
