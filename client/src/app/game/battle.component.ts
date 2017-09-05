import { Component, OnInit, Input } from '@angular/core';

import { SocketService } from '../socket.service';
import { Monster } from '../misc/monster';
import { Character } from '../misc/character';
import { LogMessage } from '../misc/log-message';

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

    if(this.monsterName.length == 0 || this.monsterCombatSkill < 1 || this.monsterStamina < 1) {
      return;
    }

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
    let monster: Monster = Object.assign({}, this.monsters[i]);
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
    this.socketService.battleRound(i);
  }
}
