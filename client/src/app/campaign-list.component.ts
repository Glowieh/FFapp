import { Component, OnInit } from '@angular/core';

import { BackendService } from './backend.service';
import { Campaign } from './campaign';

@Component({
  selector: 'campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.css']
})
export class CampaignListComponent {
  campaigns: Campaign[];
  error: any;

  constructor(
    private backendService: BackendService
  ) {}

  ngOnInit(): void {
    this.backendService.getCampaignsBasic()
      .then(result => {this.campaigns = result;})
      .catch(error => this.error = error);
  }
}
