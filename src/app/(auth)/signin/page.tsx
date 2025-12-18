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

  // Redirect if already authenticated
  useRedirectIfAuthenticated();

  const returnUrl = searchParams.get('returnUrl') || ROUTES.DASHBOARD;

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
    const success = await login(data);
    // setLoginError(null);

    // try {
    //   if (success) {
    //     router.push(returnUrl);
    //   } else {
    //     setLoginError('Invalid email or password. Please try again.');
    //   }
    // } catch {
    //   setLoginError('An error occurred. Please try again later.');
    // }
  };

  return (
    <div className="signin-page">
      {/* Left Side - Branding */}
      <div className="signin-branding">
        <div className="signin-branding-decor" aria-hidden="true" />
        <div className="signin-branding-content">
          <Link href="/" className="signin-logo">
            <Image
              src="/images/church-logo-transparent.png"
              alt="Gateway Church Logo"
              width={80}
              height={80}
              priority
            />
          </Link>
          <h1>Gateway Church</h1>
          <p>A community growing in faith, hope, and love.</p>

          <div className="signin-features">
            <div className="signin-feature">
              <div className="signin-feature-icon">
                <i className="pi pi-users"></i>
              </div>
              <div>
                <h3>Member Management</h3>
                <p>Track and manage your church community effectively.</p>
              </div>
            </div>

            <div className="signin-feature">
              <div className="signin-feature-icon">
                <i className="pi pi-calendar"></i>
              </div>
              <div>
                <h3>Event Planning</h3>
                <p>Organize services, events, and gatherings seamlessly.</p>
              </div>
            </div>

            <div className="signin-feature">
              <div className="signin-feature-icon">
                <i className="pi pi-chart-bar"></i>
              </div>
              <div>
                <h3>Analytics & Reports</h3>
                <p>Gain insights to help your ministry grow.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="signin-branding-footer">
          <p>&copy; {new Date().getFullYear()} Gateway Church. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="signin-form-container">
        <div className="signin-form-wrapper">
          {/* Back to Home Link (mobile only) */}
          <Link href="/" className="signin-back-link">
            <i className="pi pi-arrow-left"></i>
            <span>Back to Home</span>
          </Link>

          {/* Mobile Logo */}
          <div className="signin-mobile-logo">
            <Link href="/">
              <Image
                src="/images/church-logo-transparent.png"
                alt="Gateway Church Logo"
                width={70}
                height={70}
                priority
              />
            </Link>
            <h2>Gateway Church</h2>
          </div>

          <div className="signin-form-header">
            <h2>Welcome Back</h2>
            <p>Sign in to access your church management portal</p>
          </div>

          {loginError && (
            <div className="signin-error">
              <i className="pi pi-exclamation-circle"></i>
              <span>{loginError}</span>
            </div>
          )}

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="signin-form">
              <div className="signin-field">
                <FormInput
                  name="email"
                  label="Email Address"
                  placeholder="Enter your email"
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
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>
          </FormProvider>

          <div className="signin-divider">
            <span>or</span>
          </div>

          <div className="signin-social">
            <button className="signin-social-btn google" type="button">
              <i className="pi pi-google"></i>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="signin-footer">
            <p>
              Need help? <Link href="/#contact">Contact Support</Link>
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
