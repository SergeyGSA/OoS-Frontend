import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from '../../../../shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from '../../../../shared/constants/constants';
import { ModalConfirmationType } from '../../../../shared/enum/modal-confirmation';
import { MarkFormDirty } from '../../../../shared/store/app.actions';
import { AppState } from '../../../../shared/store/app.state';

@Injectable({
  providedIn: 'root'
})
export class CreateGuard implements CanDeactivate<unknown> {
  result: boolean;
  constructor(private matDialog: MatDialog, private store: Store) {}

  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isDirty = this.store.selectSnapshot<boolean>(AppState.isDirtyForm);

    if (isDirty) {
      const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
        width: Constants.MODAL_SMALL,
        data: {
          type: ModalConfirmationType.leavePage
        }
      });
      dialogRef
        .afterClosed()
        .pipe(takeWhile(() => isDirty))
        .subscribe((response) => response && this.store.dispatch(new MarkFormDirty(false)));

      return dialogRef.afterClosed();
    } else {
      return true;
    }
  }
}
