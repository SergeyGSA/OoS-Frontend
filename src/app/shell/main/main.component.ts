import { Component, OnInit } from '@angular/core';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { GetTopWorkshops, SetCity } from 'src/app/shared/store/filter.actions';
import { FilterState } from 'src/app/shared/store/filter.state';
import { RegistrationState } from '../../shared/store/registration.state';
import { Direction } from 'src/app/shared/models/category.model';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { WorkshopCard } from '../../shared/models/workshop.model';
import { GetDirections } from 'src/app/shared/store/meta-data.actions';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],

})

export class MainComponent implements OnInit {
  @Select(FilterState.topWorkshops)
  topWorkshops$: Observable<WorkshopCard[]>;
  @Select(RegistrationState.isAuthorized)
  isAuthorized$: Observable<boolean>;
  @Select(MetaDataState.directions)
  directions$: Observable<Direction[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();


  constructor(
    private store: Store,
    private actions$: Actions,
  ) { }


  ngOnInit(): void {
    this.store.dispatch([
      new GetDirections(),
      new GetTopWorkshops()
    ]);

    this.actions$.pipe(ofAction(SetCity))
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$))
      .subscribe(() => this.store.dispatch(new GetTopWorkshops()));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
