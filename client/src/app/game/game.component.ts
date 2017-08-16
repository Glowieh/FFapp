import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SocketService } from '../socket.service';
import { Campaign } from '../misc/campaign';
import { Character } from '../misc/character';
import { Monster } from '../misc/monster';
import { LogMessage } from '../misc/log-message';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  character: Character;
  campaign: Campaign;
  monsters: Monster[];
                          /////////pitää tehdä alikomponentteja gamesta. chatit on yksi, hahmostatit on yksi, tappelu on yksi
                          ///////////sen jälkeen nappien toiminnallisuus
  connection;
  id: string;
  role: string;
  connected: boolean = false;

  icMessage: string = "";
  oocMessage: string = "";

  monsterName: string = "";
  monsterCombatSkill: number = 0;
  monsterStamina: number = 0;
  addedMonsters: Monster[] = [];

  item: string = "";
  swordsmanship: number = 0;
  skill: number = 0;
  luck: number = 0;
  stamina: number = 0;
  gold: number = 0;
  provisions: number = 0;

  constructor(
    private socketService: SocketService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.role = this.route.snapshot.paramMap.get('role');
    this.id = this.route.snapshot.paramMap.get('id');

    this.connection = this.socketService.connect(this.id)
    .subscribe((packet: any) => {
      console.log("Got a packet: ", packet);

      if(packet.type == "init") {
        this.character = packet.character;
        this.campaign = packet.campaign;
        this.monsters = packet.monsters;
        this.connected = true;
      }

      if(packet.type == "ic-message") {
        this.campaign.inCharacterLog.push(packet.message);
      }

      if(packet.type == "ooc-message") {
        this.campaign.outOfCharacterLog.push(packet.message);
      }

      if(packet.type == "update-character") {
        this.character = packet.character;
      }
    });
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  sendICMessage(): void {
    if(this.icMessage != "") {
      let msg: LogMessage = {senderName: this.role, message: this.icMessage, posted: null}
      this.socketService.icMessage(msg);
      this.icMessage = '';
    }
  }

  sendOOCMessage(): void {
    if(this.oocMessage != "") {
      let msg: LogMessage = {senderName: this.role, message: this.oocMessage, posted: null}
      this.socketService.oocMessage(msg);
      this.oocMessage = '';
    }
  }

  set(stat: string): void {
    switch(stat) {
      case 'swordsmanship': this.character.swordsmanship = this.swordsmanship; break;
      case 'skill': this.character.skill = this.skill; break;
      case 'luck': this.character.luck = this.luck; break;
      case 'stamina': this.character.stamina = this.stamina; break;
      case 'gold': this.character.gold = this.gold; break;
      case 'provisions': this.character.provisions = this.provisions; break;
    }

    this.socketService.updateCharacter(this.character);
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
