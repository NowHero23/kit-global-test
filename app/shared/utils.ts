import { Timestamp } from "firebase/firestore";

/**
 * Перетворює Firestore Timestamp у JavaScript Date.
 * Якщо значення вже є датою або відсутнє, повертає undefined.
 */
export const toDate = (timestamp: any): Date | undefined => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }

  if (timestamp instanceof Date) {
    return timestamp;
  }

  // Якщо це об'єкт типу Timestamp, але не екземпляр класу (наприклад, прийшов через JSON)
  if (timestamp && typeof timestamp === "object" && "seconds" in timestamp) {
    return new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
  }

  if (typeof timestamp === "string" || typeof timestamp === "number") {
    const date = new Date(timestamp);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }

  return undefined;
};
