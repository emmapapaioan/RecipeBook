import { Component, HostBinding, OnInit } from '@angular/core';
import * as Tesseract from 'tesseract.js';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-ocr-reader',
  templateUrl: './ocr-reader.component.html',
  styleUrls: ['./ocr-reader.component.css']
})
export class OcrReaderComponent implements OnInit {
  @HostBinding('class.loading') isLoading = false;
  imageUrl: string = '';
  extractedText: string = '';
  isServerUp: boolean;

  constructor(private http: HttpClient, private alertService: AlertService) { }

  ngOnInit() {
    this.loadImage('https://images.squarespace-cdn.com/content/v1/5a870022e45a7c0c0c9ea20e/1587642606272-7FLQ93BAH89DAWEDSEXT/Screen+Shot+2020-04-23+at+7.49.46+AM.png?format=750w');
    this.extractText();
  }

  loadImage(imageUrlInput: string) {
    this.imageUrl = imageUrlInput;
    this.extractedText = '';
  }

  extractText() {
    this.extractedText = '';
    this.isLoading = true;
    this.checkServerStatus().subscribe({
      next: () => {
        this.performOCRServerSide(this.imageUrl);
      },
      error: () => {
        this.performOCR(this.imageUrl);
      }
    });
  }

  checkServerStatus() {
    return this.http.get('https://fierce-mountain-99172.herokuapp.com/');
  }

  async performOCRServerSide(imageUrl: string) {
    if (!imageUrl) {
      this.alertService.infoMessage(false, 'Insert an image url.');
      return;
    }
    this.http.get<any>(`https://fierce-mountain-99172.herokuapp.com/ocr?imageUrl=${encodeURIComponent(imageUrl)}`).subscribe({
      next: (res) => {
        this.extractedText = res.text;
      },
      error: (error) => {
        this.alertService.infoMessage(false, 'Error performing OCR: ' + error.message);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }


  async performOCR(imageUrl: string) {
    if (!imageUrl) {
      this.alertService.infoMessage(false, 'Insert an image url.');
      return;
    }
    try {
      const result = await Tesseract.recognize(imageUrl, 'eng', { logger: (m) => console.log(m) }); //For every new language, write '+ell' for example
      this.extractedText = result.data.text;
    } catch (error) {
      this.alertService.infoMessage(false, 'Error performing OCR: ' + error.message);
    }
    finally {
      this.isLoading = false;
    }
  }
}
