import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CampaignListComponent } from './campaign-list.component';
import { CharacterCreationComponent } from './character-creation.component';
import { GameComponent } from './game.component';

const routes: Routes = [
  { path: '', component: CampaignListComponent },
  { path: 'character-creation/:id',  component: CharacterCreationComponent },
  { path: 'game/:id', component: GameComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}