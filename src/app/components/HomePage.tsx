import { useState, useEffect } from 'react';
import { Home as HomeIcon, FileText, TrendingUp, Settings, Plus, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { AddSubscriptionModal } from './AddSubscriptionModal';
import { SubscriptionDetailsModal } from './SubscriptionDetailsModal';
import { SubscriptionsPage } from './SubscriptionsPage';
import { SpendingPage } from './SpendingPage';
import { SettingsPage } from './SettingsPage';
import { EditBudgetPage } from './EditBudgetPage';

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

interface HomePageProps {
  username: string;
  onLogout: () => void;
  subscriptions: Subscription[];
  onViewDetail: (id: string, fromPage?: 'Home' | 'Subscriptions' | 'Spending' | 'Settings') => void;
  onAddSubscription: (data: Omit<Subscription, 'id'>) => void;
  onUpdateSubscription: (id: string, updates: Partial<Subscription>) => void;
  onDeleteSubscription: (id: string) => void;
  initialPage?: 'Home' | 'Subscriptions' | 'Spending' | 'Settings';
  onUpdateProfile?: (updates: { username?: string; email?: string; password?: string }) => void;
  isDarkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
  budgetLimit: number;
  onSetBudgetLimit: (newBudget: number) => void;
}

export function HomePage({ 
  username, 
  subscriptions,
  onViewDetail,
  onAddSubscription,
  onDeleteSubscription,
  onLogout,
  initialPage = 'Home',
  onUpdateProfile,
  isDarkMode,
  onToggleDarkMode,
  budgetLimit,
  onSetBudgetLimit
}: HomePageProps) {
  const [greeting, setGreeting] = useState('');
  const [dateString, setDateString] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#BFCBCF');
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [miniColorPicker, setMiniColorPicker] = useState<{ show: boolean; category: string; x: number; y: number }>({ show: false, category: '', x: 0, y: 0 });
  const [showColorConfirmation, setShowColorConfirmation] = useState(false);
  const [showEditBudget, setShowEditBudget] = useState(false);

  const [categoryColors, setCategoryColors] = useState(() => {
    const saved = localStorage.getItem('subtle_category_colors');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          Entertainment: '#BFCBCF',
          Food: '#E3BFA6',
          Study: '#D2E0C8',
          Transportation: '#D9C9B6',
          Sports: '#E9DFB9',
          Other: '#CDB9A9'
        };
      }
    }
    return {
      Entertainment: '#BFCBCF',
      Food: '#E3BFA6',
      Study: '#D2E0C8',
      Transportation: '#D9C9B6',
      Sports: '#E9DFB9',
      Other: '#CDB9A9'
    };
  });

  const colorPalette = [
    '#D2DCE4', '#DEC3B3', '#DCE8CE', '#EDE6B6',
    '#A77A63', '#7A8B65', '#8B7A98', '#6D8492'
  ];

  // Persist category colors to localStorage
  useEffect(() => {
    localStorage.setItem('subtle_category_colors', JSON.stringify(categoryColors));
  }, [categoryColors]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { month: 'numeric', day: 'numeric', weekday: 'long' };
    setDateString(date.toLocaleDateString('en-US', options));
  }, []);

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  // Scroll to top whenever the page changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentPage]);

  const totalSubscriptions = subscriptions.reduce((sum, sub) => sum + (sub.amount || 0), 0);
  const isOverBudget = totalSubscriptions > budgetLimit;
  const budgetOverage = totalSubscriptions - budgetLimit;

  const categoryData = subscriptions.reduce((acc, sub) => {
    const category = sub.category || 'Other';
    acc[category] = (acc[category] || 0) + (sub.amount || 0);
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
    percentage: totalSubscriptions > 0 ? Math.round((value / totalSubscriptions) * 100) : 0
  }));

  const navItems = [
    { name: 'Home', icon: HomeIcon },
    { name: 'Subscriptions', icon: FileText },
    { name: 'Spending', icon: TrendingUp },
    { name: 'Settings', icon: Settings }
  ];

  const displayName = username || 'user';

  const handleAddSubscription = (subscriptionData: Omit<Subscription, 'id'>) => {
    onAddSubscription(subscriptionData);
    setShowAddModal(false);
  };

  const handleCancelSubscription = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this subscription?')) {
      onDeleteSubscription(id);
      setShowDetailsModal(false);
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      setCategoryColors(prevColors => ({ ...prevColors, [newCategoryName]: selectedColor }));
      setShowAddCategoryModal(false);
      setNewCategoryName('');
      setSelectedColor('#BFCBCF');
    }
  };

  const handleMiniColorPick = (category: string, color: string) => {
    setCategoryColors(prevColors => ({ ...prevColors, [category]: color }));
    setMiniColorPicker({ show: false, category: '', x: 0, y: 0 });
    setShowColorConfirmation(true);
    setTimeout(() => setShowColorConfirmation(false), 2000);
  };

  const handleColorDotClick = (e: React.MouseEvent, category: string) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const pickerWidth = 280; // approximate width of the picker
    
    // Calculate x position - if too close to right edge, shift left
    let xPos = rect.left;
    if (xPos + pickerWidth > windowWidth) {
      xPos = windowWidth - pickerWidth - 20;
    }
    
    setMiniColorPicker({
      show: true,
      category,
      x: xPos,
      y: rect.bottom + 8
    });
  };

  // Handle pie segment click
  const handlePieSegmentClick = (data: any, index: number) => {
    const category = pieData[index]?.name;
    if (!category) return;
    
    // Position the modal in the center of the screen
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const pickerWidth = 280;
    
    setMiniColorPicker({
      show: true,
      category,
      x: Math.max(20, (windowWidth - pickerWidth) / 2),
      y: Math.max(20, (windowHeight - 200) / 2)
    });
  };

  // Render different content based on current page
  const renderPageContent = () => {
    // If editing budget, show the EditBudgetPage
    if (showEditBudget) {
      return (
        <EditBudgetPage
          currentBudget={budgetLimit}
          onSave={(newBudget) => {
            onSetBudgetLimit(newBudget);
            setShowEditBudget(false);
          }}
          onBack={() => setShowEditBudget(false)}
          isDarkMode={isDarkMode}
        />
      );
    }

    switch (currentPage) {
      case 'Subscriptions':
        return (
          <SubscriptionsPage 
            subscriptions={subscriptions}
            onViewDetail={onViewDetail}
            onAddSubscription={() => setShowAddModal(true)}
            isDarkMode={isDarkMode}
            categoryColors={categoryColors}
          />
        );
      case 'Spending':
        return <SpendingPage subscriptions={subscriptions} isDarkMode={isDarkMode} budgetLimit={budgetLimit} onEditBudget={() => setShowEditBudget(true)} />;
      case 'Settings':
        return <SettingsPage username={username} onLogout={onLogout} onUpdateProfile={onUpdateProfile} isDarkMode={isDarkMode} onToggleDarkMode={onToggleDarkMode} budgetLimit={budgetLimit} onSetBudgetLimit={onSetBudgetLimit} />;
      default:
        return renderHomePage();
    }
  };

  const handleViewAllSubscriptions = () => {
    setShowDetailsModal(true);
  };

  const renderHomePage = () => (
    <>
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 
            className="neuro-text mb-1"
            style={{ fontFamily: 'Georgia, serif', fontSize: '30px', fontWeight: '300' }}
          >
            Home 🏠
          </h1>
          <p 
            className="neuro-text"
            style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: '300' }}
          >
            {greeting}, {displayName} :)
          </p>
          <p 
            className="neuro-text opacity-70 mt-1"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
          >
            {dateString}
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="neuro-button-primary w-14 h-14 rounded-2xl flex items-center justify-center"
        >
          <Plus className="w-6 h-6 neuro-text" />
        </button>
      </div>

      {/* Total Subscriptions - Clickable */}
      <div 
        className="neuro-card clickable-card p-6"
        onClick={handleViewAllSubscriptions}
        style={{ cursor: 'pointer' }}
      >
        <div className="flex justify-between items-center">
          <div>
            <p 
              className="neuro-text mb-1"
              style={{ 
                fontFamily: 'Inter, system-ui, sans-serif', 
                fontSize: '15px',
                fontWeight: '600',
                letterSpacing: '0.2px',
                opacity: 0.85
              }}
            >
              Total Subscriptions
            </p>
            <p 
              className="neuro-text"
              style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: '300' }}
            >
              ${totalSubscriptions.toFixed(0)}
            </p>
            <p 
              className="neuro-text opacity-60 mt-1"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px' }}
            >
              Lifetime spending
            </p>
          </div>
          <ChevronRight className="w-5 h-5 neuro-text opacity-50" />
        </div>
      </div>

      {/* Your Spending - Monthly */}
      <div className="neuro-card p-6">
        <div className="flex items-center gap-2 mb-1">
          <p 
            className="neuro-text flex items-center gap-2"
            style={{ 
              fontFamily: 'Inter, system-ui, sans-serif', 
              fontSize: '15px',
              fontWeight: '600',
              letterSpacing: '0.2px',
              opacity: 0.85
            }}
          >
            <span style={{ fontSize: '16px' }}>💸</span>
            Your Spending
          </p>
          {isOverBudget && <span style={{ fontSize: '16px' }}>⚠️</span>}
        </div>
        <p 
          className="neuro-text opacity-60 mb-3"
          style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px' }}
        >
          This month
        </p>
        {isOverBudget && (
          <div 
            className="mb-3 p-3 rounded-2xl"
            style={{
              background: isDarkMode ? 'rgba(232, 163, 154, 0.15)' : 'rgba(232, 163, 154, 0.2)',
              border: isDarkMode ? '1px solid rgba(242, 193, 178, 0.25)' : '1px solid rgba(242, 193, 178, 0.3)'
            }}
          >
            <p 
              className="neuro-text text-center"
              style={{ 
                fontFamily: 'Inter, system-ui, sans-serif', 
                fontSize: '13px',
                lineHeight: '1.5',
                color: isDarkMode ? '#F2C1B2' : '#C78A7E'
              }}
            >
              You're over budget by ${budgetOverage.toFixed(2)} this month.
            </p>
          </div>
        )}
        <div className="spending-bar-bg h-10 mb-4">
          <div 
            className="spending-bar-fill"
            style={{ 
              width: `${Math.min((totalSubscriptions / budgetLimit) * 100, 100)}%`,
              background: isOverBudget 
                ? 'linear-gradient(90deg, #E8A39A 0%, #F2C1B2 100%)' 
                : (isDarkMode ? 'linear-gradient(90deg, #DCC7A1 0%, #BBA490 100%)' : 'linear-gradient(90deg, #D8C0A8 0%, #CBB299 100%)')
            }}
          />
        </div>
        <p 
          className="neuro-text"
          style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '300' }}
        >
          ${totalSubscriptions.toFixed(0)}/${budgetLimit}
        </p>
      </div>

      {/* Subscriptions List and Pie Chart */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Subscriptions */}
        <div className="neuro-card p-6">
          <p 
            className="neuro-text mb-4 flex items-center gap-2"
            style={{ 
              fontFamily: 'Inter, system-ui, sans-serif', 
              fontSize: '15px',
              fontWeight: '600',
              letterSpacing: '0.2px',
              opacity: 0.85
            }}
          >
            <span style={{ fontSize: '16px' }}>📋</span>
            Subscriptions
          </p>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="flex justify-between items-center neuro-inset p-3">
                <span 
                  className="neuro-text"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', fontWeight: '300' }}
                >
                  {sub.name}
                </span>
                <span 
                  className="neuro-text"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', fontWeight: '300' }}
                >
                  ${sub.amount}
                </span>
              </div>
            ))}
            {subscriptions.length === 0 && (
              <p 
                className="text-center neuro-text opacity-50 py-4"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
              >
                No subscriptions yet
              </p>
            )}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="neuro-card p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <p 
              className="neuro-text flex items-center gap-2"
              style={{ 
                fontFamily: 'Inter, system-ui, sans-serif', 
                fontSize: '15px',
                fontWeight: '600',
                letterSpacing: '0.2px',
                opacity: 0.85
              }}
            >
              <span style={{ fontSize: '16px' }}>📊</span>
              Spending by category
            </p>
            <button 
              onClick={() => setShowAddCategoryModal(true)}
              className="neuro-button w-8 h-8 rounded-xl flex items-center justify-center"
              title="Add Category"
            >
              <Plus className="w-4 h-4 neuro-text" />
            </button>
          </div>
          {pieData.length > 0 ? (
            <div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={60}
                      paddingAngle={3}
                      dataKey="value"
                      onClick={handlePieSegmentClick}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={categoryColors[entry.name as keyof typeof categoryColors] || categoryColors.Other} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {pieData.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between neuro-text"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px' }}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: categoryColors[item.name as keyof typeof categoryColors] || categoryColors.Other }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span>{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p 
              className="text-center neuro-text opacity-50 py-8"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
            >
              No data to display
            </p>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: isDarkMode ? '#76625E' : '#E8E1D9' }}>
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

        .nav-active {
          color: ${isDarkMode ? '#F5EFE7' : '#4a3f38'};
        }

        .spending-bar-bg {
          background: ${isDarkMode ? '#76625E' : '#E8DDD8'};
          border-radius: 12px;
          overflow: hidden;
        }

        .spending-bar-fill {
          height: 100%;
          background: ${isDarkMode ? 'linear-gradient(90deg, #DCC7A1 0%, #BBA490 100%)' : 'linear-gradient(90deg, #D8C0A8 0%, #CBB299 100%)'};
          border-radius: 12px;
          transition: width 0.3s ease;
        }

        .modal-overlay {
          background: ${isDarkMode ? 'rgba(118, 98, 94, 0.5)' : 'rgba(106, 94, 85, 0.3)'};
          backdrop-filter: blur(4px);
        }

        .color-option {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 
            4px 4px 8px ${isDarkMode ? '#6A5850' : '#D6CEC5'},
            -4px -4px 8px ${isDarkMode ? '#A0928E' : '#FAF7F3'};
          border: none;
        }

        .color-option.selected {
          box-shadow: 
            inset 3px 3px 6px ${isDarkMode ? '#6A5850' : '#D6CEC5'},
            inset -3px -3px 6px ${isDarkMode ? '#A0928E' : '#FAF7F3'};
          transform: scale(0.95);
        }

        .clickable-card {
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clickable-card:hover {
          box-shadow: 
            8px 8px 16px ${isDarkMode ? '#6A5850' : '#D6CEC5'},
            -8px -8px 16px ${isDarkMode ? '#A0928E' : '#FAF7F3'};
        }

        .mini-color-picker {
          box-shadow: 
            6px 6px 12px ${isDarkMode ? '#6A5850' : '#D6CEC5'},
            -6px -6px 12px ${isDarkMode ? '#A0928E' : '#FAF7F3'};
        }

        .mini-color-option {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 
            3px 3px 6px ${isDarkMode ? '#6A5850' : '#D6CEC5'},
            -3px -3px 6px ${isDarkMode ? '#A0928E' : '#FAF7F3'};
          border: none;
        }

        .mini-color-option:active {
          box-shadow: 
            inset 2px 2px 4px ${isDarkMode ? '#6A5850' : '#D6CEC5'},
            inset -2px -2px 4px ${isDarkMode ? '#A0928E' : '#FAF7F3'};
          transform: scale(0.9);
        }

        .color-dot-clickable {
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .color-dot-clickable:hover {
          transform: scale(1.2);
        }

        .confirmation-toast {
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {renderPageContent()}
      </div>

      {/* Modals */}
      <AddSubscriptionModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddSubscription}
        categories={Object.keys(categoryColors)}
        isDarkMode={isDarkMode}
      />

      <SubscriptionDetailsModal 
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        subscriptions={subscriptions}
        onCancel={handleCancelSubscription}
        onViewDetail={(id) => {
          setShowDetailsModal(false);
          onViewDetail(id);
        }}
        isDarkMode={isDarkMode}
      />

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-50 modal-overlay"
          onClick={() => setShowAddCategoryModal(false)}
        >
          <div 
            className="neuro-card p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 
              className="neuro-text mb-4"
              style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: '300' }}
            >
              Add Category
            </h2>
            
            <input
              type="text"
              placeholder="Category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="neuro-inset w-full px-4 py-3 rounded-2xl neuro-text mb-4"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', border: 'none', outline: 'none' }}
            />

            <p 
              className="neuro-text mb-3"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
            >
              Pick a color
            </p>
            
            <div className="grid grid-cols-4 gap-3 mb-6">
              {colorPalette.map((color) => (
                <button
                  key={color}
                  className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddCategoryModal(false);
                  setNewCategoryName('');
                  setSelectedColor('#BFCBCF');
                }}
                className="neuro-button flex-1 px-4 py-3 rounded-2xl neuro-text"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="neuro-button-primary flex-1 px-4 py-3 rounded-2xl neuro-text"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mini Color Picker */}
      {miniColorPicker.show && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 z-[60]"
            style={{
              background: isDarkMode ? 'rgba(118, 98, 94, 0.3)' : 'rgba(106, 94, 85, 0.2)',
              backdropFilter: 'blur(2px)'
            }}
            onClick={() => setMiniColorPicker({ show: false, category: '', x: 0, y: 0 })}
          />
          
          {/* Mini picker popover */}
          <div 
            className="fixed z-[70] p-4 rounded-2xl mini-color-picker"
            style={{ 
              left: `${miniColorPicker.x}px`, 
              top: `${miniColorPicker.y}px`,
              background: isDarkMode ? '#8A786F' : '#F3ECE4',
              width: '280px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p 
              className="neuro-text mb-3"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', fontWeight: '500' }}
            >
              Pick a color for {miniColorPicker.category}
            </p>
            
            <div className="grid grid-cols-4 gap-3">
              {colorPalette.map((color) => (
                <button
                  key={color}
                  className="mini-color-option"
                  style={{ backgroundColor: color }}
                  onClick={() => handleMiniColorPick(miniColorPicker.category, color)}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Color Confirmation Toast */}
      {showColorConfirmation && (
        <div 
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[80] px-6 py-3 rounded-2xl confirmation-toast"
          style={{
            background: isDarkMode ? '#8A786F' : '#F3ECE4',
            boxShadow: isDarkMode 
              ? '6px 6px 12px #6A5850, -6px -6px 12px #A0928E' 
              : '6px 6px 12px #D6CEC5, -6px -6px 12px #FAF7F3'
          }}
        >
          <p 
            className="neuro-text flex items-center gap-2"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', fontWeight: '500' }}
          >
            ✅ Color updated
          </p>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 neuro-card mx-4 mb-4 px-6 py-4">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          {navItems.map((item) => {
            const isActive = currentPage === item.name;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setCurrentPage(item.name);
                  setShowEditBudget(false); // Close Edit Budget page when navigating
                }}
                className="flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer"
              >
                <item.icon 
                  className={`w-6 h-6 ${isActive ? 'nav-active' : 'neuro-text opacity-60'}`} 
                />
                <span 
                  className={`${isActive ? 'nav-active' : 'neuro-text opacity-60'}`}
                  style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px' }}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}