import { Injectable } from '@angular/core';
import { CanLoad, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { filter, map } from 'rxjs/operators';
import { RegistrationState } from '../../../shared/store/registration.state';
import { Role } from '../../../shared/enum/role';

@Injectable({
  providedIn: 'root'
})
export class ProviderGuard implements CanLoad {
  @Select(RegistrationState.role)
  role$: Observable<string>;

  constructor(public store: Store) {}

  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.role$.pipe(
      filter((role: string) => role === Role.provider),
      map((role: string) => role === Role.provider)
    );
  }
}
