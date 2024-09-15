import { Component, NgZone, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { IMAGES } from 'src/app/core/constants/images.constant';

@Component({
  selector: 'app-speech-recognition',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './speech-recognition.component.html',
  styleUrls: ['./speech-recognition.component.scss']
})
export class SpeechRecognitionComponent {
  boo = false;
  speech: string = '';
  voice: string = '';
  public images = IMAGES;
  private speechRecognition: any; // Store the speech recognition instance
  public isListening: boolean = false; // Track whether speech recognition is active
  speechRecognitionInstance:any;

  @Output() speechData: EventEmitter<string> = new EventEmitter<string>(); // EventEmitter to send data

  constructor(private _ngZone: NgZone) {}

  ngOnInit() {}

  getTranscript({ locale = 'en-US' }: { locale?: string } = {}): Observable<string> {
    return new Observable(observer => {
      const Window:any= window;
      this.speechRecognition = Window['webkitSpeechRecognition'] || Window['SpeechRecognition'];
      this.speechRecognitionInstance = new this.speechRecognition();

      this.speechRecognitionInstance.continuous = true;
      this.speechRecognitionInstance.interimResults = true;
      this.speechRecognitionInstance.lang = locale;

      this.speechRecognitionInstance.onresult = (speechRecognitionEvent:any) => {
        let interim_transcript = '';
        for (let i = speechRecognitionEvent.resultIndex; i < speechRecognitionEvent.results.length; ++i) {
          if (speechRecognitionEvent.results[i].isFinal) {
            this.boo = true;
            const finalTranscript = speechRecognitionEvent.results[i][0].transcript.trim();
            this._ngZone.run(() => {
              observer.next(finalTranscript);
              this.emitSpeechData(finalTranscript); // Emit final transcript
            });
          } else {
            this.boo = false;
            interim_transcript += speechRecognitionEvent.results[i][0].transcript;
            this._ngZone.run(() => observer.next(interim_transcript.trim()));
          }
        }
      };

      this.speechRecognitionInstance.onerror = (event:any) => {
        console.error('Speech recognition error', event);
        observer.error(event);
      };

      this.speechRecognitionInstance.start();
          // Stop recognition when speech ends
    this.speechRecognitionInstance.onspeechend = () => {
      this.stopRecognition();
    };


      return () => this.speechRecognitionInstance.abort(); // Cleanup on unsubscribe
    });
  }

  recognize() {
    this.getTranscript().subscribe(transcript => {
      if (transcript !== '' && this.boo) {
        this.voice += ' ' + transcript;
      } else {
        this.speech = transcript;
      }
    });
  }

  startRecognition() {
    this.isListening = true; // Set listening state to true
    this.recognize(); // Start recognizing speech
  }

  stopRecognition() {
    if (this.speechRecognition) {
      this.speechRecognitionInstance.stop();
    }
    this.isListening = false;
  }

  private emitSpeechData(data: string) {
    this.speechData.emit(data);
  }
}
