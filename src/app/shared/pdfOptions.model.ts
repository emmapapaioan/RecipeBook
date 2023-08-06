import { FontName, FontStyle } from "./fonts.model";

export interface PdfOptions {
  leftMargin: number;
  imageWidth: number;
  imageHeight: number;
  marginTop: number;
  maxWidth: number;
  fontSize: number;
  fontName: FontName;
  fontStyle: FontStyle;
  titlesFontStyle: FontStyle;
  imageHtml: string;
} 