import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ValidationConstants } from '../../../constants/validation';
import { SetIsAppropriateAge, SetMaxAge, SetMinAge } from '../../../store/filter.actions';

@Component({
  selector: 'app-age-filter',
  templateUrl: './age-filter.component.html',
  styleUrls: ['./age-filter.component.scss']
})
export class AgeFilterComponent implements OnInit, OnDestroy {
  readonly validationConstants = ValidationConstants;
  @Input()
  set ageFilter(filter) {
    const { minAge, maxAge, isAppropriateAge } = filter;
    this.minAgeFormControl.setValue(minAge, { emitEvent: false });
    this.maxAgeFormControl.setValue(maxAge, { emitEvent: false });
    this.isAppropriateAgeControl.setValue(isAppropriateAge, { emitEvent: false });
  }

  minAgeFormControl = new FormControl(null);
  maxAgeFormControl = new FormControl(null);
  isAppropriateAgeControl = new FormControl(false);
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.minAgeFormControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((age: number) => this.store.dispatch(new SetMinAge(age)));

    this.maxAgeFormControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((age: number) => this.store.dispatch(new SetMaxAge(age)));

    this.isAppropriateAgeControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((val: boolean) => this.store.dispatch(new SetIsAppropriateAge(val)));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  clearMin(): void {
    this.minAgeFormControl.reset();
  }

  clearMax(): void {
    this.maxAgeFormControl.reset();
  }
}
