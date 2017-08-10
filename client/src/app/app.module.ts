import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation'

import { AppComponent } from './app.component';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { CampaignSubsetComponent } from './campaign-list/campaign-subset.component';
import { CampaignCreationComponent } from './campaign-creation/campaign-creation.component';
import { CampaignCreationErrorsComponent } from './campaign-creation/campaign-creation-errors.component';
import { CharacterCreationComponent } from './character-creation/character-creation.component';
import { GameComponent } from './game/game.component';

import { BackendService } from './backend.service';
import { SocketService } from './socket.service';
import { AuthGuard } from './auth-guard.service';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    CampaignListComponent,
    CampaignSubsetComponent,
    CampaignCreationComponent,
    CampaignCreationErrorsComponent,
    CharacterCreationComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    CustomFormsModule,
    AppRoutingModule
  ],
  providers: [BackendService, AuthGuard, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
