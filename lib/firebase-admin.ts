import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

function getFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  const serviceAccount = require("@/firebase-service-account.json");

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

export function getFirebaseAdminMessaging() {
  return getMessaging(getFirebaseAdminApp());
}