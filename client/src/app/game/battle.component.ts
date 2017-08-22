import { Component, OnInit, Input } from '@angular/core';

import { SocketService } from '../socket.service';
import { Monster } from '../misc/monster';
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
  @Input() monsters: Monster[];

  monsterName: string = "";
  monsterCombatSkill: number = 0;
  monsterStamina: number = 0;
  addedMonsters: Monster[] = [];

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

      if(this.battleMode) {
        this.socketService.icMessage({senderName: "None", message: "Exiting battle mode.", posted: null}, this.role);
      }
      else {
        this.socketService.icMessage({senderName: "None", message: "Entering battle mode.", posted: null}, this.role);
      }

      this.addedMonsters = [];
    }
  }

  hit(i: number): void {
    console.log(this.monsters[i].name);
  }
}
