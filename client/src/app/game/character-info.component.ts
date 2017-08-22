import { Component, OnInit, Input } from '@angular/core';

import { SocketService } from '../socket.service';
import { Character } from '../misc/character';
import { Roller } from '../misc/roller';

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
    let char: Character = this.character;
    let num: number;

    switch(stat) {
      case 'swordsmanship': char.swordsmanship = num = this.swordsmanship; break;
      case 'skill': char.skill = num = this.skill; break;
      case 'luck': char.luck = num = this.luck; break;
      case 'stamina': char.stamina = num = this.stamina; break;
      case 'gold': char.gold = num = this.gold; break;
      case 'provisions': char.provisions = num = this.provisions; break;
    }

    this.socketService.updateCharacter(char, this.role);
    this.socketService.icMessage({senderName: "None", message: "The character's " + stat + " was changed to " + num + ".", posted: null}, this.role);
  }

  eatProvision(): void {
    if(this.character.provisions > 0 && this.character.stamina < this.character.maxStamina) {
      let char: Character = this.character;

      char.provisions--;
      char.stamina += 4;

      if(char.stamina > char.maxStamina) {
        char.stamina = char.maxStamina;
      }

      this.socketService.updateCharacter(char, this.role);
      this.socketService.icMessage({senderName: "None", message: char.name + " ate a provision.", posted: null}, this.role);
    }
  }

  testLuck(): void {
    if(this.character.luck > 0) {
      let char: Character = this.character;
      let roller: Roller = new Roller();
      let result = roller.roll(1, 20);
      let resultText: string;
      let senderName: string;

      if(result <= char.luck) {
        resultText = "succeeded with a roll of " + result + " against luck score " + char.luck + ".";
        senderName = "RollSuccess";
      }
      else {
        resultText = "failed with a roll of " + result + " against luck score " + char.luck + ".";
        senderName = "RollFailure";
      }

      char.luck--;

      this.socketService.updateCharacter(char, this.role);
      this.socketService.icMessage({senderName: senderName, message: "Luck test " + resultText, posted: null}, this.role);
    }
  }

  testSkill(difficulty: string): void {
    let roller: Roller = new Roller();
    let result = roller.roll(1, 20);
    let modifier: number;
    let resultText: string;
    let symbol: string;
    let senderName;

    switch(difficulty){
      case 'easy': modifier=-5;symbol="";break;
      case 'normal': modifier=0;symbol="+";break;
      case 'hard': modifier=5;symbol="+";break;
      case 'extreme': modifier=10;symbol="+";break;
    }

    if(result+modifier <= this.character.skill) {
      resultText = "succeeded with a roll of " + result + symbol + modifier + " = " + (result+modifier) + " against skill score " + this.character.skill + ".";
      senderName = "RollSuccess";
    }
    else {
      resultText = "failed with a roll of " + result + symbol + modifier + " = " + (result+modifier) + " against skill score " + this.character.skill + ".";
      senderName = "RollFailure";
    }

    this.socketService.icMessage({senderName: senderName, message: "Skill test (" + difficulty + ") " + resultText, posted: null}, this.role);
  }

  addItem(): void {
    if(this.item != "") {
      let char: Character = this.character;

      char.items.push(this.item);
      this.socketService.updateCharacter(char, this.role);
      this.socketService.icMessage({senderName: "None", message: "An item was added to the character's inventory: " + this.item, posted: null}, this.role);
      this.item = "";
    }
  }

  deleteItem(toDelete: string): void {
    let char: Character = this.character;

    char.items.splice(char.items.indexOf(toDelete), 1);
    this.socketService.updateCharacter(char, this.role);
    this.socketService.icMessage({senderName: "None", message: "An item was removed from the character's inventory: " + toDelete, posted: null}, this.role);
  }
}
