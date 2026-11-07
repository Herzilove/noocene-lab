import type { NextRequest } from 'next/server';
import { validOrigin } from '../../lib/quest-core';

export function validRequestOrigin(req: NextRequest) {
  const configured = process.env.APP_ORIGIN;
  if (configured) return validOrigin(req.headers.get('origin'), configured);
  // Next may normalize req.url to localhost while the browser uses 127.0.0.1.
  // Host reflects the browser destination. Never trust forwarded-host or Origin
  // itself to construct the expected destination.
  const host = req.headers.get('host');
  if (!host || !/^[a-zA-Z0-9.\-:\[\]]+$/.test(host)) return false;
  return validOrigin(req.headers.get('origin'), `${req.nextUrl.protocol}//${host}`);
}
