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

  password: string;
  errorMsg: string;

  constructor(
    private backendService: BackendService,
    private router: Router
  ) {}

  enter(campaign: Campaign): void {
    this.errorMsg = null;
    let url: string;

    this.backendService.campaignPasswords[campaign._id] = this.password;
    if(campaign.lastPlayBy == "None") {
      url = '/character-creation/';
    }
    else {
      url = '/game/';
    }

    this.router.navigate([url, campaign._id])
    .then((result) => {
      if(!result) {
        this.errorMsg = "Wrong password!";
      }
      else {
        this.errorMsg = "Unexpected error!";
      }
    },
    () => this.errorMsg = "Unexpected error!");
  }
}
