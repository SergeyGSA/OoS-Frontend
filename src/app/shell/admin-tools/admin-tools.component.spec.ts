import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminToolsComponent } from './admin-tools.component';
import { NgxsModule } from '@ngxs/store';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('AdminToolsComponent', () => {
  let component: AdminToolsComponent;
  let fixture: ComponentFixture<AdminToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), RouterTestingModule, TranslateModule.forRoot()],
      declarations: [AdminToolsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
