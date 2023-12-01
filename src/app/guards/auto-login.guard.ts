import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { filter, map, take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AutoLoginGuard implements CanLoad {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}
  canLoad() {
    if (this.authService.loadToken() != null) {
      this.router.navigateByUrl('/diary');
      return false;
    }
    return true;
  }
}
