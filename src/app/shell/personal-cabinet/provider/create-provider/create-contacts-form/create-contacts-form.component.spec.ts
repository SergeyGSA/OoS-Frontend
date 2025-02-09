import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CreateContactsFormComponent } from './create-contacts-form.component';
import { NgxsModule } from '@ngxs/store';
import { Address } from '../../../../../shared/models/address.model';
import { TranslateModule } from '@ngx-translate/core';

describe('CreateContactsFormComponent', () => {
  let component: CreateContactsFormComponent;
  let fixture: ComponentFixture<CreateContactsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatCheckboxModule,
        NgxsModule.forRoot([]),
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      declarations: [CreateContactsFormComponent, MockAddressFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateContactsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-create-address-form',
  template: '',
})
class MockAddressFormComponent {
  @Input() addressFormGroup: FormGroup;
  @Input() searchFormGroup: FormGroup;
  @Input() address: Address;
}
