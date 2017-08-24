import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Campaign } from '../misc/campaign';

import { BackendService } from '../backend.service';

@Component({
  selector: 'campaign-subset',
  templateUrl: './campaign-subset.component.html',
  styleUrls: ['./campaign-subset.component.css']
})
export class CampaignSubsetComponent {
  @Input() type: string;
  @Input() campaigns: Campaign[];
  @Input() privateState: boolean;
  @Input() endState: boolean;

  passwords: string[] = [];
  errorMsgs: string[] = [];

  constructor(
    private backendService: BackendService,
    private router: Router
  ) {}

  enter(campaign: Campaign, role: string): void {
    let url: string;

    if(campaign.lastPlayBy == "None") {
      url = '/character-creation/';
    }
    else {
      url = '/game/';
    }

    this.router.navigate([url, campaign._id, role]);
  }

  enterPassword(campaign: Campaign, role: string, i: number): void {
    this.errorMsgs[i] = null;
    let url: string;

    this.backendService.campaignPasswords[campaign._id] = this.passwords[i];
    if(campaign.lastPlayBy == "None") {
      url = '/character-creation/';
    }
    else {
      url = '/game/';
    }

    this.router.navigate([url, campaign._id, role])
    .then((result) => {
      if(!result) {
        this.errorMsgs[i] = "Wrong password!";
      }
      else {
        this.errorMsgs[i] = "Unexpected error!";
      }
    },
    () => this.errorMsgs[i] = "Unexpected error!");
  }
}
