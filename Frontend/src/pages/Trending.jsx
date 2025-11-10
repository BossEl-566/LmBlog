import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge, Select, Spinner, Modal, Progress, ButtonGroup } from 'flowbite-react';
import { 
  TrendingUp, 
  Flame, 
  Zap, 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  Bookmark, 
  Users,
  Calendar,
  MapPin,
  Star,
  ArrowUp,
  BarChart3,
  Filter,
  Play,
  Sparkles,
  Rocket,
  Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Custom Tabs Components
const Tabs = ({ children, style = 'default', className = '' }) => {
  const baseStyles = style === 'underline' 
    ? 'border-b border-gray-200 dark:border-gray-700'
    : 'bg-gray-50 dark:bg-gray-800 rounded-lg p-1';
  
  return (
    <div className={`${baseStyles} ${className}`}>
      {children}
    </div>
  );
};

const TabsList = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-2 mb-6 ${className}`}>
      {children}
    </div>
  );
};

const TabsTrigger = ({ 
  children, 
  active = false, 
  onClick, 
  icon: Icon,
  className = '' 
}) => {
  const baseStyles = active
    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-blue-600 shadow-sm'
    : 'bg-transparent text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-white';
  
  const styleClasses = 'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-all duration-200 rounded-t-lg';
  
  return (
    <button
      className={`${styleClasses} ${baseStyles} ${className}`}
      onClick={onClick}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

const TabsContent = ({ children, active = false, className = '' }) => {
  if (!active) return null;
  
  return (
    <div className={className}>
      {children}
    </div>
  );
};

const TabsItem = ({ 
  children, 
  title, 
  active = false, 
  icon,
  onClick,
  ...props 
}) => {
  if (props.active !== undefined) {
    return (
      <TabsTrigger 
        active={active} 
        onClick={onClick}
        icon={icon}
        {...props}
      >
        {title}
      </TabsTrigger>
    );
  }
  
  return children;
};

const AdvancedTrendingPage = () => {
  const [trendingData, setTrendingData] = useState({
    posts: [],
    topics: [],
    authors: []
  });
  const [timeRange, setTimeRange] = useState('week');
  const [category, setCategory] = useState('all');
  const [region, setRegion] = useState('global');
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [viewMode, setViewMode] = useState('cards');
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [activeTab, setActiveTab] = useState('trending-posts');

  // Mock data for demonstration
  const mockPosts = [
    {
      id: 1,
      title: 'The Future of Artificial Intelligence in Healthcare',
      excerpt: 'Exploring how AI is revolutionizing medical diagnosis and treatment planning with unprecedented accuracy.',
      coverImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      author: { username: 'TechInnovator' },
      readingTime: 8,
      views: 12500,
      likes: 842,
      engagementRate: 78,
      growth: 45
    },
    {
      id: 2,
      title: 'Sustainable Energy Solutions for Urban Development',
      excerpt: 'Innovative approaches to integrating renewable energy sources in modern city infrastructure.',
      coverImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop',
      author: { username: 'EcoWarrior' },
      readingTime: 6,
      views: 8900,
      likes: 621,
      engagementRate: 65,
      growth: 32
    },
    {
      id: 3,
      title: 'Web3 and the Decentralized Internet Revolution',
      excerpt: 'Understanding the impact of blockchain technology on the future of digital interactions.',
      coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop',
      author: { username: 'CryptoPioneer' },
      readingTime: 10,
      views: 15600,
      likes: 1123,
      engagementRate: 82,
      growth: 67
    }
  ];

  // Mock APIs - In production, these would be real API calls
  const APIs = {
    trendingPosts: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockPosts;
    },
    
    googleTrends: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        topics: [
          { name: 'Artificial Intelligence', growth: 85, volume: 1.2e6 },
          { name: 'Sustainable Energy', growth: 72, volume: 890000 },
          { name: 'Web3 Development', growth: 68, volume: 760000 },
          { name: 'Mental Wellness', growth: 63, volume: 540000 },
          { name: 'Remote Work', growth: 58, volume: 430000 },
        ]
      };
    },

    newsAPI: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        breaking: [
          { title: 'Major Tech Breakthrough Announced', source: 'TechCrunch', time: '2h ago' },
          { title: 'Global Climate Summit Updates', source: 'BBC News', time: '1h ago' },
        ]
      };
    },

    socialMetrics: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        platforms: [
          { name: 'Twitter', trendCount: 45, engagement: 1.2e6 },
          { name: 'LinkedIn', trendCount: 28, engagement: 890000 },
          { name: 'Reddit', trendCount: 32, engagement: 760000 },
        ]
      };
    }
  };

  useEffect(() => {
    fetchTrendingData();
    
    // Set up real-time updates
    let interval;
    if (realTimeUpdates) {
      interval = setInterval(fetchTrendingData, 30000); // Update every 30 seconds
    }

    return () => clearInterval(interval);
  }, [timeRange, category, region, realTimeUpdates]);

  const fetchTrendingData = async () => {
    setLoading(true);
    try {
      const [posts, trends, news, social] = await Promise.all([
        APIs.trendingPosts(),
        APIs.googleTrends(),
        APIs.newsAPI(),
        APIs.socialMetrics()
      ]);

      setTrendingData({
        posts: posts || [],
        topics: trends.topics,
        breakingNews: news.breaking,
        socialMetrics: social.platforms,
        // Generate trending authors from posts
        authors: posts.slice(0, 5).map(post => ({
          ...post.author,
          id: Math.random(),
          followers: Math.floor(Math.random() * 10000) + 1000,
          engagement: Math.floor(Math.random() * 30) + 60,
          growth: Math.floor(Math.random() * 50) + 20,
          postCount: Math.floor(Math.random() * 20) + 5
        }))
      });
    } catch (error) {
      console.error('Error fetching trending data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Advanced analytics data
  const analyticsData = useMemo(() => ({
    engagement: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Engagement Rate',
          data: [65, 78, 82, 79, 85, 92, 88],
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4,
        },
      ],
    },
    topicsDistribution: {
      labels: trendingData.topics.slice(0, 5).map(t => t.name),
      datasets: [
        {
          data: trendingData.topics.slice(0, 5).map(t => t.volume / 10000),
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
        },
      ],
    },
  }), [trendingData.topics]);

  const TrendingPostCard = ({ post, rank }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: rank * 0.1 }}
      className="group"
    >
      <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        {/* Rank Badge */}
        <div className={`absolute -top-3 -left-3 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
          rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg' :
          rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
          rank === 3 ? 'bg-gradient-to-br from-orange-400 to-red-500' :
          'bg-gradient-to-br from-blue-500 to-purple-600'
        }`}>
          {rank}
        </div>

        {/* Growth Indicator */}
        {post.growth > 0 && (
          <Badge color="green" className="absolute top-3 right-3">
            <ArrowUp size={12} />
            {post.growth}%
          </Badge>
        )}

        <div className="flex gap-4">
          {/* Cover Image */}
          {post.coverImage && (
            <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mt-1">
                  {post.excerpt}
                </p>
              </div>
            </div>

            {/* Meta Information */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Users size={12} />
                  <span>{post.author?.username}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{post.readingTime} min</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Eye size={12} />
                  <span>{(post.views / 1000).toFixed(1)}k</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart size={12} />
                  <span>{post.likes}</span>
                </div>
              </div>
            </div>

            {/* Engagement Progress */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Engagement</span>
                <span>{post.engagementRate}%</span>
              </div>
              <Progress 
                progress={post.engagementRate} 
                color="blue"
                size="sm"
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const TrendingTopicCard = ({ topic, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
          index === 1 ? 'bg-gradient-to-br from-blue-500 to-purple-600' :
          'bg-gradient-to-br from-green-500 to-blue-500'
        }`}>
          <Flame size={16} className="text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {topic.name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {(topic.volume / 1000).toFixed(0)}K searches
          </p>
        </div>
      </div>
      
      <Badge color={topic.growth > 70 ? "green" : "blue"}>
        <TrendingUp size={12} />
        {topic.growth}% growth
      </Badge>
    </motion.div>
  );

  const TrendingAuthorCard = ({ author, index }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="relative inline-block mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto">
          {author.username?.charAt(0).toUpperCase()}
        </div>
        {index < 3 && (
          <div className="absolute -top-1 -right-1">
            <Crown size={16} className={
              index === 0 ? 'text-yellow-500' :
              index === 1 ? 'text-gray-400' :
              'text-orange-500'
            } />
          </div>
        )}
      </div>

      <h4 className="font-bold text-gray-900 dark:text-white mb-1">
        {author.username}
      </h4>
      <p className="text-blue-600 dark:text-blue-400 text-sm mb-3">
        {author.postCount} articles
      </p>

      <div className="flex justify-center gap-4 text-xs text-gray-600 dark:text-gray-400 mb-4">
        <div className="text-center">
          <div className="font-bold text-gray-900 dark:text-white">{author.followers}</div>
          <div>Followers</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-gray-900 dark:text-white">{author.engagement}%</div>
          <div>Engagement</div>
        </div>
      </div>

      <Badge color="green" size="sm">
        <TrendingUp size={10} />
        {author.growth}% growth
      </Badge>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Rocket size={48} className="text-blue-600 mx-auto mb-4" />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-400">Loading trending insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Header */}
      <div className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <Badge gradientMonochrome="cyan" className="mx-auto">
              <Zap size={14} className="mr-1" />
              LIVE TRENDING DATA
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white">
              What's{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Trending
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
              Real-time insights into the most engaging content, trending topics, and rising creators across the platform
            </p>

            {/* Live Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-8 text-sm"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-700 dark:text-gray-300">Live Updates</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                <Flame size={14} className="text-orange-500" />
                <span className="text-gray-700 dark:text-gray-300">{trendingData.posts.length} Trending Posts</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                <Users size={14} className="text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300">{trendingData.authors.length} Rising Creators</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <Card className="border-0 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              <div className="flex flex-wrap gap-4">
                <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </Select>

                <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="all">All Categories</option>
                  <option value="technology">Technology</option>
                  <option value="business">Business</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="entertainment">Entertainment</option>
                </Select>

                <Select value={region} onChange={(e) => setRegion(e.target.value)}>
                  <option value="global">Global</option>
                  <option value="us">United States</option>
                  <option value="eu">Europe</option>
                  <option value="asia">Asia</option>
                </Select>
              </div>

              <div className="flex gap-4">
                <ButtonGroup>
                  <Button 
                    color={viewMode === 'cards' ? 'blue' : 'gray'}
                    onClick={() => setViewMode('cards')}
                  >
                    Cards
                  </Button>
                  <Button 
                    color={viewMode === 'list' ? 'blue' : 'gray'}
                    onClick={() => setViewMode('list')}
                  >
                    List
                  </Button>
                  <Button 
                    color={viewMode === 'analytics' ? 'blue' : 'gray'}
                    onClick={() => setViewMode('analytics')}
                  >
                    Analytics
                  </Button>
                </ButtonGroup>

                <Button
                  color={realTimeUpdates ? 'blue' : 'gray'}
                  onClick={() => setRealTimeUpdates(!realTimeUpdates)}
                >
                  <Zap size={16} className="mr-2" />
                  {realTimeUpdates ? 'Live' : 'Paused'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Trending Posts - 3/4 width */}
            <div className="xl:col-span-3 space-y-8">
              <Tabs style="underline">
                <TabsList>
                  <TabsTrigger 
                    active={activeTab === 'trending-posts'} 
                    onClick={() => setActiveTab('trending-posts')}
                    icon={Flame}
                  >
                    Trending Posts
                  </TabsTrigger>
                  <TabsTrigger 
                    active={activeTab === 'breaking-news'} 
                    onClick={() => setActiveTab('breaking-news')}
                    icon={Zap}
                  >
                    Breaking News
                  </TabsTrigger>
                  <TabsTrigger 
                    active={activeTab === 'analytics'} 
                    onClick={() => setActiveTab('analytics')}
                    icon={BarChart3}
                  >
                    Analytics
                  </TabsTrigger>
                </TabsList>

                <TabsContent active={activeTab === 'trending-posts'} className="space-y-6">
                  {trendingData.posts.map((post, index) => (
                    <TrendingPostCard key={post.id} post={post} rank={index + 1} />
                  ))}
                </TabsContent>

                <TabsContent active={activeTab === 'breaking-news'} className="space-y-4">
                  {trendingData.breakingNews?.map((news, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800"
                    >
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {news.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span>{news.source}</span>
                          <span>•</span>
                          <span>{news.time}</span>
                        </div>
                      </div>
                      <Button size="xs">
                        <Play size={14} />
                      </Button>
                    </motion.div>
                  ))}
                </TabsContent>

                <TabsContent active={activeTab === 'analytics'}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-lg">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-4">
                        Engagement Trends
                      </h4>
                      <Line 
                        data={analyticsData.engagement} 
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              display: false
                            }
                          }
                        }} 
                      />
                    </Card>

                    <Card className="border-0 shadow-lg">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-4">
                        Topics Distribution
                      </h4>
                      <Doughnut 
                        data={analyticsData.topicsDistribution} 
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              position: 'bottom'
                            }
                          }
                        }} 
                      />
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar - 1/4 width */}
            <div className="space-y-8">
              {/* Trending Topics */}
              <Card className="border-0 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={20} className="text-orange-500" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Hot Topics</h3>
                </div>
                <div className="space-y-3">
                  {trendingData.topics.map((topic, index) => (
                    <TrendingTopicCard key={topic.name} topic={topic} index={index} />
                  ))}
                </div>
              </Card>

              {/* Rising Authors */}
              <Card className="border-0 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Rocket size={20} className="text-purple-500" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Rising Creators</h3>
                </div>
                <div className="space-y-4">
                  {trendingData.authors.map((author, index) => (
                    <TrendingAuthorCard key={author.id} author={author} index={index} />
                  ))}
                </div>
              </Card>

              {/* Social Platform Trends */}
              <Card className="border-0 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Share2 size={20} className="text-blue-500" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Cross-Platform Trends</h3>
                </div>
                <div className="space-y-4">
                  {trendingData.socialMetrics?.map((platform, index) => (
                    <div key={platform.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {platform.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {platform.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {platform.trendCount} trends
                          </div>
                        </div>
                      </div>
                      <Badge color="blue">
                        {(platform.engagement / 1000).toFixed(0)}K
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Real-time Insights */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <div className="text-center space-y-4">
                  <Sparkles size={32} className="mx-auto" />
                  <h3 className="font-bold text-lg">Trending Insights</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Peak Engagement</span>
                      <span className="font-bold">2:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fastest Growing</span>
                      <span className="font-bold">AI & Tech</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Read Time</span>
                      <span className="font-bold">4.2 min</span>
                    </div>
                  </div>
                  <Button color="light" size="xs" className="w-full">
                    Get Detailed Report
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-8 right-8"
      >
        <Button
          gradientDuoTone="purpleToBlue"
          size="xl"
          className="rounded-full w-14 h-14 shadow-2xl"
          onClick={fetchTrendingData}
        >
          <Zap size={24} />
        </Button>
      </motion.div>
    </div>
  );
};

export default AdvancedTrendingPage;