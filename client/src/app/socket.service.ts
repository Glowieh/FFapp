import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

import { Campaign } from './misc/campaign';
import { Character } from './misc/character';
import { Monster } from './misc/monster';
import { LogMessage } from './misc/log-message';

export class SocketService {
  private socket;

  connect(id: string) {
    let url: string = window.location.host + '/?id=' + id;
    console.log("Connecting to: " + url);

    let observable = new Observable(observer => {
      this.socket = io(url);

      this.socket.on('packet', (packet) => {
        observer.next(packet);
      });

      return () => {
        this.socket.disconnect();
      };
    })

    return observable;
  }

  icMessage(message: LogMessage): void {
    this.socket.emit('ic-message', message);
  }

  oocMessage(message: LogMessage): void {
    this.socket.emit('ooc-message', message);
  }
}
