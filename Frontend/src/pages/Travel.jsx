import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Compass, 
  Plane, 
  Mountain,
  Palette,
  Camera,
  Heart,
  Share2,
  Bookmark,
  Clock,
  Users,
  Star,
  TrendingUp,
  Sparkles,
  Crown,
  ChevronLeft,
  ChevronRight,
  Play,
  ExternalLink,
  Calendar,
  Navigation,
  Globe,
  Coffee
} from 'lucide-react';

// Custom Components with travel-themed styles
const Card = ({ children, className = '', hover = false, variant = 'default' }) => {
  const variants = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    gradient: 'bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20',
    elevated: 'bg-white dark:bg-gray-800 shadow-xl border-0',
    glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20'
  };
  
  return (
    <div className={`rounded-2xl ${variants[variant]} ${hover ? 'hover:shadow-2xl transition-all duration-500' : ''} ${className}`}>
      {children}
    </div>
  );
};

const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', icon: Icon, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl',
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

const Badge = ({ children, color = 'cyan', className = '' }) => {
  const colors = {
    cyan: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
    emerald: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    violet: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300',
    rose: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300'
  };
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

// Main Travel Page Component
const TravelPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  const [travelStories, setTravelStories] = useState([]);
  const [travelGuides, setTravelGuides] = useState([]);
  const [hotDeals, setHotDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
  const [currentDestination, setCurrentDestination] = useState(0);
  const [viewMode, setViewMode] = useState('grid');

  const categories = [
    { id: 'all', name: 'All Destinations', icon: Globe, color: 'cyan', count: 156 },
    { id: 'beach', name: 'Beach', icon: Compass, color: 'emerald', count: 42 },
    { id: 'mountain', name: 'Mountain', icon: Mountain, color: 'violet', count: 38 },
    { id: 'city', name: 'City', icon: Palette, color: 'amber', count: 51 },
    { id: 'cultural', name: 'Cultural', icon: Camera, color: 'rose', count: 25 }
  ];

  // Mock travel data
  const mockData = {
    featuredDestinations: [
      {
        id: 1,
        name: 'Santorini, Greece',
        description: 'Experience the magical sunsets and white-washed buildings of this iconic Greek island',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop',
        country: 'Greece',
        type: 'beach',
        rating: 4.9,
        reviews: 2840,
        price: '$$$',
        bestTime: 'May-Oct',
        highlights: ['Sunset Views', 'Wine Tasting', 'Volcanic Beaches'],
        gradient: 'from-blue-400 to-cyan-400'
      },
      {
        id: 2,
        name: 'Kyoto, Japan',
        description: 'Discover ancient temples, traditional gardens, and rich cultural heritage',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
        country: 'Japan',
        type: 'cultural',
        rating: 4.8,
        reviews: 1920,
        price: '$$',
        bestTime: 'Mar-May, Oct-Nov',
        highlights: ['Temples', 'Cherry Blossoms', 'Traditional Cuisine'],
        gradient: 'from-emerald-400 to-green-400'
      },
      {
        id: 3,
        name: 'Swiss Alps',
        description: 'Majestic mountain peaks and pristine lakes in the heart of Europe',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        country: 'Switzerland',
        type: 'mountain',
        rating: 4.9,
        reviews: 1560,
        price: '$$$',
        bestTime: 'Jun-Sep, Dec-Mar',
        highlights: ['Hiking', 'Skiing', 'Scenic Trains'],
        gradient: 'from-violet-400 to-purple-400'
      }
    ],
    travelStories: [
      {
        id: 1,
        title: 'Road Tripping Through Iceland\'s Ring Road',
        excerpt: '7 days of epic landscapes, waterfalls, and midnight sun adventures',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        author: 'Sarah Adventure',
        readTime: 8,
        likes: 1240,
        date: '2024-03-15'
      },
      {
        id: 2,
        title: 'Hidden Gems of Southeast Asia',
        excerpt: 'Beyond the tourist trail: discovering authentic local experiences',
        image: 'https://images.unsplash.com/photo-1534008897995-27a23e859048?w=400&h=300&fit=crop',
        author: 'Mike Explorer',
        readTime: 6,
        likes: 890,
        date: '2024-03-10'
      }
    ],
    travelGuides: [
      {
        id: 1,
        title: 'Bali on a Budget',
        destination: 'Bali, Indonesia',
        duration: '10 days',
        budget: '$800',
        image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=300&h=200&fit=crop',
        tips: ['Local Warungs', 'Scooter Rental', 'Free Temples']
      },
      {
        id: 2,
        title: 'European Capitals',
        destination: 'Multiple Cities',
        duration: '21 days',
        budget: '$2500',
        image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=300&h=200&fit=crop',
        tips: ['Train Pass', 'Free Walking Tours', 'Museum Days']
      }
    ],
    hotDeals: [
      {
        id: 1,
        destination: 'Barcelona, Spain',
        originalPrice: '$1200',
        discountPrice: '$899',
        discount: '25% off',
        image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=300&h=200&fit=crop',
        days: 7,
        expires: '2024-04-15'
      },
      {
        id: 2,
        destination: 'Bali, Indonesia',
        originalPrice: '$1500',
        discountPrice: '$1099',
        discount: '27% off',
        image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=300&h=200&fit=crop',
        days: 10,
        expires: '2024-04-20'
      }
    ],
    trendingDestinations: [
      {
        id: 1,
        name: 'Portugal',
        trend: '+45% searches',
        image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=200&h=150&fit=crop'
      },
      {
        id: 2,
        name: 'Vietnam',
        trend: '+38% interest',
        image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=200&h=150&fit=crop'
      },
      {
        id: 3,
        name: 'Croatia',
        trend: '+52% bookings',
        image: 'https://images.unsplash.com/photo-1549877452-9c387954fbc2?w=200&h=150&fit=crop'
      }
    ]
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setFeaturedDestinations(mockData.featuredDestinations);
      setTravelStories(mockData.travelStories);
      setTravelGuides(mockData.travelGuides);
      setHotDeals(mockData.hotDeals);
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

  const nextDestination = () => {
    setCurrentDestination((prev) => (prev === mockData.featuredDestinations.length - 1 ? 0 : prev + 1));
  };

  const prevDestination = () => {
    setCurrentDestination((prev) => (prev === 0 ? mockData.featuredDestinations.length - 1 : prev - 1));
  };

  // Unique layout components
  const DestinationCard = ({ destination, featured = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group cursor-pointer ${featured ? 'col-span-2' : ''}`}
    >
      <Card hover variant="elevated" className="h-full overflow-hidden">
        <div className="relative h-64 overflow-hidden">
          <img 
            src={destination.image} 
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge color={categories.find(cat => cat.id === destination.type)?.color}>
              {categories.find(cat => cat.id === destination.type)?.name}
            </Badge>
            <Badge color="amber">
              {destination.price}
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(destination.id);
              }}
              className="w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
            >
              <Bookmark 
                size={20} 
                className={bookmarkedItems.has(destination.id) ? 'fill-cyan-500 text-cyan-500' : ''} 
              />
            </button>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between text-white">
              <div>
                <h3 className="font-bold text-xl mb-1">{destination.name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} />
                  <span>{destination.country}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{destination.rating}</span>
                  <span className="text-sm">({destination.reviews})</span>
                </div>
                <Button size="sm">
                  Explore
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {featured && (
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">{destination.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>Best: {destination.bestTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{destination.duration}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {destination.highlights.slice(0, 2).map((highlight, index) => (
                  <Badge key={index} color="cyan" className="text-xs">
                    {highlight}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );

  const TravelStoryCard = ({ story }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="group cursor-pointer"
    >
      <Card hover variant="glass" className="overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            <img 
              src={story.image} 
              alt={story.title}
              className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="p-6 md:w-2/3">
            <div className="flex items-center gap-2 mb-3">
              <Badge color="violet">Travel Story</Badge>
              <span className="text-sm text-gray-500">{story.date}</span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-3 group-hover:text-cyan-600 transition-colors">
              {story.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {story.excerpt}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>by {story.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{story.readTime} min read</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Heart size={14} />
                <span>{story.likes}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const HotDealCard = ({ deal }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group cursor-pointer"
    >
      <Card hover variant="gradient" className="overflow-hidden relative">
        <div className="absolute top-4 right-4">
          <Badge color="rose" className="animate-pulse">
            🔥 HOT DEAL
          </Badge>
        </div>
        
        <img 
          src={deal.image} 
          alt={deal.destination}
          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-700"
        />
        
        <div className="p-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
            {deal.destination}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-500 line-through">{deal.originalPrice}</span>
            <span className="font-bold text-rose-600 text-lg">{deal.discountPrice}</span>
            <Badge color="emerald">{deal.discount}</Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{deal.days} days</span>
            </div>
            <span>Expires {new Date(deal.expires).toLocaleDateString()}</span>
          </div>
          
          <Button className="w-full mt-3" size="sm">
            <Plane size={16} className="mr-2" />
            Book Now
          </Button>
        </div>
      </Card>
    </motion.div>
  );

  const FeaturedDestinationCarousel = () => (
    <div className="relative h-[70vh] rounded-3xl overflow-hidden mb-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDestination}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img 
            src={mockData.featuredDestinations[currentDestination]?.image} 
            alt={mockData.featuredDestinations[currentDestination]?.name}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent`} />
          
          <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
            <div className="max-w-4xl">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <Badge color="cyan" className="mb-4">
                  <Crown size={14} className="mr-1" />
                  FEATURED DESTINATION
                </Badge>
                <div className="flex items-center gap-4 text-sm mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{mockData.featuredDestinations[currentDestination]?.country}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="fill-yellow-400" />
                    <span>{mockData.featuredDestinations[currentDestination]?.rating} ({mockData.featuredDestinations[currentDestination]?.reviews} reviews)</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.h2 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
              >
                {mockData.featuredDestinations[currentDestination]?.name}
              </motion.h2>
              
              <motion.p 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed"
              >
                {mockData.featuredDestinations[currentDestination]?.description}
              </motion.p>
              
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-6 mb-8"
              >
                {mockData.featuredDestinations[currentDestination]?.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    <span className="text-lg">{highlight}</span>
                  </div>
                ))}
              </motion.div>
              
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-4"
              >
                <Button size="lg">
                  <Navigation size={20} className="mr-2" />
                  Start Planning
                </Button>
                <Button variant="outline" className="text-white border-white hover:bg-white/20">
                  <Share2 size={18} className="mr-2" />
                  Share Journey
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <button 
        onClick={prevDestination}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
      >
        <ChevronLeft size={28} />
      </button>
      <button 
        onClick={nextDestination}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
      >
        <ChevronRight size={28} />
      </button>

      {/* Destination Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
        {mockData.featuredDestinations.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentDestination(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentDestination ? 'bg-white scale-125' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-cyan-900/20 dark:to-blue-900/20 flex items-center justify-center">
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
            className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Plane size={40} className="text-white" />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Discovering amazing destinations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-cyan-900/20 dark:to-blue-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="relative inline-block mb-6">
            <Badge color="cyan" className="mb-4">
              <Sparkles size={16} className="mr-2" />
              WANDERLUST AWAITS
            </Badge>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-400 rounded-full animate-ping" />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            Explore The
            <span className="block bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              World
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Discover hidden gems, plan unforgettable journeys, and create memories that last a lifetime
          </p>
        </motion.div>

        {/* Featured Destination Carousel */}
        <section className="mb-16">
          <FeaturedDestinationCarousel />
        </section>

        {/* Categories */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Find Your Adventure</h2>
            <div className="flex gap-2">
              <Button 
                variant={viewMode === 'grid' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
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
                    color={activeCategory === category.id ? "cyan" : "gray"}
                    className={activeCategory === category.id ? "bg-white/20 text-white border-0" : ""}
                  >
                    {category.count}
                  </Badge>
                </motion.button>
              );
            })}
          </div>

          {/* Destinations Grid */}
          <div className={`grid gap-8 ${
            viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
          }`}>
            {mockData.featuredDestinations.map((destination, index) => (
              <DestinationCard 
                key={destination.id} 
                destination={destination} 
                featured={viewMode === 'list'}
              />
            ))}
          </div>
        </section>

        {/* Split Layout Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Travel Stories - 2/3 width */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Travel Stories</h3>
              <Button variant="outline">
                Read All
                <ExternalLink size={16} />
              </Button>
            </div>
            <div className="space-y-6">
              {travelStories.map((story) => (
                <TravelStoryCard key={story.id} story={story} />
              ))}
            </div>
          </div>

          {/* Hot Deals & Trending - 1/3 width */}
          <div className="space-y-8">
            {/* Hot Deals */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp size={24} className="text-rose-600" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Hot Deals</h3>
              </div>
              <div className="space-y-4">
                {hotDeals.map((deal) => (
                  <HotDealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </div>

            {/* Trending Destinations */}
            <Card variant="elevated" className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Compass size={24} className="text-cyan-600" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Now</h3>
              </div>
              <div className="space-y-4">
                {mockData.trendingDestinations.map((destination) => (
                  <div key={destination.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                    <img 
                      src={destination.image} 
                      alt={destination.name}
                      className="w-16 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{destination.name}</h4>
                      <p className="text-sm text-emerald-600">{destination.trend}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Travel Guides Section */}
        <section className="mb-16">
          <Card variant="gradient" className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Travel Guides</h2>
                <p className="text-gray-600 dark:text-gray-400">Expert-planned itineraries for your next adventure</p>
              </div>
              <Button>
                <Compass size={20} className="mr-2" />
                All Guides
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {travelGuides.map((guide) => (
                <Card key={guide.id} hover variant="elevated" className="overflow-hidden">
                  <div className="flex">
                    <div className="w-1/3">
                      <img 
                        src={guide.image} 
                        alt={guide.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 w-2/3">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{guide.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <MapPin size={14} />
                        <span>{guide.destination}</span>
                        <span>•</span>
                        <span>{guide.duration}</span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-600">{guide.budget}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {guide.tips.map((tip, index) => (
                          <Badge key={index} color="cyan" className="text-xs">
                            {tip}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </section>

        {/* Inspiration Quote */}
        <motion.section
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <Card variant="elevated" className="p-12">
            <div className="text-6xl mb-6">🌍</div>
            <blockquote className="text-2xl md:text-3xl font-light text-gray-700 dark:text-gray-300 italic mb-6 leading-relaxed">
              "The world is a book, and those who do not travel read only one page."
            </blockquote>
            <div className="text-gray-500 dark:text-gray-400">— Saint Augustine</div>
          </Card>
        </motion.section>
      </div>
    </div>
  );
};

export default TravelPage;