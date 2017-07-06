import { Component, OnInit } from '@angular/core';

import { BackendService } from './backend.service';
import { Campaign } from './campaign';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FFapp';
  error: any;
  campaignid: string;

  constructor(
    private backendService: BackendService
  ) {}

  ngOnInit(): void {
    this.backendService.getCampaignsBasic()
    .then(campaigns => {console.log(JSON.stringify(campaigns)); this.campaignid = campaigns[0]._id;})
    .catch(error => this.error = error);
  }
}
