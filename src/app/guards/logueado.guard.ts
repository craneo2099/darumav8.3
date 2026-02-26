import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class LogueadoGuard implements CanActivate {
  constructor(private router: Router, private storage: Storage){

  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    
    const token = await this.storage.get('tokenS');
    
    if (token) {
      return true;
    } else {
      return this.router.createUrlTree(['/inicio-login']);
    }
  }
  
}
