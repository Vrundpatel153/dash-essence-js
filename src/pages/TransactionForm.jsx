import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowLeft, DollarSign, Calendar, Tag, CreditCard, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  getTransaction, 
  saveTransaction, 
  getCategories,
  formatCurrency
} from '../utils/transactionUtils';
import { toast } from 'sonner';

const paymentMethods = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'digital_wallet', label: 'Digital Wallet' },
  { value: 'check', label: 'Check' },
  { value: 'other', label: 'Other' },
];

export default function TransactionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [existingTransaction, setExistingTransaction] = useState(null);

  const isEditing = Boolean(id);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: 'expense',
      amountMinor: '',
      categoryId: '',
      note: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'card',
    },
  });

  const watchType = watch('type');

  useEffect(() => {
    const loadData = async () => {
      // Load categories
      const cats = getCategories();
      setCategories(cats);

      // Load existing transaction if editing
      if (isEditing) {
        const transaction = getTransaction(id);
        if (transaction) {
          setExistingTransaction(transaction);
          
          // Populate form
          setValue('type', transaction.type);
          setValue('amountMinor', (transaction.amountMinor / 100).toString());
          setValue('categoryId', transaction.categoryId);
          setValue('note', transaction.note || '');
          setValue('date', transaction.date.split('T')[0]);
          setValue('paymentMethod', transaction.paymentMethod || 'card');
        } else {
          toast.error('Transaction not found');
          navigate('/transactions');
        }
      }
    };

    loadData();
  }, [id, isEditing, setValue, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const transactionData = {
        ...data,
        amountMinor: Math.round(parseFloat(data.amountMinor) * 100),
        date: new Date(data.date).toISOString(),
  currency: 'INR',
      };

      if (isEditing) {
        transactionData.id = id;
      }

      const result = saveTransaction(transactionData, currentUser?.id);

      if (result.success) {
        toast.success(isEditing ? 'Transaction updated!' : 'Transaction created!');
        navigate('/transactions');
      } else {
        toast.error(result.error || 'Failed to save transaction');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Invalid form data');
    }

    setLoading(false);
  };

  const filteredCategories = categories.filter(cat => cat.type === watchType);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-4 mb-6"
      >
        <Link
          to="/transactions"
          className="p-2 hover:bg-card/5 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted" />
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
            {isEditing ? 'Edit Transaction' : 'Add Transaction'}
          </h1>
          <p className="text-muted">
            {isEditing ? 'Update transaction details' : 'Record a new income or expense'}
          </p>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-card p-6"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="relative">
                <input
                  {...register('type', { required: 'Type is required' })}
                  type="radio"
                  value="expense"
                  className="sr-only peer"
                />
                <div className="p-4 border border-border/50 rounded-lg cursor-pointer transition-all peer-checked:border-red-400 peer-checked:bg-red-400/10 hover:border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Expense</p>
                      <p className="text-sm text-muted">Money going out</p>
                    </div>
                  </div>
                </div>
              </label>

              <label className="relative">
                <input
                  {...register('type', { required: 'Type is required' })}
                  type="radio"
                  value="income"
                  className="sr-only peer"
                />
                <div className="p-4 border border-border/50 rounded-lg cursor-pointer transition-all peer-checked:border-green-400 peer-checked:bg-green-400/10 hover:border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Income</p>
                      <p className="text-sm text-muted">Money coming in</p>
                    </div>
                  </div>
                </div>
              </label>
            </div>
            {errors.type && (
              <p className="mt-2 text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="w-5 h-5 text-muted" />
              </div>
              <input
                {...register('amountMinor', {
                  required: 'Amount is required',
                  validate: value => {
                    const num = parseFloat(value);
                    if (isNaN(num) || num <= 0) {
                      return 'Amount must be greater than 0';
                    }
                    return true;
                  },
                })}
                type="number"
                step="0.01"
                placeholder="0.00"
                className="block w-full pl-10 pr-3 py-3 bg-input border border-border/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder-muted transition-all duration-200"
              />
            </div>
            {errors.amountMinor && (
              <p className="mt-2 text-sm text-destructive">{errors.amountMinor.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="w-5 h-5 text-muted" />
              </div>
              <select
                {...register('categoryId', { required: 'Category is required' })}
                className="block w-full pl-10 pr-3 py-3 bg-input border border-border/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-foreground"
              >
                <option value="">Select a category</option>
                {filteredCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.categoryId && (
              <p className="mt-2 text-sm text-destructive">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="w-5 h-5 text-muted" />
              </div>
              <input
                {...register('date', { required: 'Date is required' })}
                type="date"
                className="block w-full pl-10 pr-3 py-3 bg-input border border-border/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-foreground"
              />
            </div>
            {errors.date && (
              <p className="mt-2 text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Payment Method
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard className="w-5 h-5 text-muted" />
              </div>
              <select
                {...register('paymentMethod')}
                className="block w-full pl-10 pr-3 py-3 bg-input border border-border/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-foreground"
              >
                {paymentMethods.map(method => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Note (Optional)
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FileText className="w-5 h-5 text-muted" />
              </div>
              <textarea
                {...register('note')}
                rows={3}
                placeholder="Add a description..."
                className="block w-full pl-10 pr-3 py-3 bg-input border border-border/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder-muted resize-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-border/50">
            <Link
              to="/transactions"
              className="px-6 py-3 border border-border/50 text-foreground hover:bg-card/5 rounded-lg font-medium transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-600 hover:brightness-110 disabled:opacity-50 text-white font-medium rounded-lg transition-all duration-200 shadow shadow-fuchsia-600/30"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-border mr-2"></div>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                isEditing ? 'Update Transaction' : 'Create Transaction'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}