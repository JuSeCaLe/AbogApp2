import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Memorials } from './memorials';

const routes: Routes = [
  { path: '', component: Memorials }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemorialsRoutingModule { }
