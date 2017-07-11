import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { Campaign } from './campaign';
import { Character } from './character';
import { Monster } from './monster';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class BackendService {
  private apiUrl = 'api/';

  constructor(private http: Http) { }

//campaigns
  getCampaignsBasic(): Promise<Array<Campaign>> {
    return this.http
      .get(this.apiUrl + 'campaign')
      .toPromise()
      .then((response) => {
        return response.json() as Campaign[];
      })
      .catch(this.handleError);
  }

  getCampaign(id: string): Promise<Campaign> {
    return this.http
      .get(this.apiUrl + 'campaign/' + id)
      .toPromise()
      .then((response) => {
        return response.json() as Campaign;
      })
      .catch(this.handleError);
  }

  deleteCampaign(id: string): Promise<Response> {
    return this.http
      .delete(this.apiUrl + 'campaign/' + id)
      .toPromise()
      .catch(this.handleError);
  }

  addCampaign(campaign: Campaign): Promise<Response> {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http
      .post(this.apiUrl + 'campaign', JSON.stringify(campaign), { headers: headers })
      .toPromise()
      .catch(this.handleError);
  }

  updateCampaign(id: string, campaign: Campaign): Promise<Response> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http
      .put(this.apiUrl + 'campaign/' + id, JSON.stringify(campaign), { headers: headers })
      .toPromise()
      .catch(this.handleError);
  }

//characters
  getCharacterByCampaignId(id: string): Promise<Character> {
    return this.http
      .get(this.apiUrl + 'character/campaign/' + id)
      .toPromise()
      .then((response) => {
        return response.json() as Character;
      })
      .catch(this.handleError);
  }

  addCharacter(character: Character): Promise<Response> {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http
      .post(this.apiUrl + 'character', JSON.stringify(character), { headers: headers })
      .toPromise()
      .catch(this.handleError);
  }

  updateCharacter(id: string, character: Character): Promise<Response> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http
      .put(this.apiUrl + 'character/' + id, JSON.stringify(character), { headers: headers })
      .toPromise()
      .catch(this.handleError);
  }

//monsters
  getMonstersByCampaignId(id: string): Promise<Array<Monster>> {
    return this.http
      .get(this.apiUrl + 'monster/campaign/' + id)
      .toPromise()
      .then((response) => {
        return response.json() as Monster[];
      })
      .catch(this.handleError);
  }

  deleteMonster(id: string): Promise<Response> {
    return this.http
      .delete(this.apiUrl + 'monster/' + id)
      .toPromise()
      .catch(this.handleError);
  }

  addMonster(monster: Monster): Promise<Response> {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http
      .post(this.apiUrl + 'monster', JSON.stringify(monster), { headers: headers })
      .toPromise()
      .catch(this.handleError);
  }

  updateMonster(id: string, monster: Monster): Promise<Response> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http
      .put(this.apiUrl + 'monster/' + id, JSON.stringify(monster), { headers: headers })
      .toPromise()
      .catch(this.handleError);
  }

//general
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
