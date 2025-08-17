import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

export default function TransactionChart({ transactions }) {
  const chartData = useMemo(() => {
    if (!transactions.length) return [];

    // Get last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
      days.push(dayjs().subtract(i, 'day'));
    }

    return days.map(day => {
      const dayStart = day.startOf('day');
      const dayEnd = day.endOf('day');
      
      const dayTransactions = transactions.filter(tx => {
        const txDate = dayjs(tx.date);
        return txDate.isAfter(dayStart) && txDate.isBefore(dayEnd);
      });

      const income = dayTransactions
        .filter(tx => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amountMinor, 0) / 100;

      const expenses = dayTransactions
        .filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => sum + tx.amountMinor, 0) / 100;

      return {
        date: day.format('MMM DD'),
        income,
        expenses,
        net: income - expenses,
      };
    });
  }, [transactions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Weekly Trend
          </h3>
          <p className="text-sm text-muted">Income vs Expenses (Last 7 days)</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255,255,255,0.1)" 
            />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--text-muted))', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--text-muted))', fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="hsl(var(--accent-teal))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--accent-teal))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'hsl(var(--accent-teal))', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="hsl(var(--accent-pink))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--accent-pink))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'hsl(var(--accent-pink))', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-sm text-muted">Income</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--accent-pink))' }}></div>
          <span className="text-sm text-muted">Expenses</span>
        </div>
      </div>
    </motion.div>
  );
}