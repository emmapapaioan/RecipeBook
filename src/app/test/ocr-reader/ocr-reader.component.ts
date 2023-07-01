import { Component, OnInit } from '@angular/core';
import * as Tesseract from 'tesseract.js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ocr-reader',
  templateUrl: './ocr-reader.component.html',
  styleUrls: ['./ocr-reader.component.css']
})
export class OcrReaderComponent implements OnInit {

  //https://image3.slideserve.com/5770912/example-in-text-citation-with-no-author-l.jpg
  //https://static.vecteezy.com/system/resources/previews/000/092/311/original/beautiful-text-background-template-vector.jpg
  imageUrl: string = '';
  extractedText: string = '';
  isLoading: boolean = false;

  ngOnInit() {
    this.loadImage('http://tesseract.projectnaptha.com/img/eng_bw.png');
    this.extractText();
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

    this.isLoading = true;

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

  loadImage(imageUrlInput: string) {
    this.imageUrl = imageUrlInput
  }

  //Use proxy to overcome cors policy
  // loadImage(imageUrlInput: string) {
  //   const proxyUrl = 'http://localhost:5000/api/proxy?url=';
  //   this.imageUrl = proxyUrl + encodeURIComponent(imageUrlInput);
  // }

  extractText() {
    this.performOCR(this.imageUrl);
  }
}
