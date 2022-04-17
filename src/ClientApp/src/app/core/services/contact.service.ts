import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Contact } from '../interfaces/Contact';


@Injectable({
  providedIn: 'root',
})
export class ContactService {
  url = this.baseUrl + 'api/contact';
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  getData<Contact>(): Observable<Contact> {
    var params = new HttpParams();
    return this.http.get<Contact>(this.url, { params });
  }

  deleteContactItem(contactId: number): any {
    //return this.http.delete(this.url + `/${contactId}`);
  }

  updateContactItem(contactItem: Contact): any {
    //return this.http.put(this.url + `/${contactItem.id}`, menuItem);
  }

  createContactItem(contactItem: Contact): any {
    //return this.http.post(this.url, contactItem);
  }
}
