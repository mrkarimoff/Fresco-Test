/* eslint-disable no-console */
import type { Session } from 'lucia';
import type { Route } from 'next';
import { type ReadonlyURLSearchParams } from 'next/navigation';
import { cache } from 'react';

export const calculateRedirect = ({
  session,
  path,
  searchParams,
  expired,
  configured,
}: {
  session: Session | null;
  path: Route;
  searchParams: ReadonlyURLSearchParams;
  expired: boolean;
  configured: boolean;
}): undefined | Route => {
  // If for some reason we weren't given a path, bail out.
  if (!path) {
    throw new Error('No path provided to calculateRedirect!');
  }

  const isLoginPage = path === '/signin';
  const isLandingPage = path === '/';
  const isOnboarding = path.startsWith('/setup');
  const isInterviewing = path.startsWith('/interview');
  const isExpiredPage = path === '/expired';

  /**
   * `configured` - setup has been completed
   * `expired` - the setup window has expired. always false if configured is true.
   */

  if (expired) {
    if (!isExpiredPage) {
      return '/expired';
    }

    return;
  }

  // APP IS NOT EXPIRED
  // If not configured, but not expired, redirect to onboard.
  if (!configured) {
    if (!isOnboarding) {
      return '/setup';
    }

    return;
  }

  // APP IS CONFIGURED
  if (!session) {
    if (isLoginPage) {
      return;
    }

    if (isInterviewing) {
      return;
    }

    return ('/signin?callbackUrl=' + encodeURI(path)) as Route;
  }

  // APP IS CONFIGURED AND SESSION EXISTS

  // Redirect authed users away from these pages and to the dashboard
  if (isLoginPage || isOnboarding || isLandingPage || isExpiredPage) {
    if (isLoginPage) {
      const callbackUrl = searchParams.get('callbackUrl') as Route;

      if (callbackUrl) {
        return callbackUrl;
      }
    }

    return '/dashboard';
  }

  // APP IS CONFIGURED AND SESSION EXISTS AND USER IS WHERE THEY REQUESTED TO BE
  return;
};

export const calculateRedirectCached = cache(calculateRedirect);
