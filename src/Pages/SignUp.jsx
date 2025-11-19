import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2, Mail, Shield } from 'lucide-react';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

const validatePassword = (password) => {
  const checks = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]/.test(password),
    noCommon: !/password|123456|qwerty|admin|letmein|welcome/i.test(password),
    noRepeat: !/(.)\1{2,}/.test(password)
  };
  const score = Object.values(checks).filter(Boolean).length;
  return { checks, score, isValid: score >= 6 };
};




const PasswordStrength = ({ password }) => {
  const validation = useMemo(() => validatePassword(password), [password]);
  const strengthConfig = {
    0: { bg: 'bg-zinc-700', text: 'text-zinc-500', label: 'No Password', width: 0 },
    1: { bg: 'bg-red-500', text: 'text-red-400', label: 'Very Weak', width: 15 },
    2: { bg: 'bg-orange-500', text: 'text-orange-400', label: 'Weak', width: 30 },
    3: { bg: 'bg-amber-500', text: 'text-amber-400', label: 'Fair', width: 45 },
    4: { bg: 'bg-yellow-400', text: 'text-yellow-400', label: 'Good', width: 65 },
    5: { bg: 'bg-lime-500', text: 'text-lime-400', label: 'Strong', width: 80 },
    6: { bg: 'bg-green-500', text: 'text-green-400', label: 'Very Strong', width: 100 },
    7: { bg: 'bg-emerald-500', text: 'text-emerald-400', label: 'Excellent', width: 100 }
  };
  if (!password) return null;
  const config = strengthConfig[Math.min(validation.score, 7)] || strengthConfig[0];
  const percentage = config.width;
  return (
    <div className="mt-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-zinc-800/50 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${config.bg}`}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={validation.score}
            aria-valuemin={0}
            aria-valuemax={7}
            aria-label={`Password strength: ${config.label}`}
          />
        </div>
        <span className={`text-xs font-medium ${config.text} min-w-[70px] text-right`}>
          {config.label}
        </span>
      </div>
      <p className="mt-2 text-[11px] text-zinc-500">
        This is your <span className="text-white">Master Password</span>. We can’t recover it. Store it safely.
      </p>
    </div>
  );
};


const OTPInput = ({ otp, setOtp, error }) => {
  const inputRefs = useRef([]);
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  return (
    <div className="space-y-3">
      <div className="flex justify-center gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`w-12 h-12 text-center text-lg font-bold bg-zinc-900 border-2 rounded-lg focus:outline-none transition-all text-white ${error
              ? 'border-red-500/50 shadow-lg shadow-red-500/20'
              : 'border-zinc-800 focus:border-white hover:border-zinc-700'
              }`}
            maxLength={1}
            inputMode="numeric"
          />
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-400 text-center flex items-center justify-center gap-1.5">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
};


export default function VaultSignUpPage({
  onSuccess,
  onError,
  apiEndpoint = `${BASE_URL}auth/createUser`
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ email: '', username: '', password: '', confirmPassword: '' });
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => () => timerRef.current && clearInterval(timerRef.current), []);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSubmitError('');
  }, []);
  const handleBlur = useCallback((field) => setTouched((prev) => ({ ...prev, [field]: true })), []);

  const validation = useMemo(() => {
    const emailValid = validateEmail(formData.email);
    const usernameValid = validateUsername(formData.username);
    const passwordValid = validatePassword(formData.password);
    const confirmPasswordValid =
      formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

    return {
      email: {
        isValid: emailValid,
        error: !emailValid && touched.email ? 'Please enter a valid email address' : '',
      },
      username: {
        isValid: usernameValid,
        error:
          !usernameValid && touched.username
            ? '3–20 chars, start with a letter, use letters/numbers/._-, no spaces'
            : '',
      },
      password: {
        isValid: passwordValid.isValid,
        error: !passwordValid.isValid && touched.password ? 'Use 12+ chars with upper, lower, number & symbol' : '',
        strength: passwordValid,
      },
      confirmPassword: {
        isValid: confirmPasswordValid,
        error:
          !confirmPasswordValid && touched.confirmPassword
            ? formData.confirmPassword.length === 0
              ? 'Please confirm your master password'
              : 'Passwords do not match'
            : '',
      },
    };
  }, [formData, touched]);

  const isStep1Valid =
    validation.email.isValid &&
    validation.username.isValid &&
    validation.password.isValid &&
    validation.confirmPassword.isValid;

  const progressWidth = ((step - 1) / 1) * 100;

  
  const handleSubmitStep1 = async () => {
    setTouched({ email: true, username: true, password: true, confirmPassword: true });
    if (!isStep1Valid) {
      setSubmitError('Please fix the errors above.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const payload = {
        email: formData.email.trim(),
        username: formData.username.trim(), 
        password: formData.password,
      };

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload),
      });

      let data = null;
      try {
        data = await response.json();
      } catch { }

      if (!response.ok) {
        throw new Error((data && (data.message || data.errorMessage)) || `Server error: ${response.status}`);
      }

      const token = data?.accessToken || data?.token;
      if (token) console.log('Signup success, provisional token:', token);

      setStep(2);
      setResendTimer(60);
      timerRef.current = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      const msg = error.message === 'Failed to fetch' ? 'Network error. Check connection and try again.' : error.message;
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendOTP = async () => {
    if (resendTimer > 0) return;
    setIsSubmitting(true);
    try {
      const payload = { email: formData.email.trim(), resendOTP: true };
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data = null;
      try {
        data = await response.json();
      } catch { }

      if (!response.ok) throw new Error((data && data.message) || `Server returned ${response.status}`);

      setOtp(Array(6).fill(''));
      setSubmitError('');
      setResendTimer(60);
      timerRef.current = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      const msg = error.message === 'Failed to fetch' ? 'Network error – check backend or CORS' : error.message;
      setSubmitError(msg || 'Failed to send verification code');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleFinalSubmit = async () => {
    if (otp.join('').length !== 6) {
      setSubmitError('Please enter the 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch(
         `${BASE_URL}auth/verification?email=${encodeURIComponent(formData.email.trim())}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
          },
          body: JSON.stringify({ otp: otp.join('') }),
          
        }
      );

      const contentType = response.headers.get('content-type') || '';
      let token = '';

      if (contentType.includes('application/json')) {
        const data = await response.json();
        token = data?.accessToken || data?.token || '';
      } else {
        const raw = await response.text();
        token = (raw || '').trim().replace(/^"(.*)"$/, '$1'); 
      }

      if (!response.ok) {
        throw new Error(token || `Server error: ${response.status}`);
      }
      if (!token) {
        throw new Error('No token found in response.');
      }

      console.log('Verification success, final token saved:', token);
      onSuccess?.(token);

      if (token) {
  localStorage.setItem("sv_token", token);
}
window.location.href = "/dashboard";

    } catch (error) {
      const msg = error.message === 'Failed to fetch' ? 'Network error. Please try again.' : error.message;
      setSubmitError(msg);
      onError?.(error);
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/50 p-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="w-7 h-7 text-white" />
          <span className="text-2xl font-bold text-white">SecuroServ</span>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-medium text-zinc-500">Step {step} of 2</span>
            <span className="text-xs text-zinc-600">{Math.round(progressWidth)}%</span>
          </div>
          <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
            <div className="bg-white h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progressWidth}%` }} />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-1.5">Sign Up</h1>
              <p className="text-sm text-zinc-500">Use a strong Master Password. We cannot reset it.</p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`w-full px-4 py-2.5 bg-zinc-900 border rounded-lg focus:outline-none transition-all text-white placeholder-zinc-600 ${validation.email.error ? 'border-red-500/50 shadow-lg shadow-red-500/10' : 'border-zinc-800 focus:border-white hover:border-zinc-700'
                  }`}
                placeholder="you@securemail.com"
                disabled={isSubmitting}
                autoComplete="email"
              />
              {validation.email.error && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {validation.email.error}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-zinc-400 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                onBlur={() => handleBlur('username')}
                className={`w-full px-4 py-2.5 bg-zinc-900 border rounded-lg focus:outline-none transition-all text-white placeholder-zinc-600 ${validation.username.error ? 'border-red-500/50 shadow-lg shadow-red-500/10' : 'border-zinc-800 focus:border-white hover:border-zinc-700'
                  }`}
                placeholder="e.g. bakihanma666"
                disabled={isSubmitting}
                autoComplete="username"
                inputMode="text"
              />
              {validation.username.error && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {validation.username.error}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-400 mb-2">
                Master Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`w-full px-4 py-2.5 pr-11 bg-zinc-900 border rounded-lg focus:outline-none transition-all text-white placeholder-zinc-600 ${validation.password.error ? 'border-red-500/50 shadow-lg shadow-red-500/10' : 'border-zinc-800 focus:border-white hover:border-zinc-700'
                    }`}
                  placeholder="••••••••••••"
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-400 transition-colors"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <PasswordStrength password={formData.password} />

              {validation.password.error && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {validation.password.error}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-400 mb-2">
                Confirm Master Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`w-full px-4 py-2.5 pr-11 bg-zinc-900 border rounded-lg focus:outline-none transition-all text-white placeholder-zinc-600 ${validation.confirmPassword.error ? 'border-red-500/50 shadow-lg shadow-red-500/10' : 'border-zinc-800 focus:border-white hover:border-zinc-700'
                    }`}
                  placeholder="••••••••••••"
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-400 transition-colors"
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {validation.confirmPassword.error && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {validation.confirmPassword.error}
                </p>
              )}
            </div>

            {submitError && (
              <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-lg">
                <p className="text-xs text-red-400 flex items-center gap-2">
                  <AlertCircle size={14} />
                  {submitError}
                </p>
              </div>
            )}

            <button
  type="button"
  onClick={handleSubmitStep1}
  disabled={isSubmitting}
  className="w-full bg-white hover:bg-zinc-100 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 mt-2 flex items-center justify-center gap-2"
>
  {isSubmitting ? (
    <>
      <Loader2 size={18} className="animate-spin text-black" />
      Creating Account…
    </>
  ) : (
    "Continue"
  )}
</button>


            <p className="text-[11px] text-zinc-500 text-center">
              By continuing you agree to our privacy-first, zero-knowledge policy.
            </p>
          </div>
        )}

   
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-full mb-4">
                <Mail size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold mb-1.5">Verify your Email</h1>
              <p className="text-sm text-zinc-500">
                Enter the code sent to<br />
                <span className="text-white">{formData.email}</span>
              </p>
            </div>

            <OTPInput otp={otp} setOtp={setOtp} error={submitError.includes('code') ? submitError : ''} />

            <div className="text-center">
              {resendTimer > 0 ? (
                <p className="text-xs text-zinc-500">
                  Resend code in <span className="font-medium text-white">{resendTimer}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={sendOTP}
                  disabled={isSubmitting}
                  className="text-xs text-white hover:text-zinc-300 underline disabled:opacity-50 transition-colors"
                >
                  Resend verification code
                </button>
              )}
            </div>

            {submitError && !submitError.includes('code') && (
              <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-lg">
                <p className="text-xs text-red-400 flex items-center gap-2">
                  <AlertCircle size={14} />
                  {submitError}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border border-zinc-800 text-zinc-400 py-2.5 px-4 rounded-lg hover:bg-zinc-900 hover:text-white transition-all"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting || otp.join('').length !== 6}
                className="flex-1 bg-white hover:bg-zinc-100 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                {isSubmitting ? 'Verifying…' : 'Verify'}
              </button>
            </div>
          </div>
        )}

     
        <div className="mt-8 text-center border-t border-zinc-900 pt-6">
          <p className="text-xs text-zinc-500">
            Already have a account?{' '}
            <a href="/login" className="text-white hover:text-zinc-300 font-medium transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
