import { useState } from 'react';
import { ChevronRight, User, Bell, Palette, Shield, HelpCircle, LogOut, X, Check, Moon, Sun, Mail, Phone, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsPageProps {
  username: string;
  onLogout: () => void;
  onUpdateProfile?: (updates: { username?: string; email?: string; password?: string }) => void;
  isDarkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
  budgetLimit: number;
  onSetBudgetLimit: (newBudget: number) => void;
}

export function SettingsPage({ username, onLogout, onUpdateProfile, isDarkMode, onToggleDarkMode, budgetLimit, onSetBudgetLimit }: SettingsPageProps) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAppearanceModal, setShowAppearanceModal] = useState(false);
  const [showNotificationAlertsModal, setShowNotificationAlertsModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Notification & Alerts state
  const [notificationType, setNotificationType] = useState('push'); // 'push', 'email', 'sms', 'calendar'
  const [emailAddress, setEmailAddress] = useState('alex@example.com');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [alertTiming, setAlertTiming] = useState('3 days before');
  
  // Custom alert timing state
  const [showCustomAlertModal, setShowCustomAlertModal] = useState(false);
  const [customAlertType, setCustomAlertType] = useState<'days' | 'exact'>('days');
  const [customDays, setCustomDays] = useState('5');
  const [customDate, setCustomDate] = useState('');
  const [customAlertDisplay, setCustomAlertDisplay] = useState('');

  // Profile edit state
  const [editUsername, setEditUsername] = useState(username);
  const [editEmail, setEditEmail] = useState('alex@example.com');
  const [editPassword, setEditPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Budget state
  const [budgetAmount, setBudgetAmount] = useState(budgetLimit.toString());
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetSaved, setBudgetSaved] = useState(false);

  const handleLogoutClick = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      onLogout();
    }
  };

  const handleSaveProfile = () => {
    if (editPassword && editPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!editUsername || !editEmail) {
      toast.error('Username and email are required');
      return;
    }

    const updates: { username?: string; email?: string; password?: string } = {
      username: editUsername,
      email: editEmail
    };

    if (editPassword) {
      updates.password = editPassword;
    }

    if (onUpdateProfile) {
      onUpdateProfile(updates);
    }

    toast.success('Profile updated successfully!');
    setShowProfileModal(false);
    setEditPassword('');
    setConfirmPassword('');
  };

  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast.success(`Notifications ${!notificationsEnabled ? 'enabled' : 'disabled'}`);
  };

  const handleDarkModeToggle = () => {
    onToggleDarkMode(!isDarkMode);
    toast.success(`Dark mode ${!isDarkMode ? 'enabled' : 'disabled'}`);
    setShowAppearanceModal(false);
  };

  const handleSaveBudget = () => {
    if (isEditingBudget && budgetAmount) {
      const newBudget = parseFloat(budgetAmount) || 200;
      onSetBudgetLimit(newBudget);
      setBudgetSaved(true);
      toast.success('Budget updated successfully!');
      setIsEditingBudget(false);
      setTimeout(() => setBudgetSaved(false), 2000);
    }
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
    if (value.length <= 7) { // Limit to reasonable numbers
      setBudgetAmount(value);
    }
  };

  const handleBudgetKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const handleBudgetBlur = () => {
    if (budgetAmount) {
      const newBudget = parseFloat(budgetAmount) || 200;
      onSetBudgetLimit(newBudget);
      setBudgetSaved(true);
      toast.success('Budget updated!');
      setIsEditingBudget(false);
      setTimeout(() => setBudgetSaved(false), 2000);
    } else {
      // Reset to current budget if empty
      setBudgetAmount(budgetLimit.toString());
      setIsEditingBudget(false);
    }
  };

  return (
    <div className="space-y-6">
      <style>{`
        .neuro-card {
          background: ${isDarkMode ? '#8A786F' : '#F3ECE4'};
          box-shadow: 
            6px 6px 12px ${isDarkMode ? '#6A5850' : '#D6CEC5'},
            -6px -6px 12px ${isDarkMode ? '#A0928E' : '#FAF7F3'};
          border-radius: 24px;
        }

        .neuro-inset {
          background: ${isDarkMode ? '#8A786F' : '#F3ECE4'};
          box-shadow: 
            inset 4px 4px 8px ${isDarkMode ? '#6A5850' : '#D6CEC5'},
            inset -4px -4px 8px ${isDarkMode ? '#A0928E' : '#FAF7F3'};
          border-radius: 16px;
        }

        .neuro-button {
          background: ${isDarkMode ? '#998A82' : '#F3ECE4'};
          box-shadow: 
            5px 5px 10px ${isDarkMode ? '#7A6C65' : '#D6CEC5'},
            -5px -5px 10px ${isDarkMode ? '#B8A89F' : '#FAF7F3'};
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
        }

        .neuro-button:active {
          box-shadow: 
            inset 3px 3px 6px ${isDarkMode ? '#7A6C65' : '#D6CEC5'},
            inset -3px -3px 6px ${isDarkMode ? '#B8A89F' : '#FAF7F3'};
        }

        .neuro-button-primary {
          background: ${isDarkMode ? '#BBA490' : '#D8C0A8'};
          box-shadow: 
            5px 5px 10px ${isDarkMode ? '#9A8673' : '#CBB299'},
            -5px -5px 10px ${isDarkMode ? '#DCC2AD' : '#E5CDB7'};
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
        }

        .neuro-button-primary:active {
          box-shadow: 
            inset 3px 3px 6px ${isDarkMode ? '#9A8673' : '#CBB299'},
            inset -3px -3px 6px ${isDarkMode ? '#DCC2AD' : '#E5CDB7'};
        }

        .neuro-text {
          color: ${isDarkMode ? '#F5EFE7' : '#6A5E55'};
        }

        .setting-item {
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 16px;
          border-radius: 16px;
        }

        .setting-item:hover {
          background: ${isDarkMode ? 'rgba(187, 164, 144, 0.1)' : 'rgba(216, 192, 168, 0.1)'};
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: ${isDarkMode ? 'rgba(118, 98, 94, 0.5)' : 'rgba(0, 0, 0, 0.3)'};
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 20px;
        }

        .modal-content {
          background: ${isDarkMode ? '#8A786F' : '#F3ECE4'};
          box-shadow: 
            10px 10px 20px ${isDarkMode ? '#6A5850' : '#D6CEC5'},
            -10px -10px 20px ${isDarkMode ? '#A0928E' : '#FAF7F3'};
          border-radius: 28px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .toggle-switch {
          position: relative;
          width: 52px;
          height: 28px;
          background: #F3ECE4;
          box-shadow: 
            inset 4px 4px 8px #D6CEC5,
            inset -4px -4px 8px #FAF7F3;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .toggle-switch.active {
          background: #D8C0A8;
          box-shadow: 
            inset 4px 4px 8px #CBB299,
            inset -4px -4px 8px #E5CDB7;
        }

        .toggle-slider {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 22px;
          height: 22px;
          background: #F3ECE4;
          box-shadow: 
            3px 3px 6px #D6CEC5,
            -3px -3px 6px #FAF7F3;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .toggle-switch.active .toggle-slider {
          left: 27px;
        }

        .input-field {
          background: #F3ECE4;
          box-shadow: 
            inset 4px 4px 8px #D6CEC5,
            inset -4px -4px 8px #FAF7F3;
          border-radius: 16px;
          border: none;
          outline: none;
          padding: 14px 18px;
          width: 100%;
          font-family: 'Inter, system-ui, sans-serif';
          font-size: 14px;
          color: #6A5E55;
        }

        .input-field::placeholder {
          color: #6A5E55;
          opacity: 0.4;
        }

        .reminder-option {
          padding: 14px;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .reminder-option:hover {
          background: rgba(216, 192, 168, 0.1);
        }

        .reminder-option.selected {
          background: rgba(216, 192, 168, 0.2);
        }

        .notification-alerts-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);\n          }
        }

        .budget-input {
          background: transparent;
          border: none;
          outline: none;
          font-family: 'Georgia, serif';
          font-size: 24px;
          font-weight: 300;
          color: ${isDarkMode ? '#F5EFE7' : '#6A5E55'};
          text-align: left;
          width: auto;
          min-width: 40px;
          max-width: 140px;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 4px 6px;
          border-radius: 8px;
        }

        .budget-input:focus {
          background: ${isDarkMode ? 'rgba(187, 164, 144, 0.08)' : 'rgba(216, 192, 168, 0.12)'};
          box-shadow: 0 0 0 2px ${isDarkMode ? 'rgba(187, 164, 144, 0.15)' : 'rgba(216, 192, 168, 0.2)'};
          cursor: text;
        }

        .budget-input::selection {
          background: ${isDarkMode ? 'rgba(187, 164, 144, 0.3)' : 'rgba(216, 192, 168, 0.4)'};
        }

        .budget-display-wrapper {
          display: inline-flex;
          align-items: baseline;
          gap: 2px;
          cursor: pointer;
          padding: 4px 6px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .budget-display-wrapper:hover {
          background: ${isDarkMode ? 'rgba(187, 164, 144, 0.05)' : 'rgba(216, 192, 168, 0.08)'};
        }

        .budget-saved {
          animation: savedFade 2s ease-in-out;
        }

        @keyframes savedFade {
          0% {
            opacity: 0;
            transform: translateY(-5px);
          }
          20% {
            opacity: 1;
            transform: translateY(0);
          }
          80% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-5px);
          }
        }
      `}</style>

      {/* Header */}
      <h1 
        className="neuro-text"
        style={{ fontFamily: 'Georgia, serif', fontSize: '30px', fontWeight: '300' }}
      >
        Settings ⚙️
      </h1>

      {/* Profile Card */}
      <div className="neuro-card p-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-16 h-16 rounded-full neuro-inset flex items-center justify-center"
          >
            <span 
              className="neuro-text"
              style={{ fontFamily: 'Georgia, serif', fontSize: '28px' }}
            >
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 
              className="neuro-text mb-1"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '18px', fontWeight: '500' }}
            >
              {username}
            </h2>
            <p 
              className="neuro-text opacity-60"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
            >
              Manage your account
            </p>
          </div>
        </div>
      </div>

      {/* Account Section */}
      <div>
        <p 
          className="neuro-text mb-3 opacity-70 px-2"
          style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}
        >
          Account
        </p>
        <div className="neuro-card overflow-hidden">
          <div 
            className="setting-item flex items-center justify-between"
            onClick={() => setShowProfileModal(true)}
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 neuro-text opacity-50" />
              <span 
                className="neuro-text"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
              >
                Profile
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span 
                className="neuro-text opacity-60"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
              >
                {username}
              </span>
              <ChevronRight className="w-5 h-5 neuro-text opacity-30" />
            </div>
          </div>

          <div 
            className="setting-item flex items-center justify-between"
            onClick={handleNotificationToggle}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 neuro-text opacity-50" />
              <span 
                className="neuro-text"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
              >
                Notifications
              </span>
            </div>
            <div 
              className={`toggle-switch ${notificationsEnabled ? 'active' : ''}`}
            >
              <div className="toggle-slider" />
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div>
        <p 
          className="neuro-text mb-3 opacity-70 px-2"
          style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}
        >
          Preferences
        </p>
        <div className="neuro-card overflow-hidden">
          <div 
            className="setting-item flex items-center justify-between"
            onClick={() => setShowAppearanceModal(true)}
          >
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 neuro-text opacity-50" />
              <span 
                className="neuro-text"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
              >
                Appearance
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span 
                className="neuro-text opacity-60"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
              >
                {isDarkMode ? 'Dark' : 'Light'}
              </span>
              <ChevronRight className="w-5 h-5 neuro-text opacity-30" />
            </div>
          </div>

          {notificationsEnabled && (
            <div 
              className="setting-item flex items-center justify-between notification-alerts-fade-in"
              onClick={() => setShowNotificationAlertsModal(true)}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 neuro-text opacity-50" />
                <span 
                  className="neuro-text"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
                >
                  Notification & Alerts
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span 
                  className="neuro-text opacity-60"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
                >
                  {notificationType === 'push' ? 'Push' : notificationType === 'email' ? 'Email' : notificationType === 'sms' ? 'SMS' : 'Calendar'}
                </span>
                <ChevronRight className="w-5 h-5 neuro-text opacity-30" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Support Section */}
      <div>
        <p 
          className="neuro-text mb-3 opacity-70 px-2"
          style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}
        >
          Support
        </p>
        <div className="neuro-card overflow-hidden">
          <div className="setting-item flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 neuro-text opacity-50" />
              <span 
                className="neuro-text"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
              >
                Help & FAQ
              </span>
            </div>
            <ChevronRight className="w-5 h-5 neuro-text opacity-30" />
          </div>

          <div className="setting-item flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 neuro-text opacity-50" />
              <span 
                className="neuro-text"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
              >
                Privacy Policy
              </span>
            </div>
            <ChevronRight className="w-5 h-5 neuro-text opacity-30" />
          </div>

          <div className="setting-item flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 neuro-text opacity-50" />
              <span 
                className="neuro-text"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
              >
                Terms of Service
              </span>
            </div>
            <ChevronRight className="w-5 h-5 neuro-text opacity-30" />
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="neuro-card p-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span 
              className="neuro-text opacity-60"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
            >
              Version
            </span>
            <span 
              className="neuro-text"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
            >
              1.0.0
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span 
              className="neuro-text opacity-60"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
            >
              Made with
            </span>
            <span 
              className="neuro-text"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
            >
              ❤️ by Subtle
            </span>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogoutClick}
        className="neuro-button w-full p-4 rounded-2xl flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5 neuro-text" />
        <span 
          className="neuro-text"
          style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
        >
          Log Out
        </span>
      </button>

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 
                className="neuro-text"
                style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '300' }}
              >
                Edit Profile
              </h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="neuro-button w-10 h-10 rounded-xl flex items-center justify-center"
              >
                <X className="w-5 h-5 neuro-text" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label 
                  className="neuro-text block mb-2"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
                >
                  Username
                </label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="input-field"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label 
                  className="neuro-text block mb-2"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="input-field"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label 
                  className="neuro-text block mb-2"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
                >
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="input-field"
                  placeholder="Enter new password"
                />
              </div>

              {editPassword && (
                <div>
                  <label 
                    className="neuro-text block mb-2"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field"
                    placeholder="Confirm new password"
                  />
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveProfile}
                  className="neuro-button-primary flex-1 py-3 rounded-2xl neuro-text"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="neuro-button flex-1 py-3 rounded-2xl neuro-text"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appearance Modal */}
      {showAppearanceModal && (
        <div className="modal-overlay" onClick={() => setShowAppearanceModal(false)}>
          <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 
                className="neuro-text"
                style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '300' }}
              >
                Appearance
              </h2>
              <button
                onClick={() => setShowAppearanceModal(false)}
                className="neuro-button w-10 h-10 rounded-xl flex items-center justify-center"
              >
                <X className="w-5 h-5 neuro-text" />
              </button>
            </div>

            <div className="space-y-3">
              <div 
                className={`reminder-option ${!isDarkMode ? 'selected' : ''}`}
                onClick={handleDarkModeToggle}
              >
                <div className="flex items-center gap-3">
                  <Sun className="w-5 h-5 neuro-text" />
                  <div>
                    <p 
                      className="neuro-text"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
                    >
                      Light Mode
                    </p>
                    <p 
                      className="neuro-text opacity-60"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px' }}
                    >
                      Warm and bright
                    </p>
                  </div>
                </div>
                {!isDarkMode && <Check className="w-5 h-5 neuro-text" />}
              </div>

              <div 
                className={`reminder-option ${isDarkMode ? 'selected' : ''}`}
                onClick={handleDarkModeToggle}
              >
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 neuro-text" />
                  <div>
                    <p 
                      className="neuro-text"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
                    >
                      Dark Mode
                    </p>
                    <p 
                      className="neuro-text opacity-60"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px' }}
                    >
                      Cosy and deep
                    </p>
                  </div>
                </div>
                {isDarkMode && <Check className="w-5 h-5 neuro-text" />}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification & Alerts Modal */}
      {showNotificationAlertsModal && (
        <div className="modal-overlay" onClick={() => setShowNotificationAlertsModal(false)}>
          <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 
                className="neuro-text"
                style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '300' }}
              >
                🔔 Notification & Alerts
              </h2>
              <button
                onClick={() => setShowNotificationAlertsModal(false)}
                className="neuro-button w-10 h-10 rounded-xl flex items-center justify-center"
              >
                <X className="w-5 h-5 neuro-text" />
              </button>
            </div>

            {/* Notification Preferences Card */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-5 h-5 neuro-text" />
                <h3 
                  className="neuro-text"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px', fontWeight: '500' }}
                >
                  Notification Preferences
                </h3>
              </div>

              <div className="neuro-card p-4 space-y-3">
                {/* Notification Type Options */}
                {[
                  { value: 'push', label: 'Push notification', icon: Bell },
                  { value: 'email', label: 'Email notification', icon: Mail },
                  { value: 'sms', label: 'SMS/Text notification', icon: Phone },
                  { value: 'calendar', label: 'Add to Calendar', icon: CalendarIcon }
                ].map((option) => (
                  <div 
                    key={option.value}
                    className={`reminder-option ${notificationType === option.value ? 'selected' : ''}`}
                    onClick={() => setNotificationType(option.value)}
                  >
                    <div className="flex items-center gap-3">
                      <option.icon className="w-5 h-5 neuro-text opacity-70" />
                      <span 
                        className="neuro-text"
                        style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
                      >
                        {option.label}
                      </span>
                    </div>
                    {notificationType === option.value && <Check className="w-5 h-5 neuro-text" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info / Delivery Method */}
            {notificationType === 'email' && (
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="w-5 h-5 neuro-text" />
                  <h3 
                    className="neuro-text"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px', fontWeight: '500' }}
                  >
                    Email Delivery
                  </h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label 
                      className="neuro-text block mb-2 opacity-70"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
                    >
                      Send notifications to:
                    </label>
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="input-field"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setEmailVerified(true);
                      toast.success('Verification email sent!');
                    }}
                    className="neuro-button-primary w-full py-3 rounded-2xl neuro-text"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', paddingLeft: '14px', textAlign: 'left' }}
                  >
                    {emailVerified ? '✓ Email Verified' : 'Verify Email'}
                  </button>
                </div>
              </div>
            )}

            {notificationType === 'sms' && (
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="w-5 h-5 neuro-text" />
                  <h3 
                    className="neuro-text"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px', fontWeight: '500' }}
                  >
                    SMS Delivery
                  </h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label 
                      className="neuro-text block mb-2 opacity-70"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
                    >
                      Phone number for alerts:
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="input-field"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setPhoneVerified(true);
                      toast.success('Verification code sent!');
                    }}
                    className="neuro-button-primary w-full py-3 rounded-2xl neuro-text"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', paddingLeft: '14px', textAlign: 'left' }}
                  >
                    {phoneVerified ? '✓ Phone Verified' : 'Send Verification Code'}
                  </button>
                </div>
              </div>
            )}

            {notificationType === 'calendar' && (
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarIcon className="w-5 h-5 neuro-text" />
                  <h3 
                    className="neuro-text"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px', fontWeight: '500' }}
                  >
                    Calendar Sync
                  </h3>
                </div>

                <div className="neuro-inset p-4 rounded-2xl mb-3">
                  <p 
                    className="neuro-text opacity-70"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
                  >
                    We will automatically add renewal events to your calendar.
                  </p>
                </div>

                <button
                  onClick={() => {
                    toast.success('Calendar sync enabled!');
                  }}
                  className="neuro-button-primary w-full py-3 rounded-2xl neuro-text"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', paddingLeft: '14px', textAlign: 'left' }}
                >
                  Sync with Calendar
                </button>
              </div>
            )}

            {/* Alert Timing */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-5 h-5 neuro-text" />
                <h3 
                  className="neuro-text"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px', fontWeight: '500' }}
                >
                  Alert Timing
                </h3>
              </div>

              <p 
                className="neuro-text opacity-70 mb-3"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
              >
                When should we send you alerts?
              </p>

              <div className="space-y-3">
                {['1 day before', '3 days before', '7 days before'].map((timing) => (
                  <div 
                    key={timing}
                    className={`reminder-option ${alertTiming === timing ? 'selected' : ''}`}
                    onClick={() => {
                      setAlertTiming(timing);
                      localStorage.setItem('subtle_alert_timing', timing);
                      setCustomAlertDisplay('');
                      toast.success(`Alert timing set to ${timing}`);
                    }}
                  >
                    <span 
                      className="neuro-text"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
                    >
                      {timing}
                    </span>
                    {alertTiming === timing && <Check className="w-5 h-5 neuro-text" />}
                  </div>
                ))}
                
                {/* Custom Alert Option */}
                <div 
                  className={`reminder-option ${alertTiming === 'custom' ? 'selected' : ''}`}
                  onClick={() => setShowCustomAlertModal(true)}
                >
                  <span 
                    className="neuro-text"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
                  >
                    {customAlertDisplay ? customAlertDisplay : 'Custom (pick date)'}
                  </span>
                  {alertTiming === 'custom' && <Check className="w-5 h-5 neuro-text" />}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={() => {
                toast.success('Notification settings saved!');
                setShowNotificationAlertsModal(false);
              }}
              className="neuro-button-primary w-full py-3 rounded-2xl neuro-text"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', paddingLeft: '14px', textAlign: 'left' }}
            >
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* Custom Alert Timing Modal */}
      {showCustomAlertModal && (
        <div className="modal-overlay" onClick={() => setShowCustomAlertModal(false)}>
          <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 
                className="neuro-text"
                style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '300' }}
              >
                Custom Alert Timing
              </h2>
              <button
                onClick={() => setShowCustomAlertModal(false)}
                className="neuro-button w-10 h-10 rounded-xl flex items-center justify-center"
              >
                <X className="w-5 h-5 neuro-text" />
              </button>
            </div>

            <p 
              className="neuro-text opacity-70 mb-5"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
            >
              Choose how you'd like to be reminded:
            </p>

            {/* Alert Type Selection */}
            <div className="space-y-3 mb-5">
              <div 
                className={`reminder-option ${customAlertType === 'days' ? 'selected' : ''}`}
                onClick={() => setCustomAlertType('days')}
              >
                <div>
                  <p 
                    className="neuro-text"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
                  >
                    Days before renewal
                  </p>
                  <p 
                    className="neuro-text opacity-60"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px' }}
                  >
                    Get reminded a specific number of days ahead
                  </p>
                </div>
                {customAlertType === 'days' && <Check className="w-5 h-5 neuro-text" />}
              </div>

              <div 
                className={`reminder-option ${customAlertType === 'exact' ? 'selected' : ''}`}
                onClick={() => setCustomAlertType('exact')}
              >
                <div>
                  <p 
                    className="neuro-text"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
                  >
                    Exact date
                  </p>
                  <p 
                    className="neuro-text opacity-60"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px' }}
                  >
                    Pick a specific date for the reminder
                  </p>
                </div>
                {customAlertType === 'exact' && <Check className="w-5 h-5 neuro-text" />}
              </div>
            </div>

            {/* Input Section */}
            <div className="mb-6">
              {customAlertType === 'days' ? (
                <div>
                  <label 
                    className="neuro-text block mb-2"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
                  >
                    Number of days before renewal:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={customDays}
                    onChange={(e) => setCustomDays(e.target.value)}
                    className="input-field"
                    placeholder="5"
                    style={{ fontSize: '16px' }}
                  />
                </div>
              ) : (
                <div>
                  <label 
                    className="neuro-text block mb-2"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
                  >
                    Select reminder date:
                  </label>
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="input-field"
                    style={{ fontSize: '14px' }}
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  // Validate and save custom alert
                  if (customAlertType === 'days') {
                    const days = parseInt(customDays);
                    if (days > 0 && days <= 30) {
                      const displayText = `${days} ${days === 1 ? 'day' : 'days'} before`;
                      setCustomAlertDisplay(displayText);
                      setAlertTiming('custom');
                      localStorage.setItem('subtle_alert_timing', 'custom');
                      localStorage.setItem('subtle_custom_alert_type', 'days');
                      localStorage.setItem('subtle_custom_days', customDays);
                      toast.success(`Alert set to ${displayText}`);
                      setShowCustomAlertModal(false);
                    } else {
                      toast.error('Please enter a number between 1 and 30');
                    }
                  } else {
                    if (customDate) {
                      const selectedDate = new Date(customDate);
                      const formattedDate = selectedDate.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      });
                      setCustomAlertDisplay(formattedDate);
                      setAlertTiming('custom');
                      localStorage.setItem('subtle_alert_timing', 'custom');
                      localStorage.setItem('subtle_custom_alert_type', 'exact');
                      localStorage.setItem('subtle_custom_date', customDate);
                      toast.success(`Alert set to ${formattedDate}`);
                      setShowCustomAlertModal(false);
                    } else {
                      toast.error('Please select a date');
                    }
                  }
                }}
                className="neuro-button-primary flex-1 py-3 rounded-2xl neuro-text"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
              >
                Set Custom Alert
              </button>
              <button
                onClick={() => setShowCustomAlertModal(false)}
                className="neuro-button flex-1 py-3 rounded-2xl neuro-text"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}