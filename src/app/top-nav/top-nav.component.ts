import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

declare function initMenu(): void; // función global del JS

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit, AfterViewInit {

  constructor(private router: Router) { }

  ngOnInit() {
    // cada vez que cambia la ruta, re-inicializamos el menú
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.reInitMenu();
      }
    });
  }

  ngAfterViewInit() {
    // primera inicialización al cargar
    this.reInitMenu();
  }

  private reInitMenu(): void {
    if (typeof initMenu === 'function') {
      // espera un microtick para que Angular renderice el DOM del menú
      setTimeout(() => {
        initMenu();
      }, 0);
    }
  }
}
