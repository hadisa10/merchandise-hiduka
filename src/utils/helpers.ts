import Decimal from 'decimal.js';
import * as Realm from 'realm-web';
import _, { isNumber } from 'lodash';
import { cloneElement } from 'react';
import { intervalToDuration } from 'date-fns';

import { paths } from 'src/routes/paths';

import { ERole } from 'src/config-global';

import uuidv4 from './uuidv4';

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

export const calculateDiscount = (
  price: number,
  discountRate: number,
  quantity: number,
  taxRate: number
): null | {
  discount: number;
  totalTaxableAmount: number;
  totalAmount: number;
  totalTaxAmount: number;
  taxableAmount: number;
  taxAmount: number;
  totalPrice: number;
} => {
  if (!(isNumber(price) && isNumber(discountRate) && isNumber(taxRate) && isNumber(quantity))) {
    return null;
  }
  console.log(price, 'LOCAL PRICE');
  const localPrice = new Decimal(price);
  const discountDecimal = new Decimal(discountRate).dividedBy(new Decimal(100));
  const taxRateDecimal = new Decimal(taxRate).dividedBy(new Decimal(100));
  const quantityLocal = new Decimal(quantity);

  const discLocalAmount = localPrice.times(discountDecimal);
  const totalLocalTaxable = localPrice.minus(discLocalAmount);
  const totalLocalTaxAmount = totalLocalTaxable.times(taxRateDecimal);
  const totalLocalTotalAmount = totalLocalTaxable.add(totalLocalTaxAmount);

  return {
    discount: discLocalAmount.toDecimalPlaces(2).times(quantityLocal).toNumber(),
    totalTaxableAmount: totalLocalTaxable.toDecimalPlaces(2).times(quantityLocal).toNumber(),
    totalAmount: totalLocalTotalAmount.toDecimalPlaces(2).times(quantityLocal).toNumber(),
    totalTaxAmount: totalLocalTaxAmount.toDecimalPlaces(2).times(quantityLocal).toNumber(),
    taxableAmount: totalLocalTaxable.toDecimalPlaces(2).toNumber(),
    taxAmount: totalLocalTaxAmount.toDecimalPlaces(2).toNumber(),
    totalPrice: totalLocalTotalAmount.toDecimalPlaces(2).toNumber(),
  };
};

export const calculateTax = (
  price: number,
  tax: number,
  quantity: number
): { tax: number; total: number } | null => {
  if (!(isNumber(price) && isNumber(tax) && isNumber(quantity))) return null;
  const localPrice = new Decimal(price);
  const taxLocal = new Decimal(tax);
  const quantityLocal = new Decimal(quantity);

  if (tax > 0) {
    const taxLocalAmount = localPrice.times(taxLocal.div(100));
    const totalLocalAmount = localPrice.add(taxLocalAmount);
    return {
      total: totalLocalAmount.toDecimalPlaces(2).times(quantityLocal).toNumber(),
      tax: taxLocalAmount.toDecimalPlaces(2).times(quantityLocal).toNumber(),
    };
  }
  return {
    total: localPrice.times(quantityLocal).toDecimalPlaces(2).toNumber(),
    tax,
  };
};

export const generate = (element: React.ReactElement, size: number = 3) => {
  const arr = Array.from({ length: size }, (__, index) => index + 1);
  return arr.map((value) =>
    cloneElement(element, {
      key: value,
    })
  );
};
export const hyphenateEvery4Letters = (input: string) => input?.replace(/(.{4})(?=.{1,})/g, '$1-');

export async function uploadImages(data: { images: File[] }, currentUser: Realm.User) {
  // Your existing code for checks...

  const uploadResults = await Promise.all(
    data.images.map((file) =>
      uploadImage(file, currentUser).catch((error) => ({ error: error.toString() }))
    )
  );

  // Filter out successfully uploaded images and extract URLs
  const imageUrls: string[] = uploadResults
    .filter((result): result is { url: string } => result && 'url' in result)
    .map((result) => result.url);

  // Optionally, collect errors for reporting
  const errors = uploadResults
    .filter((result): result is { error: string } => result && 'error' in result)
    .map((result) => result.error);

  return {
    images: imageUrls,
    coverUrl: imageUrls[0] ?? '', // Fallback to an empty string if there's no image
    errors, // You can return errors for further handling if needed
  };
}

export async function uploadImage(
  file: File,
  currentUser: Realm.User
): Promise<{ url?: string; error?: string }> {
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
    if (_.isArray(url) && _.some(url, (obj) => _.has(obj, 'error'))) {
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
// export const removeAndFormatNullFields = <T>(
//     data: T,
//     formatOptionsArray?: { key: keyof T; formatter: (value: any) => any }[],
//     removeFields?: (keyof T)[]
// ): T | undefined => {
//     // Check if the data is an object and not null
//     if (typeof data === 'object' && data !== null) {
//         // Use generics to preserve the structure of arrays or objects
//         return Object.entries(data).reduce((acc: any, [key, value]) => {
//             // Skip any field that is in the removeFields list or has key __typename
//             if (key === '__typename' || removeFields?.includes(key as keyof T)) {
//                 return acc;
//             }
//             // Check if the current key has a specified format option
//             const formatOption = formatOptionsArray?.find(option => option.key === key);
//             if (formatOption) {
//                 // Apply the formatter function if found
//                 value = formatOption.formatter(value);
//             }
//             // Recursively clean the value
//             const cleanedValue = removeAndFormatNullFields(value, formatOptionsArray, removeFields);
//             // If the cleaned value is not undefined, add it to the accumulator
//             if (cleanedValue !== undefined) {
//                 acc[key] = cleanedValue;
//             }
//             return acc;
//         }, Array.isArray(data) ? [] : {}) as T; // Cast the result to the same type as input
//     }
//         // Return the value if it's not null, otherwise return undefined
//         return data !== null ? data : undefined;

// };
export const removeAndFormatNullFields = <T>(
  data: T,
  formatOptionsArray?: { key: keyof T; formatter: (value: any) => any }[],
  removeFields?: (keyof T)[],
  mismatchConditions?: { key: keyof T; predicate: (value: any) => boolean }[]
): T | undefined => {
  // Check if the data is an object and not null
  if (typeof data === 'object' && data !== null) {
    return Object.entries(data).reduce(
      (acc: any, [key, value]) => {
        // Skip any field that is in the removeFields list, has key __typename, or does not meet the mismatch condition
        if (key === '__typename' || removeFields?.includes(key as keyof T)) {
          return acc;
        }

        // Check for mismatch conditions and skip if predicate returns false
        const mismatchCondition = mismatchConditions?.find((condition) => condition.key === key);
        if (mismatchCondition && !mismatchCondition.predicate(value)) {
          return acc; // Skip adding this key-value pair
        }

        // Check if the current key has a specified format option
        const formatOption = formatOptionsArray?.find((option) => option.key === key);
        if (formatOption) {
          console.log(`${key}: ${value}`);
          value = formatOption.formatter(value); // Apply the formatter function if found
        }

        // Recursively clean the value
        const cleanedValue = removeAndFormatNullFields(
          value,
          formatOptionsArray,
          removeFields,
          mismatchConditions
        );

        // If the cleaned value is not undefined, add it to the accumulator
        if (cleanedValue !== undefined) {
          acc[key] = cleanedValue;
        }
        return acc;
      },
      Array.isArray(data) ? [] : {}
    ) as T; // Cast the result to the same type as input
  }
  // Return the value if it's not null, otherwise return undefined
  return data !== null ? data : undefined;
};

export const formatFilterAndRemoveFields = <T>(
  d: T,
  removeFields?: (keyof T)[],
  formatOptionsArray?: { key: keyof T; formatter: (value: any) => any }[],
  mismatchConditions?: { key: keyof T; predicate: (value: any) => boolean }[],
  orderedKeys?: (keyof T)[] // New parameter for specifying order
): T | undefined => {
  const process = <U>(data: U): U | undefined => {
    if (Array.isArray(data)) {
      return data.map((item) => process(item)) as unknown as U;
    }
    if (typeof data === 'object' && data !== null) {
      // Initialize a new object with the ordered keys positioned first.
      const orderedData: any =
        orderedKeys?.reduce((acc: any, key) => {
          if (key in data && !removeFields?.includes(key)) {
            acc[key] = (data as any)[key];
          }
          return acc;
        }, {}) || {};

      // Process remaining keys
      Object.entries(data).forEach(([key, value]) => {
        const keyOfT: keyof T = key as keyof T;

        // Skip if key is in orderedKeys or removeFields
        if (orderedKeys?.includes(keyOfT) || removeFields?.includes(keyOfT)) {
          return;
        }

        const mismatchCondition = mismatchConditions?.find((condition) => condition.key === keyOfT);
        if (mismatchCondition && !mismatchCondition.predicate(value)) {
          return; // Skip this key-value pair
        }

        const formatOption = formatOptionsArray?.find((option) => option.key === keyOfT);
        if (formatOption) {
          value = formatOption.formatter(value);
        }

        // Recursively process the value for nested objects/arrays
        orderedData[key] = process(value);
      });

      return orderedData as U;
    }
    return data;
  };

  return process(d);
};

export const safeDateFormatter = (value?: string): string => {
  if (!value) {
    return new Date().toISOString();
  }
  // Check if the value is a valid date string
  const timestamp = Date.parse(value);
  if (!Number.isNaN(timestamp)) {
    // If valid, return a Date object for the value
    return new Date(value).toISOString();
  }
  // If not valid, return a new Date object
  return new Date().toISOString();
};

export function generateAccessCode() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

export const removeNullFields = <T>(data: T): T | undefined => {
  // Check if the data is an object and not null
  if (typeof data === 'object' && data !== null) {
    // Use generics to preserve the structure of arrays or objects
    return Object.entries(data).reduce(
      (acc: any, [key, value]) => {
        // Recursively clean the value
        const cleanedValue = removeNullFields(value);
        // If the cleaned value is not undefined, add it to the accumulator
        if (cleanedValue !== undefined) {
          // Adjusted to check against undefined
          acc[key] = cleanedValue;
        }
        return acc;
      },
      Array.isArray(data) ? [] : {}
    ) as T; // Cast the result to the same type as input
  }
  // Return the value if it's not null, otherwise return undefined
  return data !== null ? data : undefined;
};

export function generateShortUniqueId(company = 'COMPANY') {
  const uuid = uuidv4();
  const buffer = Buffer.from(uuid.replace(/-/g, ''), 'hex');
  return `BRIS${buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '')
    .replace(/=+$/, '')
    .substring(0, 8)}${company}`.toUpperCase();
}

export const getRolePath = (rle: string) => {
  switch (rle) {
    case ERole.SUPERADMIN:
      return paths.v2.superadmin.root;
    case ERole.ADMIN:
      return paths.v2.admin.root;
    case ERole.CLIENT:
      return paths.v2.client.root;
    case ERole.PROJECT_MANAGER:
      return paths.v2['project-manager'].root;
    case ERole.TEAM_LEAD:
      return paths.v2['team-lead'].root;
    case ERole.AGENT:
    default:
      return paths.v2.agent.root;
  }
};

export function getRelevantTimeInfo(milliseconds: number): string {
  // Create a duration object from milliseconds
  const duration = intervalToDuration({ start: 0, end: milliseconds });

  // Determine the most relevant unit of time based on the duration
  if (duration.months && duration.months > 0) {
    return `${duration.months} month(s)`;
  }
  if (duration.days && duration.days > 0) {
    // Convert days to weeks and days for more precise output
    const weeks = Math.floor(duration.days / 7);
    const days = duration.days % 7;
    return `${weeks} week(s) ${days > 0 ? `and ${days} day(s)` : ''}`;
  }
  if (duration.days && duration.days > 0) {
    return `${duration.days} day(s)`;
  }
  if (duration.hours && duration.hours > 0) {
    return `${duration.hours} hour(s)`;
  }
  if (duration.minutes && duration.minutes > 0) {
    return `${duration.minutes} minute(s)`;
  }
  if (duration.seconds && duration.seconds > 0) {
    return `${duration.seconds} second(s)`;
  }
  return '0 seconds';
}

interface GenericDeepSearch<T> {
  nestedClients?: T[];
}

export function deepSearchGeneric<T extends GenericDeepSearch<T>>(
  clients: T[],
  regex: RegExp,
  searchableField: keyof T,
  nestedFieldName: keyof T = 'nestedClients',
  parentChain: T[] = [],
  topLevelParents: T[] = []
): { results: Array<{ client: T; parentChain: T[] }>; topLevelParents: T[] } {
  let results: Array<{ client: T; parentChain: T[] }> = [];

  clients.forEach((client) => {
    // Add top-level clients on first recursion level
    if (parentChain.length === 0) {
      topLevelParents.push(client);
    }

    // Current chain of parent clients including this client
    const currentChain = [...parentChain, client];

    // Check if the client's searchable field matches the regex
    if (regex.test(String(client[searchableField]))) {
      results.push({
        client,
        parentChain: [...parentChain], // Keep a copy of the current parent chain
      });
    }

    // Recurse into nested clients if they exist
    if (nestedFieldName in client && Array.isArray(client[nestedFieldName])) {
      const nestedResults = deepSearchGeneric(
        client[nestedFieldName] as T[],
        regex,
        searchableField,
        nestedFieldName,
        currentChain,
        topLevelParents
      );
      results = results.concat(nestedResults.results); // Concatenate only the results
    }
  });

  if (parentChain.length === 0) {
    return { results, topLevelParents }; // Return both results and top-level parents at the top level
  }

  return { results, topLevelParents: [] }; // Do not return top-level parents in deeper recursion levels
}

// Define your client interface

// interface GenericFindRootEL<TId extends string | number | symbol, T> {
//   _id:
//   [key: string]: T; // Allow any other properties
// }
interface GenericFindRootEL {
  _id: string;
}

export function findRootClient<T extends GenericFindRootEL>(
  clients: Record<string, T>,
  clientId: string,
  parentIdField: keyof T
): T | null {
  const visited = new Set<string>(); // To track visited clients and detect cycles

  let currentClient = clients[clientId];
  if (!currentClient) {
    return null; // Return null if the initial client doesn't exist
  }
  // Traverse up the parent chain until a client without a parent is found
  while (
    currentClient &&
    currentClient[parentIdField] !== null &&
    currentClient[parentIdField] !== undefined
  ) {
    const parentId = currentClient[parentIdField] as string;
    if (visited.has(parentId)) {
      console.error('Cycle detected! Aborting search.');
      return null; // Cycle detected, aborting
    }

    visited.add(currentClient._id); // Mark this client as visited

    if (!clients[parentId]) {
      console.error('Parent ID referenced but not found in record.');
      return null; // Referenced parent ID does not exist in the record
    }

    currentClient = clients[parentId]; // Move up to the parent
  }

  return currentClient; // This is the root client, as it has no parent
}
