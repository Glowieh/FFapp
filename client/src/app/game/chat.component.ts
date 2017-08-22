import { Component, OnInit, Input } from '@angular/core';

import { SocketService } from '../socket.service';
import { LogMessage } from '../misc/log-message';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() title: string;
  @Input() type: string;
  @Input() role: string;
  @Input() log: LogMessage[];
  @Input() hasEnded: boolean;

  message: string = "";

  constructor(private socketService: SocketService) { }

  ngOnInit() {
  }

  sendMessage(): void {
    if(this.message != "") {
      let msg: LogMessage = {senderName: this.role, message: this.message, posted: null};

      if(this.type == 'ic') {
        this.socketService.icMessage(msg, this.role);
      }
      else {
        this.socketService.oocMessage(msg, this.role);
      }

      this.message = '';
    }
  }
}
