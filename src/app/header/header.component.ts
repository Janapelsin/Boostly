import { NavigationService } from './../core/services/navigation.service';
import { Component, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  navSubscription: Subscription;
  menuActive = false;
  activeSection = 0;
  sectionProgress = [4, 12.5, 19.5];

  constructor(private navService: NavigationService, private ref: ElementRef) {
    this.navSubscription = navService.subscribe((val) => this.activeSection = val)
  }

  ngOnDestroy(): void {
    this.navSubscription.unsubscribe();
  }

  setActiveSection(index: number) {
    this.navService.activeSection = index;
    this.menuActive && this.toggleMenu();
  }

  // Hamburger
  toggleMenu() {
    this.menuActive = !this.menuActive;
  }

  // Relative width of section progress indicator
  getProgress() {
    const step = this.sectionProgress[this.activeSection];
    return step ? step : 0;
  }
}
