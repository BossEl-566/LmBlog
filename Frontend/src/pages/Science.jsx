import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Microscope, 
  Atom, 
  Brain, 
  Rocket,
  Globe,
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
  Users,
  Zap,
  Target,
  FlaskConical
} from 'lucide-react';

// Custom Components for Science Style
const Card = ({ children, className = '', hover = false, variant = 'default' }) => {
  const variants = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    gradient: 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20',
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

// Main Science Blog Page Component
const SciencePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [latestDiscoveries, setLatestDiscoveries] = useState([]);
  const [scienceNews, setScienceNews] = useState([]);
  const [researchSpotlights, setResearchSpotlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedArticles, setBookmarkedArticles] = useState(new Set());
  const [currentFeatured, setCurrentFeatured] = useState(0);

  const categories = [
    { id: 'all', name: 'All Science', icon: Microscope, color: 'blue', count: 184 },
    { id: 'physics', name: 'Physics', icon: Atom, color: 'purple', count: 42 },
    { id: 'biology', name: 'Biology', icon: Brain, color: 'emerald', count: 38 },
    { id: 'chemistry', name: 'Chemistry', icon: Brain, color: 'amber', count: 35 },
    { id: 'space', name: 'Space', icon: Rocket, color: 'violet', count: 29 },
    { id: 'environment', name: 'Environment', icon: Globe, color: 'blue', count: 40 }
  ];

  // Mock science blog data
  const mockData = {
    featuredArticles: [
      {
        id: 1,
        title: 'Quantum Entanglement: The Spooky Action That\'s Revolutionizing Computing',
        excerpt: 'How quantum mechanics is paving the way for unprecedented computational power and secure communication networks.',
        content: 'Quantum entanglement, once described by Einstein as "spooky action at a distance," is no longer just a theoretical curiosity. Recent breakthroughs in quantum computing have demonstrated practical applications that could transform everything from drug discovery to cryptography...',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=500&fit=crop',
        category: 'physics',
        author: 'Dr. Elena Rodriguez',
        authorTitle: 'Quantum Physicist',
        authorImage: 'https://images.unsplash.com/photo-1589279003523-5d2a0e4b0e51?w=100&h=100&fit=crop',
        readTime: 8,
        views: 89200,
        likes: 4200,
        comments: 89,
        publishedAt: '2024-03-15T09:00:00Z',
        trending: true,
        peerReviewed: true
      },
      {
        id: 2,
        title: 'CRISPR 2.0: The Next Generation of Gene Editing Technology',
        excerpt: 'Advanced gene editing techniques are opening new frontiers in medicine and biotechnology.',
        content: 'The evolution of CRISPR technology has accelerated at an unprecedented pace. New variants like prime editing and base editing offer greater precision and fewer off-target effects, bringing us closer to curing genetic diseases and developing personalized medicine...',
        image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=500&fit=crop',
        category: 'biology',
        author: 'Dr. Michael Chen',
        authorTitle: 'Genetic Researcher',
        authorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop',
        readTime: 6,
        views: 75600,
        likes: 3800,
        comments: 67,
        publishedAt: '2024-03-14T14:30:00Z',
        trending: true,
        peerReviewed: true
      }
    ],
    latestDiscoveries: [
      {
        id: 3,
        title: 'Breakthrough in Room-Temperature Superconductivity',
        excerpt: 'New material shows superconducting properties at temperatures previously thought impossible.',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop',
        category: 'physics',
        author: 'Dr. Sarah Johnson',
        authorTitle: 'Materials Scientist',
        readTime: 7,
        views: 45200,
        likes: 2100,
        comments: 45,
        publishedAt: '2024-03-13T11:15:00Z',
        peerReviewed: true
      },
      {
        id: 4,
        title: 'Deep-Sea Microbes Reveal Clues About Early Life on Earth',
        excerpt: 'Extremophile organisms found thriving in hydrothermal vents provide insights into life\'s origins.',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop',
        category: 'biology',
        author: 'Dr. James Wilson',
        authorTitle: 'Marine Biologist',
        readTime: 5,
        views: 38900,
        likes: 1800,
        comments: 32,
        publishedAt: '2024-03-12T16:45:00Z',
        peerReviewed: true
      },
      {
        id: 5,
        title: 'Webb Telescope Discovers Ancient Galaxy Cluster',
        excerpt: 'Observations reveal galaxy formation occurring earlier than theoretical models predicted.',
        image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=250&fit=crop',
        category: 'space',
        author: 'Dr. Maria Gonzalez',
        authorTitle: 'Astrophysicist',
        readTime: 6,
        views: 52300,
        likes: 2900,
        comments: 78,
        publishedAt: '2024-03-11T10:20:00Z',
        peerReviewed: true
      }
    ],
    scienceNews: [
      {
        id: 1,
        title: 'Major Climate Study Reveals Accelerating Ice Melt in Antarctica',
        excerpt: 'Comprehensive satellite data shows ice loss 30% faster than previous estimates',
        category: 'environment',
        timeAgo: '2 hours ago',
        source: 'Nature Journal',
        impact: 'high'
      },
      {
        id: 2,
        title: 'New Battery Technology Promises 500% Increase in Energy Density',
        excerpt: 'Solid-state batteries could revolutionize electric vehicles and renewable energy storage',
        category: 'chemistry',
        timeAgo: '5 hours ago',
        source: 'Science Advances',
        impact: 'medium'
      }
    ],
    researchSpotlights: [
      {
        id: 1,
        institution: 'CERN',
        title: 'Search for Dark Matter Particles Intensifies',
        field: 'Particle Physics',
        status: 'Ongoing',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=200&fit=crop'
      },
      {
        id: 2,
        institution: 'NASA',
        title: 'Mars Sample Return Mission Planning',
        field: 'Planetary Science',
        status: 'Planning Phase',
        image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=200&fit=crop'
      }
    ],
    scienceFacts: [
      {
        id: 1,
        fact: 'Neutron stars are so dense that a teaspoon would weigh 6 billion tons',
        category: 'physics',
        source: 'NASA'
      },
      {
        id: 2,
        fact: 'The human brain can store approximately 2.5 petabytes of information',
        category: 'biology',
        source: 'Salk Institute'
      },
      {
        id: 3,
        fact: 'There are more stars in the universe than grains of sand on Earth',
        category: 'space',
        source: 'Hubble Telescope'
      }
    ]
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setFeaturedArticles(mockData.featuredArticles);
      setLatestDiscoveries(mockData.latestDiscoveries);
      setScienceNews(mockData.scienceNews);
      setResearchSpotlights(mockData.researchSpotlights);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredArticles = useMemo(() => {
    const allArticles = [...mockData.featuredArticles, ...mockData.latestDiscoveries];
    if (activeCategory === 'all') return allArticles;
    return allArticles.filter(article => article.category === activeCategory);
  }, [activeCategory]);

  const toggleBookmark = (articleId) => {
    const newBookmarks = new Set(bookmarkedArticles);
    if (newBookmarks.has(articleId)) {
      newBookmarks.delete(articleId);
    } else {
      newBookmarks.add(articleId);
    }
    setBookmarkedArticles(newBookmarks);
  };

  const nextFeatured = () => {
    setCurrentFeatured((prev) => (prev === mockData.featuredArticles.length - 1 ? 0 : prev + 1));
  };

  const prevFeatured = () => {
    setCurrentFeatured((prev) => (prev === 0 ? mockData.featuredArticles.length - 1 : prev - 1));
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  // Science-specific components
  const ScienceArticleCard = ({ article, featured = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group cursor-pointer ${featured ? 'col-span-2' : ''}`}
    >
      <Card hover className="h-full overflow-hidden">
        <div className={`flex ${featured ? 'flex-col lg:flex-row' : 'flex-col'} h-full`}>
          <div className={`relative overflow-hidden ${featured ? 'lg:w-1/2' : 'w-full'}`}>
            <img 
              src={article.image} 
              alt={article.title}
              className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                featured ? 'h-64 lg:h-full' : 'h-48'
              }`}
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge color={categories.find(cat => cat.id === article.category)?.color}>
                {categories.find(cat => cat.id === article.category)?.name}
              </Badge>
              {article.peerReviewed && <Badge color="emerald">Peer Reviewed</Badge>}
              {article.trending && <Badge color="amber">Trending</Badge>}
            </div>
            <div className="absolute top-3 right-3">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(article.id);
                }}
                className="w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <Bookmark 
                  size={16} 
                  className={bookmarkedArticles.has(article.id) ? 'fill-blue-500 text-blue-500' : ''} 
                />
              </button>
            </div>
          </div>
          
          <div className={`p-6 flex flex-col ${featured ? 'lg:w-1/2' : ''}`}>
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={article.authorImage} 
                alt={article.author}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {article.author}
                </div>
                <div className="text-xs text-gray-500">{article.authorTitle}</div>
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
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{formatTimeAgo(article.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{article.readTime} min read</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Eye size={14} />
                  <span>{(article.views / 1000).toFixed(1)}k</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle size={14} />
                  <span>{article.comments}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const ResearchSpotlightCard = ({ research }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group cursor-pointer"
    >
      <Card hover variant="gradient" className="overflow-hidden">
        <div className="relative h-32 overflow-hidden">
          <img 
            src={research.image} 
            alt={research.institution}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 text-white">
            <div className="font-bold text-sm">{research.institution}</div>
            <div className="text-xs opacity-90">{research.field}</div>
          </div>
        </div>
        
        <div className="p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2">
            {research.title}
          </h4>
          <div className="flex items-center justify-between">
            <Badge color="blue" className="text-xs">
              {research.status}
            </Badge>
            <Button variant="ghost" size="sm">
              Learn More
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const ScienceFactCard = ({ fact }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">💡</div>
        <div className="flex-1">
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
            {fact.fact}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <Badge color="gray">{fact.category}</Badge>
            <span>Source: {fact.source}</span>
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
            src={mockData.featuredArticles[currentFeatured]?.image} 
            alt={mockData.featuredArticles[currentFeatured]?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="max-w-4xl">
              <Badge color="blue" className="mb-4">
                <Crown size={12} className="mr-1" />
                FEATURED RESEARCH
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {mockData.featuredArticles[currentFeatured]?.title}
              </h2>
              <p className="text-lg text-gray-200 mb-6 max-w-2xl">
                {mockData.featuredArticles[currentFeatured]?.excerpt}
              </p>
              
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={mockData.featuredArticles[currentFeatured]?.authorImage} 
                    alt={mockData.featuredArticles[currentFeatured]?.author}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold">{mockData.featuredArticles[currentFeatured]?.author}</div>
                    <div className="text-sm text-gray-300">
                      {mockData.featuredArticles[currentFeatured]?.authorTitle}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{mockData.featuredArticles[currentFeatured]?.readTime} min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye size={16} />
                    <span>{(mockData.featuredArticles[currentFeatured]?.views / 1000).toFixed(1)}k views</span>
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
                  Share Research
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
        {mockData.featuredArticles.map((_, index) => (
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-violet-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
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
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Microscope size={32} className="text-white" />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-400">Loading scientific discoveries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-violet-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
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
              SCIENCE & DISCOVERY
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Exploring the
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Frontiers of Science
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Evidence-based research, breakthrough discoveries, and expert analysis from the world of science
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Scientific Disciplines</h2>
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
                  <Icon size={20} />
                  <span className="font-medium text-sm text-center">{category.name}</span>
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

        {/* Latest Discoveries */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Latest Discoveries
            </h2>
            <Button variant="outline">
              View All
              <ExternalLink size={14} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestDiscoveries.map((discovery) => (
              <ScienceArticleCard key={discovery.id} article={discovery} />
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
                  {activeCategory === 'all' ? 'All Scientific Content' : categories.find(c => c.id === activeCategory)?.name}
                </h2>
                <span className="text-gray-500">({filteredArticles.length} articles)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map((article) => (
                  <ScienceArticleCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar - 1/4 width */}
          <div className="space-y-8">
            {/* Science News */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={20} className="text-amber-600" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Science News</h3>
                </div>
                <div className="space-y-4">
                  {scienceNews.map((news) => (
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

            {/* Research Spotlights */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target size={20} className="text-purple-600" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Research Spotlights</h3>
                </div>
                <div className="space-y-4">
                  {researchSpotlights.map((research) => (
                    <ResearchSpotlightCard key={research.id} research={research} />
                  ))}
                </div>
              </div>
            </Card>

            {/* Science Facts */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain size={20} className="text-emerald-600" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Did You Know?</h3>
                </div>
                <div className="space-y-4">
                  {mockData.scienceFacts.map((fact) => (
                    <ScienceFactCard key={fact.id} fact={fact} />
                  ))}
                </div>
              </div>
            </Card>

            {/* Newsletter */}
            <Card variant="gradient">
              <div className="p-6 text-center">
                <FlaskConical size={32} className="text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Science Digest</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Get weekly research summaries and scientific breakthroughs delivered to your inbox
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
          </div>
        </div>

        {/* Scientific Integrity Section */}
        <section className="mt-12">
          <Card variant="elevated" className="p-8">
            <div className="text-center mb-8">
              <Badge color="blue" className="mb-4">
                <Microscope size={14} className="mr-1" />
                SCIENTIFIC INTEGRITY
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Trusted Scientific Authority
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                All our content is reviewed by subject matter experts and based on peer-reviewed research and verified scientific evidence
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Peer-Reviewed', desc: 'Content based on published scientific literature', icon: '📚' },
                { title: 'Expert Verified', desc: 'Reviewed by PhDs and field specialists', icon: '👨‍🔬' },
                { title: 'Evidence-Based', desc: 'Supported by empirical data and research', icon: '📊' }
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

export default SciencePage;