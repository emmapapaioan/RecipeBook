export enum FontName {
    Helvetica = 'Helvetica',
    Courier = 'Courier',
    Times = 'Times',
    Symbol = 'Symbol',
    ZapfDingbats = 'ZapfDingbats',
    helvetica = 'helvetica',
    courier = 'courier',
    times = 'times',
    symbol = 'symbol',
    zapfdingbats = 'zapfdingbats'
}

export enum FontStyle {
    Normal = 'normal',
    Bold = 'bold',
    Italic = 'italic',
    BoldItalic = 'bolditalic',
    Oblique = 'oblique',
    Roman = 'Roman'
}

export interface Font {
    fontName: FontName;
    fontStyles: FontStyle[];
}

export const HelveticaFont: Font = {
    fontName: FontName.Helvetica,
    fontStyles: [FontStyle.Normal, FontStyle.Bold, FontStyle.Oblique, FontStyle.BoldItalic]
};

export const CourierFont: Font = {
    fontName: FontName.Courier,
    fontStyles: [FontStyle.Normal, FontStyle.Bold, FontStyle.Oblique, FontStyle.BoldItalic]
};

export const TimesFont: Font = {
    fontName: FontName.Times,
    fontStyles: [FontStyle.Roman, FontStyle.Bold, FontStyle.Italic, FontStyle.BoldItalic]
};

export const SymbolFont: Font = {
    fontName: FontName.Symbol,
    fontStyles: [FontStyle.Normal]
};

export const ZapfDingbatsFont: Font = {
    fontName: FontName.ZapfDingbats,
    fontStyles: [FontStyle.Normal]
};

export const helveticaFont: Font = {
    fontName: FontName.helvetica,
    fontStyles: [FontStyle.Normal, FontStyle.Bold, FontStyle.Italic, FontStyle.BoldItalic]
};

export const courierFont: Font = {
    fontName: FontName.courier,
    fontStyles: [FontStyle.Normal, FontStyle.Bold, FontStyle.Italic, FontStyle.BoldItalic]
};

export const timesFont: Font = {
    fontName: FontName.times,
    fontStyles: [FontStyle.Normal, FontStyle.Bold, FontStyle.Italic, FontStyle.BoldItalic]
};

export const symbolFont: Font = {
    fontName: FontName.symbol,
    fontStyles: [FontStyle.Normal]
};

export const zapfdingbatsFont: Font = {
    fontName: FontName.zapfdingbats,
    fontStyles: [FontStyle.Normal]
};

