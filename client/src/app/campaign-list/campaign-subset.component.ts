import { Component, Input } from '@angular/core';

import { Campaign } from '../campaign';

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
}
