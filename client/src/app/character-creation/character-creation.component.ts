import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { BackendService } from '../backend.service';
import { Campaign } from '../misc/campaign';
import { Character } from '../misc/character';
import { Roller } from '../misc/roller';

import 'rxjs/add/operator/switchMap';


@Component({
  selector: 'character-creation',
  templateUrl: './character-creation.component.html',
  styleUrls: ['./character-creation.component.css']
})
export class CharacterCreationComponent {
  character = new Character();
  campaign: Campaign;
  roller = new Roller();
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
        this.dataAvailable = true;
      },
      () => {
        this.errorMsg = "Couldn't get campaign information!";
        this.dataAvailable = true;
      });
  }

  rollSwordsmanship(): void {
    this.character.swordsmanship = this.character.maxSwordsmanship = this.roller.roll(2, 6)+6;
  }
  rollSkill(): void {
    this.character.skill = this.character.maxSkill = this.roller.roll(2, 6)+6;
  }
  rollLuck(): void {
    this.character.luck = this.character.maxLuck = this.roller.roll(2, 6)+6;
  }
  rollStamina(): void {
    this.character.stamina = this.character.maxStamina = this.roller.roll(2, 6)+12;
  }

  onSubmit(): void {
    this.errorMsg = "";

    this.character.gold = this.campaign.initialGold;
    this.character.provisions = this.campaign.initialProvisions;
    this.character.items = this.campaign.initialItems;
    this.character.campaignId = this.campaignId;

    this.campaign.lastPlayBy = "Player";

    this.backendService.addCharacter(this.character)
    .then(() => this.backendService.updateCampaign(this.campaignId, this.campaign),
          () => this.errorMsg += "Character creation failed! ")
    .then(() => this.router.navigate(['/game/', this.campaignId, 'Player']),
          () => this.errorMsg += "Campaign update failed!");
  }
}
