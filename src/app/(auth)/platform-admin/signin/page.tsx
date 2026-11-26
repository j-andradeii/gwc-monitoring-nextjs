/**
 * Platform Admin Sign-in
 *
 * Sign-in for the platform admin portal. Same look as /signin; only logins the API recognises as platform admins
 * get in (platformAdminService.signIn checks `GET platform/tenants` and signs anyone else out again).
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Image from 'next/image';
import { FormInput } from '@/components/forms/FormInput';
import { FormPassword } from '@/components/forms/FormPassword';
import { useScrollToFirstError } from '@/components/forms';
import { loginSchema, type LoginFormData } from '@/models/schemas/auth.schema';
import { ROUTES } from '@/core/constants';
import {
  PlatformSignInError,
  signIn,
  type PlatformSignInFailure,
} from '@/services/platform-admin.service';
import { usePlatformAdminStore } from '@/stores/platform-admin.store';
import '@/styles/landing.css';
import '@/styles/signin.css';

const FAILURE_COPY: Record<PlatformSignInFailure, string> = {
  'invalid-credentials': 'We could not sign you in. Please check your details and try again.',
  'not-platform-admin': 'This account does not have platform admin access.',
};

export default function PlatformAdminSigninPage() {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);

  // Arriving here (sign-out, session expiry, revoked access) ends any portal session the store still remembers.
  useEffect(() => {
    usePlatformAdminStore.getState().clear();
  }, []);

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const scrollToError = useScrollToFirstError();

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null);
    try {
      await signIn(data);
      router.replace(ROUTES.PLATFORM_ADMIN);
    } catch (error) {
      const reason = error instanceof PlatformSignInError ? error.reason : 'invalid-credentials';
      setLoginError(FAILURE_COPY[reason]);
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
            <p className="signin-eyebrow signin-reveal">Platform admin</p>
            <h1 className="signin-reveal">Every church, one view</h1>
            <p className="signin-branding-copy signin-reveal">
              See each tenant church and its campuses across the platform.
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
            <span className="signin-access-pill">Platform admins only</span>
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
            <p className="signin-form-kicker">Platform admin</p>
            <h2>Sign in</h2>
            <p>Use your platform admin account to continue.</p>
          </div>

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
                  displayDisabled={isSubmitting}
                />
              </div>

              <div className="signin-field">
                <FormPassword
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  showRequired
                  displayDisabled={isSubmitting}
                  feedback={false}
                />
              </div>

              <button
                type="submit"
                className="signin-submit landing-btn landing-btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="pi pi-spin pi-spinner" aria-hidden="true"></i>
                    <span>Checking access...</span>
                  </>
                ) : (
                  <>
                    <i className="pi pi-sign-in" aria-hidden="true"></i>
                    <span>Sign in</span>
                  </>
                )}
              </button>
            </form>
          </FormProvider>

          <div className="signin-footer">
            <p>
              Church staff? <Link href={ROUTES.SIGNIN}>Sign in to Campus Admin</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
