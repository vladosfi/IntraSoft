import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class IsoFileCategoryService {
  endPoint = this.baseUrl + 'api/isofilecategories';
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  getCategory<IsoFileCategory>(): Observable<IsoFileCategory> {
    var currentIsoFileCategory = this.http.get<IsoFileCategory>(this.endPoint);
    return currentIsoFileCategory;
  }
}
