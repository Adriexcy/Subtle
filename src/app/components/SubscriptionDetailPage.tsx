import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, DollarSign, Activity, Star, Edit } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

interface Subscription {
  id: string;
  name: string;
  amount: number;
  category: string;
  billingCycle: string;
  nextBillingDate: string;
  status?: string;
  rating?: number;
  note?: string;
  usageFrequency?: string;
}

interface SubscriptionDetailPageProps {
  subscription: Subscription;
  allSubscriptions: Subscription[];
  onBack: () => void;
  onUpdate: (id: string, updates: Partial<Subscription>) => void;
  onDelete: (id: string) => void;
  isDarkMode: boolean;
}

export function SubscriptionDetailPage({ 
  subscription, 
  allSubscriptions,
  onBack, 
  onUpdate,
  onDelete,
  isDarkMode
}: SubscriptionDetailPageProps) {
  const [rating, setRating] = useState(subscription.rating || 0);
  const [note, setNote] = useState(subscription.note || '');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [usageFrequency, setUsageFrequency] = useState(subscription.usageFrequency || '');
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [actionType, setActionType] = useState<'pause' | 'cancel'>('pause');

  const categoryColors: Record<string, string> = {
    Entertainment: '#BFCBCF',
    Food: '#E3BFA6',
    Study: '#D2E0C8',
    Transportation: '#D9C9B6',
    Sports: '#E9DFB9',
    Other: '#CDB9A9'
  };

  useEffect(() => {
    setRating(subscription.rating || 0);
    setNote(subscription.note || '');
    setUsageFrequency(subscription.usageFrequency || '');
  }, [subscription]);

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const getDaysUntilRenewal = () => {
    if (!subscription.nextBillingDate) return null;
    const today = new Date();
    const billingDate = new Date(subscription.nextBillingDate);
    const diffTime = billingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilRenewal = getDaysUntilRenewal();

  const totalMonthlySpending = allSubscriptions
    .filter(sub => sub.status !== 'cancelled')
    .reduce((sum, sub) => sum + (sub.amount || 0), 0);
  
  const budgetPercentage = totalMonthlySpending > 0 
    ? Math.round((subscription.amount / totalMonthlySpending) * 100) 
    : 0;

  // Mock spending history data (last 6 months)
  const historyData = [
    { month: 1, amount: subscription.amount },
    { month: 2, amount: subscription.amount },
    { month: 3, amount: subscription.amount },
    { month: 4, amount: subscription.amount },
    { month: 5, amount: subscription.amount },
    { month: 6, amount: subscription.amount }
  ];

  const handlePause = () => {
    setActionType('pause');
    setShowSuggestionModal(true);
  };

  const handleActivate = () => {
    onUpdate(subscription.id, { status: 'active' });
  };

  const handleCancel = () => {
    setActionType('cancel');
    setShowSuggestionModal(true);
  };

  const handleConfirmAction = () => {
    if (actionType === 'pause') {
      onUpdate(subscription.id, { status: 'paused' });
    } else {
      onDelete(subscription.id);
      onBack();
    }
    setShowSuggestionModal(false);
  };

  const handleKeep = () => {
    setShowSuggestionModal(false);
  };

  const handleSaveRating = (newRating: number) => {
    setRating(newRating);
    onUpdate(subscription.id, { rating: newRating });
  };

  const handleSaveNote = () => {
    onUpdate(subscription.id, { note });
    setIsEditingNote(false);
  };

  const handleUsageFrequencyChange = (frequency: string) => {
    setUsageFrequency(frequency);
    onUpdate(subscription.id, { usageFrequency: frequency });
  };

  const getUsageInsight = () => {
    if (!usageFrequency) return null;
    
    const estimations: Record<string, { sessions: number; hours: number }> = {
      daily: { sessions: 30, hours: 30 },
      weekly: { sessions: 4, hours: 4 },
      occasionally: { sessions: 2, hours: 2 },
      rarely: { sessions: 1, hours: 1 }
    };
    
    const estimate = estimations[usageFrequency];
    if (!estimate) return null;

    const lastMonthEstimate = estimate.hours * 1.73; // Mock: 73% more last month
    const change = Math.round(((estimate.hours - lastMonthEstimate) / lastMonthEstimate) * 100);

    return `Estimated ${estimate.hours} hour${estimate.hours > 1 ? 's' : ''} this month (${change}% vs last month).`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Get usage-based suggestion text
  const getUsageSuggestion = () => {
    if (usageFrequency === 'rarely') {
      return `You only used this subscription twice this month. Continue or ${actionType}?`;
    } else if (usageFrequency === 'occasionally') {
      return `You used this subscription 5 times this month. Want to keep it?`;
    } else if (usageFrequency === 'weekly') {
      return `You're using this regularly. Consider keeping it.`;
    } else if (usageFrequency === 'daily') {
      return `You're using this daily. It might be worth keeping.`;
    }
    return `Take a moment to think about how often you use this.`;
  };

  // Check if user is over budget (mock: $200 budget)
  const BUDGET_LIMIT = 200;
  const budgetOverage = totalMonthlySpending - BUDGET_LIMIT;
  const isOverBudget = budgetOverage > 0;

  const getBudgetWarning = () => {
    if (isOverBudget) {
      return `You're over your monthly budget by $${budgetOverage.toFixed(2)}. Want to review subscriptions?`;
    } else if (totalMonthlySpending > BUDGET_LIMIT * 0.85) {
      return `You're close to your budget limit. Removing this could help.`;
    }
    return null;
  };

  return (
    <div className="min-h-screen pb-8" style={{ backgroundColor: isDarkMode ? '#76625E' : '#E8E1D9' }}>
      <style>{`
        .neuro-card {
          background: ${isDarkMode ? '#8A786F' : '#F3ECE4'};
          box-shadow: 
            6px 6px 12px ${isDarkMode ? '#6A5850' : '#D6CEC5'},
            -6px -6px 12px ${isDarkMode ? '#A0928E' : '#FAF7F3'};
          border-radius: 24px;
          width: 100%;
        }

        @media (max-width: 768px) {
          .neuro-card {
            box-shadow: 
              4px 4px 8px ${isDarkMode ? '#6A5850' : '#D6CEC5'},
              -4px -4px 8px ${isDarkMode ? '#A0928E' : '#FAF7F3'};
            border-radius: 20px;
          }
        }

        @media (max-width: 390px) {
          .neuro-card {
            border-radius: 16px;
          }
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

        .neuro-button-flat {
          background: ${isDarkMode ? '#8A786F' : '#F3ECE4'};
          box-shadow: 
            2px 2px 4px ${isDarkMode ? 'rgba(106, 88, 80, 0.3)' : 'rgba(214, 206, 197, 0.3)'},
            -2px -2px 4px ${isDarkMode ? 'rgba(160, 146, 142, 0.2)' : 'rgba(250, 247, 243, 0.2)'};
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
        }

        .neuro-button-flat:active {
          box-shadow: 
            inset 2px 2px 4px ${isDarkMode ? 'rgba(106, 88, 80, 0.3)' : 'rgba(214, 206, 197, 0.3)'},
            inset -2px -2px 4px ${isDarkMode ? 'rgba(160, 146, 142, 0.2)' : 'rgba(250, 247, 243, 0.2)'};
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

        .neuro-text {
          color: ${isDarkMode ? '#F5EFE7' : '#6A5E55'};
        }

        .star {
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .star.filled {
          color: #E9DFB9;
        }

        .star:hover {
          transform: scale(1.1);
        }

        .frequency-option {
          background: ${isDarkMode ? '#998A82' : '#F3ECE4'};
          box-shadow: 
            4px 4px 8px ${isDarkMode ? '#7A6C65' : '#D6CEC5'},
            -4px -4px 8px ${isDarkMode ? '#B8A89F' : '#FAF7F3'};
          padding: 10px 16px;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Inter, system-ui, sans-serif';
          font-size: 13px;
          color: ${isDarkMode ? '#F5EFE7' : '#6A5E55'};
          border: none;
        }

        .frequency-option.selected {
          background: ${isDarkMode ? '#BBA490' : '#D8C0A8'};
          box-shadow: 
            inset 3px 3px 6px ${isDarkMode ? '#9A8673' : '#CBB299'},
            inset -3px -3px 6px ${isDarkMode ? '#DCC2AD' : '#E5CDB7'};
        }

        .frequency-option:active {
          box-shadow: 
            inset 3px 3px 6px ${isDarkMode ? '#7A6C65' : '#D6CEC5'},
            inset -3px -3px 6px ${isDarkMode ? '#B8A89F' : '#FAF7F3'};
        }

        /* Mobile Responsive Styles */
        .page-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          padding: clamp(16px, 4vw, 24px);
          gap: clamp(12px, 3vw, 24px);
        }

        @media (min-width: 1024px) {
          .page-container {
            max-width: 800px;
            margin: 0 auto;
          }
        }

        @media (max-width: 768px) {
          .neuro-card {
            padding: clamp(12px, 3vw, 20px) !important;
          }
        }

        @media (max-width: 390px) {
          .page-container {
            padding: 12px;
            gap: 10px;
          }
        }

        /* Fluid Typography */
        .title-text {
          font-size: clamp(18px, 4vw, 24px);
        }

        .body-text {
          font-size: clamp(14px, 3vw, 18px);
        }

        .section-title {
          font-size: clamp(16px, 3.6vw, 20px);
        }

        /* Fill Container Buttons */
        .action-buttons {
          display: flex;
          width: 100%;
          gap: clamp(8px, 2vw, 12px);
        }

        .action-buttons button {
          flex: 1;
          min-width: 0;
        }

        @media (max-width: 390px) {
          .action-buttons {
            flex-direction: column;
          }

          .action-buttons button {
            width: 100%;
          }
        }

        /* Fill Container Frequency Options */
        .frequency-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(8px, 2vw, 12px);
          width: 100%;
        }

        .frequency-option {
          width: 100%;
          text-align: center;
        }

        /* Responsive Icon Sizes */
        @media (max-width: 390px) {
          .icon-avatar {
            width: clamp(48px, 12vw, 64px) !important;
            height: clamp(48px, 12vw, 64px) !important;
          }

          .icon-avatar-text {
            font-size: clamp(20px, 6vw, 32px) !important;
          }
        }

        /* Responsive Amount Text */
        .amount-text {
          font-size: clamp(22px, 5vw, 30px);
        }

        .amount-label {
          font-size: clamp(10px, 2.5vw, 12px);
        }
      `}</style>

      <div className="page-container">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="neuro-button w-10 h-10 rounded-xl flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 neuro-text" />
        </button>

        {/* Main Info Card */}
        <div className="neuro-card p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl neuro-inset flex items-center justify-center icon-avatar">
                <span className="neuro-text icon-avatar-text" style={{ fontFamily: 'Georgia, serif', fontSize: '32px' }}>
                  {subscription.name.charAt(0)}
                </span>
              </div>
              
              <div>
                <h1 
                  className="neuro-text mb-1 title-text"
                  style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '300' }}
                >
                  {subscription.name}
                </h1>
                <div 
                  className="inline-flex items-center px-3 py-1 rounded-xl"
                  style={{ 
                    backgroundColor: categoryColors[subscription.category] || categoryColors.Other,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '12px',
                    color: '#6A5E55'
                  }}
                >
                  {subscription.category}
                </div>
              </div>
            </div>

            <div className="text-right">
              <p 
                className="neuro-text amount-text"
                style={{ fontFamily: 'Georgia, serif', fontSize: '30px', fontWeight: '300' }}
              >
                ${subscription.amount}
              </p>
              <p 
                className="neuro-text opacity-60 amount-label"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px' }}
              >
                per month
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="action-buttons">
            {subscription.status === 'active' || !subscription.status ? (
              <button
                onClick={handlePause}
                className="neuro-button flex-1 px-4 py-3 rounded-2xl neuro-text"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
              >
                Pause
              </button>
            ) : (
              <button
                onClick={handleActivate}
                className="neuro-button-primary flex-1 px-4 py-3 rounded-2xl neuro-text"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
              >
                Activate
              </button>
            )}
            <button
              onClick={handleCancel}
              className="neuro-button flex-1 px-4 py-3 rounded-2xl neuro-text"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Usage Tracking */}
        <div className="neuro-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 neuro-text" />
            <h2 
              className="neuro-text"
              style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '300' }}
            >
              Usage Tracking
            </h2>
          </div>

          <p 
            className="neuro-text mb-3"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
          >
            How often do you use this subscription?
          </p>

          <div className="frequency-grid">
            {[
              { value: 'daily', label: 'Daily', emoji: '🔥' },
              { value: 'weekly', label: 'Weekly', emoji: '📅' },
              { value: 'occasionally', label: 'Occasionally', emoji: '⏱️' },
              { value: 'rarely', label: 'Rarely', emoji: '💤' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleUsageFrequencyChange(option.value)}
                className={`frequency-option ${usageFrequency === option.value ? 'selected' : ''}`}
              >
                {option.emoji} {option.label}
              </button>
            ))}
          </div>

          {usageFrequency && (
            <div className="neuro-inset p-4 rounded-2xl" style={{ marginTop: 'clamp(8px, 2vw, 12px)' }}>
              <p 
                className="neuro-text body-text"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
              >
                {getUsageInsight()}
              </p>
            </div>
          )}
        </div>

        {/* Spending History */}
        <div className="neuro-card p-6">
          <h2 
            className="neuro-text mb-4 section-title"
            style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '300' }}
          >
            Spending History
          </h2>
          
          <div className="h-24 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#D8C0A8" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="neuro-inset p-4 rounded-2xl">
            <p 
              className="neuro-text"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
            >
              This subscription makes up <strong>{budgetPercentage}%</strong> of your monthly subscription cost.
            </p>
          </div>
        </div>

        {/* Billing Info */}
        <div className="neuro-card p-6">
          <h2 
            className="neuro-text mb-4 section-title"
            style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '300' }}
          >
            Billing
          </h2>
          
          <div className="space-y-3">
            {subscription.nextBillingDate && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 neuro-text opacity-50" />
                  <span 
                    className="neuro-text"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
                  >
                    Next payment
                  </span>
                </div>
                <div className="text-right">
                  <p 
                    className="neuro-text"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
                  >
                    {formatDate(subscription.nextBillingDate)}
                  </p>
                  {daysUntilRenewal !== null && daysUntilRenewal >= 0 && (
                    <p 
                      className="neuro-text opacity-60"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px' }}
                    >
                      in {daysUntilRenewal} days
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 neuro-text opacity-50" />
                <span 
                  className="neuro-text"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
                >
                  Status
                </span>
              </div>
              <span 
                className="neuro-text capitalize"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
              >
                {subscription.status || 'active'}
              </span>
            </div>
          </div>
        </div>

        {/* Value Rating */}
        <div className="neuro-card p-6">
          <h2 
            className="neuro-text mb-4 section-title"
            style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '300' }}
          >
            Value Rating
          </h2>
          
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`star w-8 h-8 ${rating >= star ? 'filled' : 'neuro-text opacity-30'}`}
                fill={rating >= star ? '#E9DFB9' : 'none'}
                onClick={() => handleSaveRating(star)}
              />
            ))}
          </div>

          <div>
            {isEditingNote ? (
              <div className="space-y-3">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add your thoughts about this subscription..."
                  className="neuro-inset w-full px-4 py-3 rounded-2xl neuro-text resize-none"
                  style={{ 
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '14px',
                    border: 'none',
                    outline: 'none',
                    minHeight: '100px'
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveNote}
                    className="neuro-button-primary px-4 py-2 rounded-xl neuro-text"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px' }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setNote(subscription.note || '');
                      setIsEditingNote(false);
                    }}
                    className="neuro-button px-4 py-2 rounded-xl neuro-text"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {note ? (
                  <div className="neuro-inset p-4 rounded-2xl relative">
                    <p 
                      className="neuro-text"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
                    >
                      {note}
                    </p>
                    <button
                      onClick={() => setIsEditingNote(true)}
                      className="absolute top-2 right-2 neuro-button w-8 h-8 rounded-lg flex items-center justify-center"
                    >
                      <Edit className="w-3 h-3 neuro-text" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingNote(true)}
                    className="neuro-inset w-full px-4 py-3 rounded-2xl neuro-text opacity-60 text-left"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
                  >
                    Add a note about this subscription...
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="neuro-button w-full px-6 py-3 rounded-2xl neuro-text"
          style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
        >
          Back to Subscriptions
        </button>
      </div>

      {/* Suggestion Modal */}
      {showSuggestionModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-5 z-50"
          style={{ 
            background: isDarkMode ? 'rgba(118, 98, 94, 0.6)' : 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setShowSuggestionModal(false)}
        >
          <div 
            className="w-full max-w-md p-6"
            style={{
              background: isDarkMode ? '#8A786F' : '#F3ECE4',
              boxShadow: isDarkMode 
                ? '10px 10px 20px #6A5850, -10px -10px 20px #A0928E' 
                : '10px 10px 20px #D6CEC5, -10px -10px 20px #FAF7F3',
              borderRadius: '28px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon & Title */}
            <div className="text-center mb-4">
              <span style={{ fontSize: '48px' }}>💭</span>
              <h2 
                className="neuro-text mt-3"
                style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: '300' }}
              >
                {actionType === 'pause' ? 'Pause this subscription?' : 'Cancel this subscription?'}
              </h2>
            </div>
            
            {/* Usage Insight */}
            <div 
              className="p-4 rounded-2xl mb-4"
              style={{ 
                background: isDarkMode ? '#8A786F' : '#F3ECE4',
                boxShadow: isDarkMode 
                  ? 'inset 3px 3px 6px #6A5850, inset -3px -3px 6px #A0928E' 
                  : 'inset 3px 3px 6px #D6CEC5, inset -3px -3px 6px #FAF7F3'
              }}
            >
              <p 
                className="neuro-text text-center"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', lineHeight: '1.5' }}
              >
                {getUsageSuggestion()}
              </p>
            </div>

            {/* Budget Warning (if applicable) */}
            {getBudgetWarning() && (
              <div 
                className="p-4 rounded-2xl mb-4"
                style={{ 
                  background: isDarkMode ? 'rgba(187, 164, 144, 0.2)' : 'rgba(235, 190, 150, 0.2)',
                  border: isDarkMode ? '1px solid rgba(235, 190, 150, 0.3)' : '1px solid rgba(220, 170, 130, 0.3)',
                  borderRadius: '16px'
                }}
              >
                <p 
                  className="neuro-text text-center"
                  style={{ 
                    fontFamily: 'Inter, system-ui, sans-serif', 
                    fontSize: '13px', 
                    lineHeight: '1.5',
                    color: isDarkMode ? '#E5C8A8' : '#A8743A'
                  }}
                >
                  💰 {getBudgetWarning()}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleKeep}
                className="neuro-button-primary w-full py-3 rounded-2xl neuro-text"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', textAlign: 'left', paddingLeft: '24px' }}
              >
                Keep Subscription
              </button>
              
              <div className="flex gap-2">
                {actionType === 'cancel' && (
                  <button
                    onClick={() => {
                      setActionType('pause');
                    }}
                    className="neuro-button-flat flex-1 py-3 rounded-2xl neuro-text"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', textAlign: 'left', paddingLeft: '24px' }}
                  >
                    Pause Instead
                  </button>
                )}
                <button
                  onClick={handleConfirmAction}
                  className="neuro-button-flat flex-1 py-3 rounded-2xl neuro-text"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', textAlign: 'left', paddingLeft: '24px' }}
                >
                  {actionType === 'pause' ? 'Pause' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}