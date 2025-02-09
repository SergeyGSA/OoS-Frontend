import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { AdminTabsTitles } from './../../../../../shared/enum/enumUA/tech-admin/admin-tabs';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { ValidationConstants } from '../../../../../shared/constants/validation';
import { NavBarName } from '../../../../../shared/enum/enumUA/navigation-bar';
import { CompanyInformation, CompanyInformationSectionItem } from '../../../../../shared/models/сompanyInformation.model';
import { NavigationBarService } from '../../../../../shared/services/navigation-bar/navigation-bar.service';
import { UpdatePlatformInfo, GetPlatformInfo } from '../../../../../shared/store/admin.actions';
import { AdminState } from '../../../../../shared/store/admin.state';
import { AddNavPath } from '../../../../../shared/store/navigation.actions';
import { CreateFormComponent } from '../../../../personal-cabinet/shared-cabinet/create-form/create-form.component';
import { AdminTabTypes } from '../../../../../shared/enum/admins';

@Component({
  selector: 'app-info-edit',
  templateUrl: './info-edit.component.html',
  styleUrls: ['./info-edit.component.scss']
})
export class InfoEditComponent extends CreateFormComponent implements OnInit, OnDestroy {
  readonly validationConstants = ValidationConstants;

  @Select(AdminState.AboutPortal)
  AboutPortal$: Observable<CompanyInformation>;
  @Select(AdminState.MainInformation)
  MainInformation$: Observable<CompanyInformation>;
  @Select(AdminState.SupportInformation)
  SupportInformation$: Observable<CompanyInformation>;
  @Select(AdminState.LawsAndRegulations)
  LawsAndRegulations$: Observable<CompanyInformation>;

  PlatformInfoItemArray = new FormArray([]);
  platformInfoEditFormGroup: FormGroup;
  titleFormControl = new FormControl('', [Validators.required]);
  editTitle: AdminTabsTitles;
  platformInfo: CompanyInformation;

  platformInfoType: AdminTabTypes;
  isMainPage: boolean = false;

  constructor(
    protected store: Store,
    protected route: ActivatedRoute,
    protected navigationBarService: NavigationBarService,
    private fb: FormBuilder,
    private location: Location
  ) {
    super(store, route, navigationBarService);
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => this.setInitialData(params));
  }

  private setInitialData(params: Params): void {
    this.editMode = !!params.mode;
    this.platformInfoType = params.param;
    this.editTitle = AdminTabsTitles[this.platformInfoType];

    this.editMode ? this.setEditMode() : this.onAddForm();
    this.addNavPath();
  }

  addNavPath(): void {
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          { name: NavBarName.Administration, isActive: false, disable: false },
          {
            name: NavBarName.Platform,
            path: '/admin-tools/platform/',
            queryParams: { page: this.platformInfoType },
            isActive: false,
            disable: false
          },
          { name: `Редагувати інфомацію "${NavBarName[this.platformInfoType]}"`, isActive: false, disable: true }
        )
      )
    );
  }

  setEditMode(): void {
    switch (this.platformInfoType) {
      case AdminTabTypes.AboutPortal:
        this.getAboutInfo();
        break;
      case AdminTabTypes.MainPage:
        this.getMainInfo();
        this.isMainPage = true;
        break;
      case AdminTabTypes.SupportInformation:
        this.getSupportInformation();
        break;
      case AdminTabTypes.LawsAndRegulations:
        this.getLawsAndRegulations();
        break;
    }
  }

  /**
   * This method creates new FormGroup
   */
  private newForm(platformInfoItem?: CompanyInformationSectionItem): FormGroup {
    this.platformInfoEditFormGroup = this.fb.group({
      sectionName: new FormControl('', [
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_256),
        Validators.required
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_2000)
      ])
    });

    if (platformInfoItem) {
      this.platformInfoEditFormGroup.addControl('companyInformationId', this.fb.control(platformInfoItem.companyInformationId));
      this.platformInfoEditFormGroup.patchValue(platformInfoItem, { emitEvent: false });
    }

    this.subscribeOnDirtyForm(this.platformInfoEditFormGroup);

    return this.platformInfoEditFormGroup;
  }

  /**
   * This method creates new FormGroup adds new FormGroup to the FormArray
   */
  onAddForm(): void {
    this.PlatformInfoItemArray.push(this.newForm());
  }

  /**
   * This method delete FormGroup from the FormArray by index
   * @param index
   */
  onDeleteForm(index: number): void {
    this.PlatformInfoItemArray.removeAt(index);
  }

  onBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    if (this.PlatformInfoItemArray.valid && this.titleFormControl.valid) {
      const platformInfoItemArray: CompanyInformationSectionItem[] = [];
      this.PlatformInfoItemArray.controls.forEach((form: FormGroup) =>
        platformInfoItemArray.push(new CompanyInformationSectionItem(form.value))
      );

      const platformInfo = this.editMode
        ? new CompanyInformation(this.titleFormControl.value, platformInfoItemArray, this.platformInfo.id)
        : new CompanyInformation(this.titleFormControl.value, platformInfoItemArray);

      this.store.dispatch(new UpdatePlatformInfo(platformInfo, this.platformInfoType));
    }
  }

  private getAboutInfo(): void {
    this.AboutPortal$.pipe(
      takeUntil(this.destroy$),
      tap((aboutPortal: CompanyInformation) => !aboutPortal && this.store.dispatch(new GetPlatformInfo())),
      filter((aboutPortal: CompanyInformation) => !!aboutPortal)
    ).subscribe((aboutPortal: CompanyInformation) => this.setPlatformInfo(aboutPortal));
  }

  private getMainInfo(): void {
    this.MainInformation$.pipe(
      takeUntil(this.destroy$),
      tap((mainInformation: CompanyInformation) => !mainInformation && this.store.dispatch(new GetPlatformInfo())),
      filter((mainInformation: CompanyInformation) => !!mainInformation)
    ).subscribe((mainInformation: CompanyInformation) => this.setPlatformInfo(mainInformation));
  }

  private getSupportInformation(): void {
    this.SupportInformation$.pipe(
      takeUntil(this.destroy$),
      tap((supportInformation: CompanyInformation) => !supportInformation && this.store.dispatch(new GetPlatformInfo())),
      filter((supportInformation: CompanyInformation) => !!supportInformation)
    ).subscribe((supportInformation: CompanyInformation) => this.setPlatformInfo(supportInformation));
  }

  private getLawsAndRegulations(): void {
    this.LawsAndRegulations$.pipe(
      takeUntil(this.destroy$),
      tap((lawsAndRegulations: CompanyInformation) => !lawsAndRegulations && this.store.dispatch(new GetPlatformInfo())),
      filter((lawsAndRegulations: CompanyInformation) => !!lawsAndRegulations)
    ).subscribe((lawsAndRegulations: CompanyInformation) => this.setPlatformInfo(lawsAndRegulations));
  }

  /**
   * This method set portalInfo data for editing
   * @param platformInfo
   */
  private setPlatformInfo(platformInfo: CompanyInformation): void {
    this.platformInfo = platformInfo;
    this.titleFormControl.setValue(this.platformInfo.title, { emitEvent: false });
    this.platformInfo.companyInformationItems.forEach((item: CompanyInformationSectionItem) =>
      this.PlatformInfoItemArray.push(this.newForm(item))
    );
  }
}
