import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

export function TermsOfService({ onBack }: TermsOfServiceProps) {
  return (
    <div className="min-h-screen bg-[#e8ddd3] px-6 py-12">
      <div className="max-w-[800px] mx-auto">
        {/* Back Button */}
        <Button
          onClick={onBack}
          className="mb-8 bg-[#f5ede7] hover:bg-[#e8ddd3] text-[#8b7f72] rounded-[24px] px-6 h-[48px]"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Login
        </Button>

        {/* Header */}
        <h1
          className="text-center mb-8 text-[#6b5f52] tracking-wide"
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '48px',
            fontWeight: '400',
            lineHeight: '1.2',
          }}
        >
          Terms of Service
        </h1>

        {/* Content */}
        <div className="bg-[#f5ede7] rounded-[24px] p-8 md:p-12 space-y-6 text-[#8b7f72]">
          <div>
            <p className="mb-4">
              <strong>Last updated: November 10, 2025</strong>
            </p>
            <p>
              Welcome to Subtle. By accessing or using our subscription reminder service, you agree to be bound by these Terms of Service. Please read them carefully before using our application.
            </p>
          </div>

          <div>
            <h2 className="text-[#6b5f52] mb-3" style={{ fontSize: '24px' }}>
              Acceptance of Terms
            </h2>
            <p>
              By creating an account and using Subtle, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our service.
            </p>
          </div>

          <div>
            <h2 className="text-[#6b5f52] mb-3" style={{ fontSize: '24px' }}>
              Service Description
            </h2>
            <p>
              Subtle is a subscription reminder application that helps you track and manage your recurring subscriptions. We provide notifications and reminders about upcoming renewal dates to help you stay informed about your subscription commitments.
            </p>
          </div>

          <div>
            <h2 className="text-[#6b5f52] mb-3" style={{ fontSize: '24px' }}>
              User Responsibilities
            </h2>
            <p className="mb-2">As a user of Subtle, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete information when creating your account</li>
              <li>Maintain the security and confidentiality of your account credentials</li>
              <li>Use the service in compliance with all applicable laws and regulations</li>
              <li>Not use the service for any unauthorized or illegal purposes</li>
              <li>Not attempt to gain unauthorized access to our systems or other users' accounts</li>
              <li>Keep your subscription information up to date and accurate</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[#6b5f52] mb-3" style={{ fontSize: '24px' }}>
              Account Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate your account at any time if we believe you have violated these Terms of Service. You may also terminate your account at any time by contacting our support team or using the account deletion feature in the application.
            </p>
          </div>

          <div>
            <h2 className="text-[#6b5f52] mb-3" style={{ fontSize: '24px' }}>
              Limitation of Liability
            </h2>
            <p>
              Subtle is provided "as is" without warranties of any kind. We strive to provide accurate reminder notifications, but we are not liable for any missed notifications or subscription charges. You are ultimately responsible for managing your own subscriptions and payment obligations.
            </p>
          </div>

          <div>
            <h2 className="text-[#6b5f52] mb-3" style={{ fontSize: '24px' }}>
              Intellectual Property
            </h2>
            <p>
              All content, features, and functionality of Subtle, including but not limited to text, graphics, logos, and software, are the exclusive property of Subtle and are protected by copyright, trademark, and other intellectual property laws.
            </p>
          </div>

          <div>
            <h2 className="text-[#6b5f52] mb-3" style={{ fontSize: '24px' }}>
              Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. We will notify users of any material changes via email or through the application. Your continued use of Subtle after such modifications constitutes your acceptance of the updated terms.
            </p>
          </div>

          <div>
            <h2 className="text-[#6b5f52] mb-3" style={{ fontSize: '24px' }}>
              Disclaimer
            </h2>
            <p>
              While we make every effort to ensure the accuracy of reminder notifications, Subtle does not guarantee the timeliness or accuracy of all notifications. Users should independently verify subscription renewal dates and amounts with their service providers.
            </p>
          </div>

          <div>
            <h2 className="text-[#6b5f52] mb-3" style={{ fontSize: '24px' }}>
              Contact Information
            </h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at support@subtle.app
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
