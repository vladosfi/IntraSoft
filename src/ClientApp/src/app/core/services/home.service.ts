import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HomeItem } from '../interfaces/Home';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  endPoint = this.baseUrl + 'api/home';
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  getIsoServices(): Observable<HomeItem[]> {
    var params = new HttpParams();

    return this.http.get<HomeItem[]>(this.endPoint, { params })
      .pipe(map(result => result as HomeItem[]));
  }
}
