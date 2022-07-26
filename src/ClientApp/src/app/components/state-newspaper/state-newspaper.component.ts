import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StateNewspaper } from 'src/app/core/interfaces/StateNewspaper';
import { StateNewspaperService } from 'src/app/core/services/state-newspaper.service';
import { StateNewspaperModalDialogComponent } from './state-newspaper/state-newspaper-modal.component';

@Component({
  selector: 'app-state-newspaper',
  templateUrl: './state-newspaper.component.html',
  styleUrls: ['./state-newspaper.component.css']
})
export class StateNewspaperComponent implements OnInit {
   stateNewspapers: StateNewspaper[] = [];

  constructor(
    private stateNewspaperService: StateNewspaperService,
    private dialog: MatDialog,
    ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.stateNewspaperService.getData().subscribe(
      {
        next: (result) => {
          this.stateNewspapers = result as StateNewspaper[];
          console.log(this.stateNewspapers);
        }
      });
  }

  onEdit(stateNewspaperId: number){
    const dialogRef = this.dialog.open(StateNewspaperModalDialogComponent,
      {
        data: {
          stateNewspaperId: stateNewspaperId,
          modalTitle: "Редактиране",
          title: "Заглавие",
          content: "Съдържание",
          link: "линк",
          newRecord: false
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

  onAdd(){
    window.alert('Add');

  }

}
