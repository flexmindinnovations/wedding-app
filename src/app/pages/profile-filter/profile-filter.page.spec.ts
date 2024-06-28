import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileFilterPage } from './profile-filter.page';

describe('ProfileFilterPage', () => {
  let component: ProfileFilterPage;
  let fixture: ComponentFixture<ProfileFilterPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProfileFilterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
