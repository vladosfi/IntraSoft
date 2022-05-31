import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Department } from 'src/app/core/interfaces/Department';
import { IIsoFileCategory } from 'src/app/core/interfaces/IsoFileCategory';
import { IIsoService } from 'src/app/core/interfaces/IsoService';
import { DepartmentService } from 'src/app/core/services/department.service';
import { IsoFileCategoryService } from 'src/app/core/services/iso-file-category.service';
import { IsoService } from 'src/app/core/services/iso.service';

export interface DialogData {
  title: string;
  serviceNumber: string;
  serviceName: string;
  department: string;
}


@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.css']
})
export class ModalDialogComponent implements OnInit {
  //form: FormGroup;
  departments: Department[];
  isoFileCategories: IIsoFileCategory[];
  isoServiceItem: IIsoService;

  categoryForm: FormGroup;


  constructor(
    public dialogRef: MatDialogRef<ModalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private departmentService: DepartmentService,
    private isoFileCategoryService: IsoFileCategoryService,
    private isoService: IsoService,
    private fb:FormBuilder,
  ) {

    this.categoryForm = this.fb.group({
      number: new FormControl(this.data.serviceNumber, Validators.required),
      name: new FormControl(this.data.serviceName, Validators.required),
      department: new FormControl('', Validators.required),
      buttonCategories: this.fb.array([]),
    });

   }

  
   buttonCategories() : FormArray {
    return this.categoryForm.get("buttonCategories") as FormArray
  }
   
  newButtonCategory(): FormGroup {
    return this.fb.group({
      buttonsWithCategory: '',
    })
  }
   
  addButtonCategory() {
    this.buttonCategories().push(this.newButtonCategory());
  }
   
  removeButtonCategory(i:number) {
    this.buttonCategories().removeAt(i);
  }
   
  onSubmit() {
    console.log(this.categoryForm.value);
  }



  ngOnInit(): void {
    this.departmentService.getAll().subscribe(
      {
        next: (result) => {
          this.departments = result as Department[];
          this.departments = this.departments.slice(1);
        }
      });

    this.isoFileCategoryService.getItem().subscribe(
      {
        next: (result) => {
          this.isoFileCategories = result as IIsoFileCategory[];
        }
      });

      this.categoryForm = this.fb.group({
      number: new FormControl(this.data.serviceNumber, Validators.required),
      name: new FormControl(this.data.serviceName, Validators.required),
      department: new FormControl('', Validators.required),
      buttonCategories: this.fb.array([]),
      // isoFileCategory: new FormControl('', Validators.required),
    });
  }

  onSaveClick(): void {
    // stop here if form is invalid
    if (this.categoryForm.invalid) {
      return;
    }
    
    const { name, number, department } = this.categoryForm.value;

    this.isoServiceItem = Object.assign({}, 
        {
          id: null,
          name: name, 
          number: number, 
          departmentId: department.id,
          isoFiles: null,
        });
    

    this.isoService.createItem(this.isoServiceItem)
      .subscribe({
        next: (result) => {
          this.isoServiceItem = Object.assign(this.isoServiceItem, result);
        },
        error: (error) => {
          console.error('Failed to save iso service!');
        }
      });



    //this.dialogRef.close();
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
