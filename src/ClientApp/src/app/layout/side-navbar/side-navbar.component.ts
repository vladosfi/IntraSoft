import { Component, OnInit } from '@angular/core';
import { catchError, from, Observable, retry, throwError } from 'rxjs';
import { IMenu } from '../../core/interfaces/Menu';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css']
})
export class SideNavbarComponent implements OnInit {

  menuList: Observable<IMenu[]>;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    //this.menuList = mnuStr;
    this.menuList = this.get<IMenu[]>("/assets/menu.json");
  }

  // HttpClient API get() method => Fetch details
  get<T>(url: string) {
    return this.httpClient.get<T>(`http://localhost:4200/${url}`).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }


  //getEmployees(): Observable<IMenu[]> {
  
  //  //return from(mnuStr); // <-- changed
  //}

  //getEmployees(userInfo: any): Observable<IMenu[]> { // <-- changed
  //  return Observable.of(mnuStr); // <-- changed
  ////...

 
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}


const mnuStr = [{
  'text': 'Dashboard',
  'icon': 'dashboard',
  'routerLink': '/'
},
{
  'text': 'Customer',
  'icon': 'people',
  'routerLink': '/customer/manage'
},
{
  'text': 'Supplier',
  'icon': 'supervised_user_circle',
  'routerLink': '/supplier/manage'
},
{
  'text': 'Suit',
  'icon': 'inventory_2',
  'children': [{
    'text': 'Category',
    'icon': 'category',
    'routerLink': '/product/category'
  },
  {
    'text': 'Sub Category',
    'icon': 'layers',
    'routerLink': '/product/sub-category'
  },
  {
    'text': 'Product',
    'icon': 'all_inbox',
    'routerLink': '/product/manage'
  }
  ]
},
{
  'text': 'Expense',
  'icon': 'inventory_2',
  'children': [{
    'text': 'Category',
    'icon': 'category',
    'routerLink': '/product/category'
  },
  {
    'text': 'Manage Expense',
    'icon': 'layers',
    'routerLink': '/product/sub-category'
  },
  {
    'text': 'Statement',
    'icon': 'all_inbox',
    'routerLink': '/product/manage'
  }
  ]
},
{
  'text': 'Purchases',
  'icon': 'receipt',
  'children': [{
    'text': 'New Purchases',
    'icon': 'local_atm',
    'routerLink': '/purchases/new'
  },
  {
    'text': 'Purchases History',
    'icon': 'history',
    'routerLink': '/purchases/history'
  }
  ]
},
{
  'text': 'Sales',
  'icon': 'calculate',
  'children': [{
    'text': 'New Sales',
    'icon': 'point_of_sale',
    'routerLink': '/sales/add'
  },
  {
    'text': 'Sales History',
    'icon': 'history',
    'routerLink': '/sales/history'
  }
  ]
},
{
  'text': 'Report',
  'icon': 'analytics',
  'routerLink': '/reports'
}
];
