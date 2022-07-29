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
  stateNewspaperId: number;
  createdOn: string;
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

    if (this.data.stateNewspaperId != 0) {
      this.stateNewspaperService.getItemById(this.data.stateNewspaperId).subscribe(
        {
          next: (result) => {
            this.stateNewspaper = result as StateNewspaper;
            this.data.title = this.stateNewspaper.title;
            this.data.content = this.stateNewspaper.content;
            this.data.link = this.stateNewspaper.link;
            this.data.createdOn = this.stateNewspaper.createdOn;
            this.prepairForm();
          }
        });
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: new FormControl(0 , Validators.required),
      title: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
      link: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    console.log(this.form.value);
  }

  prepairForm() {
    this.form = this.fb.group({
      id: new FormControl(this.data.stateNewspaperId = !0 ? this.data.stateNewspaperId : 0, Validators.required),
      title: new FormControl(this.data.title = ! null ? this.data.title : '', Validators.required),
      content: new FormControl(this.data.content = ! null ? this.data.content : '', Validators.required),
      link: new FormControl(this.data.link = ! null ? this.data.link : '', Validators.required),
      createdOn: new FormControl(this.data.createdOn = ! null ? this.data.createdOn : '', Validators.required),
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
        id: id == 0 ? 0 : id,
        title: title,
        content: content,
        link: link,
        createdOn: null,
      });


    if (id == 0) {
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
