// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { HeaderComponent } from './header.component';
// import { AppRoutingModule } from '../../app-routing.module';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { Location } from '@angular/common';
// import { RouterTestingModule } from '@angular/router/testing';
// import { BlankComponent } from '../../mocks/blank/blank.component';
// import { AuthenticationService } from '../../auth/auth.service';

// describe('HeaderComponent', () => {
//   let component: HeaderComponent;
//   let fixture: ComponentFixture<HeaderComponent>;
//   let page: any
//   let location: Location
//   let authenticationServiceSpy: jasmine.SpyObj<AuthenticationService>

//   beforeEach(() => {
//     const spy = jasmine.createSpyObj('AuthenticationService', ['logout'])

//     TestBed.configureTestingModule({
//       declarations: [HeaderComponent],
//       imports: [
//         AppRoutingModule,
//         BrowserAnimationsModule,
//         RouterTestingModule.withRoutes([{path: 'login', component: BlankComponent}])
//       ],
//       providers: [
//         Location,
//         { provide: AuthenticationService, useValue: spy }
//       ]
//     })
//     fixture = TestBed.createComponent(HeaderComponent);
//     location = TestBed.inject(Location)
//     authenticationServiceSpy = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>

//     component = fixture.componentInstance;
//     page = fixture.debugElement.nativeElement

//     fixture.detectChanges();
//   });

//   describe('Logout flow', () => {

//     describe('when settings are opened', () => {

//       beforeEach(() => {
//         toggleSettingsButton().click()
//         fixture.detectChanges()
//       })

//       it('then show logout button', () => {
//         expect(logoutButton()).not.toBeNull()
//       })

//       describe('given user clicks on logout button', () => {

//         beforeEach(() => {
//           logoutButton().click()
//           fixture.detectChanges()
//         })

//         it('then navigate to login page', done => {
//           setTimeout(() => {
//             expect(location.path()).toEqual('/login')
//             done()
//           }, 100)
//         })

//         it('then logout method should be called from AuthenticationService', () => {
//           expect(authenticationServiceSpy.logout).toHaveBeenCalled()
//         })

//       })
      
//     })

//     describe('when settings are not opened', () => {

//       it('then do not show logout button', () => {
//         expect(logoutButton()).toBeNull()
//       })
//     })

//   })

//   function toggleSettingsButton(): HTMLButtonElement {
//     return page.querySelector('[test-id="toggle-settings-button"]')
//   }

//   function logoutButton():HTMLAnchorElement {
//     return page.querySelector('[test-id="logout-button"]')
//   }
// });