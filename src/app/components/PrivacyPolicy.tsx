import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="min-h-dvh bg-[#e8ddd3] px-6 py-12">
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
          Privacy Policy
        </h1>

        {/* Content */}
        <div className="bg-[#f5ede7] rounded-[24px] p-8 md:p-12 space-y-6 text-[#8b7f72]">
          <div>
            <p className="mb-4">
              <strong>Last updated: November 10, 2025</strong>
            </p>
            <p>
              Welcome to Subtle. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our subscription reminder service.
            </p>
          </div>

          <div>
            <h2 className="text-[#6b5f52] mb-3" style={{ fontSize: '24px' }}>
              Information We Collect
            </h2>
            <p className="mb-2">We collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (username, email address, password)</li>
              <li>Subscription details you choose to track</li>
              <li>Device and usage information</li>
              <li>Communication preferences</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[#6b5f52] mb-3" style={{ fontSize: '24px' }}>
              How We Use Your Information
            </h2>
            <p className="mb-2">Your information is used to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain our subscription reminder services</li>
              <li>Send you notifications about upcoming subscription renewals</li>
              <li>Improve and personalize your experience</li>
              <li>Communicate important updates and changes</li>
              <li>Protect against fraudulent or unauthorized activity</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[#6b5f52] mb-3" style={{ fontSize: '24px' }}>
              Data Security
            </h2>
            <p>
              We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. Your data is encrypted both in transit and at rest.
            </p>
          </div>

          <div>
            <h2 className="text-[#6b5f52] mb-3" style={{ fontSize: '24px' }}>
              Data Sharing
            </h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud</li>
              <li>With service providers who assist in our operations (under strict confidentiality agreements)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[#6b5f52] mb-3" style={{ fontSize: '24px' }}>
              Your Rights
            </h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[#6b5f52] mb-3" style={{ fontSize: '24px' }}>
              Contact Us
            </h2>
            <p>
              If you have any questions or concerns about this Privacy Policy, please contact us at privacy@subtle.app
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
