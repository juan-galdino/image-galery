import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
  
  constructor(
    private router: Router
    ) {}

  scrollToSection(sectionId: string) {
    const headerHeight = 73
    const section = document.getElementById(sectionId)
    if(section) {
      const yOffset = section.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: yOffset - headerHeight, behavior: 'smooth' })
    }
  }

  navigateToSignup() {
    this.router.navigate(['/cadastro'])
  }

  navigateToLogin() {
    this.router.navigate(['/login'])
  }

}
