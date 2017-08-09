import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BackendService } from '../backend.service';
import { Campaign } from '../misc/campaign';

@Component({
  selector: 'campaign-creation',
  templateUrl: './campaign-creation.component.html',
  styleUrls: ['./campaign-creation.component.css']
})
export class CampaignCreationComponent {
  campaign = new Campaign();
  item: string;
  submitError: boolean;

  constructor(
    private backendService: BackendService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.campaign.private = false;
    this.campaign.initialItems = ["Sword", "Backpack", "Lantern"];
    this.item = "";
    this.submitError = false;
  }

  addItem(): void {
    if(this.item != "") {
      this.campaign.initialItems.push(this.item);
      this.item = "";
    }
  }

  deleteItem(toDelete: string): void {
    this.campaign.initialItems.splice(this.campaign.initialItems.indexOf(toDelete), 1);
  }

  onSubmit(): void {
    this.submitError = false;
    this.backendService.addCampaign(this.campaign)
      .then(() => this.router.navigate(['/']),
            () => this.submitError = true);
  }
}
