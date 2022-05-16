import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit {
  addServiceForm: FormGroup;
  departments: Department[];
  isoFileCategories: IIsoFileCategory[];
  isoServiceItem: IIsoService;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private departmentService: DepartmentService,
    private isoFileCategoryService: IsoFileCategoryService,
    private isoService: IsoService,
  ) { }


  ngOnInit(): void {
    this.departmentService.getData().subscribe(
      {
        next: (result) => {
          this.departments = result as Department[];
          this.departments = this.departments.slice(1);
        }
      });

    this.isoFileCategoryService.getCategory().subscribe(
      {
        next: (result) => {
          this.isoFileCategories = result as IIsoFileCategory[];
        }
      });

    this.addServiceForm = new FormGroup({
      number: new FormControl(this.data.serviceNumber, Validators.required),
      name: new FormControl(this.data.serviceName, Validators.required),
      department: new FormControl('', Validators.required),
      // isoFileCategory: new FormControl('', Validators.required),
    });
  }

  onSaveClick(): void {
    // stop here if form is invalid
    if (this.addServiceForm.invalid) {
      return;
    }
    
    const { name, number, department } = this.addServiceForm.value;

    this.isoServiceItem = Object.assign({}, 
        {
          id: null,
          name: name, 
          number: number, 
          departmentId: department.id,
          isoFiles: null,
        });
    

    this.isoService.createIsoItem(this.isoServiceItem)
      .subscribe({
        next: (result) => {
          console.log(result);
        },
        error: (error) => {
          console.error('Failed to save iso service!');
        }
      });



    //this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
