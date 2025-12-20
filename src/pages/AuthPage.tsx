import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ClyntoLogo from '@/components/ClyntoLogo';
import { Mail, Lock, User, Building2, Briefcase, Phone, Globe, ArrowRight, Chrome, Sparkles, TrendingUp, Users, Zap, BarChart3, Shield } from 'lucide-react';
import { toast } from 'sonner';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    domain: '',
    company: '',
    designation: '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'email' && value.includes('@')) {
      const domain = value.split('@')[1];
      if (domain) {
        setFormData(prev => ({ ...prev, domain }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(isSignUp ? 'Account created successfully!' : 'Welcome back!');
    navigate('/onboarding');
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`Connecting to ${provider}...`);
    setTimeout(() => {
      navigate('/onboarding');
    }, 1000);
  };

  const features = [
    { icon: TrendingUp, title: 'Predict Churn', desc: 'Identify at-risk accounts before they leave' },
    { icon: Users, title: 'Orchestrate', desc: 'Automate customer journey touchpoints' },
    { icon: Zap, title: 'Execute', desc: 'Take action with intelligent recommendations' },
    { icon: BarChart3, title: 'Analyze', desc: 'Deep insights from all your customer data' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-warning/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-primary-foreground">
          <div className="mb-8 animate-fade-in">
            <ClyntoLogo size="lg" className="mb-6" />
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-accent" />
              <span className="text-accent font-medium text-sm tracking-wide uppercase">AI-Powered Platform</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-4">
              AI-First Customer
              <br />
              <span className="text-accent">Success Platform</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-md leading-relaxed">
              Transform your customer success operations with predictive analytics, 
              intelligent automation, and actionable insights.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-4 mt-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all duration-300"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-primary-foreground/70">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Trust Badge */}
          <div className="flex items-center gap-3 mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Shield className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Enterprise-grade Security</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Users className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">500+ Companies Trust Us</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center bg-background p-6 lg:p-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <ClyntoLogo size="lg" className="justify-center mb-2" />
            <p className="text-muted-foreground text-sm">AI-First Customer Success Platform</p>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-muted-foreground">
              {isSignUp
                ? 'Start your journey with Clynto AI'
                : 'Sign in to continue to your dashboard'}
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              className="w-full justify-center gap-3 h-12 bg-card hover:bg-secondary/80 border-border"
              onClick={() => handleSocialLogin('Google')}
            >
              <Chrome className="h-5 w-5 text-primary" />
              <span className="font-medium">Continue with Google</span>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-center gap-3 h-12 bg-card hover:bg-secondary/80 border-border"
              onClick={() => handleSocialLogin('Microsoft')}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
                <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
                <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
              </svg>
              <span className="font-medium">Continue with Microsoft</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground">or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10 h-12 bg-card border-border"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 h-12 bg-card border-border"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 h-12 bg-card border-border"
                required
              />
            </div>

            {isSignUp && (
              <>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="domain"
                    placeholder="Domain (auto-fetched)"
                    value={formData.domain}
                    onChange={handleInputChange}
                    className="pl-10 h-12 bg-secondary/50 border-border"
                    readOnly
                  />
                </div>

                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="company"
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="pl-10 h-12 bg-card border-border"
                    required
                  />
                </div>

                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="designation"
                    placeholder="Company Designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="pl-10 h-12 bg-card border-border"
                    required
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="phone"
                    placeholder="Phone Number (optional)"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10 h-12 bg-card border-border"
                  />
                </div>
              </>
            )}

            {!isSignUp && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" variant="gradient" size="lg" className="w-full h-12 text-base font-semibold">
              {isSignUp ? 'Create Account' : 'Sign In'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          {/* Toggle */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline font-semibold"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
