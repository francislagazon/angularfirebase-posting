import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', loadChildren: './forum/dashboard/dashboard#Dashboard' },
    { path: 'category', loadChildren: './forum/category/category#Category' },
    { path: 'users', loadChildren: './user/user#UserComponent' },
    { path: 'users/trash', loadChildren: './user/trash/trash#Trash' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
