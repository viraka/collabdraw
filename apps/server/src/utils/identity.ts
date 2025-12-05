import { randomUUID } from "crypto";

export function generateId() {
  return randomUUID();
}

export function generateTag() {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit
}
