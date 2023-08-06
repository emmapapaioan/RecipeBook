import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Recipe } from '../recipes/recipe.model';
import autotable, { FontStyle } from 'jspdf-autotable';
import { PdfOptions } from '../shared/pdfOptions.model';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor() { }

  async generateRecipePdf(recipe: Recipe, options: PdfOptions) {
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

    // Recipe image
    try {
      const imgData = recipe.imagePath;
      doc.addImage(imgData, 'PNG', options.leftMargin, currentY, options.imageWidth, options.imageHeight);
    } catch (error) {
      const imgData = 'assets/images/no-photo-available2.png';
      doc.addImage(imgData, 'PNG', options.leftMargin, currentY, options.imageWidth, options.imageHeight);
    }
    if (currentY + options.imageHeight + options.marginTop > doc.internal.pageSize.height) {
      doc.addPage();
      currentY = 10;
    } else {
      currentY += options.imageHeight + options.marginTop;
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
    return Promise.resolve();
  }
}
