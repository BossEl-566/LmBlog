import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  Building, 
  Users,
  Target,
  BarChart3,
  Lightbulb,
  Clock,
  Eye,
  MessageCircle,
  Share2,
  Bookmark,
  Star,
  Sparkles,
  Crown,
  ChevronLeft,
  ChevronRight,
  Play,
  ExternalLink,
  Calendar,
  Zap,
  Award,
  Briefcase,
  PieChart
} from 'lucide-react';

// Custom Components for Business Style
const Card = ({ children, className = '', hover = false, variant = 'default' }) => {
  const variants = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
    elevated: 'bg-white dark:bg-gray-800 shadow-lg border-0',
    glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20'
  };
  
  return (
    <div className={`rounded-xl ${variants[variant]} ${hover ? 'hover:shadow-xl transition-all duration-300' : ''} ${className}`}>
      {children}
    </div>
  );
};

const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', icon: Icon, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white',
    ghost: 'hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-700 dark:text-gray-300'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2'
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 16} />}
      {children}
    </button>
  );
};

const Badge = ({ children, color = 'blue', className = '' }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    emerald: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    violet: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

// Main Business Blog Page Component
const BusinessPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [businessNews, setBusinessNews] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
  const [currentFeatured, setCurrentFeatured] = useState(0);

  const categories = [
    { id: 'all', name: 'All Business', icon: Building, color: 'blue', count: 184 },
    { id: 'startup', name: 'Startups', icon: Zap, color: 'indigo', count: 42 },
    { id: 'leadership', name: 'Leadership', icon: Users, color: 'emerald', count: 38 },
    { id: 'strategy', name: 'Strategy', icon: Target, color: 'amber', count: 35 },
    { id: 'finance', name: 'Finance', icon: DollarSign, color: 'violet', count: 29 },
    { id: 'marketing', name: 'Marketing', icon: TrendingUp, color: 'blue', count: 40 }
  ];

  // Mock business blog data
  const mockData = {
    featuredPosts: [
      {
        id: 1,
        title: 'The Future of Remote Work: Building Sustainable Distributed Teams',
        excerpt: 'How successful companies are redefining workplace culture and productivity in the post-pandemic era.',
        content: 'The shift to remote work is no longer temporary—it\'s becoming a permanent fixture in the business landscape. Companies that master distributed team management are seeing unprecedented gains in productivity, employee satisfaction, and talent acquisition...',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
        category: 'leadership',
        author: 'Michael Chen',
        authorTitle: 'HR Innovation Director',
        authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        readTime: 8,
        views: 89200,
        likes: 4200,
        comments: 89,
        publishedAt: '2024-03-15T09:00:00Z',
        trending: true
      },
      {
        id: 2,
        title: 'AI in Business: From Automation to Strategic Advantage',
        excerpt: 'How forward-thinking companies are leveraging artificial intelligence beyond cost savings.',
        content: 'Artificial intelligence is no longer just about automating repetitive tasks. The most innovative businesses are using AI to drive strategic decision-making, enhance customer experiences, and create entirely new revenue streams...',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
        category: 'strategy',
        author: 'Dr. Sarah Rodriguez',
        authorTitle: 'AI Strategy Consultant',
        authorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
        readTime: 6,
        views: 75600,
        likes: 3800,
        comments: 67,
        publishedAt: '2024-03-14T14:30:00Z',
        trending: true
      }
    ],
    latestArticles: [
      {
        id: 3,
        title: 'Bootstrapping to $10M: Lessons from 5 Successful Founders',
        excerpt: 'Real stories and actionable advice from entrepreneurs who built without venture capital.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
        category: 'startup',
        author: 'Jessica Williams',
        authorTitle: 'Startup Advisor',
        readTime: 7,
        views: 45200,
        likes: 2100,
        comments: 45,
        publishedAt: '2024-03-13T11:15:00Z'
      },
      {
        id: 4,
        title: 'The Psychology of Pricing: Strategies That Actually Work',
        excerpt: 'How to price your products for maximum profitability and customer satisfaction.',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
        category: 'marketing',
        author: 'David Park',
        authorTitle: 'Pricing Expert',
        readTime: 5,
        views: 38900,
        likes: 1800,
        comments: 32,
        publishedAt: '2024-03-12T16:45:00Z'
      },
      {
        id: 5,
        title: 'Building a Company Culture That Attracts Top Talent',
        excerpt: 'Why culture is your most powerful recruitment and retention tool.',
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=250&fit=crop',
        category: 'leadership',
        author: 'Maria Gonzalez',
        authorTitle: 'Culture Consultant',
        readTime: 6,
        views: 52300,
        likes: 2900,
        comments: 78,
        publishedAt: '2024-03-11T10:20:00Z'
      }
    ],
    businessNews: [
      {
        id: 1,
        title: 'Federal Reserve Holds Interest Rates Steady Amid Economic Uncertainty',
        excerpt: 'Central bank maintains current rates while signaling potential cuts later this year',
        category: 'finance',
        timeAgo: '2 hours ago',
        source: 'Financial Times',
        impact: 'high'
      },
      {
        id: 2,
        title: 'Tech Giants Announce Major AI Partnership Initiatives',
        excerpt: 'Collaboration between industry leaders aims to accelerate responsible AI development',
        category: 'strategy',
        timeAgo: '5 hours ago',
        source: 'TechCrunch',
        impact: 'medium'
      }
    ],
    caseStudies: [
      {
        id: 1,
        company: 'SaaS Startup',
        title: 'From 0 to $5M ARR in 18 Months',
        metric: '500% Growth',
        industry: 'Technology',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop'
      },
      {
        id: 2,
        company: 'E-commerce Brand',
        title: 'Optimizing Customer Lifetime Value',
        metric: '3x ROI',
        industry: 'Retail',
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop'
      }
    ],
    marketInsights: [
      {
        id: 1,
        metric: 'VC Funding',
        value: '$38.2B',
        change: '+12%',
        trend: 'up',
        period: 'Q1 2024'
      },
      {
        id: 2,
        metric: 'Startup Valuations',
        value: '4.8x',
        change: '-5%',
        trend: 'down',
        period: 'Last Quarter'
      },
      {
        id: 3,
        metric: 'Remote Jobs',
        value: '42%',
        change: '+18%',
        trend: 'up',
        period: 'YoY Growth'
      }
    ]
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setFeaturedPosts(mockData.featuredPosts);
      setLatestArticles(mockData.latestArticles);
      setBusinessNews(mockData.businessNews);
      setCaseStudies(mockData.caseStudies);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredArticles = useMemo(() => {
    const allArticles = [...mockData.featuredPosts, ...mockData.latestArticles];
    if (activeCategory === 'all') return allArticles;
    return allArticles.filter(article => article.category === activeCategory);
  }, [activeCategory]);

  const toggleBookmark = (postId) => {
    const newBookmarks = new Set(bookmarkedPosts);
    if (newBookmarks.has(postId)) {
      newBookmarks.delete(postId);
    } else {
      newBookmarks.add(postId);
    }
    setBookmarkedPosts(newBookmarks);
  };

  const nextFeatured = () => {
    setCurrentFeatured((prev) => (prev === mockData.featuredPosts.length - 1 ? 0 : prev + 1));
  };

  const prevFeatured = () => {
    setCurrentFeatured((prev) => (prev === 0 ? mockData.featuredPosts.length - 1 : prev - 1));
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  // Business-specific components
  const BlogPostCard = ({ post, featured = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group cursor-pointer ${featured ? 'col-span-2' : ''}`}
    >
      <Card hover className="h-full overflow-hidden">
        <div className={`flex ${featured ? 'flex-col lg:flex-row' : 'flex-col'} h-full`}>
          <div className={`relative overflow-hidden ${featured ? 'lg:w-1/2' : 'w-full'}`}>
            <img 
              src={post.image} 
              alt={post.title}
              className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                featured ? 'h-64 lg:h-full' : 'h-48'
              }`}
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge color={categories.find(cat => cat.id === post.category)?.color}>
                {categories.find(cat => cat.id === post.category)?.name}
              </Badge>
              {post.trending && <Badge color="amber">Trending</Badge>}
            </div>
            <div className="absolute top-3 right-3">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(post.id);
                }}
                className="w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <Bookmark 
                  size={16} 
                  className={bookmarkedPosts.has(post.id) ? 'fill-blue-500 text-blue-500' : ''} 
                />
              </button>
            </div>
          </div>
          
          <div className={`p-6 flex flex-col ${featured ? 'lg:w-1/2' : ''}`}>
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={post.authorImage} 
                alt={post.author}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {post.author}
                </div>
                <div className="text-xs text-gray-500">{post.authorTitle}</div>
              </div>
            </div>

            <h3 className={`font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-3 ${
              featured ? 'text-2xl line-clamp-2' : 'text-xl line-clamp-2'
            }`}>
              {post.title}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-1">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{formatTimeAgo(post.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{post.readTime} min read</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Eye size={14} />
                  <span>{(post.views / 1000).toFixed(1)}k</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle size={14} />
                  <span>{post.comments}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const CaseStudyCard = ({ study }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group cursor-pointer"
    >
      <Card hover variant="gradient" className="overflow-hidden">
        <div className="relative h-32 overflow-hidden">
          <img 
            src={study.image} 
            alt={study.company}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 text-white">
            <div className="font-bold text-sm">{study.company}</div>
            <div className="text-xs opacity-90">{study.industry}</div>
          </div>
        </div>
        
        <div className="p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2">
            {study.title}
          </h4>
          <div className="flex items-center justify-between">
            <Badge color="emerald" className="font-bold">
              {study.metric}
            </Badge>
            <Button variant="ghost" size="sm">
              Read Case
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const MarketInsightCard = ({ insight }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {insight.metric}
        </span>
        <div className={`flex items-center gap-1 text-sm ${
          insight.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
        }`}>
          {insight.trend === 'up' ? '↗' : '↘'}
          <span>{insight.change}</span>
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {insight.value}
      </div>
      <div className="text-xs text-gray-500">{insight.period}</div>
    </motion.div>
  );

  const FeaturedCarousel = () => (
    <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentFeatured}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img 
            src={mockData.featuredPosts[currentFeatured]?.image} 
            alt={mockData.featuredPosts[currentFeatured]?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="max-w-4xl">
              <Badge color="blue" className="mb-4">
                <Crown size={12} className="mr-1" />
                FEATURED INSIGHT
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {mockData.featuredPosts[currentFeatured]?.title}
              </h2>
              <p className="text-lg text-gray-200 mb-6 max-w-2xl">
                {mockData.featuredPosts[currentFeatured]?.excerpt}
              </p>
              
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={mockData.featuredPosts[currentFeatured]?.authorImage} 
                    alt={mockData.featuredPosts[currentFeatured]?.author}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold">{mockData.featuredPosts[currentFeatured]?.author}</div>
                    <div className="text-sm text-gray-300">
                      {mockData.featuredPosts[currentFeatured]?.authorTitle}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{mockData.featuredPosts[currentFeatured]?.readTime} min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye size={16} />
                    <span>{(mockData.featuredPosts[currentFeatured]?.views / 1000).toFixed(1)}k views</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Button size="lg">
                  <Play size={20} className="mr-2" />
                  Read Analysis
                </Button>
                <Button variant="outline" className="text-white border-white hover:bg-white/20">
                  <Share2 size={16} className="mr-2" />
                  Share Insight
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <button 
        onClick={prevFeatured}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button 
        onClick={nextFeatured}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {mockData.featuredPosts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentFeatured(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentFeatured ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              scale: { duration: 2, repeat: Infinity },
              rotate: { duration: 3, repeat: Infinity }
            }}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <TrendingUp size={32} className="text-white" />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-400">Loading business insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Badge color="blue" className="mx-auto">
              <Sparkles size={14} className="mr-1" />
              BUSINESS INTELLIGENCE
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Strategic
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Business Insights
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Data-driven analysis, leadership strategies, and market trends for modern business professionals
            </p>
          </motion.div>
        </div>

        {/* Featured Carousel */}
        <section className="mb-12">
          <FeaturedCarousel />
        </section>

        {/* Market Insights */}
        <section className="mb-8">
          <Card variant="elevated" className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 size={24} className="text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Market Insights</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockData.marketInsights.map((insight) => (
                <MarketInsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </Card>
        </section>

        {/* Categories */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Business Categories</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium text-sm text-center">{category.name}</span>
                  <Badge 
                    color={activeCategory === category.id ? "indigo" : "gray"}
                    className={activeCategory === category.id ? "bg-white/20 text-white border-0" : ""}
                  >
                    {category.count}
                  </Badge>
                </button>
              );
            })}
          </div>
        </section>

        {/* Latest Articles */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Latest Business Analysis
            </h2>
            <Button variant="outline">
              View All
              <ExternalLink size={14} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <BlogPostCard key={article.id} post={article} />
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Articles Grid - 3/4 width */}
          <div className="lg:col-span-3">
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeCategory === 'all' ? 'All Business Content' : categories.find(c => c.id === activeCategory)?.name}
                </h2>
                <span className="text-gray-500">({filteredArticles.length} articles)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map((article) => (
                  <BlogPostCard key={article.id} post={article} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar - 1/4 width */}
          <div className="space-y-8">
            {/* Business News */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={20} className="text-amber-600" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Business News</h3>
                </div>
                <div className="space-y-4">
                  {businessNews.map((news) => (
                    <div key={news.id} className="group cursor-pointer">
                      <div className="flex gap-3">
                        <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                          news.impact === 'high' ? 'bg-red-500' : 'bg-amber-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors text-sm mb-1">
                            {news.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2 mb-1">
                            {news.excerpt}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{news.source}</span>
                            <span>•</span>
                            <span>{news.timeAgo}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Case Studies */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award size={20} className="text-emerald-600" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Case Studies</h3>
                </div>
                <div className="space-y-4">
                  {caseStudies.map((study) => (
                    <CaseStudyCard key={study.id} study={study} />
                  ))}
                </div>
              </div>
            </Card>

            {/* Newsletter */}
            <Card variant="gradient">
              <div className="p-6 text-center">
                <Briefcase size={32} className="text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Business Brief</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Get weekly market analysis and strategic insights delivered to your inbox
                </p>
                <div className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button className="w-full">
                    Subscribe
                  </Button>
                </div>
              </div>
            </Card>

            {/* Executive Tools */}
            <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
              <div className="p-6">
                <h3 className="font-bold text-lg mb-4 text-center">Executive Resources</h3>
                <div className="space-y-3">
                  {['Strategic Planning Template', 'Financial Model Kit', 'Leadership Framework'].map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/10">
                      <span className="font-medium text-sm">{resource}</span>
                      <Button size="sm" variant="outline" className="text-white border-white hover:bg-white/20">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Expert Network Section */}
        <section className="mt-12">
          <Card variant="elevated" className="p-8">
            <div className="text-center mb-8">
              <Badge color="blue" className="mb-4">
                <Users size={14} className="mr-1" />
                EXPERT NETWORK
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Trusted Business Authority
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Our content is developed by industry experts, seasoned entrepreneurs, and thought leaders with proven track records
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Industry Experience', desc: 'Average 15+ years in leadership roles', icon: '🏆' },
                { title: 'Data-Driven', desc: 'Backed by market research and analytics', icon: '📊' },
                { title: 'Actionable Insights', desc: 'Practical strategies you can implement', icon: '⚡' }
              ].map((feature, index) => (
                <div key={index} className="text-center p-4">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default BusinessPage;