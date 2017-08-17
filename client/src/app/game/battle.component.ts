import { Component, OnInit, Input } from '@angular/core';

import { Monster } from '../misc/monster';

@Component({
  selector: 'battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.css']
})
export class BattleComponent implements OnInit {
  @Input() battleMode: boolean;
  @Input() id: string;

  monsterName: string = "";
  monsterCombatSkill: number = 0;
  monsterStamina: number = 0;
  addedMonsters: Monster[] = [];

  constructor() { }

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
}
