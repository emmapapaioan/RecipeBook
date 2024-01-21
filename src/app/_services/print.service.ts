import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Recipe } from '../shared/recipe.model';
import autotable, { FontStyle } from 'jspdf-autotable';
import { PdfOptions } from '../shared/pdfOptions.model';
import { FirebaseStorageService } from './firebase-storage.service';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  constructor() { }

  async generateRecipePdf(recipe: Recipe, options: PdfOptions, imgBlob: Blob): Promise<void> {
    const doc = new jsPDF();
    doc.setFont(options.fontName, options.fontStyle);
    doc.setFontSize(options.fontSize);
    let currentY = 10;

    // Recipe name
    doc.setFont(options.fontName, options.titlesFontStyle);
    doc.text('Recipe Name:', options.leftMargin, currentY);
    currentY += 7;
    doc.setFont(options.fontName, options.fontStyle);
    const recipeNameText = doc.splitTextToSize(recipe.name, options.maxWidth);
    doc.text(recipeNameText, options.leftMargin, currentY);
    currentY += 5 * recipeNameText.length + options.marginTop;

    // Recipe description
    doc.setFont(options.fontName, options.titlesFontStyle);
    doc.text('Description:', options.leftMargin, currentY);
    currentY += 7;
    doc.setFont(options.fontName, options.fontStyle);
    const recipeDescriptionText = doc.splitTextToSize(recipe.description, options.maxWidth);
    doc.text(recipeDescriptionText, options.leftMargin, currentY);
    let textBlockHeight = 5 * recipeDescriptionText.length;
    if (currentY + textBlockHeight + options.marginTop > doc.internal.pageSize.height) {
      doc.addPage();
      currentY = 10;
    } else {
      currentY += textBlockHeight + options.marginTop;
    }

    // Convert Blob to Data URL and add to PDF
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const imageDataUrl = reader.result as string;
          doc.addImage(imageDataUrl, 'PNG', options.leftMargin, currentY, options.imageWidth, options.imageHeight);
          currentY += options.imageHeight + options.marginTop;

          // Check page overflow and add new page if needed
          if (currentY > doc.internal.pageSize.height) {
            doc.addPage();
            currentY = 10;
          }

          // Recipe's ingredients table
          autotable(doc, {
            html: options.imageHtml,
            startY: currentY,
            margin: { left: options.leftMargin },
            headStyles: {
              font: options.fontName,
              fontStyle: 'bold',
              fillColor: [184, 141, 141],
              textColor: 'black'
            },
            styles: {
              font: options.fontName,
              fontStyle: options.fontStyle as FontStyle
            },
          });

          doc.save(`${recipe.name}.pdf`);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(imgBlob);
    });
  }

  convertImageToBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.height = img.naturalHeight;
        canvas.width = img.naturalWidth;
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = () => reject(new Error('Could not load image'));
      img.src = url;
    });
  }

  getImageTypeFromUrl(url: string): string {
    const match = url.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
    if (match) {
      return match[1];
    }
    return 'PNG'; // Default type if no extension found
  }
}
