import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Zap, 
  Code, 
  Smartphone, 
  Cloud, 
  Database, 
  Shield, 
  Globe,
  TrendingUp,
  Star,
  Heart,
  Share2,
  Play,
  ExternalLink,
  Clock,
  Eye,
  MessageCircle,
  Users,
  Calendar,
  ArrowUp,
  Rocket,
  Sparkles,
  Crown,
  ChevronLeft,
  ChevronRight,
  Bookmark
} from 'lucide-react';

// Custom Components
const Card = ({ children, className = '', hover = false }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${hover ? 'hover:shadow-md transition-shadow duration-300' : ''} ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', icon: Icon, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-purple-600 hover:bg-purple-700 text-white',
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
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

const Progress = ({ progress, color = 'blue', size = 'md' }) => {
  const colors = {
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    red: 'bg-red-600'
  };
  
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  
  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${sizes[size]}`}>
      <div 
        className={`${colors[color]} ${sizes[size]} rounded-full transition-all duration-300`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// Main Technology Page Component
const TechnologyPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [trendingTech, setTrendingTech] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [tools, setTools] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
  const [likedItems, setLikedItems] = useState(new Set());
  const [currentFeatured, setCurrentFeatured] = useState(0);

  const categories = [
    { id: 'all', name: 'All Tech', icon: Cpu, count: 156 },
    { id: 'ai', name: 'AI & ML', icon: Zap, count: 42 },
    { id: 'web', name: 'Web Dev', icon: Code, count: 38 },
    { id: 'mobile', name: 'Mobile', icon: Smartphone, count: 27 },
    { id: 'cloud', name: 'Cloud', icon: Cloud, count: 31 },
    { id: 'security', name: 'Security', icon: Shield, count: 18 }
  ];

  // Mock technology data
  const mockData = {
    featured: [
      {
        id: 1,
        title: 'Revolutionary Quantum Computing Breakthrough',
        description: 'Scientists achieve quantum supremacy with new 512-qubit processor that solves problems in minutes instead of millennia.',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
        category: 'ai',
        author: 'Dr. Sarah Chen',
        readTime: 8,
        views: 125000,
        likes: 8900,
        trending: true
      },
      {
        id: 2,
        title: 'Next-Gen Web Framework Released',
        description: 'New JavaScript framework promises 10x performance improvement and revolutionary developer experience.',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
        category: 'web',
        author: 'Tech Innovations',
        readTime: 6,
        views: 89000,
        likes: 4500,
        trending: true
      }
    ],
    trending: [
      {
        id: 3,
        title: 'AI-Powered Code Generation Reaches New Heights',
        description: 'Latest models can generate production-ready code from natural language descriptions with 95% accuracy.',
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop',
        category: 'ai',
        timeAgo: '2 hours ago',
        views: 78400,
        likes: 3200,
        comments: 156,
        trending: true
      },
      {
        id: 4,
        title: 'Zero-Trust Security Architecture Guide',
        description: 'Complete implementation guide for modern zero-trust security in enterprise environments.',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop',
        category: 'security',
        timeAgo: '5 hours ago',
        views: 45600,
        likes: 2100,
        comments: 89,
        trending: true
      },
      {
        id: 5,
        title: 'Serverless Computing Cost Optimization',
        description: 'Advanced techniques to reduce serverless architecture costs by up to 70%.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
        category: 'cloud',
        timeAgo: '1 day ago',
        views: 67800,
        likes: 2900,
        comments: 134,
        trending: false
      }
    ],
    tools: [
      {
        id: 1,
        name: 'React 18',
        category: 'web',
        description: 'Latest version with concurrent features and automatic batching',
        icon: '⚛️',
        rating: 4.9,
        downloads: '15.2M',
        trending: true,
        price: 'Free'
      },
      {
        id: 2,
        name: 'TensorFlow 2.0',
        category: 'ai',
        description: 'End-to-end machine learning platform',
        icon: '🧠',
        rating: 4.8,
        downloads: '8.7M',
        trending: true,
        price: 'Free'
      },
      {
        id: 3,
        name: 'Kubernetes',
        category: 'cloud',
        description: 'Container orchestration system',
        icon: '⚓',
        rating: 4.7,
        downloads: '6.3M',
        trending: false,
        price: 'Open Source'
      }
    ],
    tutorials: [
      {
        id: 1,
        title: 'Master React Hooks in 2024',
        category: 'web',
        level: 'Intermediate',
        duration: '4 hours',
        students: 15420,
        rating: 4.9,
        instructor: 'Sarah Johnson',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop'
      },
      {
        id: 2,
        title: 'Machine Learning from Scratch',
        category: 'ai',
        level: 'Advanced',
        duration: '12 hours',
        students: 8920,
        rating: 4.8,
        instructor: 'Dr. Michael Chen',
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&fit=crop'
      }
    ],
    news: [
      {
        id: 1,
        title: 'Major Cloud Provider Announces 50% Price Reduction',
        excerpt: 'Industry shakeup as leading cloud provider slashes prices across all services.',
        category: 'cloud',
        timeAgo: '3 hours ago',
        source: 'TechCrunch'
      },
      {
        id: 2,
        title: 'New Programming Language Gains Rapid Adoption',
        excerpt: 'Modern language designed for concurrent systems sees 300% growth in usage.',
        category: 'web',
        timeAgo: '6 hours ago',
        source: 'Developer Weekly'
      }
    ]
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTrendingTech(mockData.trending);
      setLatestNews(mockData.news);
      setTools(mockData.tools);
      setTutorials(mockData.tutorials);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredContent = useMemo(() => {
    const allContent = [...mockData.trending, ...mockData.news.map(n => ({ ...n, id: n.id + 10 }))];
    if (activeCategory === 'all') return allContent;
    return allContent.filter(item => item.category === activeCategory);
  }, [activeCategory]);

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

  const nextFeatured = () => {
    setCurrentFeatured((prev) => (prev === mockData.featured.length - 1 ? 0 : prev + 1));
  };

  const prevFeatured = () => {
    setCurrentFeatured((prev) => (prev === 0 ? mockData.featured.length - 1 : prev - 1));
  };

  const TechCard = ({ item, size = 'default' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group cursor-pointer"
    >
      <Card hover className="h-full overflow-hidden">
        <div className="relative overflow-hidden">
          <img 
            src={item.image} 
            alt={item.title}
            className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              size === 'large' ? 'h-48' : 'h-40'
            }`}
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge color="blue">
              {categories.find(cat => cat.id === item.category)?.name}
            </Badge>
            {item.trending && <Badge color="purple">Trending</Badge>}
          </div>
          <div className="absolute top-3 right-3">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(item.id);
              }}
              className="w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <Bookmark 
                size={16} 
                className={bookmarkedItems.has(item.id) ? 'fill-blue-500 text-blue-500' : ''} 
              />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className={`font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-2 ${
            size === 'large' ? 'text-lg' : 'text-md'
          }`}>
            {item.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
            {item.description || item.excerpt}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              {item.timeAgo && (
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{item.timeAgo}</span>
                </div>
              )}
              {item.readTime && (
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{item.readTime} min read</span>
                </div>
              )}
              {item.source && (
                <div className="flex items-center gap-1">
                  <Globe size={12} />
                  <span>{item.source}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(item.id);
                }}
                className="flex items-center gap-1 hover:text-red-600 transition-colors"
              >
                <Heart 
                  size={12} 
                  className={likedItems.has(item.id) ? 'fill-red-600 text-red-600' : ''} 
                />
                <span>{(item.likes / 1000).toFixed(1)}k</span>
              </button>
              <div className="flex items-center gap-1">
                <Eye size={12} />
                <span>{(item.views / 1000).toFixed(1)}k</span>
              </div>
              {item.comments && (
                <div className="flex items-center gap-1">
                  <MessageCircle size={12} />
                  <span>{item.comments}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const ToolCard = ({ tool }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group cursor-pointer"
    >
      <Card hover className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{tool.icon}</div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{tool.name}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{tool.category.toUpperCase()}</span>
                <span>•</span>
                <span>{tool.price}</span>
              </div>
            </div>
          </div>
          {tool.trending && (
            <Badge color="purple">
              <TrendingUp size={12} />
            </Badge>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {tool.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-yellow-600">
              <Star size={14} className="fill-yellow-500" />
              <span className="text-sm font-medium">{tool.rating}</span>
            </div>
            <div className="text-xs text-gray-500">{tool.downloads}</div>
          </div>
          <Button size="sm" variant="outline">
            Get Started
          </Button>
        </div>
      </Card>
    </motion.div>
  );

  const TutorialCard = ({ tutorial }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:shadow-md transition-all duration-300 cursor-pointer group"
    >
      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
        <img 
          src={tutorial.image} 
          alt={tutorial.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <Badge color="blue">{tutorial.level}</Badge>
          <span className="text-xs text-gray-500">{tutorial.duration}</span>
        </div>
        <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
          {tutorial.title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          by {tutorial.instructor}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>{(tutorial.students / 1000).toFixed(1)}k students</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-600">
            <Star size={12} className="fill-yellow-500" />
            <span>{tutorial.rating}</span>
          </div>
        </div>
      </div>
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
            src={mockData.featured[currentFeatured]?.image} 
            alt={mockData.featured[currentFeatured]?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="max-w-4xl">
              <Badge color="blue" className="mb-4">
                <Crown size={12} className="mr-1" />
                FEATURED
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {mockData.featured[currentFeatured]?.title}
              </h2>
              <p className="text-xl text-gray-200 mb-6 max-w-2xl">
                {mockData.featured[currentFeatured]?.description}
              </p>
              
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <Users size={20} />
                  <span className="text-lg">{mockData.featured[currentFeatured]?.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={20} />
                  <span className="text-lg">{mockData.featured[currentFeatured]?.readTime} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={20} />
                  <span className="text-lg">{(mockData.featured[currentFeatured]?.views / 1000).toFixed(1)}k views</span>
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
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={nextFeatured}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {mockData.featured.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentFeatured(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentFeatured ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity }
            }}
            className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Cpu size={32} className="text-white" />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-400">Loading technology insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
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
              TECH INNOVATION
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
              Technology <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Hub</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Latest tech news, tools, tutorials, and innovations shaping the future
            </p>
          </motion.div>
        </div>

        {/* Featured Carousel */}
        <section className="mb-12">
          <FeaturedCarousel />
        </section>

        {/* Tech Categories */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tech Categories</h2>
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
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Icon size={24} />
                  <span className="font-medium text-sm">{category.name}</span>
                  <Badge 
                    color={activeCategory === category.id ? "purple" : "gray"}
                    className={activeCategory === category.id ? "bg-white/20 text-white border-0" : ""}
                  >
                    {category.count}
                  </Badge>
                </button>
              );
            })}
          </div>
        </section>

        {/* Trending Tech */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              <TrendingUp size={24} className="inline mr-2 text-purple-600" />
              Trending Technology
            </h2>
            <Button variant="outline">
              View All
              <ExternalLink size={14} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingTech.map((item) => (
              <TechCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Content Grid - 3/4 width */}
          <div className="lg:col-span-3">
            {/* Latest Articles */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeCategory === 'all' ? 'All Articles' : categories.find(c => c.id === activeCategory)?.name}
                </h2>
                <span className="text-gray-500">({filteredContent.length} articles)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredContent.map((item) => (
                  <TechCard key={item.id} item={item} />
                ))}
              </div>
            </section>

            {/* Development Tools */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Popular Tools</h2>
                <Button variant="outline">
                  Explore More
                  <ExternalLink size={14} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar - 1/4 width */}
          <div className="space-y-8">
            {/* Latest News */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={20} className="text-blue-600" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Tech News</h3>
                </div>
                <div className="space-y-4">
                  {latestNews.map((news) => (
                    <div key={news.id} className="group cursor-pointer">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
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

            {/* Tutorials */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Code size={20} className="text-purple-600" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Learning Paths</h3>
                </div>
                <div className="space-y-4">
                  {tutorials.map((tutorial) => (
                    <TutorialCard key={tutorial.id} tutorial={tutorial} />
                  ))}
                </div>
              </div>
            </Card>

            {/* Tech Stats */}
            <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
              <div className="p-6">
                <h3 className="font-bold text-lg mb-4 text-center">Tech Trends</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>AI Adoption</span>
                      <span className="font-bold">+42%</span>
                    </div>
                    <Progress progress={85} color="blue" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cloud Migration</span>
                      <span className="font-bold">+67%</span>
                    </div>
                    <Progress progress={72} color="purple" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Remote Development</span>
                      <span className="font-bold">+89%</span>
                    </div>
                    <Progress progress={65} color="green" />
                  </div>
                </div>
                <div className="text-center mt-4 text-sm">
                  <ArrowUp size={16} className="inline mr-1 text-green-400" />
                  <span>All metrics trending upward</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnologyPage;