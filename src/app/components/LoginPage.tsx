import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface LoginPageProps {
  onLogin: (username: string) => void;
  onNavigateToPrivacy: () => void;
  onNavigateToTerms: () => void;
  onNavigateToSignUp?: () => void;
}

export function LoginPage({ onLogin, onNavigateToPrivacy, onNavigateToTerms, onNavigateToSignUp }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Email validation
  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError('');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Password validation
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('');
      return false;
    }
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSymbol) {
      setPasswordError('Password must include uppercase, lowercase, number, and symbol');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleSignIn = () => {
    if (!agreedToTerms) {
      toast.error('Please agree to the Privacy Policy and Terms of Service');
      return;
    }
    if (!username || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      toast.error('Please fix the errors before signing in');
      return;
    }
    
    if (username) {
      localStorage.setItem('subtle_username', username);
    }
    toast.success('Signed in successfully!');
    onLogin(username);
  };

  const handlePasswordReset = () => {
    if (!resetEmail) {
      toast.error('Please enter your email address');
      return;
    }
    console.log('Password reset requested for:', resetEmail);
    toast.success('Password reset link sent to your email!');
    setShowResetModal(false);
    setResetEmail('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#E8E1D9' }}>
      <style>{`
        .neuro-text {
          color: #6A5E55;
          text-shadow: 
            2px 2px 4px #FAF7F3,
            -2px -2px 4px #D6CEC5;
        }

        .neuro-input {
          background: #F3ECE4;
          border: none;
          box-shadow: 
            inset 5px 5px 10px #D6CEC5,
            inset -5px -5px 10px #FAF7F3;
          transition: all 0.3s ease;
        }

        .neuro-input:focus {
          outline: none;
          box-shadow: 
            inset 7px 7px 14px #D6CEC5,
            inset -7px -7px 14px #FAF7F3;
        }

        .neuro-input::placeholder {
          color: #A89380;
        }

        .neuro-checkbox {
          width: 18px;
          height: 18px;
          background: #F3ECE4;
          border: none;
          box-shadow: 
            inset 3px 3px 6px #D6CEC5,
            inset -3px -3px 6px #FAF7F3;
          border-radius: 4px;
          appearance: none;
          cursor: pointer;
          position: relative;
          flex-shrink: 0;
        }

        .neuro-checkbox:checked::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #6A5E55;
          font-size: 12px;
        }

        .neuro-button {
          background: #D8C0A8;
          border: none;
          box-shadow: 
            6px 6px 12px #CBB299,
            -6px -6px 12px #E5CDB7;
          transition: all 0.15s ease;
          cursor: pointer;
        }

        .neuro-button:hover {
          box-shadow: 
            8px 8px 16px #CBB299,
            -8px -8px 16px #E5CDB7;
        }

        .neuro-button:active,
        .neuro-button.pressed {
          box-shadow: 
            inset 4px 4px 8px #CBB299,
            inset -4px -4px 8px #E5CDB7;
        }

        .neuro-link {
          color: #6A5E55;
          text-decoration: none;
          transition: all 0.2s ease;
          background: none;
          border: none;
          cursor: pointer;
        }

        .neuro-link:hover {
          color: #8a7870;
        }

        .terms-link {
          color: #6A5E55;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 2px;
          background: none;
          border: none;
          cursor: pointer;
        }

        .terms-link:hover {
          color: #8a7870;
        }

        .modal-overlay {
          background: rgba(106, 94, 85, 0.3);
          backdrop-filter: blur(4px);
        }

        .neuro-card {
          background: #F3ECE4;
          box-shadow: 
            6px 6px 12px #D6CEC5,
            -6px -6px 12px #FAF7F3;
          border-radius: 24px;
        }
      `}</style>

      <div className="w-full max-w-md">
        {/* Logo */}
        <h1 
          className="text-7xl md:text-8xl font-light text-center mb-12 neuro-text tracking-wide"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Subtle
        </h1>

        {/* Form Container */}
        <div className="space-y-5">
          {/* Username Input */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="neuro-input w-full px-7 py-4 rounded-3xl text-base text-gray-600"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: '300' }}
          />

          {/* Email Input */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              className="neuro-input w-full px-7 py-4 rounded-3xl text-base text-gray-600"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: '300' }}
            />
            {emailError && (
              <p 
                className="text-xs mt-2 px-2"
                style={{ 
                  fontFamily: 'Inter, system-ui, sans-serif',
                  color: '#C78A7E',
                  fontWeight: '300'
                }}
              >
                {emailError}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className="neuro-input w-full px-7 py-4 rounded-3xl text-base text-gray-600"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: '300' }}
            />
            {passwordError && (
              <p 
                className="text-xs mt-2 px-2"
                style={{ 
                  fontFamily: 'Inter, system-ui, sans-serif',
                  color: '#C78A7E',
                  fontWeight: '300'
                }}
              >
                {passwordError}
              </p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3 px-2 py-2">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="neuro-checkbox mt-0.5"
              id="terms"
            />
            <label 
              htmlFor="terms" 
              className="text-sm neuro-text cursor-pointer"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: '300' }}
            >
              I agree to the{' '}
              <button 
                type="button"
                onClick={onNavigateToPrivacy}
                className="terms-link"
              >
                Privacy Policy
              </button>
              {' '}and{' '}
              <button 
                type="button"
                onClick={onNavigateToTerms}
                className="terms-link"
              >
                Terms of Service
              </button>.
            </label>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleSignIn}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            className={`neuro-button w-full px-7 py-4 rounded-3xl text-lg font-light ${isPressed ? 'pressed' : ''}`}
            style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#6A5E55' }}
          >
            Sign In
          </button>

          {/* Forgot Password Link */}
          <div className="text-center pt-2">
            <button 
              onClick={() => setShowResetModal(true)}
              className="neuro-link text-sm font-light"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign Up Link */}
          {onNavigateToSignUp && (
            <div className="text-center pt-1">
              <p 
                className="neuro-text text-sm font-light"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Don't have an account?{' '}
                <button 
                  onClick={onNavigateToSignUp}
                  className="neuro-link"
                  style={{ fontWeight: '500' }}
                >
                  Sign up
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-50 modal-overlay"
          onClick={() => setShowResetModal(false)}
        >
          <div 
            className="neuro-card p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 
              className="text-2xl font-light neuro-text text-center mb-2"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Reset Password
            </h2>
            <p 
              className="text-sm neuro-text text-center mb-6 opacity-70"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="neuro-input w-full px-6 py-3 rounded-3xl text-base text-gray-600"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: '300' }}
              />
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowResetModal(false);
                    setResetEmail('');
                  }}
                  className="flex-1 px-6 py-3 rounded-3xl text-sm font-light"
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    color: '#6A5E55',
                    background: '#F3ECE4',
                    border: 'none',
                    boxShadow: '5px 5px 10px #D6CEC5, -5px -5px 10px #FAF7F3',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordReset}
                  className="neuro-button flex-1 px-6 py-3 rounded-3xl text-sm font-light"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#6A5E55' }}
                >
                  Send Reset Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}