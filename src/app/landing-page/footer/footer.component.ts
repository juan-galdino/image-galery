import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

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
