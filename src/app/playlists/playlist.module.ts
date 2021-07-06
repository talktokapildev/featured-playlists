import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { PlaylistComponent } from './playlist.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PlaylistComponent,
      },
    ]),
    CommonModule,
  ],
  declarations: [PlaylistComponent],
})
export class PlaylistModule {}
