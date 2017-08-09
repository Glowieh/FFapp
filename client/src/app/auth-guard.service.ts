import { Injectable }     from '@angular/core';
import { CanActivate, ActivatedRoute, Router }    from '@angular/router';

import { BackendService } from './backend.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private backendService: BackendService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  canActivate() {
    let id = this.route.snapshot.paramMap.get('id');

    if(this.backendService.campaignPasswords[id]) {
      return this.backendService.authenticateCampaign(id, this.backendService.campaignPasswords[id]);
    }
    else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
