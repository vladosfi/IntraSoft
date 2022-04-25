import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject,  } from 'rxjs';
import {  map,catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private url = this.baseUrl + 'api/document';
  private headers = new Headers();

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

    // file from event.target.files[0]
    uploadFile(file: File): Observable<HttpEvent<any>> {
      
      let formData = new FormData();
      formData.append('file', file);
  
      let params = new HttpParams()
          .set('path', 'uploads/menu');

      const options = {
        params: params,
        reportProgress: true,
      };
  
      const req = new HttpRequest('POST', this.url, formData, options);
      return this.http.request(req);
    }
}
