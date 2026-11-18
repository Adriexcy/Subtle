import { useState } from 'react';
import { Plus, Search, ChevronDown, MoreVertical, Calendar, AlertCircle } from 'lucide-react';

interface Subscription {
  id: string;
  name: string;
  amount: number;
  category: string;
  billingCycle: string;
  nextBillingDate: string;
  status?: string;
}

interface SubscriptionsPageProps {
  subscriptions: Subscription[];
  onViewDetail: (id: string, fromPage?: 'Home' | 'Subscriptions' | 'Spending' | 'Settings') => void;
  onAddSubscription: () => void;
  isDarkMode: boolean;
  categoryColors?: Record<string, string>;
}

export function SubscriptionsPage({ subscriptions, onViewDetail, onAddSubscription, isDarkMode, categoryColors: propCategoryColors }: SubscriptionsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('active');
  const [sortBy, setSortBy] = useState('renewal');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const categories = ['All Categories', 'Entertainment', 'Food', 'Study', 'Transportation', 'Sports', 'Other'];
  const statuses = ['All Status', 'Active', 'Paused', 'Cancelled'];
  const sortOptions = [
    { value: 'renewal', label: 'Sorted By' },
    { value: 'cost_high', label: 'Highest cost' },
    { value: 'cost_low', label: 'Lowest cost' },
    { value: 'name', label: 'Name' },
    { value: 'recent', label: 'Recently added' }
  ];
  
  // Use prop colors if provided, otherwise use defaults
  const categoryColors: Record<string, string> = propCategoryColors || {
    Entertainment: '#BFCBCF',
    Food: '#E3BFA6',
    Study: '#D2E0C8',
    Transportation: '#D9C9B6',
    Sports: '#E9DFB9',
    Other: '#CDB9A9'
  };

  const getDaysUntilRenewal = (date: string) => {
    if (!date) return null;
    const renewalDate = new Date(date);
    const today = new Date();
    const diffTime = renewalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter and sort subscriptions
  const filteredAndSortedSubs = (() => {
    let result = [...subscriptions];

    // Search filter
    if (searchTerm) {
      result = result.filter(sub => 
        sub.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(sub => sub.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      result = result.filter(sub => sub.status === selectedStatus.toLowerCase());
    }

    // Sort
    switch (sortBy) {
      case 'renewal':
        result.sort((a, b) => {
          if (!a.nextBillingDate) return 1;
          if (!b.nextBillingDate) return -1;
          return new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime();
        });
        break;
      case 'cost_high':
        result.sort((a, b) => (b.amount || 0) - (a.amount || 0));
        break;
      case 'cost_low':
        result.sort((a, b) => (a.amount || 0) - (b.amount || 0));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recent':
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }

    return result;
  })();

  const getCategoryLabel = () => {
    return selectedCategory === 'all' ? 'All Categories' : selectedCategory;
  };

  const getStatusLabel = () => {
    if (selectedStatus === 'all') return 'All Status';
    return selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1);
  };

  const getSortLabel = () => {
    return sortOptions.find(opt => opt.value === sortBy)?.label || 'Next renewal';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
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

        .neuro-search-bar {
          background: ${isDarkMode ? '#8A786F' : '#F3ECE4'};
          box-shadow: 
            8px 8px 16px ${isDarkMode ? '#6A5850' : '#D6CEC5'},
            -8px -8px 16px ${isDarkMode ? '#A0928E' : '#FAF7F3'};
          border-radius: 28px;
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

        .dropdown-selector {
          background: ${isDarkMode 
            ? 'linear-gradient(135deg, #978676 0%, #8A786F 100%)' 
            : 'linear-gradient(135deg, #FAF7F3 0%, #F3ECE4 100%)'};
          border: ${isDarkMode 
            ? '1.5px solid rgba(245, 239, 231, 0.2)' 
            : '1.5px solid rgba(106, 94, 85, 0.15)'};
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Inter, system-ui, sans-serif';
          font-size: 13px;
          font-weight: 600;
          color: ${isDarkMode ? '#F5EFE7' : '#6A5E55'};
          position: relative;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 14px;
          border-radius: 20px;
          box-shadow: 
            3px 3px 8px ${isDarkMode ? '#6A5850' : '#D6CEC5'},
            -3px -3px 8px ${isDarkMode ? '#A0928E' : '#FAF7F3'};
        }
        
        .dropdown-selector:hover {
          border-color: ${isDarkMode ? 'rgba(245, 239, 231, 0.3)' : 'rgba(106, 94, 85, 0.25)'};
          box-shadow: 
            4px 4px 10px ${isDarkMode ? '#6A5850' : '#D6CEC5'},
            -4px -4px 10px ${isDarkMode ? '#A0928E' : '#FAF7F3'};
          transform: translateY(-1px);
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          background: ${isDarkMode ? '#8A786F' : '#F3ECE4'};
          box-shadow: 
            6px 6px 12px ${isDarkMode ? '#6A5850' : '#D6CEC5'},
            -6px -6px 12px ${isDarkMode ? '#A0928E' : '#FAF7F3'};
          border-radius: 16px;
          padding: 8px;
          z-index: 10;
          min-width: 160px;
          max-height: 200px;
          overflow-y: auto;
        }

        .dropdown-item {
          padding: 10px 16px;
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.2s ease;
          font-family: 'Inter, system-ui, sans-serif';
          font-size: 14px;
          color: ${isDarkMode ? '#F5EFE7' : '#6A5E55'};
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dropdown-item:hover {
          background: ${isDarkMode ? 'rgba(187, 164, 144, 0.2)' : 'rgba(214, 206, 197, 0.2)'};
        }

        .dropdown-item.selected {
          background: ${isDarkMode ? 'rgba(187, 164, 144, 0.3)' : 'rgba(216, 192, 168, 0.3)'};
        }

        .neuro-text {
          color: ${isDarkMode ? '#F5EFE7' : '#6A5E55'};
        }

        .chip {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 400;
        }

        .menu-dropdown {
          position: absolute;
          right: 0;
          top: 100%;
          margin-top: 8px;
          z-index: 10;
        }

        .soon-badge {
          background: #E3BFA6;
          color: #6A5E55;
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 
          className="neuro-text"
          style={{ fontFamily: 'Georgia, serif', fontSize: '30px', fontWeight: '300' }}
        >
          Subscriptions
        </h1>
        <button 
          onClick={onAddSubscription}
          className="neuro-button-primary w-12 h-12 rounded-2xl flex items-center justify-center"
        >
          <Plus className="w-5 h-5 neuro-text" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="neuro-search-bar flex items-center px-6 py-5">
        <Search className="w-6 h-6 neuro-text opacity-40 mr-4" />
        <input
          type="text"
          placeholder="Search subscriptions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none neuro-text placeholder-opacity-60"
          style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}
        />
      </div>

      {/* Helper Text */}
      <p 
        className="neuro-text opacity-70 px-2"
        style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
      >
        Search and filter your active subscriptions.
      </p>

      {/* Dropdown Selectors Row */}
      <div className="grid grid-cols-3 gap-3">
        {/* Category Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
            className="dropdown-selector w-full"
          >
            <span>{getCategoryLabel()}</span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </button>
          {openDropdown === 'category' && (
            <div className="dropdown-menu">
              {categories.map((cat) => (
                <div
                  key={cat}
                  className={`dropdown-item ${selectedCategory === (cat === 'All Categories' ? 'all' : cat) ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedCategory(cat === 'All Categories' ? 'all' : cat);
                    setOpenDropdown(null);
                  }}
                >
                  {selectedCategory === (cat === 'All Categories' ? 'all' : cat) && <span>✓</span>}
                  <span>{cat}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
            className="dropdown-selector w-full"
          >
            <span>{getStatusLabel()}</span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </button>
          {openDropdown === 'status' && (
            <div className="dropdown-menu">
              {statuses.map((status) => (
                <div
                  key={status}
                  className={`dropdown-item ${selectedStatus === (status === 'All Status' ? 'all' : status.toLowerCase()) ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedStatus(status === 'All Status' ? 'all' : status.toLowerCase());
                    setOpenDropdown(null);
                  }}
                >
                  {selectedStatus === (status === 'All Status' ? 'all' : status.toLowerCase()) && <span>✓</span>}
                  <span>{status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
            className="dropdown-selector w-full"
          >
            <span>{getSortLabel()}</span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </button>
          {openDropdown === 'sort' && (
            <div className="dropdown-menu">
              {sortOptions.map((option) => (
                <div
                  key={option.value}
                  className={`dropdown-item ${sortBy === option.value ? 'selected' : ''}`}
                  onClick={() => {
                    setSortBy(option.value);
                    setOpenDropdown(null);
                  }}
                >
                  {sortBy === option.value && <span>✓</span>}
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {openDropdown && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setOpenDropdown(null)}
        />
      )}

      {/* Subscriptions List */}
      {filteredAndSortedSubs.length === 0 ? (
        <div className="neuro-card p-12 text-center">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <h3 
            className="neuro-text mb-2"
            style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: '300' }}
          >
            {subscriptions.length === 0 ? "Let's add your first one" : "No subscriptions found"}
          </h3>
          <p 
            className="neuro-text opacity-70 mb-6"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
          >
            {subscriptions.length === 0 
              ? "Start tracking your subscriptions to manage your spending better"
              : "Try adjusting your filters or search"}
          </p>
          {subscriptions.length === 0 && (
            <button
              onClick={onAddSubscription}
              className="neuro-button-primary px-6 py-3 rounded-2xl neuro-text"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
            >
              Add Subscription
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAndSortedSubs.map((sub) => {
            const daysUntil = getDaysUntilRenewal(sub.nextBillingDate);
            const isSoon = daysUntil !== null && daysUntil <= 7 && daysUntil >= 0;
            
            return (
              <div key={sub.id} className="neuro-card p-4 relative">
                <div className="flex items-start justify-between">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => onViewDetail(sub.id, 'Subscriptions')}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl neuro-inset flex items-center justify-center">
                        <span className="neuro-text" style={{ fontSize: '20px' }}>
                          {sub.name.charAt(0)}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <h3 
                          className="neuro-text"
                          style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '300' }}
                        >
                          {sub.name}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span 
                            className="neuro-text"
                            style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
                          >
                            ${sub.amount}/{sub.billingCycle === 'annually' ? 'year' : 'month'}
                          </span>
                          
                          <span 
                            className="chip"
                            style={{ 
                              backgroundColor: categoryColors[sub.category] || categoryColors.Other,
                              fontFamily: 'Inter, system-ui, sans-serif'
                            }}
                          >
                            {sub.category}
                          </span>
                          
                          {sub.status === 'paused' && (
                            <span 
                              className="chip"
                              style={{ 
                                backgroundColor: '#D6CEC5',
                                fontFamily: 'Inter, system-ui, sans-serif'
                              }}
                            >
                              Paused
                            </span>
                          )}
                        </div>
                        
                        {sub.nextBillingDate && (
                          <div className="flex items-center gap-2 mt-2">
                            <Calendar className="w-3 h-3 neuro-text opacity-50" />
                            <span 
                              className="neuro-text opacity-70"
                              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px' }}
                            >
                              Next payment on {formatDate(sub.nextBillingDate)}
                            </span>
                            {isSoon && (
                              <span 
                                className="chip soon-badge flex items-center gap-1"
                                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                              >
                                <AlertCircle className="w-3 h-3" />
                                Soon
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === sub.id ? null : sub.id)}
                      className="neuro-button w-8 h-8 rounded-xl flex items-center justify-center"
                    >
                      <MoreVertical className="w-4 h-4 neuro-text" />
                    </button>
                    
                    {activeMenu === sub.id && (
                      <div className="menu-dropdown neuro-card p-2 w-40">
                        <button
                          onClick={() => {
                            onViewDetail(sub.id, 'Subscriptions');
                            setActiveMenu(null);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg neuro-text hover:bg-opacity-50"
                          style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px' }}
                        >
                          View details
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}