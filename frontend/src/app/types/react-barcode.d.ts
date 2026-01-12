declare module 'react-barcode' {
  import * as React from 'react';

  interface BarcodeProps {
    value: string;
    format?: 'CODE39' | 'CODE128' | 'EAN13' | 'ITF' | 'ITF14' | 'MSI' | 'pharmacode' | 'codabar' | 'UPC' | 'EAN8';
    width?: number;
    height?: number;
    displayValue?: boolean;
    text?: string;
    fontOptions?: string;
    font?: string;
    textAlign?: string;
    textPosition?: string;
    textMargin?: number;
    fontSize?: number;
    background?: string;
    lineColor?: string;
    margin?: number;
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
  }

  const Barcode: React.FC<BarcodeProps>;
  export default Barcode;
}
