import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Recipe } from '../recipes/recipe.model';
import { OpenSans } from '../shared/open-sans-font';
import autotable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor() { }

  async generateRecipePdf(recipe: Recipe): Promise<void> {
    const doc = new jsPDF();
  
    // Set constants
    const { leftMargin, fontSize, maxWidth } = this.getConstants();
    const imageDimensions = this.getImageDimensions();
    const imageTopY = this.getImageTopY(imageDimensions.height);
  
    // Add the Open Sans variable font
    doc.addFileToVFS(OpenSans.name, OpenSans.base64);
    doc.addFont(OpenSans.name, 'OpenSans', 'normal');
  
    // Set the Open Sans font and size
    doc.setFontSize(fontSize);
    doc.setFont('OpenSans');
  
    // Add recipe name
    doc.text(`Recipe Name: ${recipe.name}`, leftMargin, 10, { maxWidth });
  
    // Add recipe description
    doc.text(`Description: ${recipe.description}`, leftMargin, 20, { maxWidth });
  
    // Add recipe image
    const imgData = await this.getImageData(recipe.imagePath);
    doc.addImage(imgData, 'PNG', leftMargin, imageTopY, imageDimensions.width, imageDimensions.height);
  
    // Take table ingredients from the html directly
    autotable(doc, {
      html: '#ingredients',
      startY: imageTopY + imageDimensions.height + 10,
      margin: { left: leftMargin },
      headStyles: { fillColor: [184, 141, 141] },
      styles: { font: 'OpenSans', fontStyle: 'bold' },
    });
  
    // Save the PDF
    doc.save(`${recipe.name}.pdf`);
  }
  
  private getConstants() {
    return {
      leftMargin: 15,
      fontSize: 14,
      maxWidth: 180,
    };
  }
  
  private getImageDimensions() {
    return {
      width: 100,
      height: 100,
    };
  }
  
  private getImageTopY(imageHeight: number) {
    return 30 + imageHeight + 10;
  }
  
  private async getImageData(imagePath: string) {
    try {
      const canvas = await html2canvas(document.querySelector('#recipe-img'));
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error(error);
      return imagePath;
    }
  }
  
}
