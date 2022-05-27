import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

/*import { AppRoutingModule } from './app-routing.module';*/

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuItemComponent } from './navigation/header/menu-item/menu-item.component';
import { RoutingModule } from './routing/routing.module';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './navigation/header/header.component';
import { MaterialModule } from './material/material.module';
import { AngularMaterialMenuComponent } from './navigation/angular-material-menu/angular-material-menu.component';
import { MenuItemAMComponent } from './navigation/angular-material-menu/menu-item/menu-item.component';
import { MenuComponent } from './admin/components/menu/menu.component';
import { SingleMenuItemComponent } from './admin/components/single-menu-item/single-menu-item.component';
import { ContactComponent } from './components/contact/contact.component';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import { DisableControlDirective } from './core/directives/disable-control.directive';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UploadButtonComponent } from './components/upload-button/upload-button.component';
import { EllipsifyMeDirective } from './core/directives/ellipsify-me.directive';
import { IsoListComponent } from './components/iso-list/iso-list.component';
import { UploadFileWithCategoryComponent } from './components/upload-file-with-category/upload-file-with-category.component';
import { ModalDialogComponent } from './components/dialog/modal/modal-dialog.component';
import { FooterComponent } from './components/footer/footer.component';
import { AddFileComponent } from './components/dialog/add-file/add-file.component';
import { DeleteDialogComponent } from './components/dialog/delete/delete-dialog.component';
import { fullNameValidatorDirective } from './shared/full-name-validator.directive';
import {IMaskModule} from 'angular-imask';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuItemComponent,
    HeaderComponent,
    AngularMaterialMenuComponent,
    MenuItemAMComponent,
    MenuComponent,
    SingleMenuItemComponent,
    DeleteDialogComponent,
    ModalDialogComponent,
    ContactComponent,
    DisableControlDirective,
    NotFoundComponent,
    UploadButtonComponent,
    UploadFileWithCategoryComponent,
    EllipsifyMeDirective,
    IsoListComponent,
    FooterComponent,
    AddFileComponent,
    fullNameValidatorDirective,
  ],
  entryComponents:[
    DeleteDialogComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    RoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    IMaskModule,
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
