import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { Header } from './layout/header/header';
import { Sidebar } from './layout/sidebar/sidebar';

import { Dashboard } from './forum/dashboard/dashboard';
import { Category } from './forum/category/category';
import { PostComponent } from './forum/post/post';
import { PostEditForm } from './forum/post/modal/post.edit.form';

import { SharedService } from './provider/shared.service';

import { environment } from '../environments/environment';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FirebaseBackendModule } from './../firebase-backend/firebase-backend.module';


const appRoutes:Routes = [
  { path: "", component: Dashboard },
  { path: "post", component: PostComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    Header,
    Sidebar,
    Dashboard,
    Category,
    PostComponent,
    PostEditForm
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes, { useHash : false }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    FirebaseBackendModule
  ],
  providers: [SharedService],
  bootstrap: [AppComponent],
  entryComponents: [PostEditForm]
})
export class AppModule { }
