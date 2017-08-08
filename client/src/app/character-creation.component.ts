import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { BackendService } from './backend.service';
import { Campaign } from './campaign';
import { Character } from './character';
import { Roller } from './roller';

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
  errorMsg: string;

  constructor(
    private backendService: BackendService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.campaignId = this.route.snapshot.paramMap.get('id');
    this.backendService.getCampaign(this.campaignId)
      .then(result => {
        this.errorMsg = null;
        this.campaign = result;
      },
      () => this.errorMsg = "Couldn't get campaign information!")
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
    //jatkuu
  }
}
