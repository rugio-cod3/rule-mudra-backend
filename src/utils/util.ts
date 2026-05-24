import config from "@/config/default";
import { BLOCKED_PINCODE_RANGE } from "@/helpers/blockedPincode";
import { ILead } from "@/interfaces/lead.interface";
import reader from "xlsx";
import { logger } from "./logger";
const crypto = require("crypto");

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== "number" && value === "") {
    return true;
  } else if (typeof value === "undefined" || value === undefined) {
    return true;
  } else if (
    value !== null &&
    typeof value === "object" &&
    !Object.keys(value).length
  ) {
    return true;
  } else {
    return false;
  }
};

/**
 * @method formatDate
 * @param {string} date
 * @returns yyyy-MM-dd formatted date
 */
export const formatDate = (date: string): string => {
  // edge case
  if (!date) return null;
  if (date.length > 10) date = date.slice(0, 10);
  const arr = date.split("/");
  if (arr.length == 1) return arr[0];
  arr.reverse();
  const newDate = arr.join("-");
  return newDate;
};

/**
 * @method isGoodDate
 * @param {String } dt
 * @returns {Boolean} true & false
 * @description this dt is date format Check ie (DD-MM-YYYY)
 */
export const isGoodDate = (dt: string): boolean => {
  const reGoodDate =
    /^(0?[1-9]|[12][0-9]|3[01])[- /.]((0?[1-9]|1[012])[- /.](19|20)?[0-9]{2})*$/;
  return reGoodDate.test(dt);
};

/**
 * @method formatDates
 * @param {String } dt
 * @returns {Date} true & false
 * @description dt will be formatted to (YYYY/MM/DD)
 */
export const formatDates = (dt: string): Date => {
  if (dt.includes("-")) {
    return new Date(dt.split("-").reverse().join("/"));
  }
  return new Date(dt.split("/").reverse().join("/"));
};

export const getDataFromFile = (fileParam: any): any[] => {
  const file = reader.read(fileParam.buffer, { type: "buffer" });

  const data = [];

  const sheets = file.SheetNames;

  for (let i = 0; i < sheets.length; i++) {
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
    temp.forEach((res) => {
      data.push(res);
    });
  }

  return data;
};

export const convertToNumbers = (objBody: object, paramsArr: string[]) => {
  for (const key in objBody) {
    if (paramsArr.includes(key)) objBody[key] = Number(objBody[key]);
  }
};

export const convertToArray = (objBody: object, paramsArr: string[]) => {
  for (const param of paramsArr) {
    const val = objBody[param];
    if (val && !Array.isArray(val)) {
      try {
        objBody[param] = JSON.parse(val);
      } catch (err) {
        logger.error(err.stack);
      }
    }
  }
};

export const replaceNameClippingsRe = (name: string) => {
  name = name.toLowerCase();
  const clippings = [
    "mr.",
    "miss.",
    "mrs.",
    "ms.",
    "dr.",
    "prof.",
    "rev.",
    "capt.",
    "col.",
    "sgt.",
    "fr.",
    "sr.",
    "jr.",
    "adv.",
    "engr.",
    "cdr.",
    "gov.",
    "er.",
    "smt.",
    "lt.",
    "maj.",
    "gen.",
    "pt.",
    "mr",
    "miss",
    "mrs",
    "ms",
    "dr",
    "prof",
    "rev",
    "capt",
    "col",
    "sgt",
    "fr",
    "sr",
    "jr",
    "adv",
    "engr",
    "cdr",
    "gov",
    "er",
    "smt",
    "lt",
    "maj",
    "gen",
    "swami",
    "guruji",
    "pandit",
    "panditji",
    "acharya",
    "maharaj",
    "baba",
    "dean",
    "ca",
    "cs",
    "hon'ble",
    "shri",
    "shree",
    "air cmde",
    "justice",
    "mp",
    "mla",
    "cm",
    "pm",
    "ji",
    "sahib",
    "saheb",
    "thiru",
    "seth",
    "bhai",
    "behen",
    "ben",
    "chacha",
    "tai",
  ];

  const excludeClippings = {
    "s/o": "s/o",
    "d/o": "d/o",
    "w/o": "w/o",
    "h/o": "h/o",
    "c/o": "c/o",
  };

  const sortedClippings = clippings.sort((a, b) => a.length - b.length);

  // Check for and remove clippings at the start of the name
  for (const clipping of sortedClippings) {
    if (name.startsWith(clipping)) {
      name = name.substring(clipping.length).trim();
      break;
    }
  }

  for (let clipping in excludeClippings) {
    let prefix = excludeClippings[clipping];
    const regex = new RegExp(`\\b${prefix}\\s+`, "i");
    if (regex.test(name)) {
      // name = name.replace(regex, '').trim()
      name = name.split(regex)[0].trim(); // Remove everything after the clipping
      break;
    }
  }

  let arrName = name.split(/\s+/);
  while (arrName.length > 0 && sortedClippings.includes(arrName[0])) {
    arrName.shift();
  }
  name = arrName.join(" ");

  return removeDotsAndAddSpace(name.trim());
};

export function compareTwoStrings(first: string, second: string): number {
  // Normalize and split both names
  const words1 = normalizeAndSplit(first);
  const words2 = normalizeAndSplit(second);

  // Find common words
  const commonWords = words1.filter((word) => words2.includes(word));

  // Calculate similarity percentage
  const totalUniqueWords = new Set([...words1, ...words2]).size;
  const similarityPercentage = (commonWords.length / totalUniqueWords) * 100;

  return similarityPercentage;
}

export const normalizeAndSplit = (name: string): string[] => {
  return name.toUpperCase().trim().split(/\s+/);
};

export const roundAmountBanking = (amount: number) => {
  // Convert to integer
  amount = Math.floor(Number(amount));

  let roundedAmount;
  if (amount % 1000 !== 0) {
    roundedAmount = Math.ceil(amount / 1000) * 1000;
  } else {
    roundedAmount = amount;
  }

  // Cap at 30000
  if (roundedAmount > 30000) {
    roundedAmount = 30000;
  }

  return roundedAmount;
};

export function removeDotsAndAddSpace(str: string) {
  // Remove dots at the beginning or end
  str = str.replace(/^\./, "").replace(/\.$/, "");

  // Replace dots in the middle with a space
  return str.replace(/\.(?=\S)/g, " ");
}

export const maskString = (
  str: string | number,
  lengthToMask: number,
  char?: string,
) => {
  if (typeof str === "number") {
    str = String(str);
  }

  return char
    ? char.repeat(lengthToMask) + str.slice(lengthToMask)
    : "X".repeat(lengthToMask) + str.slice(lengthToMask);
};

export const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const convertRupeesToPaise = (amount: number) => {
  return amount * 100;
};

export function truncateString(inputString: string, maxLength = 35) {
  if (inputString.length > maxLength) {
    const truncatedString = inputString.substring(0, maxLength);
    return truncatedString;
  } else {
    return inputString;
  }
}

export function injectBindings(sql: string, bindings: string | Array<any>) {
  let index = 0;
  return sql.replace(/\?/g, () => {
    const binding = bindings[index++];
    return typeof binding === "string" ? `'${binding}'` : binding;
  });
}

export function sanitizeData(data: string | object | Array<any>) {
  if (typeof data === "string") {
    return data.replace(/[^\w\s]/g, "");
  } else if (Array.isArray(data)) {
    return data.map(sanitizeData);
  } else if (typeof data === "object" && data !== null) {
    const sanitized = {};
    data = { ...data };
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        sanitized[key] = sanitizeData(data[key]);
      }
    }
    return sanitized;
  }
  return data;
}

export const sampleReferencePayload = {
  address: "N/A",
  city: "N/A",
  state: "N/A",
  pincode: 0,
  createdBy: +config.defaultUserId,
};

export const roundNumber = (num: number, precision?: number) => {
  if (precision) return parseFloat(num.toFixed(2));
  return Math.round(num);
};

export const checkValidLead = (lead: ILead, leadID: number) => {
  return lead.leadID === leadID;
};

export const roundAmountBre = (amount: number) => {
  let roundedAmount: number;

  // Check if amount is divisible by 1000
  if (amount % 1000 !== 0) {
    roundedAmount = Math.ceil(amount / 1000) * 1000;
  } else {
    roundedAmount = amount;
  }

  // If the rounded amount is greater than 20000, cap it at 20000
  if (roundedAmount > 20000) {
    roundedAmount = 20000;
  }

  return roundedAmount;
};

export const generatePennyDropId = () => {
  // Randomly select either 15 or 16 as the string length
  const length = Math.floor(Math.random() * 2) + 15; // Generates either 15 or 16

  // Generate random bytes and convert them to hexadecimal
  let uniqueString = crypto
    .randomBytes(length)
    .toString("hex") // Convert to hexadecimal format
    .slice(0, length); // Ensure the length is exactly 15 or 16

  return "fav_" + uniqueString;
};

function similarText(first: string, second: string) {
  let pos1 = 0,
    pos2 = 0,
    max = 0;
  let firstLength = first.length;
  let secondLength = second.length;

  for (let p = 0; p < firstLength; p++) {
    for (let q = 0; q < secondLength; q++) {
      let l = 0;
      while (
        p + l < firstLength &&
        q + l < secondLength &&
        first.charAt(p + l) === second.charAt(q + l)
      ) {
        l++;
      }
      if (l > max) {
        max = l;
        pos1 = p;
        pos2 = q;
      }
    }
  }

  let match = max;
  if (match) {
    match += similarText(first.substr(pos1 + max), second.substr(pos2 + max));
    match += similarText(first.substr(0, pos1), second.substr(0, pos2));
  }

  return match;
}

export function similarityPercent(first: string, second: string) {
  const match = similarText(first, second);
  return (match * 200) / (first.length + second.length);
}

export const generateFinboxLinkId = (customerID: number, env: "km" | "rf") => {
  if (env === "rf") return `rf-${customerID}`;
  else return `km-${customerID}`;
};

export const isPincodeBlocked = (pincode: string | number): boolean => {
  const numericPincode = Number(pincode);

  return BLOCKED_PINCODE_RANGE.some(
    (range) => numericPincode >= range.start && numericPincode <= range.end,
  );
};
