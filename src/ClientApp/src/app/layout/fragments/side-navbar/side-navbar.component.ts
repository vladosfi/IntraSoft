import { Component, OnInit } from '@angular/core';
import { catchError, from, Observable, retry, throwError } from 'rxjs';
import { of } from 'rxjs';
import { Menu } from '../../../core/interfaces/Menu';
import { ShareNavigationDataService } from '../navigation/share-navigation-data.service';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css']
})
export class SideNavbarComponent implements OnInit {
  menuList$ = this.shareDataService.menuList$;
  menuList: Menu[];

  constructor(private shareDataService: ShareNavigationDataService) { }

  ngOnInit() {
    //this.menuList = mnuStr;
    //this.menuList = JSON.parse(JSON.stringify(menuList$));
    this.menuList$
      .subscribe(countries => {
        this.menuList = countries as Menu[]
      })
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
