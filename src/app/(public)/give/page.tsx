/**
 * Give Page - Redirect to default tab
 *
 * Primary redirect is handled by middleware for instant edge-level redirect.
 * This component serves as a fallback only.
 */

import { redirect } from 'next/navigation';

export default function GivePage() {
  redirect('/give/ways-to-give');
}
