import { Component, HostBinding, OnInit } from '@angular/core';
import * as Tesseract from 'tesseract.js';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

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

  constructor( private http: HttpClient ) { }

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
      error: (error) => {
        console.error('Error checking server status:', error.message);
        this.performOCR(this.imageUrl);
      }
    });
  }

  checkServerStatus() {
      return this.http.get(`http://localhost:3000/ocr?imageUrl=${this.imageUrl}`);
  }

  async performOCRServerSide(imageUrl: string) {
    if (!imageUrl) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Insert an image url.',
        confirmButtonColor: '#28a745'
      });
      return;
    }
    this.http.get<any>(`http://localhost:3000/ocr?imageUrl=${imageUrl}`).subscribe(
      (res) => {
        this.extractedText = res.text;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error performing OCR: ' + error.message,
          confirmButtonColor: '#28a745'
        });
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  async performOCR(imageUrl: string) {
    if (!imageUrl) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Insert an image url.',
        confirmButtonColor: '#28a745'
      });
      return;
    }
    try {
      const result = await Tesseract.recognize(imageUrl, 'eng', { logger: (m) => console.log(m) }); //For every new language, write '+ell' for example
      this.extractedText = result.data.text;
    } catch (error) {
      console.error("Error performing OCR:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error performing OCR: ' + error.message,
        confirmButtonColor: '#28a745'
      });
    }
    finally {
      this.isLoading = false;
    }
  }
}
