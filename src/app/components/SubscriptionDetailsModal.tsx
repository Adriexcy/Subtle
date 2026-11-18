import { X, Trash2, ChevronRight } from 'lucide-react';

interface Subscription {
  id: string;
  name: string;
  amount: number;
  category: string;
  billingCycle: string;
  nextBillingDate: string;
}

interface SubscriptionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptions: Subscription[];
  onCancel: (id: string) => void;
  onViewDetail?: (id: string) => void;
  isDarkMode: boolean;
}

export function SubscriptionDetailsModal({ 
  isOpen, 
  onClose, 
  subscriptions, 
  onCancel,
  onViewDetail,
  isDarkMode
}: SubscriptionDetailsModalProps) {
  if (!isOpen) return null;

  const totalAmount = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ 
        background: isDarkMode ? 'rgba(118, 98, 94, 0.5)' : 'rgba(106, 94, 85, 0.3)',
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto"
        style={{
          background: isDarkMode ? '#8A786F' : '#F3ECE4',
          boxShadow: isDarkMode ? '6px 6px 12px #6A5850, -6px -6px 12px #A0928E' : '6px 6px 12px #D6CEC5, -6px -6px 12px #FAF7F3',
          borderRadius: '24px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 
              style={{ 
                fontFamily: 'Georgia, serif',
                fontSize: '24px',
                fontWeight: '300',
                color: isDarkMode ? '#F5EFE7' : '#6A5E55'
              }}
            >
              All Subscriptions
            </h2>
            <p
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                color: isDarkMode ? '#F5EFE7' : '#6A5E55',
                opacity: 0.7,
                marginTop: '4px'
              }}
            >
              Total: ${totalAmount.toFixed(2)}/month
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: isDarkMode ? '#998A82' : '#F3ECE4',
              boxShadow: isDarkMode ? '5px 5px 10px #7A6C65, -5px -5px 10px #B8A89F' : '5px 5px 10px #D6CEC5, -5px -5px 10px #FAF7F3',
              border: 'none',
              cursor: 'pointer',
              color: isDarkMode ? '#F5EFE7' : '#6A5E55'
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {subscriptions.length === 0 ? (
          <p
            className="text-center py-8"
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '14px',
              color: isDarkMode ? '#F5EFE7' : '#6A5E55',
              opacity: 0.5
            }}
          >
            No subscriptions yet. Add your first subscription to get started!
          </p>
        ) : (
          <div className="space-y-3">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="p-4 rounded-2xl"
                style={{
                  background: isDarkMode ? '#8A786F' : '#F3ECE4',
                  boxShadow: isDarkMode ? 'inset 4px 4px 8px #6A5850, inset -4px -4px 8px #A0928E' : 'inset 4px 4px 8px #D6CEC5, inset -4px -4px 8px #FAF7F3',
                  cursor: onViewDetail ? 'pointer' : 'default',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => onViewDetail && onViewDetail(sub.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3
                      style={{
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontSize: '16px',
                        fontWeight: '500',
                        color: isDarkMode ? '#F5EFE7' : '#6A5E55',
                        marginBottom: '4px'
                      }}
                    >
                      {sub.name}
                    </h3>
                    <p
                      style={{
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontSize: '12px',
                        color: isDarkMode ? '#F5EFE7' : '#6A5E55',
                        opacity: 0.7
                      }}
                    >
                      {sub.category} • {sub.billingCycle}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p
                      style={{
                        fontFamily: 'Georgia, serif',
                        fontSize: '20px',
                        fontWeight: '300',
                        color: isDarkMode ? '#F5EFE7' : '#6A5E55'
                      }}
                    >
                      ${sub.amount.toFixed(2)}
                    </p>
                    {onViewDetail && (
                      <ChevronRight className="w-5 h-5" style={{ color: isDarkMode ? '#F5EFE7' : '#6A5E55', opacity: 0.5 }} />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3"
                  style={{
                    borderTop: isDarkMode ? '1px solid rgba(245, 239, 231, 0.1)' : '1px solid rgba(106, 94, 85, 0.1)'
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontSize: '12px',
                      color: isDarkMode ? '#F5EFE7' : '#6A5E55',
                      opacity: 0.6
                    }}
                  >
                    Next billing date
                  </p>
                  <p
                    style={{
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontSize: '12px',
                      color: isDarkMode ? '#F5EFE7' : '#6A5E55'
                    }}
                  >
                    {new Date(sub.nextBillingDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}