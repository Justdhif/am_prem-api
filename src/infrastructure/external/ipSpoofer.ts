import crypto from 'crypto';

/**
 * Generates a random IPv4 address (e.g. 1-254.0-255.0-255.1-254)
 */
export function generateRandomIp(): string {
  return `${crypto.randomInt(1, 255)}.${crypto.randomInt(0, 255)}.${crypto.randomInt(0, 255)}.${crypto.randomInt(1, 255)}`;
}

/**
 * Injects spoofed client IP headers to bypass basic rate limiting / IP tracking.
 * Replicates the dip() & sp() behavior from justbot_v2.
 */
export function withSpoofedIpHeaders(headers: Record<string, string> = {}): Record<string, string> {
  return {
    ...headers,
    'x-forwarded-for': generateRandomIp(),
    'x-real-ip': generateRandomIp(),
    'client-ip': generateRandomIp(),
    'x-client-ip': generateRandomIp(),
    'x-originating-ip': generateRandomIp(),
    'x-cluster-client-ip': generateRandomIp(),
  };
}
