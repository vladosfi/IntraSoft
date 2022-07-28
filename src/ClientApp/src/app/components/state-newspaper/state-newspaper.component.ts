import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StateNewspaper } from 'src/app/core/interfaces/StateNewspaper';
import { NotificationService } from 'src/app/core/services/notification.service';
import { StateNewspaperService } from 'src/app/core/services/state-newspaper.service';
import { DeleteDialogComponent } from '../dialog/delete/delete-dialog.component';
import { StateNewspaperModalDialogComponent } from './state-newspaper/state-newspaper-modal.component';

@Component({
  selector: 'app-state-newspaper',
  templateUrl: './state-newspaper.component.html',
  styleUrls: ['./state-newspaper.component.css']
})
export class StateNewspaperComponent implements OnInit {
   stateNewspapers: StateNewspaper[] = [];
   pageTitle = 'ДЪРЖАВЕН ВЕСТНИК'
   lastChanged = Date.now();

  constructor(
    private stateNewspaperService: StateNewspaperService,
    private dialog: MatDialog,
    private snackbar: NotificationService,
    ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.stateNewspaperService.getData().subscribe(
      {
        next: (result) => {
          this.stateNewspapers = result as StateNewspaper[];
        }
      });
  }

  onEdit(id: number){
    const dialogRef = this.dialog.open(StateNewspaperModalDialogComponent,
      {
        data: {
          stateNewspaperId: id,
        },
        width: '70%'
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // const control = this.VOForm.get('VORows') as FormArray;
        // control.insert(0, this.initiateNewRow(result));
        // this.prepairTableView();
        // this.snackbar.infoWitHide('Заповедта беше записана');
      }
    });
  }

  // To Do
  onDelete(id: number): void{

    if (!id) {
      return;
    }

    let dialogRef = this.dialog.open(DeleteDialogComponent, { data: { name: 'Сигурни ли сте, че искате да изтриете записа за: ' + id + '?' } });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true') {
        this.stateNewspaperService.deleteItem(id)
          .subscribe({
            next: () => {
              this.stateNewspapers = this.stateNewspapers.filter(item => item.id != id);
              this.snackbar.success('Записът беше изтрит');
            }
          });
      } else {
        console.log(`Dialog result is: ${result}`);
      }
    });
  }

  onAdd(){
    const dialogRef = this.dialog.open(StateNewspaperModalDialogComponent,
      {
        data: {
          stateNewspaperId: 0,
        },
        width: '70%'
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });

  }

}
