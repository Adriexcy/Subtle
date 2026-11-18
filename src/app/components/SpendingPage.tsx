import { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { format, subDays, subMonths, startOfDay } from 'date-fns';

interface Subscription {
  id: string;
  name: string;
  amount: number;
  category: string;
  billingCycle: string;
  nextBillingDate: string;
  status?: string;
}

interface SpendingPageProps {
  subscriptions: Subscription[];
  isDarkMode: boolean;
  budgetLimit: number;
  onEditBudget: () => void;
}

type ChartTimeframe = '1W' | '3M' | '6M' | '1Y';

export function SpendingPage({ subscriptions, isDarkMode, budgetLimit, onEditBudget }: SpendingPageProps) {
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const [chartTimeframe, setChartTimeframe] = useState<ChartTimeframe>('6M');

  // Calculate spending data
  const activeSubscriptions = subscriptions.filter(sub => sub.status !== 'cancelled');
  const totalMonthly = activeSubscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const totalYearly = totalMonthly * 12;

  // Budget settings (can be made configurable later)
  const monthlyBudget = budgetLimit;
  const yearlyBudget = budgetLimit * 12;

  // Calculate percentages
  const currentBudget = viewMode === 'monthly' ? monthlyBudget : yearlyBudget;
  const currentSpending = viewMode === 'monthly' ? totalMonthly : totalYearly;
  const budgetPercentage = Math.round((currentSpending / currentBudget) * 100);
  const isOverBudget = currentSpending > currentBudget;
  const budgetOverage = currentSpending - currentBudget;

  // Generate chart data based on timeframe
  const getChartData = () => {
    const today = startOfDay(new Date());
    
    switch(chartTimeframe) {
      case '1W': {
        // Last 7 days ending today
        const data = [];
        for (let i = 6; i >= 0; i--) {
          const date = subDays(today, i);
          const dayName = format(date, 'EEE');
          // Simulate daily spending accumulation
          const amount = totalMonthly * ((7 - i) / 7) * (0.85 + Math.random() * 0.15);
          data.push({
            label: dayName,
            amount: Math.round(amount * 100) / 100
          });
        }
        return data;
      }
      case '3M': {
        // Current month + previous 2 months
        const data = [];
        for (let i = 2; i >= 0; i--) {
          const date = subMonths(today, i);
          const monthName = format(date, 'MMM');
          const amount = i === 0 ? totalMonthly : totalMonthly * (0.8 + (2 - i) * 0.1);
          data.push({
            label: monthName,
            amount: Math.round(amount * 100) / 100
          });
        }
        return data;
      }
      case '6M': {
        // Current month + previous 5 months
        const data = [];
        for (let i = 5; i >= 0; i--) {
          const date = subMonths(today, i);
          const monthName = format(date, 'MMM');
          const amount = i === 0 ? totalMonthly : totalMonthly * (0.7 + (5 - i) * 0.05);
          data.push({
            label: monthName,
            amount: Math.round(amount * 100) / 100
          });
        }
        return data;
      }
      case '1Y': {
        // Past 12 months
        const data = [];
        for (let i = 11; i >= 0; i--) {
          const date = subMonths(today, i);
          const monthName = format(date, 'MMM');
          const amount = i === 0 ? totalMonthly : totalMonthly * (0.6 + (11 - i) * 0.035);
          data.push({
            label: monthName,
            amount: Math.round(amount * 100) / 100
          });
        }
        return data;
      }
      default:
        return [];
    }
  };

  const chartData = getChartData();

  // Mock historical data (last 6 months) - kept for backward compatibility
  const monthlyData = [
    { month: 'Jun', amount: totalMonthly * 0.7 },
    { month: 'Jul', amount: totalMonthly * 0.8 },
    { month: 'Aug', amount: totalMonthly * 0.85 },
    { month: 'Sep', amount: totalMonthly * 0.9 },
    { month: 'Oct', amount: totalMonthly * 0.95 },
    { month: 'Nov', amount: totalMonthly }
  ];

  // Category breakdown
  const categorySpending = activeSubscriptions.reduce((acc, sub) => {
    const category = sub.category || 'Other';
    acc[category] = (acc[category] || 0) + sub.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categorySpending)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);

  const categoryColors: Record<string, string> = {
    Entertainment: '#BFCBCF',
    Food: '#E3BFA6',
    Study: '#D2E0C8',
    Transportation: '#D9C9B6',
    Sports: '#E9DFB9',
    Other: '#CDB9A9'
  };

  // Calculate change from last month
  const lastMonthTotal = monthlyData[monthlyData.length - 2]?.amount || 0;
  const changePercent = lastMonthTotal > 0 
    ? ((totalMonthly - lastMonthTotal) / lastMonthTotal * 100).toFixed(1)
    : 0;
  const isIncrease = Number(changePercent) > 0;

  // Top 3 most expensive subscriptions
  const topSubscriptions = [...activeSubscriptions]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  return (
    <div className="space-y-6 w-full">
      <style>{`
        .neuro-card {
          background: ${isDarkMode ? '#8A786F' : '#F3ECE4'};
          box-shadow: 
            6px 6px 12px ${isDarkMode ? '#6A5850' : '#D6CEC5'},
            -6px -6px 12px ${isDarkMode ? '#A0928E' : '#FAF7F3'};
          border-radius: 24px;
          width: 100%;
        }

        .neuro-inset {
          background: ${isDarkMode ? '#8A786F' : '#F3ECE4'};
          box-shadow: 
            inset 4px 4px 8px ${isDarkMode ? '#6A5850' : '#D6CEC5'},
            inset -4px -4px 8px ${isDarkMode ? '#A0928E' : '#FAF7F3'};
          border-radius: 16px;
        }

        .neuro-text {
          color: ${isDarkMode ? '#F5EFE7' : '#6A5E55'};
        }

        .view-toggle {
          background: ${isDarkMode ? '#998A82' : '#F3ECE4'};
          box-shadow: 
            4px 4px 8px ${isDarkMode ? '#7A6C65' : '#D6CEC5'},
            -4px -4px 8px ${isDarkMode ? '#B8A89F' : '#FAF7F3'};
          padding: 8px 20px;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          font-family: 'Inter, system-ui, sans-serif';
          font-size: 13px;
          color: ${isDarkMode ? '#F5EFE7' : '#6A5E55'};
          white-space: nowrap;
        }

        .view-toggle.active {
          background: ${isDarkMode ? '#BBA490' : '#D8C0A8'};
          box-shadow: 
            inset 3px 3px 6px ${isDarkMode ? '#9A8673' : '#CBB299'},
            inset -3px -3px 6px ${isDarkMode ? '#DCC2AD' : '#E5CDB7'};
        }

        .chart-timeframe-toggle {
          background: ${isDarkMode ? '#998A82' : '#F3ECE4'};
          box-shadow: 
            3px 3px 6px ${isDarkMode ? '#7A6C65' : '#D6CEC5'},
            -3px -3px 6px ${isDarkMode ? '#B8A89F' : '#FAF7F3'};
          padding: 6px 14px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          font-family: 'Inter, system-ui, sans-serif';
          font-size: 12px;
          color: ${isDarkMode ? '#F5EFE7' : '#6A5E55'};
          white-space: nowrap;
        }

        .chart-timeframe-toggle.active {
          background: ${isDarkMode ? '#BBA490' : '#D8C0A8'};\n          box-shadow: \n            inset 2px 2px 4px ${isDarkMode ? '#9A8673' : '#CBB299'},\n            inset -2px -2px 4px ${isDarkMode ? '#DCC2AD' : '#E5CDB7'};\n        }

        .section-title {
          color: ${isDarkMode ? '#F5EFE7' : '#5A4F48'};
          font-family: 'Inter, system-ui, sans-serif';
          font-size: 15px;
          font-weight: 500;
          margin-top: 24px;
        }

        .clickable-budget-card {
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clickable-budget-card:hover {
          box-shadow: \n            8px 8px 16px ${isDarkMode ? '#6A5850' : '#D6CEC5'},\n            -8px -8px 16px ${isDarkMode ? '#A0928E' : '#FAF7F3'};\n        }
      `}</style>

      {/* Header */}
      <h1 
        className="neuro-text"
        style={{ fontFamily: 'Georgia, serif', fontSize: '30px', fontWeight: '300' }}
      >
        Spending 💸
      </h1>

      {/* Toggle View */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setViewMode('monthly')}
          className={`view-toggle ${viewMode === 'monthly' ? 'active' : ''}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setViewMode('yearly')}
          className={`view-toggle ${viewMode === 'yearly' ? 'active' : ''}`}
        >
          Yearly
        </button>
      </div>

      {/* Total Spending Card */}
      <div className="neuro-card p-6">
        {/* Header with label and percentage */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <p 
              className="neuro-text section-title"
              style={{ marginTop: 0 }}
            >
              {viewMode === 'monthly' ? 'This Month' : 'This Year'}
            </p>
            {isOverBudget && <span style={{ fontSize: '16px' }}>⚠️</span>}
          </div>
          <div className="text-right">
            <p 
              className="neuro-text"
              style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: '300', lineHeight: '1' }}
            >
              {budgetPercentage}%
            </p>
            <p 
              className="neuro-text opacity-60"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px' }}
            >
              of budget
            </p>
          </div>
        </div>

        {/* Spending amount */}
        <div className="flex items-baseline gap-2 mb-3">
          <p 
            className="neuro-text"
            style={{ fontFamily: 'Georgia, serif', fontSize: '48px', fontWeight: '300', lineHeight: '1' }}
          >
            ${Math.round(currentSpending)}
          </p>
          <p 
            className="neuro-text opacity-50"
            style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '300' }}
          >
            / ${currentBudget}
          </p>
        </div>

        {/* Over Budget Warning Message */}
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
              You're over budget by ${budgetOverage.toFixed(2)} this {viewMode === 'monthly' ? 'month' : 'year'}.
            </p>
          </div>
        )}

        {/* Trend indicator */}
        <div className="flex items-center gap-1 mb-4">
          {isIncrease ? (
            <TrendingUp className="w-4 h-4" style={{ color: '#6A5E55' }} />
          ) : (
            <TrendingDown className="w-4 h-4" style={{ color: '#6A5E55' }} />
          )}
          <span 
            className="neuro-text opacity-70"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
          >
            {isIncrease ? '+' : ''}{Math.abs(Number(changePercent))}% vs last {viewMode === 'monthly' ? 'month' : 'year'}
          </span>
        </div>

        {/* Progress bar */}
        <div 
          className="w-full h-4 rounded-full overflow-hidden"
          style={{ background: isDarkMode ? '#6A5850' : '#E8E1D9' }}
        >
          <div 
            className="h-full rounded-full transition-all duration-300"
            style={{ 
              width: `${Math.min(budgetPercentage, 100)}%`,
              background: isOverBudget 
                ? 'linear-gradient(90deg, #E8A39A 0%, #F2C1B2 100%)' 
                : (isDarkMode ? '#BBA490' : '#D8C0A8')
            }}
          />
        </div>
      </div>

      {/* Spending Chart */}
      <div className="neuro-card p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <p 
            className="neuro-text section-title"
            style={{ marginTop: 0 }}
          >
            Spending Trend
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setChartTimeframe('1W')}
              className={`chart-timeframe-toggle ${chartTimeframe === '1W' ? 'active' : ''}`}
            >
              1W
            </button>
            <button
              onClick={() => setChartTimeframe('3M')}
              className={`chart-timeframe-toggle ${chartTimeframe === '3M' ? 'active' : ''}`}
            >
              3M
            </button>
            <button
              onClick={() => setChartTimeframe('6M')}
              className={`chart-timeframe-toggle ${chartTimeframe === '6M' ? 'active' : ''}`}
            >
              6M
            </button>
            <button
              onClick={() => setChartTimeframe('1Y')}
              className={`chart-timeframe-toggle ${chartTimeframe === '1Y' ? 'active' : ''}`}
            >
              1Y
            </button>
          </div>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis 
                dataKey="label" 
                stroke={isDarkMode ? '#F5EFE7' : '#6A5E55'}
                style={{ fontSize: '12px', fontFamily: 'Inter, system-ui, sans-serif' }}
              />
              <YAxis 
                stroke={isDarkMode ? '#F5EFE7' : '#6A5E55'}
                style={{ fontSize: '12px', fontFamily: 'Inter, system-ui, sans-serif' }}
              />
              <Tooltip 
                contentStyle={{ 
                  background: isDarkMode ? '#8A786F' : '#F3ECE4',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: isDarkMode ? '4px 4px 8px #6A5850, -4px -4px 8px #A0928E' : '4px 4px 8px #D6CEC5, -4px -4px 8px #FAF7F3',
                  color: isDarkMode ? '#F5EFE7' : '#6A5E55'
                }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke={isDarkMode ? '#DCC7A1' : '#D8C0A8'}
                strokeWidth={3}
                dot={{ fill: isDarkMode ? '#DCC7A1' : '#D8C0A8', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="neuro-card p-6">
        <p 
          className="neuro-text section-title mb-4"
          style={{ marginTop: 0 }}
        >
          By Category
        </p>
        <div className="h-48 w-full mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <XAxis 
                dataKey="name" 
                stroke={isDarkMode ? '#F5EFE7' : '#6A5E55'}
                style={{ fontSize: '11px', fontFamily: 'Inter, system-ui, sans-serif' }}
              />
              <YAxis 
                stroke={isDarkMode ? '#F5EFE7' : '#6A5E55'}
                style={{ fontSize: '12px', fontFamily: 'Inter, system-ui, sans-serif' }}
              />
              <Tooltip 
                contentStyle={{ 
                  background: isDarkMode ? '#8A786F' : '#F3ECE4',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: isDarkMode ? '4px 4px 8px #6A5850, -4px -4px 8px #A0928E' : '4px 4px 8px #D6CEC5, -4px -4px 8px #FAF7F3',
                  color: isDarkMode ? '#F5EFE7' : '#6A5E55'
                }}
                cursor={{ fill: 'transparent' }}
              />
              <Bar 
                dataKey="amount" 
                fill={isDarkMode ? '#DCC7A1' : '#D8C0A8'}
                radius={[8, 8, 0, 0]}
                activeBar={{ 
                  fill: isDarkMode ? '#C9B38A' : '#C9B095',
                  opacity: 0.9
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
          {categoryData.map((item) => (
            <div key={item.name} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full shrink-0" 
                  style={{ backgroundColor: categoryColors[item.name] || categoryColors.Other }}
                />
                <span 
                  className="neuro-text"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
                >
                  {item.name}
                </span>
              </div>
              <span 
                className="neuro-text shrink-0"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
              >
                ${item.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Subscriptions */}
      <div className="neuro-card p-6">
        <p 
          className="neuro-text section-title mb-4"
          style={{ marginTop: 0 }}
        >
          Top Subscriptions
        </p>
        <div className="space-y-3">
          {topSubscriptions.map((sub, index) => (
            <div key={sub.id} className="neuro-inset p-4 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: '#E8E1D9' }}
                >
                  <span 
                    className="neuro-text"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', fontWeight: '500' }}
                  >
                    {index + 1}
                  </span>
                </div>
                <div className="min-w-0">
                  <p 
                    className="neuro-text truncate"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', fontWeight: '500' }}
                  >
                    {sub.name}
                  </p>
                  <p 
                    className="neuro-text opacity-60 truncate"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px' }}
                  >
                    {sub.category}
                  </p>
                </div>
              </div>
              <p 
                className="neuro-text shrink-0"
                style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '300' }}
              >
                ${sub.amount}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Payments */}
      <div className="neuro-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 neuro-text" />
          <p 
            className="neuro-text section-title"
            style={{ marginTop: 0 }}
          >
            Upcoming Payments
          </p>
        </div>
        <div className="space-y-3">
          {activeSubscriptions
            .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime())
            .slice(0, 5)
            .map((sub) => {
              const daysUntil = Math.ceil(
                (new Date(sub.nextBillingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );
              return (
                <div key={sub.id} className="flex justify-between items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p 
                      className="neuro-text truncate"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
                    >
                      {sub.name}
                    </p>
                    <p 
                      className="neuro-text opacity-60"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px' }}
                    >
                      {daysUntil > 0 ? `in ${daysUntil} days` : 'Today'}
                    </p>
                  </div>
                  <p 
                    className="neuro-text shrink-0"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
                  >
                    ${sub.amount}
                  </p>
                </div>
              );
            })}
        </div>
      </div>

      {/* Budget Limit Card */}
      <div className="neuro-card p-6 clickable-budget-card" onClick={onEditBudget}>
        <p 
          className="neuro-text section-title"
          style={{ marginTop: 0, marginBottom: '16px' }}
        >
          Budget Limit
        </p>
        <div className="flex justify-between items-center">
          <div>
            <p 
              className="neuro-text"
              style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: '300', lineHeight: '1' }}
            >
              ${budgetLimit}
            </p>
            <p 
              className="neuro-text opacity-60 mt-2"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px' }}
            >
              Monthly limit
            </p>
          </div>
          <div 
            className="neuro-inset p-3 rounded-2xl"
            style={{ cursor: 'pointer' }}
          >
            <p 
              className="neuro-text"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
            >
              Edit →
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}