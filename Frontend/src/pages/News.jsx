import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Clock, 
  Share2, 
  Bookmark, 
  Eye, 
  Heart, 
  MessageCircle,
  TrendingUp,
  Filter,
  Play,
  MapPin,
  Calendar,
  User,
  Tag,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Newspaper,
  Globe,
  BarChart3
} from 'lucide-react';

// Custom Components to replace Flowbite
const Card = ({ children, className = '', hover = false }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${hover ? 'hover:shadow-md transition-shadow duration-300' : ''} ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', icon: Icon, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white',
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
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

const Input = ({ placeholder, value, onChange, icon: Icon, className = '', ...props }) => (
  <div className="relative">
    {Icon && (
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon size={16} className="text-gray-400" />
      </div>
    )}
    <input
      className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
    />
  </div>
);

const Select = ({ value, onChange, children, className = '' }) => (
  <select
    className={`px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    value={value}
    onChange={onChange}
  >
    {children}
  </select>
);

const Progress = ({ progress, color = 'blue', size = 'md' }) => {
  const colors = {
    blue: 'bg-blue-600',
    red: 'bg-red-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    purple: 'bg-purple-600'
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

// Main News Page Component
const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [breakingNews, setBreakingNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [bookmarkedArticles, setBookmarkedArticles] = useState(new Set());
  const [likedArticles, setLikedArticles] = useState(new Set());
  const [currentSlide, setCurrentSlide] = useState(0);

  // Mock news data
  const mockNews = [
    {
      id: 1,
      title: 'Global Tech Summit Announces Breakthrough in Quantum Computing',
      excerpt: 'Scientists reveal new quantum processor capable of solving complex problems in seconds that would take classical computers millennia.',
      content: 'In a groundbreaking announcement at the Global Tech Summit, researchers from leading institutions unveiled a quantum processor that marks a significant leap forward in computational capabilities. The new technology promises to revolutionize fields from drug discovery to climate modeling.',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
      category: 'technology',
      source: 'Tech News Daily',
      author: 'Sarah Chen',
      publishedAt: '2024-01-15T10:30:00Z',
      readTime: 4,
      views: 12450,
      likes: 842,
      comments: 156,
      trending: true,
      breaking: false,
      tags: ['Quantum Computing', 'Technology', 'Innovation']
    },
    {
      id: 2,
      title: 'Climate Accord Reached at International Environmental Conference',
      excerpt: 'World leaders agree on ambitious new targets for carbon emission reductions by 2030.',
      content: 'After intense negotiations, countries have reached a historic agreement to accelerate climate action. The new targets represent the most ambitious climate commitment to date.',
      image: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=800&h=400&fit=crop',
      category: 'politics',
      source: 'Global News Network',
      author: 'Michael Rodriguez',
      publishedAt: '2024-01-15T08:15:00Z',
      readTime: 6,
      views: 18900,
      likes: 1123,
      comments: 289,
      trending: true,
      breaking: true,
      tags: ['Climate', 'Politics', 'Environment']
    },
    {
      id: 3,
      title: 'Major Breakthrough in Renewable Energy Storage Technology',
      excerpt: 'New battery technology promises to make solar and wind power more reliable than ever before.',
      content: 'Researchers have developed a revolutionary energy storage system that could solve the intermittency issues of renewable energy sources.',
      image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=400&fit=crop',
      category: 'science',
      source: 'Science Today',
      author: 'Dr. Emily Watson',
      publishedAt: '2024-01-14T16:45:00Z',
      readTime: 5,
      views: 9560,
      likes: 734,
      comments: 134,
      trending: false,
      breaking: false,
      tags: ['Energy', 'Science', 'Innovation']
    },
    {
      id: 4,
      title: 'Stock Markets Reach All-Time High Amid Economic Optimism',
      excerpt: 'Global markets surge as economic indicators show stronger than expected recovery.',
      content: 'Investors are celebrating as major stock indices around the world hit record levels, fueled by positive economic data and corporate earnings.',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
      category: 'business',
      source: 'Financial Times',
      author: 'James Wilson',
      publishedAt: '2024-01-14T14:20:00Z',
      readTime: 3,
      views: 16700,
      likes: 923,
      comments: 201,
      trending: true,
      breaking: false,
      tags: ['Markets', 'Economy', 'Business']
    },
    {
      id: 5,
      title: 'New Archaeological Discovery Rewrites Ancient History',
      excerpt: 'Ancient city uncovered in remote region challenges previous understanding of early civilizations.',
      content: 'Archaeologists have made a stunning discovery that could change our understanding of ancient human settlements and trade routes.',
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&h=400&fit=crop',
      category: 'science',
      source: 'History Revealed',
      author: 'Dr. Robert Kim',
      publishedAt: '2024-01-14T11:10:00Z',
      readTime: 7,
      views: 7820,
      likes: 645,
      comments: 98,
      trending: false,
      breaking: true,
      tags: ['Archaeology', 'History', 'Discovery']
    },
    {
      id: 6,
      title: 'Revolutionary Medical Treatment Shows Promise in Clinical Trials',
      excerpt: 'New therapy demonstrates remarkable results in treating previously incurable conditions.',
      content: 'Medical researchers are excited about a new treatment approach that has shown unprecedented success in early clinical trials.',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=400&fit=crop',
      category: 'health',
      source: 'Medical Advancements',
      author: 'Dr. Lisa Park',
      publishedAt: '2024-01-13T19:30:00Z',
      readTime: 4,
      views: 11200,
      likes: 856,
      comments: 167,
      trending: true,
      breaking: false,
      tags: ['Medicine', 'Health', 'Research']
    }
  ];

  const categories = [
    { id: 'all', name: 'All News', count: mockNews.length },
    { id: 'technology', name: 'Technology', count: mockNews.filter(n => n.category === 'technology').length },
    { id: 'politics', name: 'Politics', count: mockNews.filter(n => n.category === 'politics').length },
    { id: 'science', name: 'Science', count: mockNews.filter(n => n.category === 'science').length },
    { id: 'business', name: 'Business', count: mockNews.filter(n => n.category === 'business').length },
    { id: 'health', name: 'Health', count: mockNews.filter(n => n.category === 'health').length }
  ];

  const sources = [
    'All Sources',
    'Tech News Daily',
    'Global News Network',
    'Science Today',
    'Financial Times',
    'History Revealed',
    'Medical Advancements'
  ];

  useEffect(() => {
    // Simulate API call
    const fetchNews = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNews(mockNews);
      setTrendingNews(mockNews.filter(article => article.trending));
      setBreakingNews(mockNews.filter(article => article.breaking));
      setLoading(false);
    };

    fetchNews();
  }, []);

  const filteredNews = useMemo(() => {
    return news.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      const matchesSource = selectedSource === 'all' || article.source === selectedSource;
      
      return matchesSearch && matchesCategory && matchesSource;
    });
  }, [news, searchQuery, selectedCategory, selectedSource]);

  const toggleBookmark = (articleId) => {
    const newBookmarks = new Set(bookmarkedArticles);
    if (newBookmarks.has(articleId)) {
      newBookmarks.delete(articleId);
    } else {
      newBookmarks.add(articleId);
    }
    setBookmarkedArticles(newBookmarks);
  };

  const toggleLike = (articleId) => {
    const newLikes = new Set(likedArticles);
    if (newLikes.has(articleId)) {
      newLikes.delete(articleId);
    } else {
      newLikes.add(articleId);
    }
    setLikedArticles(newLikes);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const NewsCard = ({ article, featured = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`group cursor-pointer ${featured ? 'col-span-2' : ''}`}
    >
      <Card hover className="h-full overflow-hidden">
        <div className={`flex ${featured ? 'flex-col lg:flex-row' : 'flex-col'} h-full`}>
          <div className={`relative overflow-hidden ${featured ? 'lg:w-1/2' : 'w-full'}`}>
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge color="blue">{article.category}</Badge>
              {article.breaking && <Badge color="red">Breaking</Badge>}
              {article.trending && <Badge color="green">Trending</Badge>}
            </div>
            <div className="absolute top-3 right-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(article.id);
                }}
                className="bg-white/90 hover:bg-white"
              >
                <Bookmark 
                  size={16} 
                  className={bookmarkedArticles.has(article.id) ? 'fill-blue-600 text-blue-600' : ''} 
                />
              </Button>
            </div>
          </div>
          
          <div className={`p-6 flex flex-col flex-1 ${featured ? 'lg:w-1/2' : ''}`}>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <div className="flex items-center gap-1">
                <Newspaper size={14} />
                <span>{article.source}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{formatTimeAgo(article.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <User size={14} />
                <span>{article.author}</span>
              </div>
            </div>
            
            <h3 className={`font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-3 ${
              featured ? 'text-2xl line-clamp-2' : 'text-xl line-clamp-2'
            }`}>
              {article.title}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-1">
              {article.excerpt}
            </p>
            
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{article.readTime} min read</span>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(article.id);
                    }}
                    className="flex items-center gap-1 hover:text-red-600 transition-colors"
                  >
                    <Heart 
                      size={14} 
                      className={likedArticles.has(article.id) ? 'fill-red-600 text-red-600' : ''} 
                    />
                    <span>{article.likes}</span>
                  </button>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={14} />
                    <span>{article.comments}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    <span>{(article.views / 1000).toFixed(1)}k</span>
                  </div>
                </div>
              </div>
              
              <Button variant="ghost" size="sm">
                <ExternalLink size={14} />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {article.tags.slice(0, 3).map(tag => (
                <Badge key={tag} color="gray" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const BreakingNewsTicker = () => (
    <div className="bg-red-600 text-white py-3 overflow-hidden">
      <div className="flex items-center">
        <div className="flex items-center gap-2 px-4 py-1 bg-red-700">
          <Badge color="red" className="bg-red-800 text-white border-0">
            BREAKING
          </Badge>
        </div>
        <div className="flex-1 overflow-hidden">
          <motion.div
            animate={{ x: ['100%', '-100%'] }}
            transition={{ 
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear"
              }
            }}
            className="whitespace-nowrap text-sm"
          >
            {breakingNews.map((news, index) => (
              <span key={news.id} className="mx-8">
                {news.title} • 
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );

  const FeaturedCarousel = () => (
    <div className="relative h-96 rounded-xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img 
            src={trendingNews[currentSlide]?.image} 
            alt={trendingNews[currentSlide]?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="max-w-4xl">
              <Badge color="green" className="mb-4">
                <TrendingUp size={12} className="mr-1" />
                TRENDING
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 line-clamp-2">
                {trendingNews[currentSlide]?.title}
              </h2>
              <p className="text-lg text-gray-200 mb-6 line-clamp-2">
                {trendingNews[currentSlide]?.excerpt}
              </p>
              <div className="flex items-center gap-4">
                <Button>
                  <Play size={16} className="mr-2" />
                  Read Full Story
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
        onClick={() => setCurrentSlide((prev) => (prev === 0 ? trendingNews.length - 1 : prev - 1))}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button 
        onClick={() => setCurrentSlide((prev) => (prev === trendingNews.length - 1 ? 0 : prev + 1))}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {trendingNews.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 dark:text-gray-400">Loading latest news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Breaking News Ticker */}
      {breakingNews.length > 0 && <BreakingNewsTicker />}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Carousel */}
        {trendingNews.length > 0 && (
          <section className="mb-12">
            <FeaturedCarousel />
          </section>
        )}

        {/* Categories */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h2>
            <Select value={selectedSource} onChange={(e) => setSelectedSource(e.target.value)}>
              {sources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </Select>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md border border-gray-200 dark:border-gray-700'
                }`}
              >
                <span className="font-medium">{category.name}</span>
                <Badge 
                  color={selectedCategory === category.id ? "blue" : "gray"}
                  className={selectedCategory === category.id ? "bg-blue-500 text-white" : ""}
                >
                  {category.count}
                </Badge>
              </button>
            ))}
          </div>
        </section>

        {/* News Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedCategory === 'all' ? 'Latest News' : categories.find(c => c.id === selectedCategory)?.name}
              <span className="text-gray-500 text-lg ml-2">({filteredNews.length})</span>
            </h2>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Globe size={16} />
                <span>Updated just now</span>
              </div>
            </div>
          </div>

          {filteredNews.length === 0 ? (
            <Card className="text-center py-12">
              <Newspaper size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No news found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedSource('all');
              }}>
                Clear Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredNews.map((article, index) => (
                <NewsCard 
                  key={article.id} 
                  article={article}
                  featured={index === 0 && filteredNews.length >= 3}
                />
              ))}
            </div>
          )}
        </section>

        {/* Trending Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-12">
          <div className="lg:col-span-3">
            {/* Main content already rendered above */}
          </div>
          
          <div className="space-y-6">
            {/* Trending News */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={20} className="text-green-600" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Trending Now</h3>
                </div>
                <div className="space-y-4">
                  {trendingNews.slice(0, 5).map((article, index) => (
                    <div key={article.id} className="flex items-start gap-3 group cursor-pointer">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                          {article.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span>{article.source}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(article.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Newsletter */}
            <Card className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">Stay Updated</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Get the latest news delivered to your inbox daily
                </p>
                <div className="space-y-3">
                  <Input
                    placeholder="Enter your email"
                    className="bg-white/20 border-white/30 text-white placeholder-blue-200"
                  />
                  <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                    Subscribe
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewsPage;