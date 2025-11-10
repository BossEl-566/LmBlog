import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Utensils, 
  ChefHat, 
  Coffee, 
  Heart,
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
  Timer,
  Flame,
  Salad
} from 'lucide-react';

// Custom Components for Food Style
const Card = ({ children, className = '', hover = false, variant = 'default' }) => {
  const variants = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    gradient: 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
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
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-orange-600 hover:bg-orange-700 text-white',
    secondary: 'bg-red-600 hover:bg-red-700 text-white',
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

const Badge = ({ children, color = 'orange', className = '' }) => {
  const colors = {
    orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
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

// Main Food Blog Page Component
const FoodPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [latestRecipes, setLatestRecipes] = useState([]);
  const [cookingTips, setCookingTips] = useState([]);
  const [foodNews, setFoodNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState(new Set());
  const [savedRecipes, setSavedRecipes] = useState(new Set());
  const [currentFeatured, setCurrentFeatured] = useState(0);

  const categories = [
    { id: 'all', name: 'All Recipes', icon: Utensils, color: 'orange', count: 245 },
    { id: 'dinner', name: 'Dinner', icon: ChefHat, color: 'red', count: 68 },
    { id: 'dessert', name: 'Dessert', icon: Coffee, color: 'violet', count: 42 },
    { id: 'healthy', name: 'Healthy', icon: Salad, color: 'emerald', count: 53 },
    { id: 'quick', name: 'Quick Meals', icon: Timer, color: 'amber', count: 47 },
    { id: 'baking', name: 'Baking', icon: Flame, color: 'orange', count: 35 }
  ];

  // Mock food blog data
  const mockData = {
    featuredRecipes: [
      {
        id: 1,
        title: 'Creamy Mushroom Risotto with Truffle Oil',
        excerpt: 'The ultimate comfort food with rich, earthy flavors and creamy texture that will transport you to Italy.',
        content: 'This classic Italian dish requires patience and attention, but the results are absolutely worth it. The key to perfect risotto is gradual addition of warm broth and constant stirring...',
        image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&h=500&fit=crop',
        category: 'dinner',
        author: 'Chef Marco',
        authorImage: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=100&h=100&fit=crop',
        cookTime: 45,
        difficulty: 'Intermediate',
        servings: 4,
        rating: 4.9,
        reviews: 128,
        calories: 420,
        ingredients: 12,
        publishedAt: '2024-03-15T10:00:00Z',
        trending: true
      },
      {
        id: 2,
        title: 'Decadent Chocolate Lava Cake',
        excerpt: 'Warm, gooey chocolate center surrounded by rich, moist cake - perfect for any celebration.',
        content: 'This impressive dessert looks complicated but is surprisingly easy to make. The secret is in the timing - just enough to set the edges while keeping the center molten...',
        image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&h=500&fit=crop',
        category: 'dessert',
        author: 'Pastry Chef Anna',
        authorImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
        cookTime: 25,
        difficulty: 'Easy',
        servings: 6,
        rating: 4.8,
        reviews: 89,
        calories: 380,
        ingredients: 8,
        publishedAt: '2024-03-14T14:30:00Z',
        trending: true
      }
    ],
    latestRecipes: [
      {
        id: 3,
        title: 'Mediterranean Quinoa Bowl with Lemon Herb Dressing',
        excerpt: 'Fresh, vibrant, and packed with protein - the perfect healthy lunch option.',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop',
        category: 'healthy',
        author: 'Nutritionist Sarah',
        cookTime: 20,
        difficulty: 'Easy',
        rating: 4.7,
        reviews: 45,
        calories: 320,
        publishedAt: '2024-03-13T09:15:00Z'
      },
      {
        id: 4,
        title: '15-Minute Garlic Shrimp Pasta',
        excerpt: 'Quick, elegant, and bursting with flavor - perfect for busy weeknights.',
        image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&h=250&fit=crop',
        category: 'quick',
        author: 'Chef Michael',
        cookTime: 15,
        difficulty: 'Easy',
        rating: 4.6,
        reviews: 67,
        calories: 450,
        publishedAt: '2024-03-12T16:45:00Z'
      },
      {
        id: 5,
        title: 'Artisan Sourdough Bread',
        excerpt: 'Crusty exterior, soft interior - master the art of sourdough baking.',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=250&fit=crop',
        category: 'baking',
        author: 'Baker Tom',
        cookTime: 180,
        difficulty: 'Advanced',
        rating: 4.9,
        reviews: 34,
        calories: 120,
        publishedAt: '2024-03-11T11:20:00Z'
      }
    ],
    cookingTips: [
      {
        id: 1,
        title: 'Perfect Rice Every Time',
        description: 'Use the finger method: water should reach first knuckle',
        icon: '🍚',
        category: 'basics'
      },
      {
        id: 2,
        title: 'Sharper Knife Skills',
        description: 'Keep knives sharp and use claw grip for safety',
        icon: '🔪',
        category: 'technique'
      },
      {
        id: 3,
        title: 'Flavor Building',
        description: 'Layer flavors by cooking ingredients separately',
        icon: '👃',
        category: 'flavor'
      }
    ],
    foodNews: [
      {
        id: 1,
        title: 'Sustainable Farming Practices Gain Popularity',
        excerpt: 'Local farmers adopt regenerative agriculture methods',
        category: 'sustainability',
        timeAgo: '2 hours ago',
        source: 'Food Network'
      },
      {
        id: 2,
        title: 'New Study Reveals Benefits of Fermented Foods',
        excerpt: 'Research shows improved gut health from traditional ferments',
        category: 'health',
        timeAgo: '5 hours ago',
        source: 'Nutrition Journal'
      }
    ],
    trendingIngredients: [
      {
        id: 1,
        name: 'Miso Paste',
        trend: '+45% searches',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop'
      },
      {
        id: 2,
        name: 'Tahini',
        trend: '+38% interest',
        image: 'https://images.unsplash.com/photo-1594489573268-46b8d6a99564?w=100&h=100&fit=crop'
      },
      {
        id: 3,
        name: 'Za\'atar',
        trend: '+52% usage',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100&h=100&fit=crop'
      }
    ]
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setFeaturedRecipes(mockData.featuredRecipes);
      setLatestRecipes(mockData.latestRecipes);
      setCookingTips(mockData.cookingTips);
      setFoodNews(mockData.foodNews);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredRecipes = useMemo(() => {
    const allRecipes = [...mockData.featuredRecipes, ...mockData.latestRecipes];
    if (activeCategory === 'all') return allRecipes;
    return allRecipes.filter(recipe => recipe.category === activeCategory);
  }, [activeCategory]);

  const toggleBookmark = (recipeId) => {
    const newBookmarks = new Set(bookmarkedRecipes);
    if (newBookmarks.has(recipeId)) {
      newBookmarks.delete(recipeId);
    } else {
      newBookmarks.add(recipeId);
    }
    setBookmarkedRecipes(newBookmarks);
  };

  const toggleSave = (recipeId) => {
    const newSaves = new Set(savedRecipes);
    if (newSaves.has(recipeId)) {
      newSaves.delete(recipeId);
    } else {
      newSaves.add(recipeId);
    }
    setSavedRecipes(newSaves);
  };

  const nextFeatured = () => {
    setCurrentFeatured((prev) => (prev === mockData.featuredRecipes.length - 1 ? 0 : prev + 1));
  };

  const prevFeatured = () => {
    setCurrentFeatured((prev) => (prev === 0 ? mockData.featuredRecipes.length - 1 : prev - 1));
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  // Food-specific components
  const RecipeCard = ({ recipe, featured = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group cursor-pointer ${featured ? 'col-span-2' : ''}`}
    >
      <Card hover className="h-full overflow-hidden">
        <div className={`flex ${featured ? 'flex-col lg:flex-row' : 'flex-col'} h-full`}>
          <div className={`relative overflow-hidden ${featured ? 'lg:w-1/2' : 'w-full'}`}>
            <img 
              src={recipe.image} 
              alt={recipe.title}
              className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                featured ? 'h-64 lg:h-full' : 'h-48'
              }`}
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge color={categories.find(cat => cat.id === recipe.category)?.color}>
                {categories.find(cat => cat.id === recipe.category)?.name}
              </Badge>
              <Badge color="gray">
                {recipe.difficulty}
              </Badge>
            </div>
            <div className="absolute top-3 right-3 flex gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(recipe.id);
                }}
                className="w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <Bookmark 
                  size={16} 
                  className={bookmarkedRecipes.has(recipe.id) ? 'fill-orange-500 text-orange-500' : ''} 
                />
              </button>
            </div>
            <div className="absolute bottom-3 left-3">
              <div className="flex items-center gap-2 text-white text-sm">
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{recipe.rating}</span>
                </div>
                <span>({recipe.reviews})</span>
              </div>
            </div>
          </div>
          
          <div className={`p-6 flex flex-col ${featured ? 'lg:w-1/2' : ''}`}>
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={recipe.authorImage} 
                alt={recipe.author}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white text-sm">
                  {recipe.author}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar size={12} />
                  <span>{formatTimeAgo(recipe.publishedAt)}</span>
                </div>
              </div>
            </div>

            <h3 className={`font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors mb-3 ${
              featured ? 'text-2xl line-clamp-2' : 'text-xl line-clamp-2'
            }`}>
              {recipe.title}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-1">
              {recipe.excerpt}
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-4 text-center text-sm text-gray-500">
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock size={14} />
                  <span className="font-semibold">{recipe.cookTime}min</span>
                </div>
                <div className="text-xs">Cook Time</div>
              </div>
              <div>
                <div className="font-semibold mb-1">{recipe.servings}</div>
                <div className="text-xs">Servings</div>
              </div>
              <div>
                <div className="font-semibold mb-1">{recipe.calories}</div>
                <div className="text-xs">Calories</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Button size="sm">
                View Recipe
              </Button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSave(recipe.id);
                }}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                <Heart 
                  size={16} 
                  className={savedRecipes.has(recipe.id) ? 'fill-red-600 text-red-600' : ''} 
                />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const CookingTipCard = ({ tip }) => (
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
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              {tip.description}
            </p>
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
            src={mockData.featuredRecipes[currentFeatured]?.image} 
            alt={mockData.featuredRecipes[currentFeatured]?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="max-w-4xl">
              <Badge color="orange" className="mb-4">
                <Crown size={12} className="mr-1" />
                RECIPE OF THE WEEK
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {mockData.featuredRecipes[currentFeatured]?.title}
              </h2>
              <p className="text-lg text-gray-200 mb-6 max-w-2xl">
                {mockData.featuredRecipes[currentFeatured]?.excerpt}
              </p>
              
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={mockData.featuredRecipes[currentFeatured]?.authorImage} 
                    alt={mockData.featuredRecipes[currentFeatured]?.author}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-semibold">{mockData.featuredRecipes[currentFeatured]?.author}</div>
                    <div className="text-sm text-gray-300">
                      {mockData.featuredRecipes[currentFeatured]?.difficulty} • {mockData.featuredRecipes[currentFeatured]?.cookTime}min
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span>{mockData.featuredRecipes[currentFeatured]?.rating} ({mockData.featuredRecipes[currentFeatured]?.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>{mockData.featuredRecipes[currentFeatured]?.servings} servings</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Button size="lg">
                  <Play size={20} className="mr-2" />
                  View Recipe
                </Button>
                <Button variant="outline" className="text-white border-white hover:bg-white/20">
                  <Share2 size={16} className="mr-2" />
                  Share Recipe
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
        {mockData.featuredRecipes.map((_, index) => (
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-red-900/20 flex items-center justify-center">
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
            className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Utensils size={32} className="text-white" />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-400">Loading delicious recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-red-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Badge color="orange" className="mx-auto">
              <Sparkles size={14} className="mr-1" />
              FOOD & RECIPES
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Delicious
              <span className="block bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Recipes
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover amazing recipes, cooking tips, and culinary inspiration from professional chefs and home cooks
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recipe Categories</h2>
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
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg transform scale-105'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium text-sm text-center">{category.name}</span>
                  <Badge 
                    color={activeCategory === category.id ? "red" : "gray"}
                    className={activeCategory === category.id ? "bg-white/20 text-white border-0" : ""}
                  >
                    {category.count}
                  </Badge>
                </button>
              );
            })}
          </div>
        </section>

        {/* Latest Recipes */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Latest Recipes
            </h2>
            <Button variant="outline">
              View All
              <ExternalLink size={14} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Recipes Grid - 3/4 width */}
          <div className="lg:col-span-3">
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeCategory === 'all' ? 'All Recipes' : categories.find(c => c.id === activeCategory)?.name}
                </h2>
                <span className="text-gray-500">({filteredRecipes.length} recipes)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar - 1/4 width */}
          <div className="space-y-8">
            {/* Cooking Tips */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ChefHat size={20} className="text-orange-600" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Pro Tips</h3>
                </div>
                <div className="space-y-4">
                  {cookingTips.map((tip) => (
                    <CookingTipCard key={tip.id} tip={tip} />
                  ))}
                </div>
              </div>
            </Card>

            {/* Food News */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={20} className="text-red-600" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Food News</h3>
                </div>
                <div className="space-y-4">
                  {foodNews.map((news) => (
                    <div key={news.id} className="group cursor-pointer">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-orange-600 transition-colors text-sm mb-1">
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

            {/* Trending Ingredients */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Flame size={20} className="text-amber-600" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Trending Ingredients</h3>
                </div>
                <div className="space-y-4">
                  {mockData.trendingIngredients.map((ingredient) => (
                    <div key={ingredient.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                      <img 
                        src={ingredient.image} 
                        alt={ingredient.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white text-sm">
                          {ingredient.name}
                        </div>
                        <div className="text-xs text-emerald-600">{ingredient.trend}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Newsletter */}
            <Card variant="gradient">
              <div className="p-6 text-center">
                <Utensils size={32} className="text-orange-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Weekly Recipes</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Get new recipes and cooking tips delivered to your inbox every week
                </p>
                <div className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <Button className="w-full">
                    Subscribe
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Chef's Corner Section */}
        <section className="mt-12">
          <Card variant="elevated" className="p-8">
            <div className="text-center mb-8">
              <Badge color="orange" className="mb-4">
                <ChefHat size={14} className="mr-1" />
                CHEF'S CORNER
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Professional Kitchen Secrets
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Learn techniques and tips from professional chefs that will transform your home cooking
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Knife Skills', desc: 'Master proper cutting techniques for efficiency and safety', icon: '🔪' },
                { title: 'Flavor Pairing', desc: 'Learn which ingredients complement each other perfectly', icon: '👃' },
                { title: 'Plating Art', desc: 'Transform your dishes with beautiful presentation', icon: '🍽️' }
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

export default FoodPage;