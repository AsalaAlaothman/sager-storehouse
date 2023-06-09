import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isAuthenticated: boolean = false;
  clinicName: string = 'Orchida';
  clinic_logo: string = '../../../../assets/img/orichida.jpeg';
  private localStorageDataSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);
  public localStorageData$: Observable<string | null> =
    this.localStorageDataSubject.asObservable();

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isAuthenticatedUser()) {
      // this.router.navigate(['/login']);
    } else {
      this.isAuthenticated = this.authService.isAuthenticatedUser();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    window.location.reload();

  }
}
