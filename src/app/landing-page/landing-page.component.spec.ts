import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageComponent } from './landing-page.component';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingPageComponent],
      imports: [
        BrowserAnimationsModule,
        MatIconModule,
        MatExpansionModule,
        MatMenuModule
      ]
    });
    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
