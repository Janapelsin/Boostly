import { Sections } from './../contants/sections.contant';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  _activeSection = new BehaviorSubject<number>(-1);

  get activeSection() {
    return this._activeSection.value;
  }

  set activeSection(index: number) {
    if (!Sections[index]) {
      throw new Error("Section index not found");
    }
    else if (index !== this.activeSection) {
      this._activeSection.next(index);
    }
  }

  subscribe(onSuccess: (index: number) => void, onError?: () => void) {
    return this._activeSection.subscribe(onSuccess, onError);
  }
}
