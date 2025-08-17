import { useMemo } from 'react';
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

  const maxValue = useMemo(() => {
    if (!chartData.length) return 100;
    return Math.max(...chartData.flatMap(d => [d.income, d.expenses])) * 1.1;
  }, [chartData]);

  const SVGChart = () => {
    if (!chartData.length) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted">No data available</p>
        </div>
      );
    }

    const width = 400;
    const height = 200;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const getX = (index) => padding + (index * chartWidth) / (chartData.length - 1);
    const getY = (value) => height - padding - (value / maxValue) * chartHeight;

    const incomePoints = chartData.map((d, i) => `${getX(i)},${getY(d.income)}`).join(' ');
    const expensePoints = chartData.map((d, i) => `${getX(i)},${getY(d.expenses)}`).join(' ');

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="25" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 25" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2,2"/>
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" />

        {/* Income line */}
        <polyline
          fill="none"
          stroke="hsl(var(--accent-teal))"
          strokeWidth="3"
          points={incomePoints}
        />

        {/* Expense line */}
        <polyline
          fill="none"
          stroke="hsl(var(--accent-pink))"
          strokeWidth="3"
          points={expensePoints}
        />

        {/* Data points */}
        {chartData.map((d, i) => (
          <g key={i}>
            <circle
              cx={getX(i)}
              cy={getY(d.income)}
              r="4"
              fill="hsl(var(--accent-teal))"
              stroke="hsl(var(--navy-surface))"
              strokeWidth="2"
            />
            <circle
              cx={getX(i)}
              cy={getY(d.expenses)}
              r="4"
              fill="hsl(var(--accent-pink))"
              stroke="hsl(var(--navy-surface))"
              strokeWidth="2"
            />
          </g>
        ))}

        {/* X-axis labels */}
        {chartData.map((d, i) => (
          <text
            key={i}
            x={getX(i)}
            y={height - 10}
            textAnchor="middle"
            fill="hsl(var(--text-muted))"
            fontSize="12"
          >
            {d.date}
          </text>
        ))}

        {/* Y-axis labels */}
        {[0, maxValue / 2, maxValue].map((value, i) => (
          <text
            key={i}
            x="10"
            y={getY(value) + 4}
            fill="hsl(var(--text-muted))"
            fontSize="12"
          >
            ${Math.round(value)}
          </text>
        ))}
      </svg>
    );
  };

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
        <SVGChart />
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