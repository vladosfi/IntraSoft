import { Injectable, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class FileService {
  private endPoint = this.baseUrl;
  private headers = new Headers();
  private renderer: Renderer2;

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    rendererFactory: RendererFactory2,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  downloadFile(id: string, pathToFile: string) {
    const link = this.renderer.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', `${pathToFile}/${id}/true`);
    //link.setAttribute('href',  `api/documents/${id}`);
    link.click();
    link.remove();
  }

  uploadFile(formData: FormData, endPointPath: string, newItem: boolean = false): Observable<HttpEvent<any>> {
    //var path = formData.get('path') as string;
    //let params = new HttpParams().set('path', path);

    const options = {
      //params: params,
      reportProgress: true,
    };

    if (newItem) {
      const req = new HttpRequest('POST', this.endPoint + endPointPath, formData, options);
      return this.http.request(req);
    } else {
      const req = new HttpRequest('PUT', this.endPoint + endPointPath + '/' + formData.get('id'), formData, options);
      return this.http.request(req);
    }

  }

  deleteFile(fileId: string, endPointPath: string) {
    return this.http.delete(this.endPoint + endPointPath + `/${fileId}`);
  }
}
