import { Component, OnInit, Input } from '@angular/core';

import { SocketService } from '../socket.service';
import { Character } from '../misc/character';

@Component({
  selector: 'character-info',
  templateUrl: './character-info.component.html',
  styleUrls: ['./character-info.component.css']
})
export class CharacterInfoComponent implements OnInit {
  @Input() character: Character;
  @Input() role: string;
  @Input() battleMode: boolean;
  @Input() hasEnded: boolean;

  item: string = "";
  swordsmanship: number = 0;
  skill: number = 0;
  luck: number = 0;
  stamina: number = 0;
  gold: number = 0;
  provisions: number = 0;

  constructor(private socketService: SocketService) { }

  ngOnInit() {
  }

  set(stat: string): void {
    let char: Character = Object.assign({}, this.character);
    let num: number;

    switch(stat) {
      case 'swordsmanship': char.swordsmanship = num = this.swordsmanship; break;
      case 'skill': char.skill = num = this.skill; break;
      case 'luck': char.luck = num = this.luck; break;
      case 'stamina': char.stamina = num = this.stamina; break;
      case 'gold': char.gold = num = this.gold; break;
      case 'provisions': char.provisions = num = this.provisions; break;
    }

    if(num < 0) {
      return;
    }

    this.socketService.updateCharacter(char, {senderName: "None", message: "The character's " + stat + " was changed to " + num + ".", posted: null}, this.role);
  }

  eatProvision(): void {
    if(this.character.provisions > 0 && this.character.stamina < this.character.maxStamina) {
      this.socketService.eatProvision();
    }
  }

  testLuck(): void {
    if(this.character.luck > 0) {
      this.socketService.testAttribute('luck', null);
    }
  }

  testSkill(difficulty: string): void {
    this.socketService.testAttribute('skill', difficulty);
  }

  addItem(): void {
    if(this.item != "") {
      let char: Character = this.character;

      char.items.push(this.item);
      this.socketService.updateCharacter(char, {senderName: "None", message: "An item was added to the character's inventory: " + this.item, posted: null}, this.role);
      this.item = "";
    }
  }

  deleteItem(toDelete: string): void {
    let char: Character = this.character;

    char.items.splice(char.items.indexOf(toDelete), 1);
    this.socketService.updateCharacter(char, {senderName: "None", message: "An item was removed from the character's inventory: " + toDelete, posted: null}, this.role);
  }
}
