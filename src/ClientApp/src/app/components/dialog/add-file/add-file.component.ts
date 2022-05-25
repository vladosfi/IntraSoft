import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IIsoFileCategory } from 'src/app/core/interfaces/IsoFileCategory';
import { IIsoService } from 'src/app/core/interfaces/IsoService';
import { IsoFileCategoryService } from 'src/app/core/services/iso-file-category.service';

export interface DialogData {
  title: string;
  serviceNumber: string;
  serviceName: string;
  serviceId: string;
}

@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.css']
})
export class AddFileComponent implements OnInit {
  isoFileCategories: IIsoFileCategory[];
  isoServiceItem: IIsoService;
  form: FormGroup;


  constructor(
    public dialogRef: MatDialogRef<AddFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private isoFileCategoryService: IsoFileCategoryService,
    private fb: FormBuilder,
  ) {
    
  }

  ngOnInit(): void {
    this.isoFileCategoryService.getCategory().subscribe(
      {
        next: (result) => {
          this.isoFileCategories = result as IIsoFileCategory[];
        }
      });

    this.form = this.fb.group({
      buttonCategories: this.fb.array([]),
      // isoFileCategory: new FormControl('', Validators.required),
    });

    this.addButtonCategory();
  }

  buttonCategories(): FormArray {
    return this.form.get("buttonCategories") as FormArray
  }

  newButtonCategory(): FormGroup {
    return this.fb.group({
      buttonsWithCategory: '',
    })
  }

  addButtonCategory() {
    this.buttonCategories().push(this.newButtonCategory());
  }

  removeButtonCategory(i: number) {
    this.buttonCategories().removeAt(i);
  }

  onCancelClick(): void {
    this.dialogRef.close(this.form.value);
  }
}
