import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { GetAllApplications } from '../../../../shared/store/shared-user.actions';
import { ApplicationEntityType } from '../../../../shared/enum/applications';
import { ApplicationFilterParameters } from '../../../../shared/models/application.model';
import { CabinetDataComponent } from '../../../../shell/personal-cabinet/shared-cabinet/cabinet-data.component';
import { MatDialog } from '@angular/material/dialog';
import { NavBarName } from '../../../../shared/enum/enumUA/navigation-bar';
import { PushNavPath } from '../../../../shared/store/navigation.actions';
import { PaginationConstants } from '../../../../shared/constants/constants';

@Component({
  selector: 'app-admin-applications',
  templateUrl: './admin-applications.component.html',
  styleUrls: ['./admin-applications.component.scss']
})
export class AdminApplicationsComponent extends CabinetDataComponent implements OnInit {
  applicationParams: ApplicationFilterParameters = {
    property: ApplicationEntityType.provider,
    statuses: [],
    workshops: [],
    children: [],
    showBlocked: false,
    size: PaginationConstants.APPLICATIONS_PER_PAGE,
    from: 0
  };

  constructor(protected store: Store, protected matDialog: MatDialog) {
    super(store, matDialog);
  }

  init(): void {}

  onGetApplications(): void {
    this.store.dispatch(new GetAllApplications(this.applicationParams));
  }

  protected addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Applications,
        isActive: false,
        disable: true
      })
    );
  }
}
