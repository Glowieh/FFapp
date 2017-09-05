import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { BackendService } from '../backend.service';
import { Campaign } from '../misc/campaign';
import { Character } from '../misc/character';

import 'rxjs/add/operator/switchMap';


@Component({
  selector: 'character-creation',
  templateUrl: './character-creation.component.html',
  styleUrls: ['./character-creation.component.css']
})
export class CharacterCreationComponent {
  character = new Character();
  campaign: Campaign;
  campaignId: string;
  errorMsg: string = "";
  dataAvailable: boolean;

  constructor(
    private backendService: BackendService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.campaignId = this.route.snapshot.paramMap.get('id');

    this.backendService.getCampaign(this.campaignId)
    .then(result => {
      this.campaign = result;
      this.character.campaignId = this.campaignId;
      this.character.gold = this.campaign.initialGold;
      this.character.provisions = this.campaign.initialProvisions;
      this.character.items = this.campaign.initialItems;

      return this.backendService.getCharacter(this.campaignId);
    },
    () => {
      this.errorMsg = "Couldn't get campaign information! ";
      this.dataAvailable = true;
    })
    .then((character) => {
      if(character) {
        this.character = character;
      }
      this.dataAvailable = true;
    },
    () => {
      this.errorMsg += "Couldn't get character information!";
      this.dataAvailable = true;
    });
  }

  roll(stat: string): void {
    this.errorMsg = "";

    this.backendService.addStatToCharacter(stat, this.character)
    .then((result) => {this.character = result},
          () => this.errorMsg = 'Roll failed!');
  }

  onSubmit(): void {
    this.errorMsg = "";

    this.campaign.lastPlayBy = "Player";

    this.backendService.updateCharacter(this.character)
    .then(() => this.backendService.updateCampaign(this.campaignId, this.campaign),
          () => this.errorMsg += "Character creation failed! ")
    .then(() => this.router.navigate(['/game/', this.campaignId, 'Player']),
          () => this.errorMsg += "Campaign update failed!");
  }
}
