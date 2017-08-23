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

  connection;
  id: string;
  role: string;
  connected: boolean = false;

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
    });
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  toggleEnded(): void {
    this.socketService.toggleEnded(this.role);
  }
}
