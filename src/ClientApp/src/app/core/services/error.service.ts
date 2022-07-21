import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  endPoint = this.baseUrl + 'api/errorlogs';

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
  ) {

  }

  getClientErrorMessage(error: Error): string {
    return error.message ?
           error.message :
           error.toString();
  }

  getServerErrorMessage(error: HttpErrorResponse): string {
    return navigator.onLine ?
           error.message :
           'No Internet Connection';
  }

  getData<ErrorLog>(): Observable<ErrorLog> {
    var params = new HttpParams();
    return this.http.get<ErrorLog>(this.endPoint, { params });
  }

  deleteItem(logId: number): any {
    return this.http.delete(this.endPoint + `/${logId}`);
  }
}
