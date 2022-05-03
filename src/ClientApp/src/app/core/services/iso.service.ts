import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { IIsoService } from '../interfaces/IsoService';

@Injectable({
  providedIn: 'root',
})
export class IsoService {
  endPoint = this.baseUrl + 'api/isoservice';
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  getData<IIsoService>(): Observable<IIsoService> {
    var params = new HttpParams();
    var currentIsoService = this.http.get<IIsoService>(this.endPoint, { params });
    return currentIsoService;
  }

  deleteIsoServiceItem(isoServiceId: number): any {
    return this.http.delete(this.endPoint + `/${isoServiceId}`);
  }

  updateMenuItem(isoServiceItem: IIsoService): any {
    return this.http.put(this.endPoint + `/${isoServiceItem.id}`, isoServiceItem);
  }

  createMenuItem(menuItem: IIsoService): any {    
    return this.http.post(this.endPoint, menuItem);
  }
}
