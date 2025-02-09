import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Role } from '../../../../../shared/enum/role';
import { Application } from '../../../../../shared/models/application.model';
import { BlockedParent } from '../../../../../shared/models/block.model';
import { Util } from '../../../../../shared/utils/utils';
import { ApplicationStatuses } from './../../../../../shared/enum/statuses';
import { Constants, ModeConstants } from '../../../../../shared/constants/constants';
import { YearDeclination } from '../../../../../shared/enum/enumUA/declinations/declination';

@Component({
  selector: 'app-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.scss'],
})
export class ApplicationCardComponent implements OnInit {
  readonly applicationStatuses = ApplicationStatuses;
  readonly constants: typeof Constants = Constants;
  readonly role = Role;
  readonly YearDeclination = YearDeclination;
  readonly ModeConstants = ModeConstants;

  blockedParent: BlockedParent;
  childFullName: string;
  userIsAdmin: boolean;
  applicationParams: {
    status: string;
    showBlocked: boolean;
  } = {
    status: undefined,
    showBlocked: false,
  };

  @Input() isMobileView: boolean;
  @Input() application: Application;
  @Input() userRole: string;

  @Output() leave = new EventEmitter();
  @Output() approve = new EventEmitter();
  @Output() reject = new EventEmitter();
  @Output() block = new EventEmitter();
  @Output() unblock = new EventEmitter();
  @Output() sendMessage = new EventEmitter();

  get isApproveBtnHidden(): boolean {
    return (
      this.application.status === ApplicationStatuses.Approved ||
      this.application.status === ApplicationStatuses.Completed ||
      this.application.status === ApplicationStatuses.StudyingForYears
    );
  }

  get childAge(): number {
    return Util.getChildAge(this.application.child);
  }

  ngOnInit(): void {
    this.childFullName = Util.getFullName(this.application.child);

    this.setUserIsAdmin();
  }

  private setUserIsAdmin(): void {
    this.userIsAdmin = this.userRole === Role.ministryAdmin || this.userRole === Role.techAdmin;
  }
}
