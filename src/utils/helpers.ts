import Decimal from "decimal.js";
import * as Realm from 'realm-web';
import _, { isNumber } from 'lodash';
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


export async function uploadImages(data: { images: File[] }, currentUser: Realm.User) {
    // Your existing code for checks...

    const uploadResults = await Promise.all(data.images.map(file =>
      uploadImage(file, currentUser).catch(error => ({ error: error.toString() }))
    ));

    // Filter out successfully uploaded images and extract URLs
    const imageUrls: string[] = uploadResults
      .filter((result): result is { url: string } => result && 'url' in result)
      .map(result => result.url);

    // Optionally, collect errors for reporting
    const errors = uploadResults
      .filter((result): result is { error: string } => result && 'error' in result)
      .map(result => result.error);

    return {
        images: imageUrls,
        coverUrl: imageUrls[0] ?? '', // Fallback to an empty string if there's no image
        errors, // You can return errors for further handling if needed
    };
}

export async function uploadImage(file: File, currentUser: Realm.User): Promise<{ url?: string, error?: string }> {
    const base64FileContent = await fileToBase64(file);
    const fileDetails = {
        base64FileContent,
        name: file.name,
        path: '', // Adjust based on your file organization needs
        contentType: file.type,
    };

    try {
        const url = await currentUser.functions.uploadFile(fileDetails);

        // Check for structured error responses
        if (_.isArray(url) && _.some(url, obj => _.has(obj, 'error'))) {
            return { error: `Upload failed: ${_.get(url, '[0].error', 'Unknown error')}` };
        }

        if (_.has(url, 'error')) {
            console.error('Upload failed:', url.error);
            return { error: `Upload failed: ${url.error}` };
        }

        // Assuming url is a string if there's no error
        return { url };
    } catch (error) {
        console.error('Upload failed:', error);
        return { error: error instanceof Error ? error.message : 'Unknown upload error' };
    }
}

export async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = _.replace(reader.result as string, /^data:.+;base64,/, '');
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
