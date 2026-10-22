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

  database: {
    url: process.env.DATABASE_URL || process.env.POSTGRES_URL || '',
  },

  firebase: {
    apiKey: process.env.FIREBASE_API_KEY || '',
    idtUrl: process.env.FIREBASE_IDT_URL || '',
    instanceIdToken: process.env.FIREBASE_INSTANCE_ID_TOKEN || '',
  },

  alightMotion: {
    verifyUrl: process.env.ALIGHT_VERIFY_URL || '',
    productId: process.env.ALIGHT_PRODUCT_ID || 'am.full.sub.annual.19q4',
    purchaseToken: process.env.ALIGHT_PURCHASE_TOKEN || '',
    continueUrl: process.env.ALIGHT_CONTINUE_URL || '',
    androidPackage: process.env.ALIGHT_ANDROID_PACKAGE || 'com.alightcreative.motion',
    androidCert: process.env.ALIGHT_ANDROID_CERT || '',
    androidMinVersion: process.env.ALIGHT_ANDROID_MIN_VERSION || '585',
    iosBundleId: process.env.ALIGHT_IOS_BUNDLE_ID || 'com.alightcreative.motion',
    dalvikUserAgent: process.env.ALIGHT_DALVIK_USER_AGENT || 'dalvik/2.1.0 (linux; u; android 15; 23127pn0cc build/bp1a.250505.005)',
    okhttpUserAgent: process.env.ALIGHT_OKHTTP_USER_AGENT || 'okhttp/3.12.1',
  },

  security: {
    apiSecretKey: process.env.API_SECRET_KEY || '',
    corsOrigin: process.env.CORS_ORIGIN || '*',
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    sendLinkLimitMax: parseInt(process.env.SEND_LINK_LIMIT_MAX || '5', 10),
    verifyLimitMax: parseInt(process.env.VERIFY_LIMIT_MAX || '10', 10),
  },
};
