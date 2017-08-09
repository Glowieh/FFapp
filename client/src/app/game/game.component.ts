import { Component, OnInit } from '@angular/core';

import { BackendService } from '../backend.service';
import { Campaign } from '../misc/campaign';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {

  constructor(
    private backendService: BackendService
  ) {}

  ngOnInit(): void {
  }
}
