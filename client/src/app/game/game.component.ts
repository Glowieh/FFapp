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

  connected: boolean = false;
  connection;
  role: string;
  icMessage: string = "";
  oocMessage: string = "";

  constructor(
    private socketService: SocketService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.role = this.route.snapshot.paramMap.get('role');

    this.connection = this.socketService.connect(this.route.snapshot.paramMap.get('id'))
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
     });
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  sendICMessage() {
    if(this.icMessage != "") {
      let msg: LogMessage = {senderName: this.role, message: this.icMessage, posted: null}
      this.socketService.icMessage(msg);
      this.icMessage = '';
    }
  }

  sendOOCMessage() {
    if(this.oocMessage != "") {
      let msg: LogMessage = {senderName: this.role, message: this.oocMessage, posted: null}
      this.socketService.oocMessage(msg);
      this.oocMessage = '';
    }
  }
}
