import { Component, Input } from '@angular/core';

@Component({
  selector: 'campaign-creation-errors',
  templateUrl: './campaign-creation-errors.component.html',
  styleUrls: ['./campaign-creation-errors.component.css']
})
export class CampaignCreationErrorsComponent {
  @Input() control: any;
  @Input() name: string;
  @Input() minlength: number;
  @Input() maxlength: number;
  @Input() min: number;
}
