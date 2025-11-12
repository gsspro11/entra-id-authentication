import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar-component',
  templateUrl: './navbar-component.component.html',
  styleUrls: ['./navbar-component.component.scss'],
  animations: [
    trigger('slidein', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate(150, style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate(150, style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class NavbarComponentComponent implements OnInit{
  expanded:boolean = false;
  userInitials:any;
  constructor(public _authService:AuthService){
  }

  ngOnInit(): void {
    this.userInitials = this._authService.userInitials()
  }

  public logout() {
    this.expanded = false;
    return this._authService.msLogout();
  }
}
