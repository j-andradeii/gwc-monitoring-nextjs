/**
 * Signin Page
 *
 * Modern authentication page consistent with landing page design
 */

'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Image from 'next/image';
import { FormInput } from '@/components/forms/FormInput';
import { FormPassword } from '@/components/forms/FormPassword';
import { useScrollToFirstError } from '@/components/forms';
import { ToastProvider } from '@/components/ui/Toast';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth, useRedirectIfAuthenticated } from '@/hooks/useAuth';
import { loginSchema, type LoginFormData } from '@/models/schemas/auth.schema';
import { CONST, HTTP_STATUS, ROUTES } from '@/core/constants';
import { Messages } from '@/core/messages';
import type { ApiError } from '@/services/api-client';
import '@/styles/landing.css';
import '@/styles/signin.css';

/** "1 second" / "42 seconds" for the rate-limit notice. */
const formatWait = (seconds: number): string => `${seconds} second${seconds === 1 ? '' : 's'}`;

function SigninForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  // 429 from the API: the wait it asked for (null = not waiting) and the live countdown
  const [waitSeconds, setWaitSeconds] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const isWaiting = waitSeconds !== null;

  // Counts down from an end time, not by decrementing, so a throttled background tab stays accurate.
  // The clock is read here because render must stay pure.
  useEffect(() => {
    if (waitSeconds === null) return;
    const retryUntil = Date.now() + waitSeconds * 1000;
    const timer = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((retryUntil - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left === 0) setWaitSeconds(null);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [waitSeconds]);

  /**
   * SUBSCRIBES TO AUTH STATE CHANGES
   * Redirects to dashboard if already authenticated
   * WILL CHANGE THIS TO THE TRADITIONAL API EVENT CALLBACK
   */
  useRedirectIfAuthenticated();

  const requestedReturnUrl = searchParams.get('returnUrl');
  const returnUrl = requestedReturnUrl?.startsWith('/') && !requestedReturnUrl.startsWith('//')
    ? requestedReturnUrl
    : ROUTES.DASHBOARD;

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange', // Enable real-time validation as user types
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const scrollToError = useScrollToFirstError();

  const startWait = (seconds: number) => {
    setLoginError(null);
    setSecondsLeft(seconds);
    setWaitSeconds(seconds);
  };

  const onSubmit = async (data: LoginFormData) => {
    if (isWaiting) return;
    setLoginError(null);

    try {
      const success = await login(data);

      if (success) {
        router.push(returnUrl);
      } else {
        setLoginError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError?.status === HTTP_STATUS.TOO_MANY_REQUESTS) {
        // No readable Retry-After (e.g. CORS didn't expose it) → the API's login throttle window
        startWait(apiError.retryAfter ?? CONST.LOGIN_RETRY_FALLBACK_SECONDS);
        return;
      }
      setLoginError('We could not sign you in. Please check your details and try again.');
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-branding">
        <div className="signin-branding-content">
          <Link href="/" className="signin-brand-lockup signin-reveal" aria-label="Gateway Church home">
            <span className="signin-logo">
              <Image
                src="/assets/images/gwc-logo-gold.png"
                alt="Gateway Church mark"
                width={64}
                height={52}
                priority
              />
            </span>
            <span>
              <strong>Gateway Church</strong>
              <small></small>
            </span>
          </Link>

          <div className="signin-branding-main">
            <p className="signin-eyebrow signin-reveal">Gateway Church</p>
            <h1 className="signin-reveal">Welcome back</h1>
            <p className="signin-branding-copy signin-reveal">
              Sign in to pick up right where you left off.
            </p>
          </div>
        </div>

        <div className="signin-branding-footer">
          <p>&copy; {new Date().getFullYear()} Gateway Church. All rights reserved.</p>
        </div>
      </div>

      <div className="signin-form-container">
        <div className="signin-form-wrapper">
          <div className="signin-form-topbar">
            <Link href="/" className="signin-back-link">
              <i className="pi pi-arrow-left" aria-hidden="true"></i>
              <span>Home</span>
            </Link>
            <span className="signin-access-pill">Private access</span>
          </div>

          <div className="signin-mobile-logo">
            <Link href="/">
              <Image
                src="/assets/images/gwc-logo-gold.png"
                alt="Gateway Church mark"
                width={64}
                height={52}
                priority
              />
            </Link>
            <h2>Gateway Church</h2>
          </div>

          <div className="signin-form-header">
            <p className="signin-form-kicker">Account access</p>
            <h2>Sign in</h2>
            <p>Use your Gateway Church account to continue.</p>
          </div>

          {isWaiting && (
            <div className="signin-error" role="alert">
              <i className="pi pi-clock" aria-hidden="true"></i>
              {/* Announced once with the starting wait; the ticking copy is hidden so it isn't re-read every second */}
              <span className="sr-only">
                {Messages.MESSAGE_TOO_MANY_SIGNIN_ATTEMPTS} Please wait {formatWait(waitSeconds ?? 0)} before trying again.
              </span>
              <span aria-hidden="true">
                {Messages.MESSAGE_TOO_MANY_SIGNIN_ATTEMPTS} Please wait {formatWait(secondsLeft)} before trying again.
              </span>
            </div>
          )}

          {loginError && (
            <div className="signin-error" role="alert" aria-live="assertive">
              <i className="pi pi-exclamation-circle" aria-hidden="true"></i>
              <span>{loginError}</span>
            </div>
          )}

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit, scrollToError)} className="signin-form">
              <div className="signin-field">
                <FormInput
                  name="email"
                  label="Email"
                  placeholder="you@example.com"
                  showRequired
                  displayDisabled={isSubmitting || isLoading || isWaiting}
                />
              </div>

              <div className="signin-field">
                <FormPassword
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  showRequired
                  displayDisabled={isSubmitting || isLoading || isWaiting}
                  feedback={false}
                />
              </div>

              <div className="signin-options">
                <label className="signin-remember">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link href="/forgot-password" className="signin-forgot">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="signin-submit landing-btn landing-btn-primary"
                disabled={isSubmitting || isLoading || isWaiting}
              >
                {isWaiting ? (
                  <>
                    <i className="pi pi-clock" aria-hidden="true"></i>
                    <span>Try again in {secondsLeft}s</span>
                  </>
                ) : isSubmitting || isLoading ? (
                  <>
                    <i className="pi pi-spin pi-spinner"></i>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <i className="pi pi-sign-in"></i>
                    <span>Sign in</span>
                  </>
                )}
              </button>
            </form>
          </FormProvider>

          <div className="signin-footer">
            <p>
              Need access or having trouble? <Link href="/#contact">Contact Support</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SigninPage() {
  return (
    <ToastProvider>
      <Suspense fallback={<Spinner center label="Loading..." />}>
        <SigninForm />
      </Suspense>
    </ToastProvider>
  );
}
