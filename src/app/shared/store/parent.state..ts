import { Observable, of } from 'rxjs';
import { catchError, debounceTime, tap } from 'rxjs/operators';

import { Location } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { EMPTY_RESULT } from '../constants/constants';
import { SnackbarText } from '../enum/enumUA/messageBer';
import { Application } from '../models/application.model';
import { Child } from '../models/child.model';
import { Favorite } from '../models/favorite.model';
import { TruncatedItem } from '../models/item.model';
import { Rate } from '../models/rating';
import { SearchResponse } from '../models/search.model';
import { WorkshopCard } from '../models/workshop.model';
import { ApplicationService } from '../services/applications/application.service';
import { ChildrenService } from '../services/children/children.service';
import { RatingService } from '../services/rating/rating.service';
import { FavoriteWorkshopsService } from '../services/workshops/favorite-workshops/favorite-workshops.service';
import { MarkFormDirty, ShowMessageBar } from './app.actions';
import {
  CreateApplication,
  CreateChild,
  CreateChildren,
  CreateFavoriteWorkshop,
  CreateRating,
  DeleteRatingById,
  DeleteChildById,
  DeleteFavoriteWorkshop,
  GetAllUsersChildren,
  GetAllUsersChildrenByParentId,
  GetFavoriteWorkshops,
  GetFavoriteWorkshopsByUserId,
  GetReviewedStatus,
  GetStatusAllowedToReview,
  GetStatusIsAllowToApply,
  GetUsersChildById,
  GetUsersChildren,
  OnCreateApplicationFail,
  OnCreateApplicationSuccess,
  OnCreateChildFail,
  OnCreateChildrenFail,
  OnCreateChildrenSuccess,
  OnCreateChildSuccess,
  OnCreateRatingFail,
  OnCreateRatingSuccess,
  OnDeleteRatingFail,
  OnDeleteRatingSuccess,
  OnDeleteChildFail,
  OnDeleteChildSuccess,
  OnUpdateChildFail,
  OnUpdateChildSuccess,
  ResetSelectedChild,
  UpdateChild
} from './parent.actions';

export interface ParentStateModel {
  isLoading: boolean;
  isAllowChildToApply: boolean;
  isAllowedToReview: boolean;
  isReviewed: boolean;
  favoriteWorkshops: Favorite[];
  favoriteWorkshopsCard: SearchResponse<WorkshopCard[]>;
  children: SearchResponse<Child[]>;
  truncatedItems: TruncatedItem[];
  selectedChild: Child;
}

@State<ParentStateModel>({
  name: 'parent',
  defaults: {
    isLoading: false,
    isAllowChildToApply: true,
    isAllowedToReview: false,
    isReviewed: false,
    favoriteWorkshops: null,
    favoriteWorkshopsCard: null,
    children: null,
    truncatedItems: null,
    selectedChild: null
  }
})
@Injectable()
export class ParentState {
  @Selector()
  static isLoading(state: ParentStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  static isAllowChildToApply(state: ParentStateModel): boolean {
    return state.isAllowChildToApply;
  }

  @Selector()
  static isAllowedToReview(state: ParentStateModel): boolean {
    return state.isAllowedToReview;
  }

  @Selector()
  static isReviewed(state: ParentStateModel): boolean {
    return state.isReviewed;
  }

  @Selector()
  static favoriteWorkshops(state: ParentStateModel): Favorite[] {
    return state.favoriteWorkshops;
  }

  @Selector()
  static favoriteWorkshopsCard(state: ParentStateModel): SearchResponse<WorkshopCard[]> {
    return state.favoriteWorkshopsCard;
  }

  @Selector()
  static selectedChild(state: ParentStateModel): Child {
    return state.selectedChild;
  }

  @Selector()
  static children(state: ParentStateModel): SearchResponse<Child[]> {
    return state.children;
  }

  @Selector()
  static truncatedItems(state: ParentStateModel): TruncatedItem[] {
    return state.truncatedItems;
  }

  constructor(
    private applicationService: ApplicationService,
    private favoriteWorkshopsService: FavoriteWorkshopsService,
    private childrenService: ChildrenService,
    private router: Router,
    private location: Location,
    private ratingService: RatingService
  ) {}

  @Action(GetStatusIsAllowToApply)
  getStatusIsAllowToApply(
    { patchState }: StateContext<ParentStateModel>,
    { childId, workshopId }: GetStatusIsAllowToApply
  ): Observable<boolean> {
    patchState({ isLoading: true });
    return this.applicationService
      .getStatusIsAllowToApply(childId, workshopId)
      .pipe(tap((isAllowChildToApply: boolean) => patchState({ isAllowChildToApply, isLoading: false })));
  }

  @Action(GetStatusAllowedToReview)
  getApplicationsAllowedToReview(
    { patchState }: StateContext<ParentStateModel>,
    { parentId, workshopId }: GetStatusAllowedToReview
  ): Observable<boolean> {
    patchState({ isLoading: true });
    return this.applicationService
      .getApplicationsAllowedToReview(parentId, workshopId)
      .pipe(tap((isAllowedToReview: boolean) => patchState({ isAllowedToReview, isLoading: false })));
  }

  @Action(GetReviewedStatus)
  getReviewedStatus({ patchState }: StateContext<ParentStateModel>, { parentId, workshopId }: GetReviewedStatus): Observable<boolean> {
    patchState({ isLoading: true });
    return this.ratingService
      .getReviewedStatus(parentId, workshopId)
      .pipe(tap((isReviewed: boolean) => patchState({ isReviewed, isLoading: false })));
  }

  @Action(GetFavoriteWorkshops)
  getFavoriteWorkshops({ patchState }: StateContext<ParentStateModel>, {}: GetFavoriteWorkshops): Observable<Favorite[]> {
    return this.favoriteWorkshopsService
      .getFavoriteWorkshops()
      .pipe(tap((favoriteWorkshops: Favorite[]) => patchState({ favoriteWorkshops })));
  }

  @Action(GetFavoriteWorkshopsByUserId)
  getFavoriteWorkshopsByUserId(
    { patchState }: StateContext<ParentStateModel>,
    { paginationParameters }: GetFavoriteWorkshopsByUserId
  ): Observable<SearchResponse<WorkshopCard[]>> {
    return this.favoriteWorkshopsService
      .getFavoriteWorkshopsByUserId(paginationParameters)
      .pipe(tap((favoriteWorkshopCard: SearchResponse<WorkshopCard[]>) => patchState({ favoriteWorkshopsCard: favoriteWorkshopCard })));
  }

  @Action(CreateFavoriteWorkshop)
  createFavoriteWorkshop({ dispatch }: StateContext<ParentStateModel>, { payload }: CreateFavoriteWorkshop): Observable<Favorite> {
    return this.favoriteWorkshopsService.createFavoriteWorkshop(payload).pipe(
      debounceTime(2000),
      tap(() => dispatch(new GetFavoriteWorkshops()))
    );
  }

  @Action(DeleteFavoriteWorkshop)
  deleteFavoriteWorkshop({ dispatch }: StateContext<ParentStateModel>, { payload }: DeleteFavoriteWorkshop): Observable<void> {
    return this.favoriteWorkshopsService.deleteFavoriteWorkshop(payload).pipe(
      debounceTime(2000),
      tap(() => dispatch(new GetFavoriteWorkshops()))
    );
  }

  @Action(GetUsersChildren)
  getUsersChildren({ patchState }: StateContext<ParentStateModel>, { parameters }: GetUsersChildren): Observable<SearchResponse<Child[]>> {
    patchState({ isLoading: true });
    return this.childrenService
      .getUsersChildren(parameters)
      .pipe(tap((children: SearchResponse<Child[]>) => patchState({ children: children ?? EMPTY_RESULT, isLoading: false })));
  }

  @Action(GetUsersChildById)
  getUsersChildById({ patchState }: StateContext<ParentStateModel>, { payload }: GetUsersChildById): Observable<Child> {
    patchState({ isLoading: true });
    return this.childrenService
      .getUsersChildById(payload)
      .pipe(tap((selectedChild: Child) => patchState({ selectedChild, isLoading: false })));
  }

  @Action(GetAllUsersChildren)
  getAllUsersChildren({ patchState }: StateContext<ParentStateModel>, {}: GetAllUsersChildren): Observable<SearchResponse<Child[]>> {
    patchState({ isLoading: true });
    return this.childrenService
      .getAllUsersChildren()
      .pipe(tap((children: SearchResponse<Child[]>) => patchState({ children: children ?? EMPTY_RESULT, isLoading: false })));
  }

  @Action(GetAllUsersChildrenByParentId)
  getAllUsersChildrenByParentId(
    { patchState }: StateContext<ParentStateModel>,
    { payload }: GetAllUsersChildrenByParentId
  ): Observable<TruncatedItem[]> {
    patchState({ isLoading: true });
    return this.childrenService
      .getUsersChildrenByParentId(payload)
      .pipe(tap((truncatedItems: TruncatedItem[]) => patchState({ truncatedItems, isLoading: false })));
  }

  @Action(DeleteChildById)
  deleteChildById(
    { dispatch }: StateContext<ParentStateModel>,
    { payload, parameters }: DeleteChildById
  ): Observable<void | Observable<void>> {
    return this.childrenService.deleteChild(payload).pipe(
      tap(() => dispatch(new OnDeleteChildSuccess(parameters))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnDeleteChildFail(error))))
    );
  }

  @Action(OnDeleteChildFail)
  onDeleteChildFail({ dispatch }: StateContext<ParentStateModel>, { payload }: OnDeleteChildFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnDeleteChildSuccess)
  onDeleteChildSuccess({ dispatch }: StateContext<ParentStateModel>, { parameters }: OnDeleteChildSuccess): void {
    dispatch([new ShowMessageBar({ message: SnackbarText.deleteChild, type: 'success' }), new GetUsersChildren(parameters)]);
  }

  @Action(UpdateChild)
  updateChild({ dispatch }: StateContext<ParentStateModel>, { payload }: UpdateChild): Observable<Child | Observable<void>> {
    return this.childrenService.updateChild(payload).pipe(
      tap(() => dispatch(new OnUpdateChildSuccess())),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnUpdateChildFail(error))))
    );
  }

  @Action(OnUpdateChildFail)
  onUpdateChildfail({ dispatch }: StateContext<ParentStateModel>, { payload }: OnUpdateChildFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnUpdateChildSuccess)
  onUpdateChildSuccess({ dispatch }: StateContext<ParentStateModel>, {}: OnUpdateChildSuccess): void {
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({
        message: SnackbarText.updateChild,
        type: 'success'
      })
    ]);
    this.location.back();
  }

  @Action(CreateChild)
  createChild({ dispatch }: StateContext<ParentStateModel>, { payload }: CreateChild): Observable<Observable<void> | Child> {
    return this.childrenService.createChild(payload).pipe(
      tap(() => dispatch(new OnCreateChildSuccess())),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnCreateChildFail(error))))
    );
  }

  @Action(CreateChildren)
  createChildren({ dispatch }: StateContext<ParentStateModel>, { payload }: CreateChildren): Observable<Observable<void> | Child[]> {
    const multipleChildren = payload.length > 1;
    return this.childrenService.createChildren(payload).pipe(
      tap(() => dispatch(new OnCreateChildrenSuccess(multipleChildren))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnCreateChildrenFail(error))))
    );
  }

  @Action(OnCreateChildrenFail)
  onCreateChildrenFail({ dispatch }: StateContext<ParentStateModel>, { payload }: OnCreateChildrenFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnCreateChildrenSuccess)
  onCreateChildrenSuccess({ dispatch }: StateContext<ParentStateModel>, { multipleChildren }: OnCreateChildrenSuccess): void {
    const message = multipleChildren ? SnackbarText.createChildren : SnackbarText.createChild;
    dispatch([
      new ShowMessageBar({
        message,
        type: 'success'
      }),
      new MarkFormDirty(false)
    ]);
    this.location.back();
  }

  @Action(ResetSelectedChild)
  resetSelectedChild({ patchState }: StateContext<ParentStateModel>): void {
    patchState({ selectedChild: null });
  }

  @Action(CreateRating)
  createRating({ dispatch }: StateContext<ParentStateModel>, { payload }: CreateRating): Observable<Observable<void> | Rate> {
    return this.ratingService.createRate(payload).pipe(
      tap(() => dispatch(new OnCreateRatingSuccess())),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnCreateRatingFail(error))))
    );
  }

  @Action(OnCreateRatingFail)
  onCreateRatingFail({ dispatch }: StateContext<ParentStateModel>, { payload }: OnCreateRatingFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnCreateRatingSuccess)
  onCreateRatingSuccess({ dispatch }: StateContext<ParentStateModel>, {}: OnCreateRatingSuccess): void {
    dispatch(
      new ShowMessageBar({
        message: SnackbarText.createRating,
        type: 'success'
      })
    );
  }

  @Action(DeleteRatingById)
  deleteRatingById(
    { dispatch }: StateContext<ParentStateModel>,
    { payload }: DeleteRatingById
  ): Observable<void | Observable<void>> {
    return this.ratingService.deleteRate(payload).pipe(
      tap(() => dispatch(new OnDeleteRatingSuccess(payload))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnDeleteRatingFail(error))))
    );
  }
  
  @Action(OnDeleteChildFail)
  onDeleteRatingFail({ dispatch }: StateContext<ParentStateModel>, { payload }: OnDeleteChildFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnDeleteChildSuccess)
  onDeleteRatingSuccess({ dispatch }: StateContext<ParentStateModel>, { parameters }: OnDeleteChildSuccess): void {
    dispatch([new ShowMessageBar({ message: SnackbarText.deleteChild, type: 'success' }), new GetUsersChildren(parameters)]);
  }

  @Action(CreateApplication)
  createApplication(
    { dispatch }: StateContext<ParentStateModel>,
    { payload }: CreateApplication
  ): Observable<HttpResponse<Application> | Observable<void>> {
    return this.applicationService.createApplication(payload).pipe(
      tap(() => dispatch(new OnCreateApplicationSuccess())),
      catchError((error) => {
        return of(dispatch(new OnCreateApplicationFail(error)));
      })
    );
  }

  @Action(OnCreateApplicationFail)
  onCreateApplicationFail({ dispatch }: StateContext<ParentStateModel>, { payload }: OnCreateApplicationFail): void {
    dispatch(
      new ShowMessageBar({
        message: payload.error.status === 429 ? SnackbarText.applicationLimit : SnackbarText.error,
        type: 'error',
        info: payload.error.status === 429 ? SnackbarText.applicationLimitPerPerson : ''
      })
    );
  }

  @Action(OnCreateApplicationSuccess)
  onCreateApplicationSuccess({ dispatch }: StateContext<ParentStateModel>, {}: OnCreateApplicationSuccess): void {
    dispatch([new ShowMessageBar({ message: SnackbarText.createApplication, type: 'success' }), new MarkFormDirty(false)]);
    this.router.navigate(['']);
  }
}
