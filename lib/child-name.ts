/**
 * Returns a child's name safe for public display.
 *
 * For child privacy, only the first name is shown on public pages
 * (sponsor grid, homepage testimonials, featured profile). The full
 * name (first + last) is reserved for admin pages, which consume the
 * same `/api/children` data but render it in admin-only components.
 */
export function getPublicChildDisplayName(
  firstName?: string | null,
  lastName?: string | null,
): string {
  const first = (firstName || "").trim();
  return first || "Child";
}
