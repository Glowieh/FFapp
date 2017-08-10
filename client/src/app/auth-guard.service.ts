import { Injectable }     from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot }    from '@angular/router';

import { BackendService } from './backend.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private backendService: BackendService
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    let id = route.paramMap.get('id');

    if(this.backendService.campaignPasswords[id]) {
      return this.backendService.authenticateCampaign(id, this.backendService.campaignPasswords[id]);
    }
    else {
      return this.backendService.authenticateCampaign(id, "-");
    }
  }
}
