import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Login} from '../../store/registration.actions';
import {Store} from '@ngxs/store';
import {ModalData} from '../../models/modal-data.model';

@Component({
  selector: 'app-unregistered-user-warning-modal',
  templateUrl: './unregistered-user-warning-modal.component.html',
  styleUrls: ['./unregistered-user-warning-modal.component.scss']
})

export class UnregisteredUserWarningModalComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ModalData, private store: Store) {}

  login(): void {
    this.store.dispatch(new Login(false));
  }
}
