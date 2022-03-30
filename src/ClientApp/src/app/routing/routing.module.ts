import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTreeModule } from '@angular/material/tree';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeComponent } from '../components/home/home.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MainShellComponent } from '../layout/fragments/main-shell/main-shell.component';

//const routes: Routes = [
//  { path: 'home', component: HomeComponent },
//  { path: '', redirectTo: '/home', pathMatch: 'full' }
//];


const routes: Routes = [
  {
    path: '',
    component: MainShellComponent,
    children: [
      {
        path: '', pathMatch: 'full',
        component: HomeComponent
      }]
  }]

@NgModule({
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatTreeModule,
    FlexLayoutModule,
    MatExpansionModule,
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
    MatTabsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatTreeModule,
    MatExpansionModule,
    FlexLayoutModule
  ],
  declarations: []
})
export class AppRoutingModule { }
