import { SideNavMenuItem } from '../interfaces';

export const SIDE_NAV_ICON_BASE_URL = 'assets/images/side-nav/';

export const SIDE_NAV_MENU_ITEMS: SideNavMenuItem[] = [
  {
    name: 'dashboard',
    route: '/home/dashboard',
    icon: 'dashboard',
  },
  {
    name: 'calendar',
    route: '/home/calendar',
    icon: 'calendar',
  },
  {
    name: 'chat',
    route: '/home/chat',
    icon: 'chat',
  },
  {
    name: 'analytics',
    route: '/home/analytics',
    icon: 'analytics',
  },
  {
    name: 'profile',
    route: '/home/profile',
    icon: 'profile',
  },
  {
    name: 'logout',
    route: null,
    icon: 'logout',
  },
];
