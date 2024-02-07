import Decimal from "decimal.js";
import { isNumber } from "lodash";
import { cloneElement } from "react";

export async function convertBlobToFile(blob: string, fileName: string): Promise<File | null> {
    try {
        const response = await fetch(blob);
        const blobData = await response.blob();
        return new File([blobData], fileName);
    } catch (error) {
        console.error('Error converting blob to file:', error);
        return null;
    }
}

export const calculateDiscount = (price: number, discountRate: number, quantity: number, taxRate: number): null | { discount: number, totalTaxableAmount: number, totalAmount: number, totalTaxAmount: number, taxableAmount: number, taxAmount: number, totalPrice: number } => {
    if (!(isNumber(price) && isNumber(discountRate) && isNumber(taxRate) && isNumber(quantity))) {
        return null
    }
    console.log(price, 'LOCAL PRICE')
    const localPrice = new Decimal(price);
    const discountDecimal = new Decimal(discountRate).dividedBy(new Decimal(100))
    const taxRateDecimal = new Decimal(taxRate).dividedBy(new Decimal(100))
    const quantityLocal = new Decimal(quantity)

    const discLocalAmount = localPrice.times(discountDecimal);
    const totalLocalTaxable = localPrice.minus(discLocalAmount);
    const totalLocalTaxAmount = totalLocalTaxable.times(taxRateDecimal);
    const totalLocalTotalAmount = totalLocalTaxable.add(totalLocalTaxAmount)

    return {
        discount: discLocalAmount.toDecimalPlaces(2).times(quantityLocal).toNumber(),
        totalTaxableAmount: totalLocalTaxable.toDecimalPlaces(2).times(quantityLocal).toNumber(),
        totalAmount: totalLocalTotalAmount.toDecimalPlaces(2).times(quantityLocal).toNumber(),
        totalTaxAmount: totalLocalTaxAmount.toDecimalPlaces(2).times(quantityLocal).toNumber(),
        taxableAmount: totalLocalTaxable.toDecimalPlaces(2).toNumber(),
        taxAmount: totalLocalTaxAmount.toDecimalPlaces(2).toNumber(),
        totalPrice: totalLocalTotalAmount.toDecimalPlaces(2).toNumber(),
    }

}

export const calculateTax = (price: number, tax: number, quantity: number): { tax: number, total: number } | null => {
    if (!(isNumber(price) && isNumber(tax) && isNumber(quantity)))
        return null
    const localPrice = new Decimal(price);
    const taxLocal = new Decimal(tax)
    const quantityLocal = new Decimal(quantity)

    if (tax > 0) {
        const taxLocalAmount = localPrice.times(taxLocal.div(100));
        const totalLocalAmount = localPrice.add(taxLocalAmount);
        return {
            total: totalLocalAmount.toDecimalPlaces(2).times(quantityLocal).toNumber(),
            tax: taxLocalAmount.toDecimalPlaces(2).times(quantityLocal).toNumber()
        }
    }
    return {
        total: localPrice.times(quantityLocal).toDecimalPlaces(2).toNumber(),
        tax
    };
}

export const generate = (element: React.ReactElement, size: number = 3) => {
    const arr = Array.from({ length: size }, (_, index) => index + 1)
    return arr.map((value) =>
      cloneElement(element, {
        key: value,
      }),
    );
  }
export const hyphenateEvery4Letters = (input: string) => input?.replace(/(.{4})(?=.{1,})/g, '$1-');

