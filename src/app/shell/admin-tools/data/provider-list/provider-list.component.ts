import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, filter, takeUntil, startWith, map, skip } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Constants, ModeConstants, PaginationConstants } from '../../../../shared/constants/constants';
import { AdminState } from '../../../../shared/store/admin.state';
import { Provider, ProviderParameters, ProviderStatusUpdateData } from '../../../../shared/models/provider.model';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { BlockProviderById, GetFilteredProviders } from '../../../../shared/store/admin.actions';
import { PopNavPath, PushNavPath } from '../../../../shared/store/navigation.actions';
import { NavBarName } from '../../../../shared/enum/enumUA/navigation-bar';
import { OwnershipTypesEnum } from '../../../../shared/enum/enumUA/provider';
import { SearchResponse } from '../../../../shared/models/search.model';
import { MatDialog } from '@angular/material/dialog';
import { ReasonModalWindowComponent } from './../../../../shared/components/confirmation-modal-window/reason-modal-window/reason-modal-window.component';
import { LicenseStatuses, ProviderStatuses, UserStatusIcons } from '../../../../shared/enum/statuses';
import { NoResultsTitle } from '../../../../shared/enum/enumUA/no-results';
import { ModalConfirmationType } from './../../../../shared/enum/modal-confirmation';
import { ConfirmationModalWindowComponent } from './../../../../shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { DeleteProviderById, UpdateProviderStatus, UpdateProviderLicenseStatuse } from './../../../../shared/store/provider.actions';
import { OwnershipTypes } from '../../../../shared/enum/provider';
import { LicenseStatusTitles, ProviderStatusTitles } from '../../../../shared/enum/enumUA/statuses';
import { Util } from '../../../../shared/utils/utils';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss']
})
export class ProviderListComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;

  readonly noProviders = NoResultsTitle.noResult;
  readonly ModeConstants = ModeConstants;
  readonly OwnershipTypeEnum = OwnershipTypesEnum;
  readonly ownershipTypes = OwnershipTypes;
  readonly statusIcons = UserStatusIcons;
  readonly providerStatuses = ProviderStatuses;
  readonly providerStatusTitles = ProviderStatusTitles;

  readonly blockedStatus = 'Blocked'; //TODO: should be localized

  readonly licenseStatuses = LicenseStatuses;
  readonly licenseStatusTitles = LicenseStatusTitles;

  @Select(AdminState.providers)
  providers$: Observable<SearchResponse<Provider[]>>;
  @Select(AdminState.isLoading)
  isLoadingCabinet$: Observable<boolean>;

  provider: Provider;
  destroy$: Subject<boolean> = new Subject<boolean>();
  isInfoDisplayed: boolean;
  displayedColumns: string[] = [
    'fullTitle',
    'ownership',
    'edrpouIpn',
    'licence',
    'city',
    'street',
    'email',
    'phoneNumber',
    'status',
    'star'
  ];
  filterFormControl: FormControl = new FormControl('');
  dataSource = new MatTableDataSource([{}]);
  currentPage: PaginationElement = PaginationConstants.firstPage;
  totalEntities: number;
  providerParameters: ProviderParameters = {
    searchString: '',
    size: PaginationConstants.TABLE_ITEMS_PER_PAGE
  };

  constructor(private liveAnnouncer: LiveAnnouncer, private store: Store, private matDialog: MatDialog) {}

  ngOnInit(): void {
    this.getProviders();

    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Providers,
        isActive: false,
        disable: true
      })
    );
    this.providers$.pipe(takeUntil(this.destroy$), filter(Boolean)).subscribe((providers: SearchResponse<Provider[]>) => {
      this.dataSource = new MatTableDataSource(providers.entities);
      this.dataSource.sort = this.sort;
      this.totalEntities = providers.totalAmount;
    });

    this.filterFormControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        startWith(''),
        skip(1),
        debounceTime(1000),
        takeUntil(this.destroy$),
        map((value: string) => value.trim())
      )
      .subscribe((searchString: string) => {
        this.providerParameters.searchString = searchString;

        this.currentPage = PaginationConstants.firstPage;
        this.getProviders();
      });
  }

  onViewProviderInfo(provider: Provider): void {
    this.provider = provider;
    this.isInfoDisplayed = true;
  }

  announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  onChangeStatus(provider: Provider, status: ProviderStatuses): void {
    const statusUpdateData = new ProviderStatusUpdateData(provider.id, status);
    if (status === ProviderStatuses.Editing) {
      const dialogRef = this.matDialog.open(ReasonModalWindowComponent, {
        data: { type: ModalConfirmationType.editingProvider }
      });
      dialogRef
        .afterClosed()
        .pipe(filter(Boolean))
        .subscribe((statusReason: string) =>
          this.store.dispatch(new UpdateProviderStatus({ ...statusUpdateData, statusReason }, this.providerParameters))
        );
    } else {
      this.store.dispatch(new UpdateProviderStatus(statusUpdateData, this.providerParameters));
    }
  }

  onLicenseApprove(providerId: string): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      data: { type: ModalConfirmationType.licenseApproved }
    });

    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() =>
        this.store.dispatch(
          new UpdateProviderLicenseStatuse({ providerId, licenseStatus: LicenseStatuses.Approved }, this.providerParameters)
        )
      );
  }

  onDelete(provider: Provider): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.deleteProvider,
        property: provider.fullTitle
      }
    });

    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.store.dispatch(new DeleteProviderById(provider.id, this.providerParameters)));
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getProviders();
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.providerParameters.size = itemsPerPage;
    this.getProviders();
  }

  onBlock(provider: Provider): void {
    if (provider.isBlocked) {
      const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
        width: Constants.MODAL_SMALL,
        data: {
          type: ModalConfirmationType.unBlockProvider,
          property: provider.fullTitle
        }
      });

      dialogRef.afterClosed().subscribe((result: boolean) => {
        result &&
          this.store.dispatch(
            new BlockProviderById(
              {
                id: provider.id,
                isBlocked: false
              },
              this.providerParameters
            )
          );
      });
    } else {
      const dialogRef = this.matDialog.open(ReasonModalWindowComponent, {
        data: { type: ModalConfirmationType.blockProvider }
      });
      dialogRef.afterClosed().subscribe((result: string) => {
        if (result) {
          this.store.dispatch(new BlockProviderById({ id: provider.id, isBlocked: true, blockReason: result }, this.providerParameters));
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }

  private getProviders(): void {
    Util.setFromPaginationParam(this.providerParameters, this.currentPage, this.totalEntities);
    this.store.dispatch(new GetFilteredProviders(this.providerParameters));
  }
}
