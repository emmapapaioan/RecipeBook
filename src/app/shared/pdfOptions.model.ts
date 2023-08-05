import { fontName, fontStyle } from "./fonts.model";

export interface PdfOptions {
  leftMargin: number;
  imageWidth: number;
  imageHeight: number;
  marginTop: number;
  maxWidth: number;
  fontSize: number;
  fontName: fontName;
  fontStyle: fontStyle;
  titlesFontStyle: fontStyle;
} 