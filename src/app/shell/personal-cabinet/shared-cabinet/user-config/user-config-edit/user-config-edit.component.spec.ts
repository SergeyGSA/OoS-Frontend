import { MatDatepickerModule } from '@angular/material/datepicker';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserConfigEditComponent } from './user-config-edit.component';
import { NgxsModule } from '@ngxs/store';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MatRadioModule } from '@angular/material/radio';
import { User } from '../../../../../shared/models/user.model';
import { TranslateModule } from '@ngx-translate/core';

describe('UserConfigEditComponent', () => {
  let component: UserConfigEditComponent;
  let fixture: ComponentFixture<UserConfigEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        NgxsModule.forRoot([]),
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatDialogModule,
        RouterTestingModule,
        MatRadioModule,
        MatDatepickerModule,
        TranslateModule.forRoot()
      ],
      declarations: [UserConfigEditComponent, MockValidationHintForInputComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserConfigEditComponent);
    component = fixture.componentInstance;
    component.user = {
      lastName: '',
      firstName: '',
      middleName: '',
      phoneNumber: '',
      gender: 0
    } as User;
    component.userEditFormGroup = new FormGroup({
      lastName: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      middleName: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required])
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-validation-hint',
  template: ''
})
class MockValidationHintForInputComponent {
  @Input() validationFormControl: FormControl;
  @Input() minCharachters: number;
  @Input() maxCharachters: number;
  @Input() minMaxDate: boolean;
  @Input() isPhoneNumber: boolean;
}
