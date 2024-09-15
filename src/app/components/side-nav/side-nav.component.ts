import { NgClass, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMAGES } from 'src/app/core/constants/images.constant';
import {
  SIDE_NAV_ICON_BASE_URL,
  SIDE_NAV_MENU_ITEMS,
} from 'src/app/core/constants/side-nav.constant';
import { SideNavMenuItem } from 'src/app/core/interfaces';
import { ApiService } from 'src/app/core/services';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  public images = IMAGES;
  menuItems: SideNavMenuItem[] = [];

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.menuItems = SIDE_NAV_MENU_ITEMS.map((item) => {
      return {
        name: item.name,
        route: item.route,
        icon: `${SIDE_NAV_ICON_BASE_URL}${item.icon}.svg`,
        selectedIcon: `${SIDE_NAV_ICON_BASE_URL}${item.icon}-selected.svg`,
      };
    });
  }

  onLogoClick() {
    this.router.navigateByUrl('home/dashboard');
  }

  onMenuClick(menuItem: SideNavMenuItem) {
    if (menuItem.route === null) {
      this.apiService.logout().then(res=>{
        this.router.navigate(['']);
      }).catch(err=> {});
      return;
    }
    this.router.navigateByUrl(menuItem.route);
  }

  isRouteSelected(menuItem: SideNavMenuItem) {
    if (menuItem.route === null) return false;
    return this.router.url.includes(menuItem.route);
  }
}
