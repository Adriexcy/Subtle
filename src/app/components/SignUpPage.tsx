import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SignUpPageProps {
  onSignUp: (username: string, email: string, password: string) => void;
  onNavigateToLogin: () => void;
}

export function SignUpPage({ onSignUp, onNavigateToLogin }: SignUpPageProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (!username || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Basic password validation
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    toast.success('Account created successfully!');
    onSignUp(username, email, password);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#E8E1D9' }}>
      <style>{`
        .neuro-text {
          color: #6A5E55;
        }

        .neuro-inset {
          background: #F3ECE4;
          box-shadow: 
            inset 6px 6px 12px #D6CEC5,
            inset -6px -6px 12px #FAF7F3;
          border-radius: 20px;
        }

        .neuro-button {
          background: #D8C0A8;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .neuro-button:active {
          box-shadow: 
            inset 4px 4px 8px #CBB299,
            inset -4px -4px 8px #E5CDB7;
        }

        .input-field {
          background: transparent;
          border: none;
          outline: none;
          width: 100%;
          padding: 18px 20px;
          font-family: 'Inter, system-ui, sans-serif';
          font-size: 15px;
          color: #6A5E55;
        }

        .input-field::placeholder {
          color: #6A5E55;
          opacity: 0.4;
        }

        .password-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .password-toggle {
          position: absolute;
          right: 20px;
          cursor: pointer;
          opacity: 0.4;
          transition: opacity 0.2s ease;
        }

        .password-toggle:hover {
          opacity: 0.7;
        }

        .link-text {
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .link-text:hover {
          opacity: 0.7;
        }
      `}</style>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="neuro-text mb-2"
            style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: '300' }}
          >
            Welcome to Subtle
          </h1>
          <p 
            className="neuro-text opacity-60"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
          >
            Create your account to get started
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Username Field */}
          <div>
            <label 
              className="neuro-text block mb-2 px-1"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px', fontWeight: '500' }}
            >
              Username
            </label>
            <div className="neuro-inset">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Choose a username"
                className="input-field"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label 
              className="neuro-text block mb-2 px-1"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px', fontWeight: '500' }}
            >
              Email Address
            </label>
            <div className="neuro-inset">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="your.email@example.com"
                className="input-field"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label 
              className="neuro-text block mb-2 px-1"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px', fontWeight: '500' }}
            >
              Password
            </label>
            <div className="neuro-inset password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Create a secure password"
                className="input-field"
                autoComplete="new-password"
                style={{ paddingRight: '50px' }}
              />
              <div 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 neuro-text" />
                ) : (
                  <Eye className="w-5 h-5 neuro-text" />
                )}
              </div>
            </div>
            <p 
              className="neuro-text opacity-50 mt-2 px-1"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px' }}
            >
              Minimum 6 characters
            </p>
          </div>
        </div>

        {/* Sign Up Button */}
        <button
          onClick={handleSubmit}
          className="neuro-button w-full py-4 rounded-3xl mt-10"
          style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '15px', fontWeight: '500' }}
        >
          <span className="neuro-text">
            Sign Up
          </span>
        </button>

        {/* Login Link */}
        <div className="text-center mt-8">
          <p 
            className="neuro-text opacity-70"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
          >
            Already have an account?{' '}
            <span
              onClick={onNavigateToLogin}
              className="link-text"
              style={{ fontWeight: '500', opacity: '1' }}
            >
              Log in
            </span>
          </p>
        </div>

        {/* Decorative Element */}
        <div className="mt-10 text-center">
          <div 
            className="neuro-text opacity-20"
            style={{ fontFamily: 'Georgia, serif', fontSize: '24px' }}
          >
            ✦
          </div>
        </div>
      </div>
    </div>
  );
}