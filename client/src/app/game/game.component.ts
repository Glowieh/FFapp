import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BackendService } from '../backend.service';
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

  connection;
  id: string;
  role: string;
  connected: boolean = false;

  constructor(
    private socketService: SocketService,
    private backendService: BackendService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.role = this.route.snapshot.paramMap.get('role');
    this.id = this.route.snapshot.paramMap.get('id');

    this.connection = this.socketService.connect(this.id, this.backendService.jwtToken, this.role)
    .subscribe((packet: any) => {
      //console.log("Got a packet: ", packet);

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
        this.campaign.inCharacterLog.push(packet.message);
      }

      if(packet.type == "toggle-ended") {
        this.campaign.hasEnded = packet.endState;
        this.campaign.inCharacterLog.push(packet.message);
      }

      if(packet.type == "toggle-battle") {
        this.campaign.battleMode = packet.battleState;
        this.campaign.inCharacterLog.push(packet.message);
        if(packet.battleState) {
          this.monsters = packet.monsters;
        }
      }

      if(packet.type == "battle-round") {
        this.character = packet.character;
        this.monsters = packet.monsters;
        packet.messages.forEach((msg) => this.campaign.inCharacterLog.push(msg));

        if(this.character.stamina <= 0) {
          this.campaign.hasEnded = !this.campaign.hasEnded;
        }

        if(this.monsters.length == 0) {
          this.campaign.battleMode = !this.campaign.battleMode;
        }
      }

      if(packet.type == "update-monster") {
        this.monsters[this.monsters.findIndex((m) => m._id == packet.monster._id)] = packet.monster;
        this.campaign.inCharacterLog.push(packet.message);
      }

      if(packet.type == "delete-monster") {
        this.monsters.splice(this.monsters.findIndex((m) => m._id == packet.monsterId), 1);
        this.campaign.inCharacterLog.push(packet.message);
      }
    });
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  toggleEnded(): void {
    this.socketService.toggleEnded(this.role);
  }
}
