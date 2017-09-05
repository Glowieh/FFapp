import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

import { Campaign } from './misc/campaign';
import { Character } from './misc/character';
import { Monster } from './misc/monster';
import { LogMessage } from './misc/log-message';

export class SocketService {
  private socket;

  connect(id: string, jwtToken: string, role: string) {
    let url: string = window.location.host + '/?id=' + id + '&token=' + jwtToken + '&role=' + role;
    //console.log("Connecting to: " + url);

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

  eatProvision(): void {
    this.socket.emit('eat-provision');
  }

  testAttribute(stat: string, difficulty: string): void {
    this.socket.emit('test-attribute', {stat: stat, difficulty: difficulty});
  }

  toggleEnded(role: string): void {
    this.socket.emit('toggle-ended', {role: role});
  }

  toggleBattleMode(monsters: Monster[], role: string) {
    this.socket.emit('toggle-battle', {monsters: monsters, role: role});
  }

  battleRound(hitTarget) {
    this.socket.emit('battle-round', {hitTarget: hitTarget});
  }

  updateMonster(monster: Monster, message: LogMessage, role: string) {
    this.socket.emit('update-monster', {monster: monster, message: message, role: role});
  }

  deleteMonster(id: string, message: LogMessage, role: string) {
    this.socket.emit('delete-monster', {monsterId: id, message: message, role: role});
  }
}
