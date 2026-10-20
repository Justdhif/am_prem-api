import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  statsFilePath: process.env.STATS_FILE_PATH
    ? path.resolve(process.cwd(), process.env.STATS_FILE_PATH)
    : process.env.VERCEL
    ? path.resolve('/tmp', 'stats.json')
    : path.resolve(process.cwd(), 'data', 'stats.json'),

  firebase: {
    apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyDtG1AU22ErnQD60AzBAcaknySiz9_CEq0',
    idtUrl: process.env.FIREBASE_IDT_URL || 'https://www.googleapis.com/identitytoolkit/v3/relyingparty',
    instanceIdToken:
      process.env.FIREBASE_INSTANCE_ID_TOKEN ||
      'cSDnCyp3T-uwp07z3tL86T:APA91bFkmvvsHw5nnqa1SBFci-99DRsKClLiETdRrVcJjS5yBx1v_FbCb1d8WhBuea_zmwnYBktyTIzcRhN4b6uNOUur9wPc0gKXmJDoZic0LhNq5V2s0xI',
  },

  alightMotion: {
    verifyUrl:
      process.env.ALIGHT_VERIFY_URL ||
      'https://us-central1-alight-creative.cloudfunctions.net/verifyPurchase',
    productId: 'am.full.sub.annual.19q4',
    purchaseToken:
      'mmgaobamlahbbeccfplmbkbb.AO-J1OzqG0or_GJJIx-ms8GrTm-jaglCRfhQSRPUZKpl2YspYS-oN7_94uv8RC5vQbvd_Ios2pPDStZ2n7F0hLE3FiOU7HS3R6Fquulv5xLXFECSv4ctElw',
    continueUrl: 'https://alightcreative.com?ui_sid=0366624874&ui_sd=0',
    androidPackage: 'com.alightcreative.motion',
    androidCert: 'ECA6BF91B8715A6F810ED0BBFC65B6CD578F52A8',
    androidMinVersion: '585',
    iosBundleId: 'com.alightcreative.motion',
    dalvikUserAgent: 'dalvik/2.1.0 (linux; u; android 15; 23127pn0cc build/bp1a.250505.005)',
    okhttpUserAgent: 'okhttp/3.12.1',
  },
};
