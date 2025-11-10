import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Heart, 
  Share2, 
  Bookmark, 
  Star, 
  Clock, 
  Users,
  Eye,
  MessageCircle,
  TrendingUp,
  Film,
  Music,
  Tv,
  Gamepad2,
  Sparkles,
  Crown,
  Calendar,
  MapPin,
  ExternalLink,
  SkipForward,
  SkipBack
} from 'lucide-react';

// Custom Components
const Card = ({ children, className = '', hover = false }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${hover ? 'hover:shadow-md transition-shadow duration-300' : ''} ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', icon: Icon, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white',
    secondary: 'bg-pink-600 hover:bg-pink-700 text-white',
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

const Badge = ({ children, color = 'purple', className = '' }) => {
  const colors = {
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

const Progress = ({ progress, color = 'purple', size = 'md' }) => {
  const colors = {
    purple: 'bg-purple-600',
    pink: 'bg-pink-600',
    yellow: 'bg-yellow-600',
    green: 'bg-green-600',
    blue: 'bg-blue-600'
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

// Main Entertainment Page Component
const EntertainmentPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [trendingContent, setTrendingContent] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [celebrityNews, setCelebrityNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
  const [likedItems, setLikedItems] = useState(new Set());
  const [currentFeatured, setCurrentFeatured] = useState(0);

  // Mock entertainment data
  const entertainmentData = {
    movies: [
      {
        id: 1,
        title: 'Cyber Revolution',
        type: 'movie',
        category: 'sci-fi',
        description: 'In a dystopian future, a hacker uncovers a conspiracy that could change humanity forever.',
        image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&h=400&fit=crop',
        rating: 4.8,
        duration: '2h 28m',
        releaseDate: '2024-03-15',
        director: 'Alex Rivera',
        cast: ['Emma Stone', 'Michael B. Jordan', 'Zendaya'],
        trending: true,
        featured: true,
        views: 1250000,
        likes: 89200,
        comments: 12400
      },
      {
        id: 2,
        title: 'Midnight in Paris',
        type: 'movie',
        category: 'romance',
        description: 'A nostalgic journey through time and love in the city of lights.',
        image: 'https://images.unsplash.com/photo-1489599809505-7c8e1c8bfc26?w=600&h=400&fit=crop',
        rating: 4.3,
        duration: '1h 52m',
        releaseDate: '2024-02-28',
        director: 'Sophie Laurent',
        cast: ['Lily Collins', 'Timothée Chalamet'],
        trending: false,
        featured: false,
        views: 890000,
        likes: 45600,
        comments: 7800
      }
    ],
    tvShows: [
      {
        id: 3,
        title: 'The Last Kingdom',
        type: 'tv',
        category: 'drama',
        description: 'Epic historical drama following the journey of a warrior in medieval England.',
        image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=600&h=400&fit=crop',
        rating: 4.7,
        seasons: 4,
        episodes: 32,
        network: 'HBO',
        trending: true,
        featured: true,
        views: 3450000,
        likes: 234500,
        comments: 45600
      }
    ],
    music: [
      {
        id: 4,
        title: 'Summer Vibes 2024',
        type: 'music',
        category: 'pop',
        artist: 'Ava Max & The Weeknd',
        description: 'The ultimate summer anthem collaboration of the year.',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
        rating: 4.9,
        duration: '3:45',
        releaseDate: '2024-05-20',
        trending: true,
        featured: false,
        views: 5670000,
        likes: 345000,
        comments: 89200
      }
    ],
    games: [
      {
        id: 5,
        title: 'Cyber Nexus',
        type: 'game',
        category: 'action',
        description: 'Open-world RPG set in a cyberpunk metropolis with endless possibilities.',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop',
        rating: 4.8,
        platform: ['PC', 'PS5', 'XBOX'],
        developer: 'Neon Studios',
        releaseDate: '2024-04-10',
        trending: true,
        featured: true,
        views: 2340000,
        likes: 167000,
        comments: 34500
      }
    ],
    events: [
      {
        id: 6,
        title: 'Global Music Festival 2024',
        type: 'event',
        category: 'music',
        description: 'The biggest music festival featuring top artists from around the world.',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop',
        date: '2024-07-15',
        location: 'Miami, FL',
        artists: ['Beyoncé', 'Coldplay', 'Dua Lipa', 'Kendrick Lamar'],
        price: '$199 - $599',
        trending: true,
        featured: false
      }
    ]
  };

  const categories = [
    { id: 'all', name: 'All', icon: Sparkles, count: 25 },
    { id: 'movies', name: 'Movies', icon: Film, count: 8 },
    { id: 'tv', name: 'TV Shows', icon: Tv, count: 6 },
    { id: 'music', name: 'Music', icon: Music, count: 5 },
    { id: 'games', name: 'Games', icon: Gamepad2, count: 4 },
    { id: 'events', name: 'Events', icon: Calendar, count: 2 }
  ];

  const celebrityNewsData = [
    {
      id: 1,
      title: 'Taylor Swift Announces World Tour 2024',
      excerpt: 'Global superstar reveals dates for her most ambitious tour yet.',
      image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=200&fit=crop',
      category: 'music',
      timeAgo: '2 hours ago',
      trending: true
    },
    {
      id: 2,
      title: 'Chris Hemsworth Starts in New Action Franchise',
      excerpt: 'Marvel star to lead new epic adventure series.',
      image: 'https://images.unsplash.com/photo-1518630362444-1f76b4bd83e8?w=300&h=200&fit=crop',
      category: 'movies',
      timeAgo: '5 hours ago',
      trending: false
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Flatten all entertainment data
      const allContent = Object.values(entertainmentData).flat();
      setTrendingContent(allContent.filter(item => item.trending));
      setNewReleases(allContent.slice(0, 6));
      setUpcomingEvents(entertainmentData.events);
      setCelebrityNews(celebrityNewsData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredContent = useMemo(() => {
    const allContent = Object.values(entertainmentData).flat();
    if (activeCategory === 'all') return allContent;
    return allContent.filter(item => item.type === activeCategory);
  }, [activeCategory]);

  const featuredContent = useMemo(() => 
    Object.values(entertainmentData).flat().filter(item => item.featured),
  []);

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
    setCurrentFeatured((prev) => (prev === featuredContent.length - 1 ? 0 : prev + 1));
  };

  const prevFeatured = () => {
    setCurrentFeatured((prev) => (prev === 0 ? featuredContent.length - 1 : prev - 1));
  };

  const EntertainmentCard = ({ item, size = 'default' }) => (
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
              size === 'large' ? 'h-64' : 'h-48'
            }`}
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge color="purple">
              {item.type === 'movie' && 'Movie'}
              {item.type === 'tv' && 'TV Show'}
              {item.type === 'music' && 'Music'}
              {item.type === 'game' && 'Game'}
              {item.type === 'event' && 'Event'}
            </Badge>
            {item.trending && <Badge color="pink">Trending</Badge>}
          </div>
          <div className="absolute top-3 right-3 flex gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(item.id);
              }}
              className="w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <Bookmark 
                size={16} 
                className={bookmarkedItems.has(item.id) ? 'fill-white' : ''} 
              />
            </button>
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{item.rating}</span>
              </div>
              <Button size="sm" variant="secondary">
                <Play size={14} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className={`font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors mb-2 ${
            size === 'large' ? 'text-lg' : 'text-md'
          }`}>
            {item.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
            {item.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              {item.duration && (
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{item.duration}</span>
                </div>
              )}
              {item.releaseDate && (
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{new Date(item.releaseDate).getFullYear()}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(item.id);
                }}
                className="flex items-center gap-1 hover:text-pink-600 transition-colors"
              >
                <Heart 
                  size={12} 
                  className={likedItems.has(item.id) ? 'fill-pink-600 text-pink-600' : ''} 
                />
                <span>{(item.likes / 1000).toFixed(1)}k</span>
              </button>
              <div className="flex items-center gap-1">
                <Eye size={12} />
                <span>{(item.views / 1000000).toFixed(1)}M</span>
              </div>
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
            src={featuredContent[currentFeatured]?.image} 
            alt={featuredContent[currentFeatured]?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="max-w-4xl">
              <Badge color="pink" className="mb-4">
                <Crown size={12} className="mr-1" />
                FEATURED
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {featuredContent[currentFeatured]?.title}
              </h2>
              <p className="text-xl text-gray-200 mb-6 max-w-2xl">
                {featuredContent[currentFeatured]?.description}
              </p>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Star size={20} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">
                    {featuredContent[currentFeatured]?.rating}/5.0
                  </span>
                </div>
                {featuredContent[currentFeatured]?.duration && (
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{featuredContent[currentFeatured]?.duration}</span>
                  </div>
                )}
                {featuredContent[currentFeatured]?.releaseDate && (
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{new Date(featuredContent[currentFeatured]?.releaseDate).getFullYear()}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <Button size="lg">
                  <Play size={20} className="mr-2" />
                  Watch Now
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
        <SkipBack size={24} />
      </button>
      <button 
        onClick={nextFeatured}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
      >
        <SkipForward size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {featuredContent.map((_, index) => (
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

  const CelebrityNewsCard = ({ news }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-4 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
        <img 
          src={news.image} 
          alt={news.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          {news.trending && <Badge color="pink">Trending</Badge>}
          <span className="text-xs text-gray-500">{news.timeAgo}</span>
        </div>
        <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
          {news.title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {news.excerpt}
        </p>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Film size={32} className="text-white" />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-400">Loading entertainment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Badge color="purple" className="mx-auto">
              <Sparkles size={14} className="mr-1" />
              ENTERTAINMENT HUB
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
              Discover <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Entertainment</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Your gateway to the latest movies, TV shows, music, games, and celebrity news
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
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-105'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Icon size={24} />
                  <span className="font-medium text-sm">{category.name}</span>
                  <Badge 
                    color={activeCategory === category.id ? "pink" : "gray"}
                    className={activeCategory === category.id ? "bg-white/20 text-white border-0" : ""}
                  >
                    {category.count}
                  </Badge>
                </button>
              );
            })}
          </div>
        </section>

        {/* Trending Now */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              <TrendingUp size={24} className="inline mr-2 text-pink-600" />
              Trending Now
            </h2>
            <Button variant="outline">
              View All
              <ExternalLink size={14} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingContent.map((item) => (
              <EntertainmentCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Content Grid - 3/4 width */}
          <div className="lg:col-span-3">
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeCategory === 'all' ? 'All Entertainment' : categories.find(c => c.id === activeCategory)?.name}
                </h2>
                <span className="text-gray-500">({filteredContent.length} items)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContent.map((item) => (
                  <EntertainmentCard key={item.id} item={item} />
                ))}
              </div>
            </section>

            {/* New Releases */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">New Releases</h2>
                <Button variant="outline">
                  See More
                  <ExternalLink size={14} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newReleases.map((item) => (
                  <EntertainmentCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar - 1/4 width */}
          <div className="space-y-8">
            {/* Celebrity News */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={20} className="text-purple-600" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Celebrity News</h3>
                </div>
                <div className="space-y-4">
                  {celebrityNews.map((news) => (
                    <CelebrityNewsCard key={news.id} news={news} />
                  ))}
                </div>
              </div>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar size={20} className="text-pink-600" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Upcoming Events</h3>
                </div>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {event.title}
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <MapPin size={12} />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={12} />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={12} />
                          <span>{event.price}</span>
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-3">
                        Get Tickets
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Entertainment Stats */}
            <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
              <div className="p-6">
                <h3 className="font-bold text-lg mb-4 text-center">This Week's Buzz</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Movie Views</span>
                      <span className="font-bold">2.4M</span>
                    </div>
                    <Progress progress={85} color="pink" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Music Streams</span>
                      <span className="font-bold">5.7M</span>
                    </div>
                    <Progress progress={72} color="yellow" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Game Downloads</span>
                      <span className="font-bold">890K</span>
                    </div>
                    <Progress progress={65} color="green" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntertainmentPage;