import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechRecognitionComponent } from './speech-recognition.component';

describe('SpeechRecognitionComponent', () => {
  let component: SpeechRecognitionComponent;
  let fixture: ComponentFixture<SpeechRecognitionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SpeechRecognitionComponent]
    });
    fixture = TestBed.createComponent(SpeechRecognitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
