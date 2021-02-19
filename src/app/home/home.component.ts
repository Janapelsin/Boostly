import { NavigationService } from './../core/services/navigation.service';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnDestroy, AfterViewInit {
  // INIT
  intersectionObserver: IntersectionObserver;
  isScrolling: number | undefined;
  navSubscription?: Subscription;
  lastIntersection: number = 0;
  sections: Element[] = [];

  constructor(private navService: NavigationService, private ref: ElementRef) {
    this.intersectionObserver = new IntersectionObserver(
      this.onIntersect.bind(this), {
      root: this.ref.nativeElement,
      threshold: 0.75
    });

    if (navService.activeSection == -1) {
      navService.activeSection = 0;
    }
  }

  // LIFECYCLE
  ngAfterViewInit(): void {
    for (const child of this.ref.nativeElement.children) {
      this.sections.push(child);
      this.intersectionObserver?.observe(child);
    }

    this.navSubscription = this.navService.subscribe(
      this.onActiveSectionChange.bind(this),
      this.onError.bind(this)
    );

    // TODO: Match with section registry
  }

  ngOnDestroy(): void {
    this.intersectionObserver.disconnect();
    this.navSubscription?.unsubscribe();

    this.navService.activeSection = -1;
  }

  // LISTENER & CALLBACKS
  @HostListener("scroll") onScrollEnd() {
    window.clearTimeout(this.isScrolling);

    this.isScrolling = window.setTimeout(() => {
      if (this.sections[this.lastIntersection]) {
        this.navService.activeSection = this.lastIntersection;
      }
      else {
        this.onError();
      }
    }, 50)
  }

  onActiveSectionChange(index: number) {
    const section = this.sections[index];

    if (!section) {
      this.onError();
      return;
    }
    else if (this.navService.activeSection != this.lastIntersection) {
      this.scrollTo(section);
    }

    this.focusSection(section);
  }

  onIntersect(e: IntersectionObserverEntry[]) {
    const entry = e[0];

    if (entry.isIntersecting) {
      this.lastIntersection = this.sections.indexOf(entry.target);
    }
  }

  focusSection(section: Element) {
    this.sections.forEach(s => {
      s == section
        ? s.classList.add("active")
        : s.classList.remove("active");
    })
  }

  scrollTo(section: Element) {
    section.scrollIntoView({ behavior: "smooth", inline: "start", block: "start" });
  }

  // Fallback
  onError() {
    this.navSubscription?.unsubscribe();
    this.intersectionObserver.disconnect();
    this.sections.forEach(s => s.classList.add("active"));
  }
}
