import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

interface IMenuItem {
  type: string; // Possible values: link/dropDown/icon/separator/extLink
  name?: string; // Used as display text for item and title for separator type
  state?: string; // Router state
  icon?: string; // Material icon name
  tooltip?: string; // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]; // Dropdown items
  badges?: IBadge[];
}
interface IChildItem {
  type?: string;
  name: string; // Display text
  state?: string; // Router state
  icon?: string;
  sub?: IChildItem[];
}

interface IBadge {
  color: string; // primary/accent/warn/hex color codes(#fff000)
  value: string; // Display text
}

@Injectable()
export class NavigationService {
  constructor() {}

  plainMenu: IMenuItem[] = [
    {
      name: 'Current Services',
      type: 'link',
      tooltip: 'current services',
      icon: 'dashboard',
      state: 'services/variance',
    },
    {
      name: 'Service Detail',
      type: 'link',
      tooltip: 'service detail',
      icon: 'shutter_speed',
      state: 'services/detail',
    },
    {
      name: 'Train Performance',
      type: 'link',
      tooltip: 'train performance',
      icon: 'view_module',
      state: 'train-performance/train-performance',
    },
    {
      name: 'NIS List',
      type: 'link',
      tooltip: 'NIS List',
      icon: 'subway',
      state: 'services/not-in-service',
    },
    {
      name: 'Matangi Tracking',
      type: 'link',
      tooltip: 'matangi tracking',
      icon: 'subway',
      state: 'services/matangi-units',
    },
    {
      name: 'Time Distance Graph',
      type: 'link',
      tooltip: 'time-distance',
      icon: 'show_chart',
      state: 'services/time-distance',
    },
    {
      name: 'RTI Boards',
      type: 'link',
      tooltip: 'RTI boards',
      icon: 'toc',
      state: 'rti-boards/rti-boards',
    },
    {
      name: 'Roster Status',
      type: 'link',
      tooltip: 'roster status',
      icon: 'group',
      state: 'rosters/roster-status',
    },
    {
      name: 'Shift Detail',
      type: 'link',
      tooltip: 'shift detail',
      icon: 'person',
      state: 'rosters/shift-detail',
    },
    {
      name: 'Shift Visualiser',
      type: 'link',
      tooltip: 'shift visualiser',
      icon: 'clear_all',
      state: 'rosters/shift-visualiser',
    },
    // {
    //   name: 'Staff Visualiser',
    //   type: 'link',
    //   tooltip: 'staff visualiser',
    //   icon: 'clear_all',
    //   state: 'rosters/staff-visualiser',
    // },
    {
      name: 'Staff Holistic',
      type: 'link',
      tooltip: 'staff-holistic',
      icon: 'accessibility',
      state: 'rosters/staff-holistic',
    },
    {
      name: 'Leave Availability',
      type: 'link',
      tooltip: 'available-leave',
      icon: 'hotel',
      state: 'rosters/available-leave',
    },
    {
      name: 'Resource Visboard',
      type: 'link',
      tooltip: 'Resource Visboard',
      icon: 'multiline_chart',
      state: 'resource-visboard/resource-visboard',
    },
    {
      name: "Pilot Status",
      type: "link",
      tooltip: "Pilot Status",
      icon: "cloud",
      state: "pilot-status/status-page"
    },
    // {
    //   name: "Blank",
    //   type: "link",
    //   tooltip: "Blank",
    //   icon: "blur_on",
    //   state: "others/blank"
    // },
  ];

  // Icon menu TITLE at the very top of navigation.
  // This title will appear if any icon type item is present in menu.
  iconTypeMenuTitle: string = "Frequently Accessed";
  // sets iconMenu as default;
  menuItems = new BehaviorSubject<IMenuItem[]>(this.plainMenu);
  // navigation component has subscribed to this Observable
  menuItems$ = this.menuItems.asObservable();

  // Customizer component uses this method to change menu.
  // You can remove this method and customizer component.
  // Or you can customize this method to supply different menu for
  // different user type.

  publishNavigationChange(menuType: string) {
    // switch (menuType) {
    //   case "separator-menu":
    //     this.menuItems.next(this.separatorMenu);
    //     break;
    //   case "icon-menu":
    //     this.menuItems.next(this.iconMenu);
    //     break;
    //   default:
    //     this.menuItems.next(this.plainMenu);
    // }
  }
}
