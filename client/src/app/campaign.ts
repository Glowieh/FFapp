import { Character } from './character';
import { Monster } from './monster';
import { LogMessage } from './log-message';

export class Campaign {
  _id           : string;
  name          : string;
  description   : string;

  initialProvisions : number;
  initialGold       : number;
  initialItems      : string[];

  hasEnded    : boolean;
  private     : boolean;
  password    : string;
  battleMode  : boolean;

  creationTime  : Date;
  lastPlayBy    : string; //"GM" | "Player"
  lastPlayTime  : Date;

  character   : Character;
  monsters    : Monster[];

  inCharacterLog    : LogMessage[];
  outOfCharacterLog : LogMessage[];
}
