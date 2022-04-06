import { Component, Input, OnInit } from '@angular/core';
import { ShareNavigationDataService } from '../../../navigation/share-navigation-data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Menu } from '../../../core/interfaces/Menu';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';

@Component({
  selector: 'app-single-menu-item',
  templateUrl: './single-menu-item.component.html',
  styleUrls: ['./single-menu-item.component.css']
})
export class SingleMenuItemComponent implements OnInit {
  menuItem$ = this.shareDataService.menuItem$;
  menuList$ = this.shareDataService.menuList$;
  // the form model
  form: FormGroup;
  menu: Menu;
  flatedMenu: Menu[];

  constructor(
    private shareDataService: ShareNavigationDataService,
    private snackbar: SnackbarService,
    private dialog: MatDialog) { }

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
    // let id = +this.activatedRoute.snapshot.paramMap.get('id');
    this.menuItem$.subscribe(
      { 
        next: (result) => {
          this.menu = result;
          this.form.patchValue(this.menu);
          this._getAllMenuItems();
        },
        error: (error) => console.error(error), 
        complete: () => {console.info('complete') }
      })
  }


  onSubmit() {

  }

  openDialog(){
    let dialogRef = this.dialog.open(DialogComponent, {data: {name: 'Vlad'}});
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result is: ${result}`);
    });
  }

  onDelete(message){
    // //let snackBarRef = this.snackBar.open(message,action, {duration: 2000});
    // let snackBarRef = this.snackBar.open(message,action,{panelClass: ["color:white;"]});

    // snackBarRef.afterDismissed().subscribe(() => {
    //   console.log('The snackbar was dismissed');
    // });

    // snackBarRef.onAction().subscribe(() => {
    //   console.log('The snackbar action was triggered!');
    // });

    this.snackbar.info(message);
  }

  private _getAllMenuItems(){
    this.menuList$.subscribe(
      {
      next: (items) => {
        this.flatedMenu = this._createFlatArrayUsingMap(items,this.menu?.id);
        this.form.controls['parentId'].setValue(this.menu?.parentId, {onlySelf: true});
      },
      error: (error) => console.error(error)
    });    
  }

  private _createFlatArrayUsingMap(item: any, menuId: number) : Menu[]{
    let flatedMenusItems: Menu[] = [];
    if(!item) {
      return;
    }

    for (var i = 0; i < item.length; i++) {
      let recursiveFn = (mnuItem) => {
        if (mnuItem.id && mnuItem.text) {
          const { children, parentId, ...rest } = mnuItem;
          if(menuId !== rest.id){
            flatedMenusItems.push(rest);
          }
        }
        mnuItem.children.map(recursiveFn)
      }
      recursiveFn(item[i]);
    }
    return flatedMenusItems;
  }
}
