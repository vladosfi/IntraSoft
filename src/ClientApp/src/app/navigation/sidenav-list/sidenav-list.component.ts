import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ShareNavigationDataService } from '../share-navigation-data.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();
  menuList$ = this.shareDataService.menuList$;


  constructor(
    private shareDataService: ShareNavigationDataService
  ) {

  }

  ngOnInit(): void {
  }


  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

}
