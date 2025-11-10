import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Activity,
  Apple,
  Brain,
  Moon,
  Sun,
  Users,
  Clock,
  Eye,
  MessageCircle,
  Share2,
  Bookmark,
  Star,
  TrendingUp,
  Sparkles,
  Crown,
  ChevronLeft,
  ChevronRight,
  Play,
  ExternalLink,
  Calendar,
  Target,
  Zap,
  Leaf
} from 'lucide-react';

// Custom Components for Blogging Style
const Card = ({ children, className = '', hover = false, variant = 'default' }) => {
  const variants = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    gradient: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
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
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-green-600 hover:bg-green-700 text-white',
    secondary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
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

const Badge = ({ children, color = 'green', className = '' }) => {
  const colors = {
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    emerald: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

// Main Health Blog Page Component
const HealthPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [wellnessTips, setWellnessTips] = useState([]);
  const [healthNews, setHealthNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [currentFeatured, setCurrentFeatured] = useState(0);

  const categories = [
    { id: 'all', name: 'All Health', icon: Heart, color: 'green', count: 156 },
    { id: 'nutrition', name: 'Nutrition', icon: Apple, color: 'emerald', count: 42 },
    { id: 'fitness', name: 'Fitness', icon: Activity, color: 'blue', count: 38 },
    { id: 'mental', name: 'Mental Health', icon: Brain, color: 'purple', count: 35 },
    { id: 'sleep', name: 'Sleep', icon: Moon, color: 'orange', count: 18 },
    { id: 'prevention', name: 'Prevention', icon: Target, color: 'green', count: 23 }
  ];

  // Mock health blog data
  const mockData = {
    featuredPosts: [
      {
        id: 1,
        title: 'The Science of Intermittent Fasting: Benefits Beyond Weight Loss',
        excerpt: 'Discover how timing your meals can improve cellular repair, brain function, and longevity.',
        content: 'Intermittent fasting has gained significant attention for its potential health benefits beyond weight management. Research suggests it may improve insulin sensitivity, reduce inflammation, and promote cellular autophagy...',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop',
        category: 'nutrition',
        author: 'Dr. Sarah Chen',
        authorImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop',
        readTime: 8,
        views: 125000,
        likes: 8900,
        comments: 156,
        publishedAt: '2024-03-15T10:00:00Z',
        trending: true
      },
      {
        id: 2,
        title: 'Mindful Movement: The Connection Between Exercise and Mental Wellbeing',
        excerpt: 'How physical activity can be your most powerful tool for mental health maintenance.',
        content: 'Regular exercise does more than just transform your body—it has profound effects on your mental health. From reducing anxiety to improving cognitive function, movement is medicine for the mind...',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop',
        category: 'mental',
        author: 'James Wilson',
        authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        readTime: 6,
        views: 98000,
        likes: 7600,
        comments: 89,
        publishedAt: '2024-03-14T14:30:00Z',
        trending: true
      }
    ],
    latestArticles: [
      {
        id: 3,
        title: '10 Anti-Inflammatory Foods to Add to Your Diet Today',
        excerpt: 'Simple dietary changes that can reduce chronic inflammation and improve overall health.',
        image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400&h=250&fit=crop',
        category: 'nutrition',
        author: 'Nutritionist Amy',
        readTime: 5,
        views: 45600,
        likes: 2300,
        comments: 45,
        publishedAt: '2024-03-13T09:15:00Z'
      },
      {
        id: 4,
        title: 'The Power of Breath: Simple Techniques for Stress Reduction',
        excerpt: 'Learn breathing exercises that can calm your nervous system in minutes.',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop',
        category: 'mental',
        author: 'Dr. Michael Park',
        readTime: 4,
        views: 38900,
        likes: 1900,
        comments: 32,
        publishedAt: '2024-03-12T16:45:00Z'
      },
      {
        id: 5,
        title: 'Building a Sustainable Morning Exercise Routine',
        excerpt: 'How to create a fitness habit that actually sticks long-term.',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=250&fit=crop',
        category: 'fitness',
        author: 'Coach Maria',
        readTime: 7,
        views: 52300,
        likes: 3100,
        comments: 67,
        publishedAt: '2024-03-11T11:20:00Z'
      }
    ],
    wellnessTips: [
      {
        id: 1,
        title: 'Hydration Tracking',
        description: 'Start your day with a glass of water and track your intake',
        icon: '💧',
        duration: 'Daily',
        category: 'nutrition'
      },
      {
        id: 2,
        title: 'Digital Sunset',
        description: 'Turn off screens 1 hour before bedtime for better sleep',
        icon: '📱',
        duration: 'Nightly',
        category: 'sleep'
      },
      {
        id: 3,
        title: 'Movement Breaks',
        description: '5-minute stretch every hour if you have a desk job',
        icon: '🚶',
        duration: 'Hourly',
        category: 'fitness'
      }
    ],
    healthNews: [
      {
        id: 1,
        title: 'New Study Reveals Benefits of Mediterranean Diet on Brain Health',
        excerpt: 'Research shows significant cognitive benefits for long-term followers',
        category: 'nutrition',
        timeAgo: '2 hours ago',
        source: 'Health Journal'
      },
      {
        id: 2,
        title: 'Breakthrough in Sleep Technology Helps Insomnia Patients',
        excerpt: 'New non-invasive device shows promising results in clinical trials',
        category: 'sleep',
        timeAgo: '5 hours ago',
        source: 'Sleep Research'
      }
    ],
    popularTopics: [
      {
        id: 1,
        name: 'Gut Health',
        posts: 24,
        trend: 'up'
      },
      {
        id: 2,
        name: 'Mindfulness',
        posts: 31,
        trend: 'up'
      },
      {
        id: 3,
        name: 'Home Workouts',
        posts: 28,
        trend: 'up'
      }
    ]
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setFeaturedPosts(mockData.featuredPosts);
      setLatestArticles(mockData.latestArticles);
      setWellnessTips(mockData.wellnessTips);
      setHealthNews(mockData.healthNews);
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

  const toggleLike = (postId) => {
    const newLikes = new Set(likedPosts);
    if (newLikes.has(postId)) {
      newLikes.delete(postId);
    } else {
      newLikes.add(postId);
    }
    setLikedPosts(newLikes);
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

  // Blog-specific components
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
              {post.trending && <Badge color="orange">Trending</Badge>}
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
                  className={bookmarkedPosts.has(post.id) ? 'fill-green-500 text-green-500' : ''} 
                />
              </button>
            </div>
          </div>
          
          <div className={`p-6 flex flex-col ${featured ? 'lg:w-1/2' : ''}`}>
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={post.authorImage} 
                alt={post.author}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white text-sm">
                  {post.author}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar size={12} />
                  <span>{formatTimeAgo(post.publishedAt)}</span>
                  <span>•</span>
                  <Clock size={12} />
                  <span>{post.readTime} min read</span>
                </div>
              </div>
            </div>

            <h3 className={`font-bold text-gray-900 dark:text-white group-hover:text-green-600 transition-colors mb-3 ${
              featured ? 'text-2xl line-clamp-2' : 'text-xl line-clamp-2'
            }`}>
              {post.title}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-1">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(post.id);
                  }}
                  className="flex items-center gap-1 hover:text-red-600 transition-colors"
                >
                  <Heart 
                    size={14} 
                    className={likedPosts.has(post.id) ? 'fill-red-600 text-red-600' : ''} 
                  />
                  <span>{post.likes}</span>
                </button>
                <div className="flex items-center gap-1">
                  <MessageCircle size={14} />
                  <span>{post.comments}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={14} />
                  <span>{(post.views / 1000).toFixed(1)}k</span>
                </div>
              </div>
              
              <Button variant="ghost" size="sm">
                Read More
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const WellnessTipCard = ({ tip }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="group cursor-pointer"
    >
      <Card variant="gradient" hover className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{tip.icon}</div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
              {tip.title}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
              {tip.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Badge color="green" className="text-xs">
                {tip.duration}
              </Badge>
              <span>{categories.find(cat => cat.id === tip.category)?.name}</span>
            </div>
          </div>
        </div>
      </Card>
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
              <Badge color="green" className="mb-4">
                <Crown size={12} className="mr-1" />
                FEATURED POST
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
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-semibold">{mockData.featuredPosts[currentFeatured]?.author}</div>
                    <div className="text-sm text-gray-300">
                      {formatTimeAgo(mockData.featuredPosts[currentFeatured]?.publishedAt)}
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
                  Read Article
                </Button>
                <Button variant="outline" className="text-white border-white hover:bg-white/20">
                  <Share2 size={16} className="mr-2" />
                  Share
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20 flex items-center justify-center">
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
            className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Heart size={32} className="text-white" />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-400">Loading health insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Badge color="green" className="mx-auto">
              <Sparkles size={14} className="mr-1" />
              HEALTH & WELLNESS
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Your Guide to
              <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Better Health
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Evidence-based articles, practical tips, and the latest research to help you live your healthiest life
            </p>
          </motion.div>
        </div>

        {/* Featured Carousel */}
        <section className="mb-12">
          <FeaturedCarousel />
        </section>

        {/* Categories */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Browse Categories</h2>
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
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg transform scale-105'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium text-sm text-center">{category.name}</span>
                  <Badge 
                    color={activeCategory === category.id ? "emerald" : "gray"}
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
              Latest Articles
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
                  {activeCategory === 'all' ? 'All Articles' : categories.find(c => c.id === activeCategory)?.name}
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
            {/* Wellness Tips */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={20} className="text-green-600" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Daily Wellness Tips</h3>
                </div>
                <div className="space-y-4">
                  {wellnessTips.map((tip) => (
                    <WellnessTipCard key={tip.id} tip={tip} />
                  ))}
                </div>
              </div>
            </Card>

            {/* Health News */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={20} className="text-blue-600" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Health News</h3>
                </div>
                <div className="space-y-4">
                  {healthNews.map((news) => (
                    <div key={news.id} className="group cursor-pointer">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-green-600 transition-colors text-sm mb-1">
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

            {/* Popular Topics */}
            <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white">
              <div className="p-6">
                <h3 className="font-bold text-lg mb-4 text-center">Popular Topics</h3>
                <div className="space-y-3">
                  {mockData.popularTopics.map((topic) => (
                    <div key={topic.id} className="flex items-center justify-between p-3 rounded-lg bg-white/10">
                      <span className="font-medium">{topic.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge color="emerald" className="bg-white/20 text-white">
                          {topic.posts} posts
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 text-white border-white hover:bg-white/20">
                  Explore Topics
                </Button>
              </div>
            </Card>

            {/* Newsletter Signup */}
            <Card variant="gradient">
              <div className="p-6 text-center">
                <Leaf size={32} className="text-green-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Health Insights</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Get weekly evidence-based health tips delivered to your inbox
                </p>
                <div className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <Button className="w-full">
                    Subscribe
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Expert Advice Section */}
        <section className="mt-12">
          <Card variant="elevated" className="p-8">
            <div className="text-center mb-8">
              <Badge color="green" className="mb-4">
                <Star size={14} className="mr-1" />
                EXPERT ADVICE
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Trusted Health Guidance
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                All our content is reviewed by healthcare professionals and based on the latest scientific research
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Medical Review', 'Evidence-Based', 'Practical Tips'].map((feature, index) => (
                <div key={index} className="text-center p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check size={24} className="text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature === 'Medical Review' && 'Content reviewed by licensed professionals'}
                    {feature === 'Evidence-Based' && 'Backed by scientific research and studies'}
                    {feature === 'Practical Tips' && 'Actionable advice you can implement today'}
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

// Helper component
const Check = ({ size = 24, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    className={className}
  >
    <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default HealthPage;