import { Component, OnInit } from '@angular/core';

import { BackendService } from './backend.service';
import { Campaign } from './campaign';
import { Character } from './character';

@Component({
  selector: 'character-creation',
  templateUrl: './character-creation.component.html',
  styleUrls: ['./character-creation.component.css']
})
export class CharacterCreationComponent {

  constructor(
    private backendService: BackendService
  ) {}

  ngOnInit(): void {
  }
}
