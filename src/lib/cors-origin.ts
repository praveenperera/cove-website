export function isAllowedCorsOrigin(
  origin: string,
  requestOrigin: string,
  siteOrigins: ReadonlySet<string>,
): boolean {
  return origin === requestOrigin || siteOrigins.has(origin)
}
