import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StateNewspaper } from 'src/app/core/interfaces/StateNewspaper';
import { StateNewspaperService } from 'src/app/core/services/state-newspaper.service';

export interface DialogData {
  modalTitle: string;
  title: string;
  content: string;
  link: string;
  currentStateNewspaperId: number;
}


@Component({
  selector: 'app-modal-dialog',
  templateUrl: './state-newspaper-modal.component.html',
  styleUrls: ['./state-newspaper-modal.component.css']
})
export class StateNewspaperModalDialogComponent implements OnInit {
  stateNewspaper: StateNewspaper;

  form: FormGroup;


  constructor(
    private stateNewspaperService: StateNewspaperService,
    public dialogRef: MatDialogRef<StateNewspaperModalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
  ) {

    if (this.data.currentStateNewspaperId != null) {
      this.stateNewspaperService.getItemById(this.data.currentStateNewspaperId).subscribe(
        {
          next: (result) => {
            this.stateNewspaper = result as StateNewspaper;
            this.data.title = this.stateNewspaper.title;
            this.data.content = this.stateNewspaper.link;
          }
        });
    }
  }


  buttonCategories(): FormArray {
    return this.form.get("buttonCategories") as FormArray
  }

  onSubmit() {
    console.log(this.form.value);
  }



  ngOnInit(): void {
    this.form = this.fb.group({
      title: new FormControl(this.data.title = ! null ? this.data.title : '', Validators.required),
      content: new FormControl(this.data.content = ! null ? this.data.content : '', Validators.required),
      link: new FormControl(this.data.link = ! null ? this.data.link : '', Validators.required),
    });
  }

  onSaveClick(): void {
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    const { id, title, content, link } = this.form.value;

    this.stateNewspaper = Object.assign({},
      {
        id: id == null ? null : id,
        title: title,
        content: content,
        link: link,
      });


    if (id == null) {
      this.stateNewspaperService.createItem(this.stateNewspaper)
        .subscribe({
          next: (result) => {
            this.stateNewspaper = Object.assign(this.stateNewspaper, result);
            this.onCancelClick();
          }
        });
    }
    else {
      this.stateNewspaperService.updateItem(this.stateNewspaper)
        .subscribe({
          next: (result) => {
            this.stateNewspaper = Object.assign(this.stateNewspaper, result);
            this.onCancelClick();
          }
        });
    }

  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
