import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';

import { Provider } from '../../../../shared/models/provider.model';
import { CreateProviderComponent } from './create-provider.component';

fdescribe('CreateProviderComponent', () => {
  let component: CreateProviderComponent;
  let fixture: ComponentFixture<CreateProviderComponent>;
  let fb: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatStepperModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        NgxsModule.forRoot([]),
        RouterTestingModule,
        MatDialogModule
      ],
      declarations: [CreateProviderComponent, MockCreatePhotoFormComponent, MockCreateInfoComponent, MockCreateContactsFormComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProviderComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);

    component.InfoFormGroup = fb.group({
      fullTitle: new FormControl('')
    });
    component.LegalAddressFormGroup = fb.group({
      fullTitle: new FormControl('')
    });
    component.ActualAddressFormGroup = fb.group({
      fullTitle: new FormControl('')
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-create-contacts-form',
  template: ''
})
class MockCreateContactsFormComponent {
  @Input() provider: Provider;
  @Input() ContactsFormGroup;
}

@Component({
  selector: 'app-create-info-form',
  template: ''
})
class MockCreateInfoComponent {
  @Input() provider: Provider;
  @Input() InfoFormGroup;
  @Input() isImagesFeature: boolean;
}

@Component({
  selector: 'app-create-photo-form',
  template: ''
})
class MockCreatePhotoFormComponent {
  @Input() provider: Provider;
  @Input() isImagesFeature: boolean;
}
