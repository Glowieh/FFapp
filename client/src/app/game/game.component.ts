import { Component, OnInit, OnDestroy } from '@angular/core';

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
  messageOOC: string;
  messageIC: string;

  constructor(
    private socketService: SocketService
  ) {}
///////////////////////MITEN INITIN YHTEYDESSÄ DATAN ALUSTUS, MITEN ERI TYYPPISTEN VIESTIN VASTAANOTTO OBSERVABLEILLA, YMS SOCKETSERVICEN KEHITYS
  ngOnInit(): void {
    this.connection = this.socketService.getMessages()
    .subscribe((message: LogMessage) => {
       this.campaign.inCharacterLog.push(message);
       this.campaign.outOfCharacterLog.push(message);
     });
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  sendOOCMessage() {
    this.socketService.sendMessage(this.messageOOC);
    this.messageOOC = '';
  }

  sendICMessage() {
    this.socketService.sendMessage(this.messageIC);
    this.messageIC = '';
  }
}
