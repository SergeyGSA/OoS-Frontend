import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { Constants, EMPTY_RESULT } from '../constants/constants';
import { SnackbarText } from '../enum/enumUA/messageBer';
import { ProviderStatuses } from '../enum/statuses';
import { Achievement } from '../models/achievement.model';
import { BlockedParent } from '../models/block.model';
import { Child } from '../models/child.model';
import { TruncatedItem } from '../models/item.model';
import { LicenseStatusData, Provider, ProviderStatusUpdateData } from '../models/provider.model';
import { ProviderAdmin } from '../models/providerAdmin.model';
import { SearchResponse } from '../models/search.model';
import { ProviderWorkshopCard, Workshop, WorkshopStatus } from '../models/workshop.model';
import { AchievementsService } from '../services/achievements/achievements.service';
import { BlockService } from '../services/block/block.service';
import { ProviderAdminService } from '../services/provider-admins/provider-admin.service';
import { ProviderService } from '../services/provider/provider.service';
import { UserWorkshopService } from '../services/workshops/user-workshop/user-workshop.service';
import { Util } from '../utils/utils';
import { GetFilteredProviders } from './admin.actions';
import { MarkFormDirty, ShowMessageBar } from './app.actions';
import {
  BlockParent, BlockParentFail, BlockParentSuccess, BlockProviderAdminById, CreateAchievement,
  CreateProvider, CreateProviderAdmin, CreateWorkshop, DeleteAchievementById,
  DeleteProviderAdminById, DeleteProviderById, DeleteWorkshopById, GetAchievementById,
  GetAchievementsByWorkshopId, GetBlockedParents, GetChildrenByWorkshopId,
  GetFilteredProviderAdmins, GetProviderAdminById, GetProviderAdminWorkshops,
  GetProviderViewWorkshops, GetWorkshopListByProviderAdminId, GetWorkshopListByProviderId,
  OnBlockProviderAdminFail, OnBlockProviderAdminSuccess, OnClearBlockedParents,
  OnCreateAchievementFail, OnCreateAchievementSuccess, OnCreateProviderAdminFail,
  OnCreateProviderAdminSuccess, OnCreateProviderFail, OnCreateProviderSuccess, OnCreateWorkshopFail,
  OnCreateWorkshopSuccess, OnDeleteAchievementFail, OnDeleteAchievementSuccess,
  OnDeleteProviderAdminFail, OnDeleteProviderAdminSuccess, OnDeleteProviderByIdFail,
  OnDeleteProviderByIdSuccess, OnDeleteWorkshopFail, OnDeleteWorkshopSuccess,
  OnUpdateAchievementFail, OnUpdateAchievementSuccess, OnUpdateProviderAdminFail,
  OnUpdateProviderAdminSuccess, OnUpdateProviderFail, OnUpdateProviderStatusFail,
  OnUpdateProviderStatusSuccess, OnUpdateProviderSuccess, OnUpdateWorkshopFail,
  OnUpdateWorkshopStatusFail, OnUpdateWorkshopStatusSuccess, OnUpdateWorkshopSuccess,
  ReinviteProviderAdmin, ResetAchievements, UnBlockParent, UnBlockParentFail, UnBlockParentSuccess,
  UpdateAchievement, UpdateProvider, UpdateProviderAdmin, UpdateProviderLicenseStatuse,
  UpdateProviderStatus, UpdateWorkshop, UpdateWorkshopStatus
} from './provider.actions';
import { CheckAuth, GetProfile } from './registration.actions';
import { GetApplicationsByPropertyId } from './shared-user.actions';

export interface ProviderStateModel {
  isLoading: boolean;
  achievements: SearchResponse<Achievement[]>;
  selectedAchievement: Achievement;
  approvedChildren: SearchResponse<Child[]>;
  providerWorkshops: SearchResponse<ProviderWorkshopCard[]>;
  providerAdmins: SearchResponse<ProviderAdmin[]>;
  selectedProviderAdmin: ProviderAdmin;
  blockedParent: BlockedParent;
  truncatedItems: TruncatedItem[];
}

@State<ProviderStateModel>({
  name: 'provider',
  defaults: {
    isLoading: false,
    approvedChildren: null,
    achievements: null,
    selectedAchievement: null,
    providerWorkshops: null,
    providerAdmins: null,
    selectedProviderAdmin: null,
    blockedParent: null,
    truncatedItems: null
  }
})
@Injectable()
export class ProviderState {
  @Selector()
  static isLoading(state: ProviderStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  static approvedChildren(state: ProviderStateModel): SearchResponse<Child[]> {
    return state.approvedChildren;
  }

  @Selector()
  static achievements(state: ProviderStateModel): SearchResponse<Achievement[]> {
    return state.achievements;
  }

  @Selector()
  static selectedAchievement(state: ProviderStateModel): Achievement {
    return state.selectedAchievement;
  }

  @Selector()
  static providerWorkshops(state: ProviderStateModel): SearchResponse<ProviderWorkshopCard[]> {
    return state.providerWorkshops;
  }

  @Selector()
  static providerAdmins(state: ProviderStateModel): SearchResponse<ProviderAdmin[]> {
    return state.providerAdmins;
  }

  @Selector()
  static blockedParent(state: ProviderStateModel): BlockedParent {
    return state.blockedParent;
  }

  @Selector()
  static truncated(state: ProviderStateModel): TruncatedItem[] {
    return state.truncatedItems;
  }

  @Selector()
  static selectedProviderAdmin(state: ProviderStateModel): ProviderAdmin {
    return state.selectedProviderAdmin;
  }

  constructor(
    private achievementsService: AchievementsService,
    private router: Router,
    private userWorkshopService: UserWorkshopService,
    private providerAdminService: ProviderAdminService,
    private providerService: ProviderService,
    private blockService: BlockService
  ) {}

  @Action(GetAchievementById)
  getAchievementById({ patchState }: StateContext<ProviderStateModel>, { payload }: GetAchievementById): Observable<Achievement> {
    patchState({ isLoading: true });
    return this.achievementsService
      .getAchievementById(payload)
      .pipe(tap((selectedAchievement: Achievement) => patchState({ selectedAchievement, isLoading: false })));
  }

  @Action(GetAchievementsByWorkshopId)
  getAchievementsByWorkshopId(
    { patchState }: StateContext<ProviderStateModel>,
    { payload }: GetAchievementsByWorkshopId
  ): Observable<SearchResponse<Achievement[]>> {
    patchState({ isLoading: true });
    return this.achievementsService
      .getAchievementsByWorkshopId(payload)
      .pipe(
        tap((achievements: SearchResponse<Achievement[]>) => patchState({ achievements: achievements ?? EMPTY_RESULT, isLoading: false }))
      );
  }

  @Action(GetChildrenByWorkshopId)
  getChildrenByWorkshopId(
    { patchState }: StateContext<ProviderStateModel>,
    { payload }: GetChildrenByWorkshopId
  ): Observable<SearchResponse<Child[]>> {
    patchState({ isLoading: true });
    return this.achievementsService.getChildrenByWorkshopId(payload).pipe(
      tap((approvedChildren: SearchResponse<Child[]>) => {
        return patchState({ approvedChildren: approvedChildren ?? EMPTY_RESULT, isLoading: false });
      })
    );
  }

  @Action(GetWorkshopListByProviderId)
  getWorkshopListByProviderId(
    { patchState }: StateContext<ProviderStateModel>,
    { payload }: GetWorkshopListByProviderId
  ): Observable<TruncatedItem[]> {
    patchState({ isLoading: true });
    return this.userWorkshopService
      .getWorkshopListByProviderId(payload)
      .pipe(tap((truncatedItems: TruncatedItem[]) => patchState({ truncatedItems, isLoading: false })));
  }

  @Action(GetWorkshopListByProviderAdminId)
  getWorkshopListByProviderAdminId(
    { patchState }: StateContext<ProviderStateModel>,
    { id }: GetWorkshopListByProviderAdminId
  ): Observable<TruncatedItem[]> {
    patchState({ isLoading: true });
    return this.userWorkshopService
      .getWorkshopListByProviderAdminId(id)
      .pipe(tap((truncatedItems: TruncatedItem[]) => patchState({ truncatedItems, isLoading: false })));
  }

  @Action(CreateAchievement)
  createAchievement({ dispatch }: StateContext<ProviderStateModel>, { payload }: CreateAchievement): Observable<void | Achievement> {
    return this.achievementsService.createAchievement(payload).pipe(
      tap((res: Achievement) => dispatch(new OnCreateAchievementSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new OnCreateAchievementFail(error)))
    );
  }

  @Action(OnCreateAchievementSuccess)
  onCreateAchievementSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnCreateAchievementSuccess): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.createAchievement,
        type: 'success'
      }),
      new MarkFormDirty(false)
    ]);
    this.router.navigate([`/details/workshop/${payload.workshopId}`], {
      queryParams: { status: 'Achievements' }
    });
  }

  @Action(OnCreateAchievementFail)
  onCreateAchievementFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnCreateAchievementFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(UpdateAchievement)
  updateAchievement({ dispatch }: StateContext<ProviderStateModel>, { payload }: UpdateAchievement): Observable<void | Achievement> {
    return this.achievementsService.updateAchievement(payload).pipe(
      tap((res: Achievement) => dispatch(new OnCreateAchievementSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new OnCreateAchievementFail(error)))
    );
  }

  @Action(OnUpdateAchievementSuccess)
  onUpdateAchievementSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateAchievementSuccess): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.updateAchievement,
        type: 'success'
      }),
      new MarkFormDirty(false)
    ]);
    this.router.navigate(['/details/workshop/', payload.workshopId]);
  }

  @Action(OnUpdateAchievementFail)
  onUpdateAchievementFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateAchievementFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(DeleteAchievementById)
  deleteAchievementById(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: DeleteAchievementById
  ): Observable<void | Observable<void>> {
    return this.achievementsService.deleteAchievement(payload).pipe(
      tap(() => dispatch(new OnDeleteAchievementSuccess(payload))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnDeleteAchievementFail(error))))
    );
  }

  @Action(OnDeleteAchievementSuccess)
  onDeleteAchievementSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnDeleteAchievementSuccess): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.deleteAchievement,
        type: 'success'
      })
    ]);
    this.router.navigate(['/details/workshop', payload]);
  }

  @Action(GetProviderAdminWorkshops)
  getProviderAdminWorkshops(
    { patchState }: StateContext<ProviderStateModel>,
    { parameters }: GetProviderAdminWorkshops
  ): Observable<SearchResponse<ProviderWorkshopCard[]>> {
    patchState({ isLoading: true });
    return this.userWorkshopService
      .getProviderAdminsWorkshops(parameters)
      .pipe(
        tap((providerWorkshops: SearchResponse<ProviderWorkshopCard[]>) =>
          patchState({ providerWorkshops: providerWorkshops ?? EMPTY_RESULT, isLoading: false })
        )
      );
  }

  @Action(GetProviderViewWorkshops)
  getProviderWorkshops(
    { patchState }: StateContext<ProviderStateModel>,
    { workshopCardParameters }: GetProviderViewWorkshops
  ): Observable<SearchResponse<ProviderWorkshopCard[]>> {
    patchState({ isLoading: true });
    return this.userWorkshopService
      .getProviderViewWorkshops(workshopCardParameters)
      .pipe(
        tap((providerWorkshops: SearchResponse<ProviderWorkshopCard[]>) =>
          patchState({ providerWorkshops: providerWorkshops ?? EMPTY_RESULT, isLoading: false })
        )
      );
  }

  @Action(GetFilteredProviderAdmins)
  getFilteredProviderAdmins(
    { patchState }: StateContext<ProviderStateModel>,
    { payload }: GetFilteredProviderAdmins
  ): Observable<SearchResponse<ProviderAdmin[]>> {
    patchState({ isLoading: true });
    return this.providerAdminService
      .getFilteredProviderAdmins(payload)
      .pipe(
        tap((providerAdmins: SearchResponse<ProviderAdmin[]>) =>
          patchState({ providerAdmins: providerAdmins ?? EMPTY_RESULT, isLoading: false })
        )
      );
  }

  @Action(CreateWorkshop)
  createWorkshop(
    { patchState, dispatch }: StateContext<ProviderStateModel>,
    { payload }: CreateWorkshop
  ): Observable<Workshop | Observable<void>> {
    patchState({ isLoading: true });
    return this.userWorkshopService.createWorkshop(payload).pipe(
      tap((res: Workshop) => dispatch(new OnCreateWorkshopSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnCreateWorkshopFail(error))))
    );
  }

  @Action(OnCreateWorkshopFail)
  onCreateWorkshopFail({ dispatch, patchState }: StateContext<ProviderStateModel>, { payload }: OnCreateWorkshopFail): void {
    patchState({ isLoading: false });
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnCreateWorkshopSuccess)
  onCreateWorkshopSuccess({ patchState, dispatch }: StateContext<ProviderStateModel>, { payload }: OnCreateWorkshopSuccess): void {
    const message = Util.getWorkshopMessage(payload, SnackbarText.createWorkshop);
    patchState({ isLoading: false });
    dispatch([new MarkFormDirty(false), new ShowMessageBar({ message: message.text, type: message.type })]);
    this.router.navigate(['./personal-cabinet/provider/workshops']);
  }

  @Action(UpdateWorkshop)
  updateWorkshop({ dispatch }: StateContext<ProviderStateModel>, { payload }: UpdateWorkshop): Observable<Workshop | Observable<void>> {
    return this.userWorkshopService.updateWorkshop(payload).pipe(
      tap((res: Workshop) => dispatch(new OnUpdateWorkshopSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnUpdateWorkshopFail(error))))
    );
  }

  @Action(OnUpdateWorkshopSuccess)
  onUpdateWorkshopSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateWorkshopSuccess): void {
    const message = Util.getWorkshopMessage(payload, SnackbarText.updateWorkshop);
    dispatch([new MarkFormDirty(false), new ShowMessageBar({ message: message.text, type: message.type })]);
    this.router.navigate(['/personal-cabinet/provider/workshops']);
  }

  @Action(OnUpdateWorkshopFail)
  onUpdateWorkshopFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateWorkshopFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(DeleteWorkshopById)
  deleteWorkshop(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, parameters }: DeleteWorkshopById
  ): Observable<void | Observable<void>> {
    return this.userWorkshopService.deleteWorkshop(payload.workshopId).pipe(
      tap(() => dispatch(new OnDeleteWorkshopSuccess(parameters))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnDeleteWorkshopFail(error))))
    );
  }

  @Action(OnDeleteWorkshopFail)
  onDeleteWorkshopFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnDeleteWorkshopFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnDeleteWorkshopSuccess)
  onDeleteWorkshopSuccess({ dispatch }: StateContext<ProviderStateModel>, { parameters }: OnDeleteWorkshopSuccess): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.deleteWorkshop,
        type: 'success'
      }),
      new GetProviderViewWorkshops(parameters)
    ]);
  }

  @Action(CreateProvider)
  createProvider(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, isImagesFeature }: CreateProvider
  ): Observable<Provider | Observable<void>> {
    return this.providerService.createProvider(payload, isImagesFeature).pipe(
      tap((res: Provider) => dispatch(new OnCreateProviderSuccess(res))),
      catchError((error) => of(dispatch(new OnCreateProviderFail(error))))
    );
  }

  @Action(OnCreateProviderFail)
  onCreateProviderFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnCreateProviderFail): void {
    const message =
      payload.error === Constants.UNABLE_CREATE_PROVIDER || Constants.UNABLE_CREATE_PROVIDER + Constants.THERE_IS_SUCH_DATA
        ? SnackbarText.notUniqueData
        : SnackbarText.error;
    dispatch(new ShowMessageBar({ message, type: 'error' }));
  }

  @Action(OnCreateProviderSuccess)
  onCreateProviderSuccess({ dispatch }: StateContext<ProviderStateModel>, {}: OnCreateProviderSuccess): void {
    dispatch(new CheckAuth()).subscribe(() => this.router.navigate(['/personal-cabinet/provider/info']));
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.createProvider,
        type: 'success'
      }),
      new MarkFormDirty(false)
    ]);
  }

  @Action(UpdateProvider)
  updateProvider(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, isImagesFeature }: UpdateProvider
  ): Observable<Provider | Observable<void>> {
    return this.providerService.updateProvider(payload, isImagesFeature).pipe(
      tap(() => dispatch(new OnUpdateProviderSuccess())),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnUpdateProviderFail(error))))
    );
  }

  @Action(OnUpdateProviderFail)
  onUpdateProviderfail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateProviderFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnUpdateProviderSuccess)
  onUpdateProviderSuccess({ dispatch }: StateContext<ProviderStateModel>, {}: OnUpdateProviderSuccess): void {
    dispatch(new MarkFormDirty(false));
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.updateProvider,
        type: 'success'
      })
    ]);
    dispatch(new GetProfile()).subscribe(() => this.router.navigate(['/personal-cabinet/provider/info']));
  }

  @Action(UpdateProviderStatus)
  updateProviderStatus(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, providerParameters }: UpdateProviderStatus
  ): Observable<ProviderStatusUpdateData | Observable<void>> {
    return this.providerService.updateProviderStatus(payload).pipe(
      tap(() => dispatch(new OnUpdateProviderStatusSuccess(payload, providerParameters))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnUpdateProviderStatusFail(error))))
    );
  }

  @Action(UpdateProviderLicenseStatuse)
  updateProviderLicenseStatuse(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, providerParameters }: UpdateProviderLicenseStatuse
  ): Observable<LicenseStatusData | void> {
    return this.providerService.updateProviderLicenseStatus(payload).pipe(
      tap(() =>
        dispatch([
          new ShowMessageBar({
            message: SnackbarText.licenseApproved,
            type: 'success'
          }),
          new MarkFormDirty(false),
          new GetFilteredProviders(providerParameters)
        ])
      ),
      catchError(() => dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' })))
    );
  }

  @Action(OnUpdateProviderStatusFail)
  onUpdateProviderStatusFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateProviderStatusFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnUpdateProviderStatusSuccess)
  onUpdateProviderStatusSuccess(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, providerParameters }: OnUpdateProviderStatusSuccess
  ): void {
    dispatch([
      new ShowMessageBar({
        message: payload.status == ProviderStatuses.Editing ? SnackbarText.statusEditing : SnackbarText.changeProviderStatus,
        type: 'success'
      }),
      new MarkFormDirty(false),
      new GetFilteredProviders(providerParameters)
    ]);
  }

  @Action(CreateProviderAdmin)
  createProviderAdmin(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: CreateProviderAdmin
  ): Observable<ProviderAdmin | Observable<void>> {
    return this.providerAdminService.createProviderAdmin(payload).pipe(
      tap((res: ProviderAdmin) => dispatch(new OnCreateProviderAdminSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnCreateProviderAdminFail(error))))
    );
  }

  @Action(OnCreateProviderAdminFail)
  onCreateProviderAdminFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnCreateProviderAdminFail): void {
    dispatch(
      new ShowMessageBar({
        message: SnackbarText.error,
        type: 'error'
      })
    );
  }

  @Action(OnCreateProviderAdminSuccess)
  onCreateProviderAdminSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnCreateProviderAdminSuccess): void {
    dispatch([
      new ShowMessageBar({
        message: payload.isDeputy ? SnackbarText.createDeputy : SnackbarText.createProviderAdminSuccess,
        type: 'success'
      }),
      new MarkFormDirty(false)
    ]);
    this.router.navigate(['/personal-cabinet/provider/administration']);
  }

  @Action(BlockProviderAdminById)
  blockProviderAdmin(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, filterParams }: BlockProviderAdminById
  ): Observable<void | Observable<void>> {
    return this.providerAdminService.blockProviderAdmin(payload).pipe(
      tap(() => dispatch(new OnBlockProviderAdminSuccess(payload, filterParams))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnBlockProviderAdminFail(error))))
    );
  }

  @Action(OnBlockProviderAdminFail)
  onBlockProviderAdminFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnBlockProviderAdminFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnBlockProviderAdminSuccess)
  onBlockProviderAdminSuccess(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, filterParams }: OnBlockProviderAdminSuccess
  ): void {
    dispatch([
      new GetFilteredProviderAdmins(filterParams),
      new ShowMessageBar({
        message: payload.isBlocked ? SnackbarText.blockPerson : SnackbarText.unblockPerson,
        type: 'success'
      })
    ]);
  }

  @Action(DeleteProviderAdminById)
  deleteProviderAdmin(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, filterParams }: DeleteProviderAdminById
  ): Observable<void | Observable<void>> {
    return this.providerAdminService.deleteProviderAdmin(payload.userId, payload.providerId).pipe(
      tap(() => dispatch(new OnDeleteProviderAdminSuccess(filterParams))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnDeleteProviderAdminFail(error))))
    );
  }

  @Action(OnDeleteProviderAdminFail)
  onDeleteProviderAdminFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnDeleteProviderAdminFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnDeleteProviderAdminSuccess)
  onDeleteProviderAdminSuccess({ dispatch }: StateContext<ProviderStateModel>, { filterParams }: OnDeleteProviderAdminSuccess): void {
    dispatch([
      new GetFilteredProviderAdmins(filterParams),
      new ShowMessageBar({
        message: SnackbarText.deleteProviderAdmin,
        type: 'success'
      })
    ]);
  }

  @Action(UpdateProviderAdmin)
  updateProviderAdmin(
    { dispatch }: StateContext<ProviderStateModel>,
    { providerId, providerAdmin }: UpdateProviderAdmin
  ): Observable<void | ProviderAdmin> {
    return this.providerAdminService.updateProviderAdmin(providerId, providerAdmin).pipe(
      tap(() => dispatch(new OnUpdateProviderAdminSuccess(providerAdmin))),
      catchError((error: HttpErrorResponse) => dispatch(new OnUpdateProviderAdminFail(error)))
    );
  }

  @Action(OnUpdateProviderAdminFail)
  onUpdateProviderAdminfail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateProviderAdminFail): void {
    dispatch(
      new ShowMessageBar({
        message: SnackbarText.error,
        type: 'error'
      })
    );
  }

  @Action(OnUpdateProviderAdminSuccess)
  onUpdateProviderAdminSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateProviderAdminSuccess): void {
    dispatch([
      new ShowMessageBar({
        message: payload.isDeputy ? SnackbarText.updateDeputy : SnackbarText.updateProviderAdmin,
        type: 'success'
      }),
      new MarkFormDirty(false)
    ]);
    this.router.navigate(['/personal-cabinet/provider/administration']);
  }

  @Action(UpdateWorkshopStatus)
  updateStatus(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, providerId }: UpdateWorkshopStatus
  ): Observable<WorkshopStatus | Observable<void>> {
    return this.userWorkshopService.updateWorkshopStatus(payload).pipe(
      tap(() => dispatch(new OnUpdateWorkshopStatusSuccess(providerId))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnUpdateWorkshopStatusFail(error))))
    );
  }

  @Action(OnUpdateWorkshopStatusFail)
  onUpdateStatusFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateWorkshopStatusFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnUpdateWorkshopStatusSuccess)
  onUpdateStatusSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateWorkshopStatusSuccess): void {}

  @Action(BlockParent)
  blockParent(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, entityType }: BlockParent
  ): Observable<BlockedParent | Observable<void>> {
    return this.blockService.blockParent(payload).pipe(
      tap((res: BlockedParent) => dispatch(new BlockParentSuccess(res, entityType))),
      catchError((error: HttpErrorResponse) => of(dispatch(new BlockParentFail(error))))
    );
  }

  @Action(BlockParentFail)
  blockParentFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: BlockParentFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(BlockParentSuccess)
  blockParentFailSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload, entityType }: BlockParentSuccess): void {
    dispatch([
      new GetApplicationsByPropertyId(payload.providerId, {
        property: entityType,
        statuses: [],
        showBlocked: false,
        workshops: []
      }),
      new MarkFormDirty(false),
      new ShowMessageBar({ message: SnackbarText.blockPerson, type: 'success' })
    ]);
  }

  @Action(UnBlockParent)
  unBlockParent(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, entityType }: UnBlockParent
  ): Observable<BlockedParent | Observable<void>> {
    return this.blockService.unBlockParent(payload).pipe(
      tap((res: BlockedParent) => dispatch(new UnBlockParentSuccess(res, entityType))),
      catchError((error: Error) => of(dispatch(new UnBlockParentFail(error))))
    );
  }

  @Action(UnBlockParentFail)
  unBlockParentFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: UnBlockParentFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(UnBlockParentSuccess)
  unBlockParentFailSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload, entityType }: UnBlockParentSuccess): void {
    dispatch([
      new GetApplicationsByPropertyId(payload.providerId, {
        property: entityType,
        statuses: [],
        showBlocked: false,
        workshops: []
      }),
      new MarkFormDirty(false),
      new ShowMessageBar({ message: SnackbarText.blockPerson, type: 'success' })
    ]);
  }

  @Action(GetBlockedParents)
  getBlockedParents(
    { patchState }: StateContext<ProviderStateModel>,
    { providerId, parentId }: GetBlockedParents
  ): Observable<BlockedParent> {
    return this.blockService
      .getBlockedParents(providerId, parentId)
      .pipe(tap((blockedParent: BlockedParent) => patchState({ blockedParent })));
  }

  @Action(OnClearBlockedParents)
  onClearBlockedParents({ patchState }: StateContext<ProviderStateModel>, {}: OnClearBlockedParents): void {
    patchState({ blockedParent: null });
  }

  @Action(ResetAchievements)
  resetAchievement({ patchState }: StateContext<ProviderStateModel>, {}: ResetAchievements): void {
    patchState({ selectedAchievement: null, achievements: null });
  }

  @Action(DeleteProviderById)
  deleteProviderById(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, providerParameters }: DeleteProviderById
  ): Observable<void | Observable<void>> {
    return this.providerService.deleteProviderById(payload).pipe(
      tap(() => dispatch(new OnDeleteProviderByIdSuccess(payload, providerParameters))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnDeleteProviderByIdFail(error))))
    );
  }

  @Action(OnDeleteProviderByIdFail)
  onDeleteProviderByIdFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnDeleteProviderByIdFail): void {
    dispatch(
      new ShowMessageBar({
        message: SnackbarText.error,
        type: 'error'
      })
    );
  }

  @Action(OnDeleteProviderByIdSuccess)
  onDeleteProviderByIdSuccess(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, providerParameters }: OnDeleteProviderByIdSuccess
  ): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.deleteProvider,
        type: 'success'
      }),
      new GetFilteredProviders(providerParameters)
    ]);
  }

  @Action(GetProviderAdminById)
  getProviderAdminById({ patchState }: StateContext<ProviderStateModel>, { payload }: GetProviderAdminById): Observable<ProviderAdmin> {
    patchState({ isLoading: true });
    return this.providerAdminService
      .getProviderAdminById(payload)
      .pipe(tap((selectedProviderAdmin: ProviderAdmin) => patchState({ selectedProviderAdmin, isLoading: false })));
  }

  @Action(ReinviteProviderAdmin)
  reinviteProviderAdmin({ dispatch }: StateContext<ProviderStateModel>, { providerAdmin }: ReinviteProviderAdmin): Observable<void> {
    return this.providerAdminService.reinvateProviderAdmin(providerAdmin).pipe(
      tap(() =>
        dispatch(
          new ShowMessageBar({
            message: SnackbarText.sendInvitation,
            type: 'success'
          })
        )
      )
    );
  }
}
