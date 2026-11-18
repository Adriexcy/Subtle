import { useState } from 'react';
import { X } from 'lucide-react';

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    amount: number;
    category: string;
    billingCycle: string;
    nextBillingDate: string;
  }) => void;
  categories: string[];
  isDarkMode: boolean;
}

export function AddSubscriptionModal({ isOpen, onClose, onSubmit, categories, isDarkMode }: AddSubscriptionModalProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Entertainment');
  const [billingCycle, setBillingCycle] = useState('Monthly');
  const [nextBillingDate, setNextBillingDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !nextBillingDate) {
      alert('Please fill in all fields');
      return;
    }
    onSubmit({
      name,
      amount: parseFloat(amount),
      category,
      billingCycle,
      nextBillingDate
    });
    // Reset form
    setName('');
    setAmount('');
    setCategory('Entertainment');
    setBillingCycle('Monthly');
    setNextBillingDate('');
  };

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
        className="w-full max-w-md p-6"
        style={{
          background: isDarkMode ? '#8A786F' : '#F3ECE4',
          boxShadow: isDarkMode ? '6px 6px 12px #6A5850, -6px -6px 12px #A0928E' : '6px 6px 12px #D6CEC5, -6px -6px 12px #FAF7F3',
          borderRadius: '24px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 
            style={{ 
              fontFamily: 'Georgia, serif',
              fontSize: '24px',
              fontWeight: '300',
              color: isDarkMode ? '#F5EFE7' : '#6A5E55'
            }}
          >
            Add Subscription
          </h2>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label 
              className="block mb-2"
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                color: isDarkMode ? '#F5EFE7' : '#6A5E55'
              }}
            >
              Subscription Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Netflix"
              className="w-full px-4 py-3 rounded-2xl"
              style={{
                background: isDarkMode ? '#8A786F' : '#F3ECE4',
                boxShadow: isDarkMode ? 'inset 4px 4px 8px #6A5850, inset -4px -4px 8px #A0928E' : 'inset 4px 4px 8px #D6CEC5, inset -4px -4px 8px #FAF7F3',
                border: 'none',
                outline: 'none',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                color: isDarkMode ? '#F5EFE7' : '#6A5E55'
              }}
            />
          </div>

          {/* Amount */}
          <div>
            <label 
              className="block mb-2"
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                color: isDarkMode ? '#F5EFE7' : '#6A5E55'
              }}
            >
              Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 rounded-2xl"
              style={{
                background: isDarkMode ? '#8A786F' : '#F3ECE4',
                boxShadow: isDarkMode ? 'inset 4px 4px 8px #6A5850, inset -4px -4px 8px #A0928E' : 'inset 4px 4px 8px #D6CEC5, inset -4px -4px 8px #FAF7F3',
                border: 'none',
                outline: 'none',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                color: isDarkMode ? '#F5EFE7' : '#6A5E55'
              }}
            />
          </div>

          {/* Category */}
          <div>
            <label 
              className="block mb-2"
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                color: isDarkMode ? '#F5EFE7' : '#6A5E55'
              }}
            >
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl"
              style={{
                background: isDarkMode ? '#8A786F' : '#F3ECE4',
                boxShadow: isDarkMode ? 'inset 4px 4px 8px #6A5850, inset -4px -4px 8px #A0928E' : 'inset 4px 4px 8px #D6CEC5, inset -4px -4px 8px #FAF7F3',
                border: 'none',
                outline: 'none',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                color: isDarkMode ? '#F5EFE7' : '#6A5E55',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${isDarkMode ? '%23F5EFE7' : '%236A5E55'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '20px',
                paddingRight: '40px'
              }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} style={{ 
                  background: isDarkMode ? '#8A786F' : '#F3ECE4',
                  color: isDarkMode ? '#F5EFE7' : '#6A5E55'
                }}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Billing Cycle */}
          <div>
            <label 
              className="block mb-2"
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                color: isDarkMode ? '#F5EFE7' : '#6A5E55'
              }}
            >
              Billing Cycle
            </label>
            <select
              value={billingCycle}
              onChange={(e) => setBillingCycle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl"
              style={{
                background: isDarkMode ? '#8A786F' : '#F3ECE4',
                boxShadow: isDarkMode ? 'inset 4px 4px 8px #6A5850, inset -4px -4px 8px #A0928E' : 'inset 4px 4px 8px #D6CEC5, inset -4px -4px 8px #FAF7F3',
                border: 'none',
                outline: 'none',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                color: isDarkMode ? '#F5EFE7' : '#6A5E55',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${isDarkMode ? '%23F5EFE7' : '%236A5E55'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '20px',
                paddingRight: '40px'
              }}
            >
              <option value="Monthly" style={{ 
                background: isDarkMode ? '#8A786F' : '#F3ECE4',
                color: isDarkMode ? '#F5EFE7' : '#6A5E55'
              }}>Monthly</option>
              <option value="Yearly" style={{ 
                background: isDarkMode ? '#8A786F' : '#F3ECE4',
                color: isDarkMode ? '#F5EFE7' : '#6A5E55'
              }}>Yearly</option>
              <option value="Weekly" style={{ 
                background: isDarkMode ? '#8A786F' : '#F3ECE4',
                color: isDarkMode ? '#F5EFE7' : '#6A5E55'
              }}>Weekly</option>
            </select>
          </div>

          {/* Next Billing Date */}
          <div>
            <label 
              className="block mb-2"
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                color: isDarkMode ? '#F5EFE7' : '#6A5E55'
              }}
            >
              Next Billing Date
            </label>
            <input
              type="date"
              value={nextBillingDate}
              onChange={(e) => setNextBillingDate(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl"
              style={{
                background: isDarkMode ? '#8A786F' : '#F3ECE4',
                boxShadow: isDarkMode ? 'inset 4px 4px 8px #6A5850, inset -4px -4px 8px #A0928E' : 'inset 4px 4px 8px #D6CEC5, inset -4px -4px 8px #FAF7F3',
                border: 'none',
                outline: 'none',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                color: isDarkMode ? '#F5EFE7' : '#6A5E55'
              }}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-2xl"
              style={{
                background: isDarkMode ? '#998A82' : '#F3ECE4',
                boxShadow: isDarkMode ? '5px 5px 10px #7A6C65, -5px -5px 10px #B8A89F' : '5px 5px 10px #D6CEC5, -5px -5px 10px #FAF7F3',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                color: isDarkMode ? '#F5EFE7' : '#6A5E55'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-2xl"
              style={{
                background: isDarkMode ? '#BBA490' : '#D8C0A8',
                boxShadow: isDarkMode ? '5px 5px 10px #9A8673, -5px -5px 10px #DCC2AD' : '5px 5px 10px #CBB299, -5px -5px 10px #E5CDB7',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                color: isDarkMode ? '#F5EFE7' : '#6A5E55'
              }}
            >
              Add Subscription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}