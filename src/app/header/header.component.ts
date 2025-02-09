import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { RegistrationState } from '../shared/store/registration.state';
import { combineLatest, Observable, Subject } from 'rxjs';
import { delay, filter, takeUntil } from 'rxjs/operators';
import { Logout, Login } from '../shared/store/registration.actions';
import { User } from '../shared/models/user.model';
import { Router } from '@angular/router';
import { NavigationState } from '../shared/store/navigation.state';
import { Navigation } from '../shared/models/navigation.model';
import { Role } from '../shared/enum/role';
import { Languages } from '../shared/enum/languages';
import { SidenavToggle } from '../shared/store/navigation.actions';
import { AppState } from '../shared/store/app.state';
import { FeaturesList } from '../shared/models/featuresList.model';
import { MetaDataState } from '../shared/store/meta-data.state';
import { MainPageState } from '../shared/store/main-page.state';
import { CompanyInformation } from '../shared/models/сompanyInformation.model';
import { GetMainPageInfo } from '../shared/store/main-page.actions';
import { TranslateService } from '@ngx-translate/core';
import { RoleLinks } from '../shared/enum/enumUA/user';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  readonly Languages: typeof Languages = Languages;
  readonly Role: typeof Role = Role;
  readonly RoleLinks = RoleLinks;

  selectedLanguage = localStorage.getItem('ui-culture');
  showModalReg = false;
  userShortName = '';

  @Select(RegistrationState.isAutorizationLoading)
  isAutorizationLoading$: Observable<boolean>;
  @Select(RegistrationState.isRegistered)
  isRegistered$: Observable<boolean>;
  @Select(NavigationState.navigationPaths)
  navigationPaths$: Observable<Navigation[]>;
  @Select(RegistrationState.isAuthorized)
  isAuthorized$: Observable<string>;
  @Select(AppState.isMobileScreen)
  isMobileScreen$: Observable<boolean>;
  isMobileScreen: boolean;
  @Select(RegistrationState.user)
  user$: Observable<User>;
  user: User;
  @Select(MetaDataState.featuresList)
  featuresList$: Observable<FeaturesList>;
  @Select(RegistrationState.subrole)
  subrole$: Observable<string>;
  @Select(MainPageState.headerInfo)
  headerInfo$: Observable<CompanyInformation>;
  headerTitle: string;
  headerSubtitle: string;
  navigationPaths: Navigation[];
  subrole: string;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store, private router: Router, private translate: TranslateService, private dateAdapter: DateAdapter<Date>) {}

  onViewChange(): void {
    this.store.dispatch(new SidenavToggle());
  }

  ngOnInit(): void {
    this.store.dispatch(new GetMainPageInfo());

    combineLatest([this.subrole$, this.navigationPaths$])
      .pipe(takeUntil(this.destroy$), delay(0))
      .subscribe(([subrole, navigationPaths]: [Role, Navigation[]]) => {
        this.subrole = subrole;
        this.navigationPaths = navigationPaths;
      });

    this.isMobileScreen$.pipe(takeUntil(this.destroy$)).subscribe((isMobileScreen: boolean) => (this.isMobileScreen = isMobileScreen));

    this.user$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((user: User) => {
      this.userShortName = this.getFullName(user);
      this.user = user;
    });

    this.headerInfo$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((headerInfo: CompanyInformation) => {
      this.headerTitle = headerInfo.title;
      this.headerSubtitle = headerInfo.companyInformationItems[0].sectionName;
    });
  }

  private getFullName(user: User): string {
    return `${user.lastName} ${user.firstName.slice(0, 1)}.${user.middleName ? user.middleName.slice(0, 1) + '.' : ' '}`;
  }

  onLogout(): void {
    this.store.dispatch(new Logout());
  }

  onLogin(): void {
    this.store.dispatch(new Login(false));
  }

  isRouter(route: string): boolean {
    return this.router.url === route;
  }

  setLanguage(): void {
    this.translate.use(this.selectedLanguage);
    this.dateAdapter.setLocale(this.selectedLanguage);
    localStorage.setItem('ui-culture', this.selectedLanguage);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
