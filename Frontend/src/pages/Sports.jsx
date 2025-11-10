import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Flame, 
  Users, 
  Calendar,
  MapPin,
  Clock,
  Eye,
  Heart,
  Share2,
  Play,
  TrendingUp,
  Star,
  Crown,
  Award,
  Target,
  Activity,
  BarChart3,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Video
} from 'lucide-react';

// Custom Components
const Card = ({ children, className = '', hover = false }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${hover ? 'hover:shadow-md transition-shadow duration-300' : ''} ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', icon: Icon, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-green-600 hover:bg-green-700 text-white',
    secondary: 'bg-orange-600 hover:bg-orange-700 text-white',
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
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

const Progress = ({ progress, color = 'green', size = 'md' }) => {
  const colors = {
    green: 'bg-green-600',
    red: 'bg-red-600',
    blue: 'bg-blue-600',
    yellow: 'bg-yellow-600',
    orange: 'bg-orange-600'
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

// Main Sports Page Component
const SportsPage = () => {
  const [activeSport, setActiveSport] = useState('all');
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFeatured, setCurrentFeatured] = useState(0);
  const [favoriteTeams, setFavoriteTeams] = useState(new Set());

  const sports = [
    { id: 'all', name: 'All Sports', icon: Trophy, count: 42 },
    { id: 'football', name: 'Football', icon: Users, count: 18 },
    { id: 'basketball', name: 'Basketball', icon: Target, count: 12 },
    { id: 'tennis', name: 'Tennis', icon: Activity, count: 6 },
    { id: 'cricket', name: 'Cricket', icon: Award, count: 4 },
    { id: 'baseball', name: 'Baseball', icon: BarChart3, count: 2 }
  ];

  // Mock sports data
  const mockData = {
    liveMatches: [
      {
        id: 1,
        sport: 'football',
        league: 'Premier League',
        teamA: { name: 'Manchester United', logo: '🔴', score: 2 },
        teamB: { name: 'Liverpool', logo: '🔴', score: 1 },
        minute: '78\'',
        status: 'live',
        viewers: 1250000,
        venue: 'Old Trafford'
      },
      {
        id: 2,
        sport: 'basketball',
        league: 'NBA',
        teamA: { name: 'Lakers', logo: '💜', score: 98 },
        teamB: { name: 'Warriors', logo: '🔵', score: 95 },
        quarter: '4Q',
        minute: '02:15',
        status: 'live',
        viewers: 890000,
        venue: 'Staples Center'
      },
      {
        id: 3,
        sport: 'tennis',
        league: 'ATP Tour',
        playerA: { name: 'Djokovic', score: 2, sets: [6, 4] },
        playerB: { name: 'Nadal', score: 0, sets: [3, 2] },
        status: 'live',
        viewers: 456000,
        venue: 'Rod Laver Arena'
      }
    ],
    upcomingMatches: [
      {
        id: 4,
        sport: 'football',
        league: 'Champions League',
        teamA: { name: 'Real Madrid', logo: '⚪' },
        teamB: { name: 'Bayern Munich', logo: '🔴' },
        date: '2024-03-20T20:00:00Z',
        venue: 'Santiago Bernabéu'
      },
      {
        id: 5,
        sport: 'cricket',
        league: 'IPL 2024',
        teamA: { name: 'Mumbai Indians', logo: '🔵' },
        teamB: { name: 'Chennai Super Kings', logo: '🟡' },
        date: '2024-03-22T14:30:00Z',
        venue: 'Wankhede Stadium'
      }
    ],
    teams: [
      {
        id: 1,
        name: 'Manchester City',
        sport: 'football',
        logo: '🔵',
        wins: 18,
        losses: 2,
        draws: 3,
        points: 57,
        position: 1,
        form: ['W', 'W', 'D', 'W', 'W']
      },
      {
        id: 2,
        name: 'Golden State Warriors',
        sport: 'basketball',
        logo: '🔵',
        wins: 42,
        losses: 15,
        points: 84,
        position: 2,
        form: ['W', 'L', 'W', 'W', 'W']
      },
      {
        id: 3,
        name: 'Los Angeles Lakers',
        sport: 'basketball',
        logo: '💜',
        wins: 38,
        losses: 19,
        points: 76,
        position: 4,
        form: ['W', 'W', 'L', 'W', 'L']
      }
    ],
    players: [
      {
        id: 1,
        name: 'Lionel Messi',
        sport: 'football',
        team: 'Inter Miami',
        position: 'Forward',
        stats: { goals: 12, assists: 8, rating: 9.2 },
        trending: true
      },
      {
        id: 2,
        name: 'LeBron James',
        sport: 'basketball',
        team: 'Los Angeles Lakers',
        position: 'Forward',
        stats: { points: 28.5, rebounds: 8.2, assists: 7.5, rating: 9.0 },
        trending: true
      },
      {
        id: 3,
        name: 'Novak Djokovic',
        sport: 'tennis',
        ranking: 1,
        stats: { titles: 24, wins: 45, losses: 3, rating: 9.4 },
        trending: false
      }
    ],
    news: [
      {
        id: 1,
        title: 'Historic Comeback in Champions League Quarterfinals',
        excerpt: 'Stunning turnaround sees underdog team advance to semifinals against all odds.',
        image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&h=250&fit=crop',
        category: 'football',
        timeAgo: '2 hours ago',
        trending: true
      },
      {
        id: 2,
        title: 'Record-Breaking Performance in NBA Regular Season',
        excerpt: 'Young star sets new scoring record in spectacular fashion.',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=250&fit=crop',
        category: 'basketball',
        timeAgo: '5 hours ago',
        trending: true
      }
    ],
    featured: [
      {
        id: 1,
        title: 'Champions League Final 2024',
        description: 'The ultimate showdown between European football giants',
        image: 'https://images.unsplash.com/photo-1592913402110-fa2d0bb5b52d?w=800&h=400&fit=crop',
        sport: 'football',
        date: '2024-05-28T19:00:00Z',
        venue: 'Wembley Stadium',
        viewers: 'Estimated 450M'
      },
      {
        id: 2,
        title: 'NBA Finals Game 7',
        description: 'Decisive game for the championship title',
        image: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=800&h=400&fit=crop',
        sport: 'basketball',
        date: '2024-06-20T20:00:00Z',
        venue: 'TD Garden',
        viewers: 'Estimated 30M'
      }
    ]
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setLiveMatches(mockData.liveMatches);
      setUpcomingMatches(mockData.upcomingMatches);
      setTeams(mockData.teams);
      setPlayers(mockData.players);
      setNews(mockData.news);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredMatches = useMemo(() => {
    const allMatches = [...mockData.liveMatches, ...mockData.upcomingMatches];
    if (activeSport === 'all') return allMatches;
    return allMatches.filter(match => match.sport === activeSport);
  }, [activeSport]);

  const toggleFavorite = (teamId) => {
    const newFavorites = new Set(favoriteTeams);
    if (newFavorites.has(teamId)) {
      newFavorites.delete(teamId);
    } else {
      newFavorites.add(teamId);
    }
    setFavoriteTeams(newFavorites);
  };

  const nextFeatured = () => {
    setCurrentFeatured((prev) => (prev === mockData.featured.length - 1 ? 0 : prev + 1));
  };

  const prevFeatured = () => {
    setCurrentFeatured((prev) => (prev === 0 ? mockData.featured.length - 1 : prev - 1));
  };

  const LiveMatchCard = ({ match }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group cursor-pointer"
    >
      <Card hover className="overflow-hidden border-l-4 border-red-500">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <Badge color="red" className="animate-pulse">
              <Flame size={12} className="mr-1" />
              LIVE
            </Badge>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Eye size={14} />
              <span>{(match.viewers / 1000000).toFixed(1)}M</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-center flex-1">
              <div className="text-2xl mb-1">{match.teamA?.logo || '🎾'}</div>
              <div className="font-semibold text-gray-900 dark:text-white text-sm">
                {match.teamA?.name || match.playerA?.name}
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                {match.teamA?.score || match.playerA?.score}
              </div>
            </div>

            <div className="text-center mx-4">
              <div className="text-xs text-gray-500 mb-1">{match.league}</div>
              <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-bold">
                {match.minute || match.quarter}
              </div>
              <div className="text-xs text-gray-500 mt-1">VS</div>
            </div>

            <div className="text-center flex-1">
              <div className="text-2xl mb-1">{match.teamB?.logo || '🎾'}</div>
              <div className="font-semibold text-gray-900 dark:text-white text-sm">
                {match.teamB?.name || match.playerB?.name}
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                {match.teamB?.score || match.playerB?.score}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin size={12} />
              <span>{match.venue}</span>
            </div>
            <Button size="sm" variant="outline">
              <Play size={12} className="mr-1" />
              Watch
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const TeamCard = ({ team }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group cursor-pointer"
    >
      <Card hover className="overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{team.logo}</div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{team.name}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{team.sport}</span>
                  <span>•</span>
                  <span>#{team.position}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(team.id);
              }}
              className="text-gray-400 hover:text-yellow-500 transition-colors"
            >
              <Star 
                size={16} 
                className={favoriteTeams.has(team.id) ? 'fill-yellow-500 text-yellow-500' : ''} 
              />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-3 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">{team.wins}</div>
              <div className="text-xs text-gray-500">Wins</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600">{team.losses}</div>
              <div className="text-xs text-gray-500">Losses</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-600">{team.points}</div>
              <div className="text-xs text-gray-500">Points</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {team.form.map((result, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded text-xs flex items-center justify-center ${
                    result === 'W' ? 'bg-green-500 text-white' :
                    result === 'L' ? 'bg-red-500 text-white' :
                    'bg-yellow-500 text-white'
                  }`}
                >
                  {result}
                </div>
              ))}
            </div>
            <Badge color={team.position <= 3 ? "green" : "gray"}>
              #{team.position}
            </Badge>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const PlayerCard = ({ player }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
        {player.name.split(' ').map(n => n[0]).join('')}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-bold text-gray-900 dark:text-white">{player.name}</h4>
          {player.trending && <Badge color="green">Trending</Badge>}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {player.team || `Rank: #${player.ranking}`} • {player.position}
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {Object.entries(player.stats).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="font-bold text-gray-900 dark:text-white">{value}</div>
              <div className="capitalize">{key}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-1 text-yellow-600">
          <Star size={16} className="fill-yellow-500" />
          <span className="font-bold">{player.stats.rating}</span>
        </div>
        <div className="text-xs text-gray-500">Rating</div>
      </div>
    </motion.div>
  );

  const FeaturedCarousel = () => (
    <div className="relative h-80 rounded-2xl overflow-hidden mb-8">
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
              <Badge color="green" className="mb-4">
                <Crown size={12} className="mr-1" />
                FEATURED EVENT
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {mockData.featured[currentFeatured]?.title}
              </h2>
              <p className="text-xl text-gray-200 mb-6 max-w-2xl">
                {mockData.featured[currentFeatured]?.description}
              </p>
              
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={20} />
                  <span className="text-lg">
                    {new Date(mockData.featured[currentFeatured]?.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={20} />
                  <span className="text-lg">{mockData.featured[currentFeatured]?.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={20} />
                  <span className="text-lg">{mockData.featured[currentFeatured]?.viewers}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Button size="lg">
                  <Video size={20} className="mr-2" />
                  Watch Live
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50 dark:from-gray-900 dark:via-green-900/20 dark:to-blue-900/20 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity }
            }}
            className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Trophy size={32} className="text-white" />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-400">Loading sports data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50 dark:from-gray-900 dark:via-green-900/20 dark:to-blue-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Badge color="green" className="mx-auto">
              <Flame size={14} className="mr-1" />
              LIVE SPORTS
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
              Sports <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Hub</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Live scores, team standings, player stats, and breaking sports news
            </p>
          </motion.div>
        </div>

        {/* Featured Carousel */}
        <section className="mb-12">
          <FeaturedCarousel />
        </section>

        {/* Sports Categories */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sports Categories</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sports.map((sport) => {
              const Icon = sport.icon;
              return (
                <button
                  key={sport.id}
                  onClick={() => setActiveSport(sport.id)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all ${
                    activeSport === sport.id
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg transform scale-105'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Icon size={24} />
                  <span className="font-medium text-sm">{sport.name}</span>
                  <Badge 
                    color={activeSport === sport.id ? "blue" : "gray"}
                    className={activeSport === sport.id ? "bg-white/20 text-white border-0" : ""}
                  >
                    {sport.count}
                  </Badge>
                </button>
              );
            })}
          </div>
        </section>

        {/* Live Matches */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              <Flame size={24} className="inline mr-2 text-red-600" />
              Live Matches
            </h2>
            <Button variant="outline">
              View All
              <ExternalLink size={14} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveMatches.map((match) => (
              <LiveMatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Content Grid - 3/4 width */}
          <div className="lg:col-span-3">
            {/* Teams Standings */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Team Standings</h2>
                <Button variant="outline">
                  Full Table
                  <ExternalLink size={14} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            </section>

            {/* Upcoming Matches */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Matches</h2>
                <Button variant="outline">
                  Full Schedule
                  <ExternalLink size={14} />
                </Button>
              </div>

              <div className="space-y-4">
                {upcomingMatches.map((match) => (
                  <Card key={match.id} hover className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 flex-1">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="text-2xl">{match.teamA.logo}</div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {match.teamA.name}
                          </div>
                        </div>
                        
                        <div className="text-center mx-4">
                          <div className="text-xs text-gray-500 mb-1">VS</div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">
                            {new Date(match.date).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(match.date).toLocaleTimeString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-1 justify-end">
                          <div className="font-semibold text-gray-900 dark:text-white text-right">
                            {match.teamB.name}
                          </div>
                          <div className="text-2xl">{match.teamB.logo}</div>
                        </div>
                      </div>
                      
                      <Button size="sm" variant="outline" className="ml-4">
                        <Clock3 size={14} className="mr-1" />
                        Remind
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <MapPin size={12} />
                        <span>{match.venue}</span>
                      </div>
                      <span>{match.league}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar - 1/4 width */}
          <div className="space-y-8">
            {/* Top Players */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={20} className="text-green-600" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Top Players</h3>
                </div>
                <div className="space-y-4">
                  {players.map((player) => (
                    <PlayerCard key={player.id} player={player} />
                  ))}
                </div>
              </div>
            </Card>

            {/* Sports News */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award size={20} className="text-blue-600" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Sports News</h3>
                </div>
                <div className="space-y-4">
                  {news.map((item) => (
                    <div key={item.id} className="group cursor-pointer">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {item.trending && <Badge color="blue">Trending</Badge>}
                            <span className="text-xs text-gray-500">{item.timeAgo}</span>
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors text-sm">
                            {item.title}
                          </h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Live Stats */}
            <Card className="bg-gradient-to-br from-green-600 to-blue-600 text-white">
              <div className="p-6">
                <h3 className="font-bold text-lg mb-4 text-center">Live Stats</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Active Viewers</span>
                      <span className="font-bold">12.4M</span>
                    </div>
                    <Progress progress={85} color="yellow" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Live Matches</span>
                      <span className="font-bold">24</span>
                    </div>
                    <Progress progress={65} color="blue" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Goals Today</span>
                      <span className="font-bold">156</span>
                    </div>
                    <Progress progress={78} color="green" />
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

export default SportsPage;