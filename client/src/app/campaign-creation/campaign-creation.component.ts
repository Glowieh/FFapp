import { Component, OnInit } from '@angular/core';

import { BackendService } from '../backend.service';
import { Campaign } from '../campaign';

@Component({
  selector: 'campaign-creation',
  templateUrl: './campaign-creation.component.html',
  styleUrls: ['./campaign-creation.component.css']
})
export class CampaignCreationComponent {
  campaign = new Campaign();
  item: string;

  constructor(
    private backendService: BackendService
  ) {}

  ngOnInit(): void {
    this.campaign.private = false;
    this.campaign.initialItems = ["Sword", "Backpack", "Lantern"];
    this.item = "";
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
}
