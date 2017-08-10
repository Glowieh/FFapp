import { Component, OnInit, OnDestroy } from '@angular/core';

import { BackendService } from '../backend.service';
import { SocketService } from '../socket.service';
import { Campaign } from '../misc/campaign';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  messages: string[] = [];
  connection;
  message: string;

  constructor(
    private backendService: BackendService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.connection = this.socketService.getMessages()
    .subscribe((message: string) => {
       this.messages.push(message);
     });
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  sendOOCMessage() {
    this.socketService.sendMessage(this.message);
    this.message = '';
  }
}
