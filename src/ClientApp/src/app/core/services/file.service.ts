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
    uploadFile(formData: FormData, path:string): Observable<HttpEvent<any>> {
  
      let params = new HttpParams().set('path', path);

      const options = {
        params: params,
        reportProgress: true,
      };
  
      const req = new HttpRequest('POST', this.url, formData, options);
      return this.http.request(req);
    }

    deleteFile(fileId: string){
      return this.http.delete(this.url + `/${fileId}`);
    }
}
