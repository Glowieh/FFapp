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

  icMessage(message: LogMessage, role: string): void {
    this.socket.emit('ic-message', {message: message, role: role});
  }

  oocMessage(message: LogMessage, role: string): void {
    this.socket.emit('ooc-message', {message: message, role: role});
  }

  updateCharacter(character: Character, message: LogMessage, role: string): void {
    this.socket.emit('update-character', {character: character, message: message, role: role});
  }

  toggleEnded(role: string): void {
    this.socket.emit('toggle-ended', {role: role});
  }

  toggleBattleMode(monsters: Monster[], role: string) {
    this.socket.emit('toggle-battle', {monsters: monsters, role: role});
  }
}
