import { Component, OnInit, Input } from '@angular/core';

import { SocketService } from '../socket.service';
import { Monster } from '../misc/monster';
import { Character } from '../misc/character';
import { LogMessage } from '../misc/log-message';
import { Roller } from '../misc/roller';

@Component({
  selector: 'battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.css']
})
export class BattleComponent implements OnInit {
  @Input() battleMode: boolean;
  @Input() id: string;
  @Input() hasEnded: boolean;
  @Input() role: string;
  @Input() character: Character;
  @Input() monsters: Monster[];

  monsterName: string = "";
  monsterCombatSkill: number = 0;
  monsterStamina: number = 0;
  addedMonsters: Monster[] = [];
  combatSkillSetters: number[] = [];
  staminaSetters: number[] = [];

  constructor(private socketService: SocketService) { }

  ngOnInit() {
  }

  addMonster(): void {
    let monster = new Monster();

    monster.name = this.monsterName;
    monster.combatSkill = this.monsterCombatSkill;
    monster.stamina = this.monsterStamina;
    monster.maxStamina = this.monsterStamina;
    monster.campaignId = this.id;

    this.addedMonsters.push(monster);

    this.monsterName = "";
    this.monsterCombatSkill = 0;
    this.monsterStamina = 0;
  }

  deleteAddedMonster(toDelete: Monster): void {
    this.addedMonsters.splice(this.addedMonsters.indexOf(toDelete), 1);
  }

  toggleBattleMode(): void {
    if(this.battleMode || this.addedMonsters.length > 0) {
      this.socketService.toggleBattleMode(this.addedMonsters, this.role);
      this.addedMonsters = [];
    }
  }

  set(stat: string, i: number): void {
    let monster: Monster = this.monsters[i];
    let change: number;

    if(stat == "combat skill") {
      monster.combatSkill = change = this.combatSkillSetters[i];
    }
    else if(stat == "stamina") {
      monster.stamina = change = this.staminaSetters[i];
    }

    if(change < 1) {
      return;
    }

    this.socketService.updateMonster(monster, {senderName: "None", message: "A monster's (" + monster.name +") " + stat + " was changed to " + change + ".", posted: null}, this.role);
  }

  deleteMonster(i: number): void {
    if(this.monsters.length == 1) {
      this.toggleBattleMode();
    }
    else {
      this.socketService.deleteMonster(this.monsters[i]._id, {senderName: "None", message: this.monsters[i].name +" was removed from the battle.", posted: null}, this.role);
    }
  }

  battleRound(i: number): void {
    let messages: LogMessage[] = [];

    messages.push(this.hit(i, true));

    this.monsters.forEach((monster, index) => {
      if(index != i) {
        messages.push(this.hit(index, false));
      }
    });

    this.socketService.battleRound(this.character, this.monsters, messages, this.role);
  }

  private hit(i: number, characterHits: boolean): LogMessage {
    let roller = new Roller();
    let charRoll, monsterRoll: number;
    let msg: LogMessage = {senderName: "", message: "", posted: null};

    charRoll = roller.roll(1, 20)+this.character.swordsmanship;
    monsterRoll = roller.roll(1, 20)+this.monsters[i].combatSkill;

    if(charRoll > monsterRoll) {
      msg.senderName = "RollSuccess";
      if(!characterHits) {
        msg.message = "The " + this.monsters[i].name + " tries to hit you, but you dodge it ";
      }
      else {
        msg.message = "You hit the " + this.monsters[i].name + " ";

        this.monsters[i].stamina -= 2;

        if(this.monsters[i].stamina <= 0) {
          msg.message += "and kill it ";
        }
      }
    }
    else if(charRoll < monsterRoll) {
      msg.senderName = "RollFailure";
      if(!characterHits) {
        msg.message = "The " + this.monsters[i].name + " hits you ";
      }
      else {
        msg.message = "You try to hit the " + this.monsters[i].name + ", but it hits you ";
      }

      this.character.stamina -= 2;

      if(this.character.stamina <= 0) {
        msg.message += "and kills you ";
      }
    }
    else {
      if(!characterHits) {
        msg.senderName = "RollSuccess";
        msg.message = "The " + this.monsters[i].name + " tries to hit you, but you dodge it ";
      }
      else {
        msg.senderName = "RollFailure";
        msg.message = "You try to hit the " + this.monsters[i].name + ", but it dodges ";
      }
    }

    msg.message += "(" + charRoll + " vs " + monsterRoll +").";

    return msg;
  }
}
