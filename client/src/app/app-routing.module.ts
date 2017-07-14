import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { CampaignCreationComponent } from './campaign-creation/campaign-creation.component';
import { CharacterCreationComponent } from './character-creation.component';
import { GameComponent } from './game.component';

const routes: Routes = [
  { path: '', component: CampaignListComponent },
  { path: 'campaign-creation',  component: CampaignCreationComponent },
  { path: 'character-creation/:id',  component: CharacterCreationComponent },
  { path: 'game/:id', component: GameComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
