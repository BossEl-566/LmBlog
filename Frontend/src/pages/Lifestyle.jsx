import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Coffee, 
  Home, 
  Utensils,
  Shirt,
  Flower,
  Music,
  Book,
  Camera,
  Palette,
  Compass,
  Star,
  Share2,
  Bookmark,
  Clock,
  Eye,
  MessageCircle,
  Users,
  Calendar,
  MapPin,
  TrendingUp,
  Sparkles,
  Crown,
  ChevronLeft,
  ChevronRight,
  Play,
  ExternalLink
} from 'lucide-react';

// Custom Components with unique styles
const Card = ({ children, className = '', hover = false, variant = 'default' }) => {
  const variants = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    gradient: 'bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20',
    elevated: 'bg-white dark:bg-gray-800 shadow-lg border-0'
  };
  
  return (
    <div className={`rounded-2xl ${variants[variant]} ${hover ? 'hover:shadow-xl transition-all duration-500' : ''} ${className}`}>
      {children}
    </div>
  );
};

const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', icon: Icon, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white',
    ghost: 'hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-700 dark:text-gray-300'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-6 py-3 text-sm gap-2',
    lg: 'px-8 py-4 text-base gap-3'
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : 20} />}
      {children}
    </button>
  );
};

const Badge = ({ children, color = 'rose', className = '' }) => {
  const colors = {
    rose: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300',
    emerald: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    violet: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300',
    sky: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300'
  };
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

// Main Lifestyle Page Component
const LifestylePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [featuredContent, setFeaturedContent] = useState([]);
  const [dailyReads, setDailyReads] = useState([]);
  const [inspirations, setInspirations] = useState([]);
  const [wellnessTips, setWellnessTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
  const [likedItems, setLikedItems] = useState(new Set());
  const [currentStory, setCurrentStory] = useState(0);

  const categories = [
    { id: 'all', name: 'All Lifestyle', icon: Heart, color: 'rose', count: 128 },
    { id: 'home', name: 'Home & Decor', icon: Home, color: 'emerald', count: 32 },
    { id: 'food', name: 'Food & Recipes', icon: Utensils, color: 'amber', count: 28 },
    { id: 'fashion', name: 'Fashion', icon: Shirt, color: 'violet', count: 24 },
    { id: 'wellness', name: 'Wellness', icon: Flower, color: 'sky', count: 19 },
    { id: 'travel', name: 'Travel', icon: Compass, color: 'rose', count: 25 }
  ];

  // Mock lifestyle data with unique content
  const mockData = {
    featuredStories: [
      {
        id: 1,
        title: 'The Art of Slow Living',
        description: 'Discover how embracing mindfulness and intentional living can transform your daily routine',
        image: 'https://images.unsplash.com/photo-1491147334573-44cbb4602074?w=800&h=500&fit=crop',
        category: 'wellness',
        author: 'Sophia Chen',
        readTime: 8,
        views: 125000,
        likes: 8900,
        gradient: 'from-rose-400 to-orange-400'
      },
      {
        id: 2,
        title: 'Minimalist Home Transformation',
        description: 'How one family transformed their cluttered space into a serene minimalist sanctuary',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=500&fit=crop',
        category: 'home',
        author: 'Marcus Johnson',
        readTime: 6,
        views: 98000,
        likes: 7600,
        gradient: 'from-emerald-400 to-cyan-400'
      }
    ],
    dailyReads: [
      {
        id: 1,
        title: 'Morning Rituals for a Productive Day',
        excerpt: 'Start your day with intention using these 5 simple morning habits',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
        category: 'wellness',
        timeAgo: '2 hours ago',
        readTime: 4,
        layout: 'vertical'
      },
      {
        id: 2,
        title: 'Seasonal Farmers Market Guide',
        excerpt: 'What to buy this month for the freshest, most flavorful meals',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
        category: 'food',
        timeAgo: '5 hours ago',
        readTime: 5,
        layout: 'horizontal'
      },
      {
        id: 3,
        title: 'Sustainable Fashion Choices',
        excerpt: 'Building a conscious wardrobe that reflects your values',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
        category: 'fashion',
        timeAgo: '1 day ago',
        readTime: 7,
        layout: 'vertical'
      }
    ],
    inspirations: [
      {
        id: 1,
        title: 'Balcony Garden Oasis',
        description: 'Transform your small space into a green sanctuary',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=400&fit=crop',
        category: 'home',
        author: 'Lily Zhang',
        saves: 1240
      },
      {
        id: 2,
        title: 'Mediterranean Diet Week',
        description: 'A complete meal plan for vibrant health',
        image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=300&h=400&fit=crop',
        category: 'food',
        author: 'Chef Marco',
        saves: 890
      },
      {
        id: 3,
        title: 'Capsule Wardrobe Essentials',
        description: '20 pieces, endless possibilities',
        image: 'https://images.unsplash.com/photo-1485231183945-fffde7cb34f0?w=300&h=400&fit=crop',
        category: 'fashion',
        author: 'Elena Style',
        saves: 1560
      }
    ],
    wellnessTips: [
      {
        id: 1,
        tip: 'Digital Detox Sunday',
        description: 'Unplug for 24 hours to recharge mentally',
        icon: '📱',
        duration: '24h',
        difficulty: 'Medium'
      },
      {
        id: 2,
        tip: 'Mindful Morning Pages',
        description: 'Three pages of longhand writing to clear your mind',
        icon: '📝',
        duration: '20min',
        difficulty: 'Easy'
      },
      {
        id: 3,
        tip: 'Forest Bathing Walk',
        description: 'Immerse yourself in nature for mental clarity',
        icon: '🌳',
        duration: '1h',
        difficulty: 'Easy'
      }
    ],
    trending: [
      {
        id: 1,
        title: 'Japandi Style: The Perfect Fusion',
        metric: '+245% interest',
        trend: 'up'
      },
      {
        id: 2,
        title: 'Fermented Foods Revolution',
        metric: '+189% searches',
        trend: 'up'
      },
      {
        id: 3,
        title: 'Slow Fashion Movement',
        metric: '+156% engagement',
        trend: 'up'
      }
    ]
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      setFeaturedContent(mockData.featuredStories);
      setDailyReads(mockData.dailyReads);
      setInspirations(mockData.inspirations);
      setWellnessTips(mockData.wellnessTips);
      setLoading(false);
    };

    fetchData();
  }, []);

  const toggleBookmark = (itemId) => {
    const newBookmarks = new Set(bookmarkedItems);
    if (newBookmarks.has(itemId)) {
      newBookmarks.delete(itemId);
    } else {
      newBookmarks.add(itemId);
    }
    setBookmarkedItems(newBookmarks);
  };

  const toggleLike = (itemId) => {
    const newLikes = new Set(likedItems);
    if (newLikes.has(itemId)) {
      newLikes.delete(itemId);
    } else {
      newLikes.add(itemId);
    }
    setLikedItems(newLikes);
  };

  const nextStory = () => {
    setCurrentStory((prev) => (prev === mockData.featuredStories.length - 1 ? 0 : prev + 1));
  };

  const prevStory = () => {
    setCurrentStory((prev) => (prev === 0 ? mockData.featuredStories.length - 1 : prev - 1));
  };

  // Unique layout components
  const DailyReadCard = ({ read, layout = 'vertical' }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`group cursor-pointer ${
        layout === 'horizontal' ? 'col-span-2' : ''
      }`}
    >
      <Card hover variant="elevated" className="h-full overflow-hidden">
        <div className={`flex ${
          layout === 'horizontal' ? 'flex-row' : 'flex-col'
        } h-full`}>
          <div className={`relative overflow-hidden ${
            layout === 'horizontal' ? 'w-1/3' : 'w-full h-48'
          }`}>
            <img 
              src={read.image} 
              alt={read.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute top-3 left-3">
              <Badge color={categories.find(cat => cat.id === read.category)?.color}>
                {categories.find(cat => cat.id === read.category)?.name}
              </Badge>
            </div>
          </div>
          
          <div className={`p-6 flex flex-col justify-between ${
            layout === 'horizontal' ? 'w-2/3' : 'flex-1'
          }`}>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-rose-600 transition-colors">
                {read.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                {read.excerpt}
              </p>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{read.readTime} min</span>
                </div>
                <span>{read.timeAgo}</span>
              </div>
              <Button variant="ghost" size="sm">
                Read
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const InspirationCard = ({ inspiration }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="group cursor-pointer"
    >
      <Card hover className="overflow-hidden">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img 
            src={inspiration.image} 
            alt={inspiration.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <Badge color="rose" className="mb-2">
              {categories.find(cat => cat.id === inspiration.category)?.name}
            </Badge>
            <h3 className="font-bold text-lg mb-2">{inspiration.title}</h3>
            <p className="text-sm text-gray-200 mb-3">{inspiration.description}</p>
            <div className="flex items-center justify-between text-xs">
              <span>by {inspiration.author}</span>
              <div className="flex items-center gap-1">
                <Bookmark size={12} />
                <span>{inspiration.saves}</span>
              </div>
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
      <Card variant="gradient" hover className="p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">{tip.icon}</div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
              {tip.tip}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              {tip.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>⏱️ {tip.duration}</span>
              <span>⚡ {tip.difficulty}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const FeaturedStoryCarousel = () => (
    <div className="relative h-[600px] rounded-3xl overflow-hidden mb-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img 
            src={mockData.featuredStories[currentStory]?.image} 
            alt={mockData.featuredStories[currentStory]?.title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent`} />
          
          <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
            <div className="max-w-4xl">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge color="rose" className="mb-6">
                  <Crown size={14} className="mr-1" />
                  FEATURED STORY
                </Badge>
              </motion.div>
              
              <motion.h2 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
              >
                {mockData.featuredStories[currentStory]?.title}
              </motion.h2>
              
              <motion.p 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed"
              >
                {mockData.featuredStories[currentStory]?.description}
              </motion.p>
              
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-8 mb-8"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {mockData.featuredStories[currentStory]?.author?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{mockData.featuredStories[currentStory]?.author}</div>
                    <div className="text-sm text-gray-300">{mockData.featuredStories[currentStory]?.readTime} min read</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Eye size={18} />
                    <span>{(mockData.featuredStories[currentStory]?.views / 1000).toFixed(1)}k views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart size={18} />
                    <span>{(mockData.featuredStories[currentStory]?.likes / 1000).toFixed(1)}k likes</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-4"
              >
                <Button size="lg">
                  <Play size={20} className="mr-2" />
                  Read Story
                </Button>
                <Button variant="outline" className="text-white border-white hover:bg-white/20">
                  <Share2 size={18} className="mr-2" />
                  Share Inspiration
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <button 
        onClick={prevStory}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
      >
        <ChevronLeft size={28} />
      </button>
      <button 
        onClick={nextStory}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
      >
        <ChevronRight size={28} />
      </button>

      {/* Story Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
        {mockData.featuredStories.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStory(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentStory ? 'bg-white scale-125' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-rose-900/20 dark:to-orange-900/20 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
            className="w-20 h-20 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Heart size={40} className="text-white" />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Curating beautiful lifestyle content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-rose-900/20 dark:to-orange-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section with Unique Layout */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="relative inline-block mb-6">
            <Badge color="rose" className="mb-4">
              <Sparkles size={16} className="mr-2" />
              LIVE BEAUTIFULLY
            </Badge>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-rose-400 rounded-full animate-ping" />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            Lifestyle
            <span className="block bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
              Chronicles
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Discover inspiration for mindful living, beautiful spaces, and everyday joy
          </p>
        </motion.div>

        {/* Featured Story Carousel */}
        <section className="mb-16">
          <FeaturedStoryCarousel />
        </section>

        {/* Categories with Unique Layout */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Explore Categories</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex flex-col items-center gap-4 p-6 rounded-2xl transition-all duration-500 ${
                    activeCategory === category.id
                      ? `bg-gradient-to-r from-${category.color}-500 to-${category.color}-600 text-white shadow-2xl transform scale-105`
                      : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:shadow-xl backdrop-blur-sm border border-white/20'
                  }`}
                >
                  <Icon size={28} />
                  <span className="font-semibold text-sm text-center">{category.name}</span>
                  <Badge 
                    color={activeCategory === category.id ? "rose" : "gray"}
                    className={activeCategory === category.id ? "bg-white/20 text-white border-0" : ""}
                  >
                    {category.count}
                  </Badge>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Daily Reads with Mixed Layout */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Today's Reads</h2>
            <Button variant="outline">
              View All
              <ExternalLink size={16} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dailyReads.map((read, index) => (
              <DailyReadCard key={read.id} read={read} layout={read.layout} />
            ))}
          </div>
        </section>

        {/* Unique Split Layout Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Wellness Tips - 1/3 width */}
          <div className="lg:col-span-1">
            <Card variant="elevated" className="p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <Flower size={24} className="text-emerald-600" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Wellness Corner</h3>
              </div>
              <div className="space-y-6">
                {wellnessTips.map((tip) => (
                  <WellnessTipCard key={tip.id} tip={tip} />
                ))}
              </div>
            </Card>
          </div>

          {/* Inspiration Grid - 2/3 width */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Get Inspired</h3>
              <Button variant="outline">
                More Ideas
                <Compass size={16} />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inspirations.map((inspiration, index) => (
                <InspirationCard key={inspiration.id} inspiration={inspiration} />
              ))}
            </div>
          </div>
        </div>

        {/* Trending Section with Unique Layout */}
        <section className="mb-16">
          <Card variant="gradient" className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp size={24} className="text-rose-600" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">What's Trending</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockData.trending.map((trend, index) => (
                <motion.div
                  key={trend.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                >
                  <div className="text-2xl">📈</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{trend.title}</h4>
                    <p className="text-sm text-emerald-600 font-medium">{trend.metric}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </section>

        {/* Quote Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <Card variant="elevated" className="p-12">
            <div className="text-6xl mb-6">🌿</div>
            <blockquote className="text-2xl md:text-3xl font-light text-gray-700 dark:text-gray-300 italic mb-6 leading-relaxed">
              "The art of living lies in finding beauty in the ordinary and joy in the everyday."
            </blockquote>
            <div className="text-gray-500 dark:text-gray-400">— Lifestyle Chronicles</div>
          </Card>
        </motion.section>
      </div>
    </div>
  );
};

export default LifestylePage;