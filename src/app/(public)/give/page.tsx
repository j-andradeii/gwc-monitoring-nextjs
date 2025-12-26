/**
 * Give Page - Redirect to default tab
 *
 * Redirects to /give/ways-to-give as the default tab
 */

import { redirect } from 'next/navigation';

export default function GivePage() {
  redirect('/give/ways-to-give');
}
