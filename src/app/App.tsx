import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { HomePage } from './components/HomePage';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { SubscriptionDetailPage } from './components/SubscriptionDetailPage';
import { EditBudgetPage } from './components/EditBudgetPage';
import { Toaster } from './components/ui/sonner';

type ViewType = 'login' | 'signup' | 'home' | 'privacy' | 'terms' | 'subscriptionDetail' | 'editBudget';
type PageType = 'Home' | 'Subscriptions' | 'Spending' | 'Settings';

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

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [username, setUsername] = useState('Alex');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [budgetLimit, setBudgetLimit] = useState(() => {
    const saved = localStorage.getItem('subtle_budget_limit');
    return saved ? parseFloat(saved) : 200;
  });
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: '1',
      name: 'Netflix',
      amount: 15.99,
      category: 'Entertainment',
      billingCycle: 'Monthly',
      nextBillingDate: '2025-11-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Spotify',
      amount: 9.99,
      category: 'Entertainment',
      billingCycle: 'Monthly',
      nextBillingDate: '2025-11-20',
      status: 'active'
    },
    {
      id: '3',
      name: 'DoorDash Plus',
      amount: 9.99,
      category: 'Food',
      billingCycle: 'Monthly',
      nextBillingDate: '2025-11-25',
      status: 'active'
    },
    {
      id: '4',
      name: 'Coursera',
      amount: 49.99,
      category: 'Study',
      billingCycle: 'Monthly',
      nextBillingDate: '2025-11-18',
      status: 'active'
    },
    {
      id: '5',
      name: 'Disney+',
      amount: 15,
      category: 'Entertainment',
      billingCycle: 'Monthly',
      nextBillingDate: '2025-11-22',
      status: 'active'
    }
  ]);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | null>(null);
  const [returnToPage, setReturnToPage] = useState<PageType>('Home');

  // Scroll to top whenever the view changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentView]);

  const handleLogin = (user: string) => {
    setUsername(user);
    localStorage.setItem('subtle_username', user);
    setReturnToPage('Home'); // Reset to Home page on login
    setCurrentView('home');
  };

  const handleSignUp = (user: string, email: string, password: string) => {
    // In a real app, you'd send this to your backend
    // For now, we'll just log them in with their username
    setUsername(user);
    localStorage.setItem('subtle_username', user);
    setReturnToPage('Home'); // Reset to Home page on signup
    setCurrentView('home');
  };

  const handleLogout = () => {
    setUsername('');
    localStorage.removeItem('subtle_username');
    setCurrentView('login');
  };

  const handleUpdateProfile = (updates: { username?: string; email?: string; password?: string }) => {
    if (updates.username) {
      setUsername(updates.username);
      localStorage.setItem('subtle_username', updates.username);
    }
    // Email and password would be handled by backend in real app
  };

  const handleViewSubscriptionDetail = (id: string, fromPage?: PageType) => {
    setSelectedSubscriptionId(id);
    if (fromPage) {
      setReturnToPage(fromPage);
    }
    setCurrentView('subscriptionDetail');
  };

  const handleUpdateSubscription = (id: string, updates: Partial<Subscription>) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, ...updates } : sub
    ));
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
  };

  const handleAddSubscription = (subscriptionData: Omit<Subscription, 'id'>) => {
    const newSubscription: Subscription = {
      ...subscriptionData,
      id: Date.now().toString(),
      status: 'active'
    };
    setSubscriptions([...subscriptions, newSubscription]);
  };

  const handleUpdateBudgetLimit = (newBudget: number) => {
    setBudgetLimit(newBudget);
    localStorage.setItem('subtle_budget_limit', newBudget.toString());
  };

  if (currentView === 'privacy') {
    return <PrivacyPolicy onBack={() => setCurrentView('login')} />;
  }

  if (currentView === 'terms') {
    return <TermsOfService onBack={() => setCurrentView('login')} />;
  }

  if (currentView === 'subscriptionDetail' && selectedSubscriptionId) {
    const selectedSubscription = subscriptions.find(sub => sub.id === selectedSubscriptionId);
    if (selectedSubscription) {
      return (
        <SubscriptionDetailPage
          subscription={selectedSubscription}
          allSubscriptions={subscriptions}
          onBack={() => setCurrentView('home')}
          onUpdate={handleUpdateSubscription}
          onDelete={handleDeleteSubscription}
          isDarkMode={isDarkMode}
        />
      );
    }
  }

  if (currentView === 'editBudget') {
    return (
      <EditBudgetPage
        currentBudget={budgetLimit}
        onSave={handleUpdateBudgetLimit}
        onBack={() => setCurrentView('home')}
        isDarkMode={isDarkMode}
      />
    );
  }

  if (currentView === 'home') {
    return (
      <HomePage 
        username={username} 
        onLogout={handleLogout}
        subscriptions={subscriptions}
        onViewDetail={handleViewSubscriptionDetail}
        onAddSubscription={handleAddSubscription}
        onUpdateSubscription={handleUpdateSubscription}
        onDeleteSubscription={handleDeleteSubscription}
        initialPage={returnToPage}
        onUpdateProfile={handleUpdateProfile}
        isDarkMode={isDarkMode}
        onToggleDarkMode={setIsDarkMode}
        budgetLimit={budgetLimit}
        onSetBudgetLimit={handleUpdateBudgetLimit}
      />
    );
  }

  if (currentView === 'signup') {
    return (
      <>
        <SignUpPage 
          onSignUp={handleSignUp}
          onNavigateToLogin={() => setCurrentView('login')}
        />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <LoginPage 
        onLogin={handleLogin}
        onNavigateToPrivacy={() => setCurrentView('privacy')}
        onNavigateToTerms={() => setCurrentView('terms')}
        onNavigateToSignUp={() => setCurrentView('signup')}
      />
      <Toaster />
    </>
  );
}