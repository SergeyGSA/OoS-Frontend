import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ApplicationHistory, FilterData, ProviderAdminHistory, ProviderHistory } from '../../models/history-log.model';
import { PaginationElement } from '../../models/paginationElement.model';
import { SearchResponse } from '../../models/search.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryLogService {
  constructor(private http: HttpClient, private store: Store) {}

  setParams(filters: FilterData, searchString: string): HttpParams {
    let params = new HttpParams();

    if (filters?.dateFrom) {
      params = params.set('DateFrom', new Date(filters.dateFrom).toISOString());
    }

    if (filters?.dateTo) {
      params = params.set('DateTo', new Date(filters.dateTo).toISOString());
    }

    if (filters?.options) {
      params = params.set('PropertyName', filters.options);
    }

    if (searchString) {
      params = params.set('SearchString', searchString);
    }

    params = params.set('Size', filters.size.toString()).set('From', filters.from.toString());
    return params;
  }

  getProviderHistory(filters: FilterData, searchString: string): Observable<SearchResponse<ProviderHistory[]>> {
    const body = { params: this.setParams(filters, searchString) };
    return this.http.get<SearchResponse<ProviderHistory[]>>('/api/v1/ChangesLog/Provider', body);
  }
  getProviderAdminHistory(filters: FilterData, searchString: string): Observable<SearchResponse<ProviderAdminHistory[]>> {
    const body = { params: this.setParams(filters, searchString) };
    return this.http.get<SearchResponse<ProviderAdminHistory[]>>('/api/v1/ChangesLog/ProviderAdmin', body);
  }
  getApplicationHistory(filters: FilterData, searchString: string): Observable<SearchResponse<ApplicationHistory[]>> {
    const body = { params: this.setParams(filters, searchString) };
    return this.http.get<SearchResponse<ApplicationHistory[]>>('/api/v1/ChangesLog/Application', body);
  }
}
