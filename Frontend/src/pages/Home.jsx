import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Spinner, Carousel, Tabs, Modal } from 'flowbite-react';
import { 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  Bookmark, 
  TrendingUp, 
  Zap, 
  Calendar,
  User,
  ArrowRight,
  Play,
  Search,
  Filter,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const categories = [
    { id: 'all', name: 'All', icon: '✨' },
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'lifestyle', name: 'Lifestyle', icon: '🌟' },
    { id: 'travel', name: 'Travel', icon: '✈️' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  ];

  useEffect(() => {
    fetchPublishedPosts();
    fetchTrendingPosts();
  }, []);

  const fetchPublishedPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/post/get-post/publised');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch posts');
      }
      
      setPosts(data);
      setFeaturedPosts(data.filter(post => post.featured).slice(0, 3));
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingPosts = async () => {
    // Simulate trending posts (in real app, this would be based on views/likes)
    try {
      const response = await fetch('/api/post/get-post/publised');
      const data = await response.json();
      
      if (response.ok) {
        const trending = data
          .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
          .slice(0, 5);
        setTrendingPosts(trending);
      }
    } catch (error) {
      console.error('Error fetching trending posts:', error);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || 
      post.category?.name?.toLowerCase() === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getReadingTime = (content) => {
    const words = content?.split(' ').length || 200;
    return Math.max(1, Math.ceil(words / 200));
  };

  const PostCard = ({ post, featured = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        className={`group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] ${
          featured ? 'featured-post' : ''
        }`}
      >
        {/* Cover Image */}
        {post.coverImage?.url && (
          <div className="relative overflow-hidden rounded-lg mb-4">
            <img 
              src={post.coverImage.url} 
              alt={post.coverImage.altText || post.title}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
            {featured && (
              <Badge color="purple" className="absolute top-3 left-3">
                <Sparkles size={12} className="mr-1" />
                Featured
              </Badge>
            )}
          </div>
        )}

        {/* Content */}
        <div className="space-y-3">
          {/* Category and Date */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              {post.category && (
                <Badge color="blue" size="sm">
                  {post.category.name}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(post.createdAt)}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
              {post.excerpt}
            </p>
          )}

          {/* Author and Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              {post.author?.profilePicture ? (
                <img 
                  src={post.author.profilePicture} 
                  alt={post.author.username}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <User size={16} className="text-gray-400" />
              )}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {post.author?.username}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                {getReadingTime(post.content)} min
              </div>
              <div className="flex items-center gap-1">
                <Eye size={12} />
                {post.viewCount || 0}
              </div>
              <div className="flex items-center gap-1">
                <Heart size={12} />
                {post.likeCount || 0}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const TrendingPostCard = ({ post, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <span>{post.author?.username}</span>
            <span>•</span>
            <span>{getReadingTime(post.content)} min read</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Eye size={12} />
          {post.viewCount || 0}
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge color="blue" className="mb-4 mx-auto">
                <Zap size={14} className="mr-1" />
                Welcome to Our Blog
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                Discover{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Amazing
                </span>{' '}
                Stories
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Explore thought-provoking articles, trending topics, and inspiring stories 
                from passionate writers around the world.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for articles, topics, or authors..."
                  className="w-full px-6 py-4 pl-12 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onClick={() => setShowSearchModal(true)}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-gray-400"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {posts.length}+ Published Articles
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                50+ Expert Writers
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                1M+ Monthly Readers
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Posts Carousel */}
      {featuredPosts.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold text-gray-900 dark:text-white"
              >
                Featured Stories
              </motion.h2>
              <Button color="light" className="flex items-center gap-2">
                View All
                <ArrowRight size={16} />
              </Button>
            </div>

            <Carousel 
              slideInterval={5000}
              indicators={false}
              className="rounded-2xl overflow-hidden"
            >
              {featuredPosts.map((post, index) => (
                <div key={post._id} className="relative h-96 md:h-[500px]">
                  <img 
                    src={post.coverImage?.url || '/default-cover.jpg'} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <Badge color="purple" className="mb-4">
                      Featured
                    </Badge>
                    <h3 className="text-2xl md:text-4xl font-bold mb-4 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-200 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <span>{post.author?.username}</span>
                        <span>•</span>
                        <span>{formatDate(post.createdAt)}</span>
                        <span>•</span>
                        <span>{getReadingTime(post.content)} min read</span>
                      </div>
                      <Button gradientDuoTone="purpleToBlue">
                        Read Story
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Posts Grid - 3/4 width */}
            <div className="lg:col-span-3">
              {/* Header with Filters */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                >
                  Latest Stories
                </motion.h2>
                
                <div className="flex flex-wrap gap-4">
                  {/* View Toggle */}
                  <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    <Button
                      size="xs"
                      color={viewMode === 'grid' ? 'blue' : 'light'}
                      onClick={() => setViewMode('grid')}
                    >
                      Grid
                    </Button>
                    <Button
                      size="xs"
                      color={viewMode === 'list' ? 'blue' : 'light'}
                      onClick={() => setViewMode('list')}
                    >
                      List
                    </Button>
                  </div>

                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Posts Grid/List */}
              <AnimatePresence mode="wait">
                {filteredPosts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <div className="text-gray-400 mb-4">
                      <Search size={64} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No posts found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Try adjusting your search or filters
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                        key={viewMode}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={
                          viewMode === 'grid' 
                            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                            : 'space-y-6'
                        }
                      >
                        {filteredPosts.map((post, index) => (
                          <PostCard key={post._id} post={post} />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

            {/* Sidebar - 1/4 width */}
            <div className="lg:col-span-1 space-y-6">
              {/* Trending Posts */}
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={20} className="text-orange-500" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Trending Now</h3>
                </div>
                <div className="space-y-2">
                  {trendingPosts.map((post, index) => (
                    <TrendingPostCard key={post._id} post={post} index={index} />
                  ))}
                </div>
              </Card>

              {/* Newsletter */}
              <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <div className="text-center space-y-4">
                  <Zap size={32} className="mx-auto" />
                  <h3 className="font-bold text-lg">Stay Updated</h3>
                  <p className="text-blue-100 text-sm">
                    Get the latest stories and insights delivered to your inbox
                  </p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <Button color="light" className="w-full">
                      Subscribe
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Popular Categories */}
              <Card>
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Popular Topics</h3>
                <div className="space-y-3">
                  {categories.slice(1).map(category => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{category.icon}</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {category.name}
                        </span>
                      </div>
                      <Badge color="gray" size="sm">
                        {posts.filter(p => p.category?.name?.toLowerCase() === category.id).length}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Share Your Story?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join our community of writers and reach thousands of readers worldwide
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" color="light">
                Start Writing
              </Button>
              <Button size="lg" color="light" variant="outline">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Modal */}
      <Modal show={showSearchModal} onClose={() => setShowSearchModal(false)} size="4xl">
        <Modal.Header>
          <div className="flex items-center gap-2">
            <Search size={20} />
            Search Articles
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="w-full px-4 py-3 text-lg border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Badge key={category.id} color="gray" className="cursor-pointer">
                  {category.icon} {category.name}
                </Badge>
              ))}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default HomePage;