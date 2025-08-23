import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  PieChart, 
  Target, 
  Shield, 
  Smartphone, 
  Zap,
  ArrowRight,
  Star,
  DollarSign,
  BarChart3,
  Wallet
} from 'lucide-react';
import { Scene3D } from '../components/3d/Scene3D';
import { Button } from '../components/ui/button';

const features = [
  {
    icon: DollarSign,
    title: "Smart Expense Tracking",
    description: "Automatically categorize and track your expenses with AI-powered insights."
  },
  {
    icon: BarChart3,
    title: "Visual Analytics",
    description: "Beautiful charts and graphs to understand your spending patterns."
  },
  {
    icon: Target,
    title: "Budget Goals",
    description: "Set and achieve your financial goals with intelligent recommendations."
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your financial data is encrypted and stored securely."
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Access your finances anywhere with our responsive design."
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Get instant notifications and updates on your spending."
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    content: "This app transformed how I manage my business expenses. The insights are incredible!",
    rating: 5
  },
  {
    name: "Mike Chen",
    role: "Freelancer",
    content: "Finally, an expense tracker that's both powerful and beautiful. Love the 3D visualizations!",
    rating: 5
  },
  {
    name: "Emily Davis",
    role: "Student",
    content: "Perfect for managing my student budget. The categories and analytics help me save money.",
    rating: 5
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4">
        <Scene3D />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-3xl mb-8 shadow-2xl">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
            Master Your
            <span className="block gradient-text">Financial Future</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience the most beautiful and intuitive expense tracker with 3D visualizations, 
            AI-powered insights, and smart budgeting tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 text-white text-lg px-8 py-6 h-auto">
              <Link to="/auth/register">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 h-auto">
              <Link to="/auth/login">
                Sign In
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-muted">
            <span>✨ No credit card required</span>
            <span>•</span>
            <span>🔒 Bank-level security</span>
            <span>•</span>
            <span>📱 Mobile ready</span>
          </div>
        </motion.div>
        
        {/* Floating Cards Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex items-center space-x-2 glass-card px-6 py-3 rounded-full">
            <Wallet className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Interactive 3D Experience</span>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-background/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Everything You Need to
              <span className="block gradient-text">Manage Your Money</span>
            </h2>
            <p className="text-xl text-muted max-w-2xl mx-auto">
              Powerful features designed to give you complete control over your finances
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-8 rounded-2xl hover:scale-105 transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-primary rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Loved by
              <span className="gradient-text"> Thousands</span>
            </h2>
            <p className="text-xl text-muted max-w-2xl mx-auto">
              See what our users are saying about their financial transformation
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="glass-card p-8 rounded-2xl"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-orange-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Ready to Take Control of
              <span className="block gradient-text">Your Finances?</span>
            </h2>
            <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
              Join thousands of users who have transformed their financial lives with our innovative expense tracker.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 text-white text-lg px-12 py-6 h-auto">
                <Link to="/auth/register">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="text-lg px-12 py-6 h-auto">
                <Link to="/auth/login">
                  I Have an Account
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-heading font-bold">ExpenseTracker</span>
            </div>
            <p className="text-muted text-center">
              © 2024 ExpenseTracker. Built with ❤️ for your financial success.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}