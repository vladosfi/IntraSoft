import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

/*import { AppRoutingModule } from './app-routing.module';*/

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuItemComponent } from './navigation/menu-item/menu-item.component';
import { RoutingModule } from './routing/routing.module';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './navigation/header/header.component';
import { MaterialModule } from './material/material.module';
import { AngularMaterialMenuComponent } from './navigation/angular-material-menu/angular-material-menu.component';
import { MenuItemAMComponent } from './navigation/angular-material-menu/menu-item/menu-item.component';
import { MenuComponent } from './admin/components/menu/menu.component';
import { SingleMenuItemComponent } from './admin/components/single-menu-item/single-menu-item.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { ContactComponent } from './components/contact/contact.component';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import { DisableControlDirective } from './core/directives/disable-control.directive';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UploadButtonComponent } from './components/upload-button/upload-button.component';


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
    DialogComponent,
    ContactComponent,
    DisableControlDirective,
    NotFoundComponent,
    UploadButtonComponent,
  ],
  entryComponents:[
    DialogComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    RoutingModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
