declare module "firebase-functions/https" {
  export function onCallGenkit(config: unknown, handler: (...args: unknown[]) => unknown): unknown
  export function hasClaim(claim: string): unknown
}

