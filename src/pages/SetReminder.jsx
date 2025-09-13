import { useState, useEffect } from 'react';
import { AlarmClock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { STORAGE_KEYS, safeLocalStorageGet, safeLocalStorageSet } from '../seed/seedData';
import { formatCurrency } from '../utils/transactionUtils';

export default function SetReminder() {
  const { currentUser } = useAuth();
  const userId = currentUser?.id;
  const storageKey = `reminders_${userId || 'anon'}`;

  const [threshold, setThreshold] = useState('');
  const [type, setType] = useState('above'); // 'above' or 'below'
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = safeLocalStorageGet(storageKey, null);
    if (existing) {
      setThreshold((existing.thresholdMinor / 100).toString());
      setType(existing.type || 'above');
    }
  }, [storageKey]);

  function handleSave(e) {
    e.preventDefault();
    const amountMinor = Math.round(parseFloat(threshold || '0') * 100);
    const payload = {
      thresholdMinor: amountMinor,
      type,
      updatedAt: new Date().toISOString(),
    };
    safeLocalStorageSet(storageKey, payload);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center mb-4">
        <AlarmClock className="w-6 h-6 text-primary mr-2" />
        <h2 className="text-xl font-semibold">Set Balance Reminder</h2>
      </div>
      <p className="text-sm text-muted mb-4">Create a reminder to notify you when your balance goes above or below a threshold.</p>

      <form onSubmit={handleSave} className="space-y-4 max-w-sm">
        <div>
          <label className="text-sm text-muted block mb-1">Notify when balance</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 rounded-md bg-transparent border border-border/40">
            <option value="above">exceeds</option>
            <option value="below">falls below</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-muted block mb-1">Threshold amount (in ₹)</label>
          <input
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            placeholder="e.g. 5000"
            className="w-full p-2 rounded-md bg-transparent border border-border/40"
          />
          <p className="text-xs text-muted mt-1">You will receive an in-app toast when the balance condition matches.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button type="submit" className="bg-gradient-primary text-white px-4 py-2 rounded-md">Save Reminder</button>
          {saved && <span className="text-sm text-green-400">Saved</span>}
        </div>
      </form>
    </div>
  );
}
