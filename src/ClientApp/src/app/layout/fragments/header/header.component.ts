import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationStart, NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { filter, map, mergeMap, startWith, switchMap } from 'rxjs/operators';
import { Menu } from '../../../core/interfaces/Menu';
import { ShareNavigationDataService } from '../navigation/share-navigation-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menuList$ = this.shareDataService.menuList$;
  menuItem: Menu[];
  isExpanded = false;
  componentTitle: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
private shareDataService: ShareNavigationDataService  ) {
   
    this.router.events.subscribe(data => {
      if (data instanceof ActivationStart) {
        this.componentTitle = data.snapshot.data['title'];
      }

    });
    this.router.events
   .pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(this.router)
   )
    
    this.shareDataService.getData();

  }

  ngOnInit() {
    this.menuList$
      .subscribe(countries => {
        this.menuItem = countries as Menu[]
      })

    this.router.events.subscribe(data => {
      if (data instanceof ActivationStart) {
         console.log(data)
        this.componentTitle = data.snapshot.data['title'];
      }

    });
  }
}
