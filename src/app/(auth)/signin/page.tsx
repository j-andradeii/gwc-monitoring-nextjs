/**
 * Signin Page
 *
 * Modern authentication page consistent with landing page design
 */

'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Image from 'next/image';
import { FormInput } from '@/components/forms/FormInput';
import { FormPassword } from '@/components/forms/FormPassword';
import { ToastProvider } from '@/components/ui/Toast';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth, useRedirectIfAuthenticated } from '@/hooks/useAuth';
import { loginSchema, type LoginFormData } from '@/models/schemas/auth.schema';
import { ROUTES } from '@/core/constants';
import '@/styles/landing.css';
import '@/styles/signin.css';

function SigninForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);

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

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null);

    try {
      const success = await login(data);

      if (success) {
        router.push(returnUrl);
      } else {
        setLoginError('Invalid email or password. Please try again.');
      }
    } catch {
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

          {loginError && (
            <div className="signin-error" role="alert" aria-live="assertive">
              <i className="pi pi-exclamation-circle" aria-hidden="true"></i>
              <span>{loginError}</span>
            </div>
          )}

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="signin-form">
              <div className="signin-field">
                <FormInput
                  name="email"
                  label="Email"
                  placeholder="you@example.com"
                  showRequired
                  displayDisabled={isSubmitting || isLoading}
                />
              </div>

              <div className="signin-field">
                <FormPassword
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  showRequired
                  displayDisabled={isSubmitting || isLoading}
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
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? (
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
