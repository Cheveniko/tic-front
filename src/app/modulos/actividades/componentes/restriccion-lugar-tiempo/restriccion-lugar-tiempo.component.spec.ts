import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestriccionLugarTiempoComponent } from './restriccion-lugar-tiempo.component';

describe('RestriccionLugarTiempoComponent', () => {
  let component: RestriccionLugarTiempoComponent;
  let fixture: ComponentFixture<RestriccionLugarTiempoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestriccionLugarTiempoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestriccionLugarTiempoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
