import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface EditBudgetPageProps {
  currentBudget: number;
  onSave: (newBudget: number) => void;
  onBack: () => void;
  isDarkMode: boolean;
}

export function EditBudgetPage({ currentBudget, onSave, onBack, isDarkMode }: EditBudgetPageProps) {
  const [budgetValue, setBudgetValue] = useState(currentBudget.toString());
  const [error, setError] = useState('');
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleSave = () => {
    const numValue = parseFloat(budgetValue);
    
    if (isNaN(numValue) || numValue <= 0) {
      setError('Please enter a valid budget amount');
      return;
    }

    onSave(numValue);
    setShowSavedMessage(true);
    setTimeout(() => {
      setShowSavedMessage(false);
      onBack();
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, ''); // Only allow numbers and decimal
    setBudgetValue(value);
    setError('');
  };

  return (
    <div 
      className="w-full"
      style={{ 
        transition: 'background 0.3s ease'
      }}
    >
      <style>{`
        .neuro-card {
          background: ${isDarkMode ? '#8A786F' : '#F3ECE4'};
          box-shadow: 
            8px 8px 16px ${isDarkMode ? '#6A5850' : '#D6CEC5'},
            -8px -8px 16px ${isDarkMode ? '#A0928E' : '#FAF7F3'};
          border-radius: 28px;
        }

        .neuro-button {
          background: ${isDarkMode ? '#8A786F' : '#F3ECE4'};
          box-shadow: 
            6px 6px 12px ${isDarkMode ? '#6A5850' : '#D6CEC5'},
            -6px -6px 12px ${isDarkMode ? '#A0928E' : '#FAF7F3'};
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .neuro-button:active {
          box-shadow: 
            inset 3px 3px 6px ${isDarkMode ? '#6A5850' : '#D6CEC5'},
            inset -3px -3px 6px ${isDarkMode ? '#A0928E' : '#FAF7F3'};
        }

        .neuro-button-primary {
          background: ${isDarkMode ? '#BBA490' : '#D8C0A8'};
          box-shadow: 
            6px 6px 14px ${isDarkMode ? '#9A8673' : '#CBB299'},
            -6px -6px 14px ${isDarkMode ? '#DCC2AD' : '#E5CDB7'};
          border-radius: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .neuro-button-primary:hover {
          transform: translateY(-2px);
          box-shadow: 
            8px 8px 18px ${isDarkMode ? '#9A8673' : '#CBB299'},
            -8px -8px 18px ${isDarkMode ? '#DCC2AD' : '#E5CDB7'};
        }

        .neuro-button-primary:active {
          transform: translateY(0);
          box-shadow: 
            inset 4px 4px 8px ${isDarkMode ? '#9A8673' : '#CBB299'},
            inset -4px -4px 8px ${isDarkMode ? '#DCC2AD' : '#E5CDB7'};
        }

        .neuro-inset {
          background: ${isDarkMode ? '#8A786F' : '#F3ECE4'};
          box-shadow: 
            inset 3px 3px 6px ${isDarkMode ? '#6A5850' : '#D6CEC5'},
            inset -3px -3px 6px ${isDarkMode ? '#A0928E' : '#FAF7F3'};
          border-radius: 14px;
        }

        .neuro-text {
          color: ${isDarkMode ? '#F5EFE7' : '#6A5E55'};
        }

        .budget-input {
          background: transparent;
          border: none;
          outline: none;
          width: 100%;
          text-align: center;
          font-family: 'Georgia, serif';
          font-size: 42px;
          font-weight: 300;
          color: ${isDarkMode ? '#F5EFE7' : '#6A5E55'};
          -moz-appearance: textfield;
        }

        .budget-input::-webkit-outer-spin-button,
        .budget-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .budget-input::placeholder {
          color: ${isDarkMode ? 'rgba(245, 239, 231, 0.3)' : 'rgba(106, 94, 85, 0.3)'};
        }

        .divider {
          height: 1px;
          background: ${isDarkMode ? 'rgba(245, 239, 231, 0.1)' : 'rgba(106, 94, 85, 0.1)'};
          margin: 32px 0;
        }

        .saved-toast {
          animation: slideInOut 1.5s ease;
        }

        @keyframes slideInOut {
          0% {
            opacity: 0;
            transform: translateY(-10px);
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
            transform: translateY(-10px);
          }
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .back-button:hover {
          transform: translateX(-4px);
        }
      `}</style>

      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={onBack}
            className="neuro-button p-3 mb-8 back-button"
          >
            <ArrowLeft className="w-5 h-5 neuro-text" />
          </button>
          
          <h1 
            className="neuro-text mb-2"
            style={{ 
              fontFamily: 'Georgia, serif', 
              fontSize: '36px', 
              fontWeight: '300',
              letterSpacing: '-0.5px'
            }}
          >
            Edit Budget
          </h1>
          
          <p 
            className="neuro-text opacity-60"
            style={{ 
              fontFamily: 'Inter, system-ui, sans-serif', 
              fontSize: '15px',
              fontWeight: '400'
            }}
          >
            Set your monthly spending limit
          </p>
        </div>

        {/* Budget Input Card */}
        <div className="neuro-card p-10 mb-8">
          <p 
            className="neuro-text opacity-50 text-center mb-4"
            style={{ 
              fontFamily: 'Inter, system-ui, sans-serif', 
              fontSize: '13px',
              fontWeight: '400',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Monthly Budget Limit
          </p>
          
          <div className="neuro-inset p-3 mb-2">
            <div className="flex items-center justify-center gap-1">
              <span 
                className="neuro-text"
                style={{ 
                  fontFamily: 'Georgia, serif', 
                  fontSize: '42px', 
                  fontWeight: '300',
                  lineHeight: '1'
                }}
              >
                $
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={budgetValue}
                onChange={handleInputChange}
                className="budget-input"
                placeholder="200"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <p 
              className="text-center mt-4"
              style={{ 
                fontFamily: 'Inter, system-ui, sans-serif', 
                fontSize: '13px',
                color: '#C78A7E',
                fontWeight: '500'
              }}
            >
              ⚠️ {error}
            </p>
          )}

          <div className="divider" />

          <div className="flex justify-between items-center">
            <p 
              className="neuro-text opacity-50"
              style={{ 
                fontFamily: 'Inter, system-ui, sans-serif', 
                fontSize: '13px',
                fontWeight: '400'
              }}
            >
              Current limit
            </p>
            <p 
              className="neuro-text opacity-70"
              style={{ 
                fontFamily: 'Georgia, serif', 
                fontSize: '20px',
                fontWeight: '300'
              }}
            >
              ${currentBudget.toFixed(0)}
            </p>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="neuro-button-primary w-full py-5 mb-6"
          disabled={showSavedMessage}
        >
          <span 
            className="neuro-text flex items-center justify-center gap-2"
            style={{ 
              fontFamily: 'Inter, system-ui, sans-serif', 
              fontSize: '16px', 
              fontWeight: '600'
            }}
          >
            {showSavedMessage ? (
              <>
                <span>✓</span>
                <span>Saved</span>
              </>
            ) : (
              'Save Budget'
            )}
          </span>
        </button>

        {/* Info */}
        <p 
          className="neuro-text opacity-50 text-center px-4"
          style={{ 
            fontFamily: 'Inter, system-ui, sans-serif', 
            fontSize: '13px', 
            lineHeight: '1.7',
            fontWeight: '400'
          }}
        >
          Your budget limit helps you track spending and receive gentle warnings when approaching your limit.
        </p>
      </div>

      {/* Saved Toast - Floating */}
      {showSavedMessage && (
        <div 
          className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 saved-toast"
          style={{
            background: isDarkMode ? '#8A786F' : '#F3ECE4',
            boxShadow: isDarkMode 
              ? '8px 8px 16px #6A5850, -8px -8px 16px #A0928E' 
              : '8px 8px 16px #D6CEC5, -8px -8px 16px #FAF7F3',
            borderRadius: '20px',
            padding: '16px 32px'
          }}
        >
          <p 
            className="neuro-text flex items-center gap-2"
            style={{ 
              fontFamily: 'Inter, system-ui, sans-serif', 
              fontSize: '15px', 
              fontWeight: '600'
            }}
          >
            <span style={{ fontSize: '18px' }}>✓</span>
            Budget updated successfully
          </p>
        </div>
      )}
    </div>
  );
}