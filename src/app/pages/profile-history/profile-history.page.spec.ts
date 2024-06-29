import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileHistoryPage } from './profile-history.page';

describe('ProfileHistoryPage', () => {
  let component: ProfileHistoryPage;
  let fixture: ComponentFixture<ProfileHistoryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProfileHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
