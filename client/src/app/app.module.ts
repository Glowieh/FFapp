import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { CampaignSubsetComponent } from './campaign-list/campaign-subset.component';
import { CampaignCreationComponent } from './campaign-creation.component';
import { CharacterCreationComponent } from './character-creation.component';
import { GameComponent } from './game.component';

import { BackendService } from './backend.service';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    CampaignListComponent,
    CampaignSubsetComponent,
    CampaignCreationComponent,
    CharacterCreationComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [BackendService],
  bootstrap: [AppComponent]
})
export class AppModule { }
