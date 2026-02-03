import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editcomponent } from './editcomponent';

describe('Editcomponent', () => {
  let component: Editcomponent;
  let fixture: ComponentFixture<Editcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Editcomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
