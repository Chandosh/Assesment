import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranscriptComponent } from './components/transcript/transcript.component';


const routes: Routes = [
  {path: '',
  component: TranscriptComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
