import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder,ReactiveFormsModule,  FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HomeItem } from 'src/app/core/interfaces/Home';
import { HomeService } from 'src/app/core/services/home.service';

export interface DialogData {
  title: string;
  content: string;
}


@Component({
  selector: 'app-home-modal-dialog',
  templateUrl: './home-modal.component.html',
  styleUrls: ['./home-modal.component.css']
})
export class HomeModalDialogComponent implements OnInit {
  homeItem: HomeItem = {} as HomeItem;
  form: FormGroup;
  itemId = 1;


  constructor(
    public dialogRef: MatDialogRef<HomeModalDialogComponent>,
    private homeService: HomeService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.homeItem.content = this.data.content;

    this.form = this.fb.group({
      content: new FormControl('', Validators.required),
    });

    this.prepairForm();
  }


  onSubmit() {
    console.log(this.form.value);
  }

  prepairForm() {
    this.form = this.fb.group({
      content: new FormControl(this.data.content = ! null ? this.data.content : '', Validators.required),
    });
  }

  onSaveClick(): void {
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    const { content } = this.form.value;

    this.homeItem = Object.assign({},
      {
        id: this.itemId,
        content: content,
        orders: null,
        isoServices: null,
        stateNewspapers: null,
      });


      this.homeService.updateItem(this.homeItem)
        .subscribe({
          next: (result) => {
            this.homeItem = Object.assign(this.homeItem, result);
            this.onCancelClick();
          }
        });

  }

  onCancelClick(): void {
    this.dialogRef.close(this.homeItem);
  }
}
