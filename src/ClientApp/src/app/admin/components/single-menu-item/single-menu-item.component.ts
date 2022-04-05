import { Component, Input, OnInit } from '@angular/core';
import { ShareNavigationDataService } from '../../../navigation/share-navigation-data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Menu } from '../../../core/interfaces/Menu';

@Component({
  selector: 'app-single-menu-item',
  templateUrl: './single-menu-item.component.html',
  styleUrls: ['./single-menu-item.component.css']
})
export class SingleMenuItemComponent implements OnInit {
  menuItem$ = this.shareDataService.menuItem$;
  // the form model
  form: FormGroup;
  menu: Menu;
  id?: number;

  constructor(private shareDataService: ShareNavigationDataService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      id: new FormControl(''),
      text: new FormControl('', Validators.required),
      icon: new FormControl('',),
      routerLink: new FormControl('',),
      parentId: new FormControl('',),
    });

    this.loadData();
  }

  loadData() {
    // retrieve the ID from the 'id' parameter
    //var id = +this.activatedRoute.snapshot.paramMap.get('id');
    this.menuItem$.subscribe(result => {
      this.menu = result;
      this.form.patchValue(this.menu);
    }, error => console.error(error));
  }


  onSubmit() {

  }
}
