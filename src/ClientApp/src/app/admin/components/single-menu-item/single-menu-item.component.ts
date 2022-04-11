import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ShareNavigationDataService } from '../../../navigation/share-navigation-data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Menu } from '../../../core/interfaces/Menu';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MenuService } from 'src/app/core/services/menu.service';
import { EMPTY } from 'rxjs/internal/observable/empty';

@Component({
  selector: 'app-single-menu-item',
  templateUrl: './single-menu-item.component.html',
  styleUrls: ['./single-menu-item.component.css']
})
export class SingleMenuItemComponent implements OnInit, OnDestroy {
  menuItem$ = this.shareDataService.menuItem$;
  menuList$ = this.shareDataService.menuList$;
  // the form model
  form: FormGroup;
  menu: Menu;
  flatedMenu: Menu[];
  @Output() deletedMenuItem = new EventEmitter();

  constructor(
    private shareDataService: ShareNavigationDataService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
    private menuService: MenuService) { }

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
    this.menuItem$.subscribe(
      {
        next: (result) => {
          this.menu = result;
          this.form.patchValue(this.menu);
          this._getAllMenuItems();
        },
        error: (error) => console.error(error),
        complete: () => { console.info('complete') }
      })
  }


  saveMenuItem() {
    var updatedMenu = Object.assign({}, this.form.value);

    this.menuService.updateMenuItem(updatedMenu)
      .subscribe({
        next: () => {
          this.menu = updatedMenu;
          this.snackbar.success('Menu have been saved');
        },
        error: (error) => {
          this.snackbar.error('Failed to save Menu!');
        }
      });
  }

  delete() {
    let dialogRef = this.dialog.open(DialogComponent, { data: { name: 'Are you sure you want to delete menu ' + this.menu.text + '?' } });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true') {
        var res = this.menuService.deleteMenuItem(this.menu.id)
          .subscribe({
            next: () => {
              this.deletedMenuItem.emit();
              this.menu = null;
              this.form.reset();
              this.snackbar.success('Menu has been deleted');
            },
            error: (error) => {
              this.snackbar.error('Failed to delete Menu!');
            }
          });
      } else {
        console.log(`Dialog result is: ${result}`);
      }
    });
  }

  ngOnDestroy(): void {
    this.shareDataService.menuItem$ = EMPTY;
  }

  private _getAllMenuItems() {
    this.menuList$.subscribe(
      {
        next: (items) => {
          this.flatedMenu = this._createFlatArrayUsingMap(items, this.menu?.id);
          this.form.controls['parentId'].setValue(this.menu?.parentId, { onlySelf: true });
        },
        error: (error) => console.error(error)
      });
  }

  private _createFlatArrayUsingMap(item: any, menuId: number): Menu[] {
    if (!item) {
      return;
    }

    let flatedMenusItems: Menu[] = [];

    for (var i = 0; i < item.length; i++) {
      let recursiveFn = (mnuItem) => {
        if (mnuItem.id && mnuItem.text) {
          //const { children, parentId, ...rest } = mnuItem;
          const { ...rest } = mnuItem;
          if (menuId !== rest.id) {
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
