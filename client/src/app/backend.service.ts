import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { Campaign } from './misc/campaign';
import { Character } from './misc/character';
import { Monster } from './misc/monster';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class BackendService {
  private apiUrl = 'api/';
  campaignPasswords: string[] = [];
  jwtToken: string = null;

  constructor(private http: Http) {}

//campaigns
  authenticateCampaign(id: string, password: string, role: string): Promise<Boolean> {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http
      .post(this.apiUrl + 'campaign/' + id + '/auth', JSON.stringify({password: password, role: role}), { headers: headers })
      .toPromise()
      .then(response => {
        let result = response.json();
        this.campaignPasswords[id] = null; //don't save the passwords unnecessarily
        if(result.success) {
          this.jwtToken = result.token;
        }
        return result.success;
      })
      .catch(this.handleError);
  }

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
  addCharacter(character: Character): Promise<Response> {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http
      .post(this.apiUrl + 'character', JSON.stringify(character), { headers: headers })
      .toPromise()
      .catch(this.handleError);
  }

//general
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
