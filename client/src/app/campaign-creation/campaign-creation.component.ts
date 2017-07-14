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

  constructor(
    private backendService: BackendService
  ) {}

  ngOnInit(): void {
  }
}
