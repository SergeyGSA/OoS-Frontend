import { Subject } from 'rxjs';

import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';

import { ProviderStatusDetails, ProviderStatusTitles } from '../../enum/enumUA/statuses';
import { ProviderStatuses, UserStatuses, UserStatusIcons } from '../../enum/statuses';
import { Provider } from '../../models/provider.model';
import { ActivateEditMode } from '../../store/app.actions';

@Component({
  selector: 'app-provider-status-banner',
  templateUrl: './provider-status-banner.component.html',
  styleUrls: ['./provider-status-banner.component.scss']
})
export class ProviderStatusBannerComponent implements OnInit {
  public readonly statuses = ProviderStatuses;

  @Input() public provider: Provider;

  private get HostElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  public editLink = '/create-provider/info';
  public iconClasses: string;
  public statusTitle: string;
  public statusDetails: string;

  constructor(private elementRef: ElementRef<HTMLElement>, private store: Store) {}

  public ngOnInit(): void {
    this.setBannerOptions();
  }

  public onActivateEditMode(): void {
    this.store.dispatch(new ActivateEditMode(true));
  }

  public onClose(): void {
    this.HostElement.classList.add('hide');
  }

  private setBannerOptions(): void {
    if (this.provider.isBlocked) {
      this.iconClasses = `${UserStatusIcons.Blocked} status-icon`;
      this.statusTitle = ProviderStatusTitles[UserStatuses.Blocked];
      this.statusDetails = this.provider.blockReason ? this.provider.blockReason : ProviderStatusDetails[UserStatuses.Blocked];
      this.HostElement.classList.value = ProviderStatuses[UserStatuses.Blocked];
    } else {
      this.iconClasses = `${UserStatusIcons[this.provider.status]} status-icon`;
      this.statusTitle = ProviderStatusTitles[this.provider.status];
      this.statusDetails = this.provider.statusReason ? this.provider.statusReason : ProviderStatusDetails[this.provider.status];
      this.HostElement.classList.value = ProviderStatuses[this.provider.status];
    }
  }
}
