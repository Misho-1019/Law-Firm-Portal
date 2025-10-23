// src/lib/leanSofia.js
import { toSofiaISO } from "./time.js";

// Mutates a plain object returned by `.lean()` to show Sofia-local timestamps
export function leanSofiaTransform(doc) {
  if (!doc) return doc;

  // top-level
  if ("startsAt" in doc)  doc.startsAt  = toSofiaISO(doc.startsAt);
  if ("createdAt" in doc) doc.createdAt = toSofiaISO(doc.createdAt);
  if ("updatedAt" in doc) doc.updatedAt = toSofiaISO(doc.updatedAt);

  // reminders
  const r = doc.reminders;
  if (r && typeof r === "object") {
    if ("send24hAt" in r) r.send24hAt = toSofiaISO(r.send24hAt);
    if ("sent24hAt" in r) r.sent24hAt = toSofiaISO(r.sent24hAt);
    if ("send1hAt"  in r) r.send1hAt  = toSofiaISO(r.send1hAt);
    if ("sent1hAt"  in r) r.sent1hAt  = toSofiaISO(r.sent1hAt);
  }

  return doc;
}
