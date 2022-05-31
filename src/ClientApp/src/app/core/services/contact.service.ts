import { Injectable, Inject } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Contact } from '../interfaces/Contact'

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  endPoint = this.baseUrl + 'api/contacts'
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
  ) {}

  getData<Contact>(): Observable<Contact> {
    var params = new HttpParams();
    return this.http.get<Contact>(this.endPoint, { params });
  }

  deleteItem(contactId: number): any {
    return this.http.delete(this.endPoint + `/${contactId}`);
  }

  updateItem(contactItem: Contact): Observable<Contact> {
    return this.http
      .put<Contact>(this.endPoint + `/${contactItem.id}`, contactItem);
  }

  createItem(contactItem: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.endPoint, contactItem);
  }
}
