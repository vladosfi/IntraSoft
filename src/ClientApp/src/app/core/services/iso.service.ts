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

  getIsoServices(): Observable<IIsoService[]> {
    var params = new HttpParams();

    return this.http.get<IIsoService[]>(this.endPoint, { params })
      .pipe(map(result => result as IIsoService[]));
  }

  getIsoServiceById<IIsoService>(id: number): Observable<IIsoService> {
    var params = new HttpParams();
    return this.http.get<IIsoService>(this.endPoint + '/' + id, { params }).pipe(map(result => result as IIsoService));
  }

  getIsoFileCategoryServices<IsoFileCategory>(): Observable<IsoFileCategory> {
    var currentIsoFileCategory = this.http.get<IsoFileCategory>(this.baseUrl + 'api/isofilecategory');
    return currentIsoFileCategory;
  }

  deleteIsoServiceItem(isoServiceId: number): any {
    return this.http.delete(this.endPoint + `/${isoServiceId}`);
  }

  updateIsoItem(isoServiceItem: IIsoService): any {
    return this.http.put(this.endPoint + `/${isoServiceItem.id}`, isoServiceItem);
  }

  createIsoItem(isoItem: IIsoService): any {
    return this.http.post(this.endPoint, isoItem);
  }
}
