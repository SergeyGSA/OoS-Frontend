import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FeaturesList } from '../../models/featuresList.model';

@Injectable({
  providedIn: 'root'
})
export class FeatureManagementService {
  constructor(private http: HttpClient) {}

  /**
   * This method get features flags depending on releases
   */
  getFeaturesList(): Observable<FeaturesList> {
    return this.http.get<FeaturesList>('/api/v1/FeatureManagement/Get');
  }
}
