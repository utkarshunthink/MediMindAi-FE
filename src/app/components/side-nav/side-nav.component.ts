import { NgClass, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMAGES } from 'src/app/core/constants/images.constant';
import {
  SIDE_NAV_ICON_BASE_URL,
  SIDE_NAV_MENU_ITEMS,
} from 'src/app/core/constants/side-nav.constant';
import { SideNavMenuItem } from 'src/app/core/interfaces';

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

  constructor(private router: Router) {}

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
    this.router.navigateByUrl('');
  }

  onMenuClick(menuItem: SideNavMenuItem) {
    if (menuItem.route === null) {
      // code for logout
      return;
    }
    this.router.navigateByUrl(menuItem.route);
  }

  isRouteSelected(menuItem: SideNavMenuItem) {
    if (menuItem.route === null) return false;
    console.log(this.router.url);
    return this.router.url.includes(menuItem.route);
  }
}
