import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject,  } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class FileService {
  private endPoint = this.baseUrl + 'api/document';
  private headers = new Headers();

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  getFile<DocumentFile>(documentFileId: number): Observable<DocumentFile>{
    var params = new HttpParams();
    this.endPoint += `/${documentFileId}`;

    return this.http.get<DocumentFile>(this.endPoint, { params });
  }

    // file from event.target.files[0]
    uploadFile(formData: FormData, path:string): Observable<HttpEvent<any>> {
  
      //let params = new HttpParams().set('path', path);

      const options = {
        //params: params,
        reportProgress: true,
      };
  
      const req = new HttpRequest('POST', this.endPoint, formData, options);
      return this.http.request(req);
    }

    deleteFile(fileId: number){
      return this.http.delete(this.endPoint + `/${fileId}`);
    }
}
