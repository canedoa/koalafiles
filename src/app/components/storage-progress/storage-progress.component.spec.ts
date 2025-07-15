import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageProgressComponent } from './storage-progress.component';

describe('StorageProgressComponent', () => {
  let component: StorageProgressComponent;
  let fixture: ComponentFixture<StorageProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageProgressComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StorageProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
