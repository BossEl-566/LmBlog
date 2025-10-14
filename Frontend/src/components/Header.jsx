import { Avatar, Button, Dropdown, Navbar, TextInput, Badge, NavbarToggle, NavbarCollapse, NavbarLink } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import { AiOutlineSearch, AiOutlineClose, AiOutlineBell, AiOutlineUser } from 'react-icons/ai';
import { FaMoon, FaSun, FaBars, FaRegCompass, FaFire } from 'react-icons/fa';
import { HiLogout, HiViewGrid, HiChevronDown, HiPlus } from "react-icons/hi";
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice.js';
import { signoutSuccess } from '../redux/user/userSlice.js';
// import toast from 'react-hot-toast';

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const { theme } = useSelector(state => state.theme);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const categoriesRef = useRef(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsCategoriesOpen(false);
  }, [path]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });

      if (!res.ok) {
        toast.error('Failed to sign out. Please try again.');
      } else {
        dispatch(signoutSuccess());
        toast.success('Signed out successfully!');
        navigate('/sign-in');
      }
    } catch (error) {
      toast.error('An error occurred during sign-out. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    setIsSearchVisible(false);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  const handleCreatePost = () => {
    if (currentUser) {
      navigate('/create-post');
    } else {
      navigate('/sign-in');
      toast.error('Please sign in to create a post');
    }
  };

  return (
    <Navbar className='border-b-2 print:hidden sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm supports-backdrop-blur:bg-white/60'>
      {/* Logo Section */}
      <div className='flex items-center justify-between w-full md:w-auto'>
        <Link to='/' className='self-center whitespace-nowrap group'>
          <div className='flex items-center space-x-3'>
            <div className='relative'>
              <img 
                src='/src/assets/blog-logo.png' 
                alt='Blog Logo' 
                width='36' 
                height='36'
                className='transition-transform group-hover:scale-105 rounded-lg'
              />
            </div>
            <div className='flex flex-col'>
              <span className='text-lg font-bold dark:text-white text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-300 dark:to-purple-300 leading-tight'>
                ModernBlog
              </span>
              <span className='text-xs text-gray-500 dark:text-gray-400 font-medium'>
                Stories That Matter
              </span>
            </div>
          </div>
        </Link>

        {/* Mobile Search Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Button 
            className='w-10 h-10 transition-all hover:scale-105' 
            color='gray' 
            pill 
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === 'light' ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
          </Button>
          
          <Button 
            className='w-10 h-10 transition-all hover:scale-105' 
            color='gray' 
            pill 
            onClick={toggleSearch}
          >
            {isSearchVisible ? <AiOutlineClose /> : <AiOutlineSearch />}
          </Button>
          
          {/* Mobile Profile/Hamburger Menu */}
          {currentUser && (
            <Dropdown 
              arrowIcon={false} 
              inline 
              label={
                <div className="md:hidden relative">
                  {currentUser.profilePicture ? (
                    <Avatar 
                      alt='user' 
                      img={currentUser.profilePicture} 
                      rounded 
                      className='border-2 border-transparent hover:border-blue-500 transition-colors'
                    />
                  ) : (
                    <div className="relative">
                      <FaBars className="text-gray-600 dark:text-gray-300 text-xl" />
                      {hasNotifications && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </div>
                  )}
                </div>
              }
            >
              <Dropdown.Header className='border-b border-gray-200 dark:border-gray-700'>
                <div className="flex items-center space-x-3">
                  <Avatar alt='user' img={currentUser.profilePicture} rounded size="md" />
                  <div>
                    <span className="block text-sm font-semibold">{currentUser.username}</span>
                    <span className="block truncate text-sm text-gray-500">{currentUser.email}</span>
                  </div>
                </div>
              </Dropdown.Header>
              
              <Link to={'/dashboard?tab=profile'}>
                <Dropdown.Item icon={HiViewGrid} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
                  Dashboard
                </Dropdown.Item>
              </Link>
              
              <Dropdown.Item 
                icon={HiPlus} 
                onClick={handleCreatePost}
                className='hover:bg-gray-50 dark:hover:bg-gray-700 text-green-600 dark:text-green-400'
              >
                Create Post
              </Dropdown.Item>
              
              <Link to={'/notifications'}>
                <Dropdown.Item icon={AiOutlineBell} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
                  Notifications
                  {hasNotifications && (
                    <Badge color="red" className="ml-2">3</Badge>
                  )}
                </Dropdown.Item>
              </Link>
              
              <Dropdown.Divider />
              <Dropdown.Item 
                icon={HiLogout} 
                onClick={handleSignout}
                className='text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
              >
                Sign out
              </Dropdown.Item>
            </Dropdown>
          )}
        </div>
      </div>

      {/* Search Form - Desktop */}
      <form onSubmit={handleSubmit} className="hidden md:flex flex-1 max-w-2xl mx-8">
        <TextInput 
          type='text' 
          placeholder='Search articles, topics, or authors...' 
          rightIcon={AiOutlineSearch} 
          className='w-full transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent'
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </form>

      {/* Search Form - Mobile (when toggled) */}
      {isSearchVisible && (
        <form onSubmit={handleSubmit} className="absolute top-16 left-0 right-0 px-4 md:hidden bg-white dark:bg-gray-800 py-2 border-b border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex gap-2">
            <TextInput 
              type='text' 
              placeholder='Search articles, topics...' 
              className='flex-1' 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              autoFocus
            />
            <Button type="submit" className='h-10 transition-all hover:scale-105'>
              <AiOutlineSearch />
            </Button>
          </div>
        </form>
      )}

      {/* Right Side Controls */}
      <div className="flex items-center gap-3 md:order-2">
        {/* Create Post Button - Desktop */}
        

        

        {/* Theme Toggle - Desktop */}
        <Button
          className='w-10 h-10 hidden md:inline transition-all hover:scale-105'
          color='gray'
          pill
          onClick={() => {
            dispatch(toggleTheme());
            toast.success(`Theme switched to ${theme === 'light' ? 'dark' : 'light'}.`);
          }}
        >
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>

        {/* User Dropdown - Desktop */}
        {currentUser ? (
          <Dropdown 
            arrowIcon={false} 
            inline 
            label={
              <div className="hidden md:block relative">
                <Avatar 
                  alt='user' 
                  img={currentUser.profilePicture} 
                  rounded 
                  bordered
                  className="border-2 border-transparent hover:border-blue-500 transition-colors cursor-pointer"
                />
              </div>
            }
          >
            <Dropdown.Header className='border-b border-gray-200 dark:border-gray-700 pb-3'>
              <div className="flex items-center space-x-3">
                <Avatar alt='user' img={currentUser.profilePicture} rounded size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {currentUser.username}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{currentUser.email}</p>
                  <Badge color="purple" className="mt-1">Writer</Badge>
                </div>
              </div>
            </Dropdown.Header>
            
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item icon={AiOutlineUser} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
                My Profile
              </Dropdown.Item>
            </Link>
            
            <Link to={'/dashboard?tab=posts'}>
              <Dropdown.Item icon={HiViewGrid} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
                My Posts
              </Dropdown.Item>
            </Link>
            
            <Dropdown.Item 
              icon={HiPlus} 
              onClick={handleCreatePost}
              className='hover:bg-gray-50 dark:hover:bg-gray-700 text-purple-600 dark:text-purple-400 font-semibold'
            >
              Create New Post
            </Dropdown.Item>
            
            <Link to={'/bookmarks'}>
              <Dropdown.Item icon={FaRegCompass} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
                Saved Articles
              </Dropdown.Item>
            </Link>
            
            <Dropdown.Divider />
            <Dropdown.Item 
              icon={HiLogout} 
              onClick={handleSignout}
              className='text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold'
            >
              Sign out
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <Link to='/sign-in'>
              <Button  outline className="transition-all hover:scale-105">
                Sign In
              </Button>
            </Link>
            <Link to='/sign-up'>
              <Button  className="transition-all hover:scale-105">
                Get Started
              </Button>
            </Link>
          </div>
        )}
        
        <NavbarToggle />
      </div>

      {/* Navigation Links */}
      <NavbarCollapse className="mt-2 md:mt-0">
        <Link to='/'>
          <NavbarLink
            active={path === "/"} 
            as={'div'} 
            className='transition-colors hover:text-purple-600 dark:hover:text-purple-400 font-medium'
          >
            Home
          </NavbarLink>
        </Link>
        
        {/* Categories Dropdown */}
        <div className="relative" ref={categoriesRef}>
          <button 
            className={`flex items-center justify-between w-full py-2 pr-4 pl-3 md:p-0 transition-colors ${
              path.startsWith("/category") 
                ? 'text-purple-700 dark:text-purple-500 font-semibold' 
                : 'text-gray-700 dark:text-gray-400 hover:text-purple-700 dark:hover:text-purple-500 font-medium'
            }`}
            onClick={toggleCategories}
          >
            <span>Categories</span>
            <HiChevronDown className={`ml-1 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isCategoriesOpen && (
            <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 border border-gray-200 dark:border-gray-700 p-4 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-4">
                {/* Popular Categories */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                    Popular
                  </h3>
                  <div className="space-y-2">
                    {[
                      { name: 'Technology', path: '/category/technology', icon: '💻' },
                      { name: 'Lifestyle', path: '/category/lifestyle', icon: '🌟' },
                      { name: 'Travel', path: '/category/travel', icon: '✈️' },
                      { name: 'Health', path: '/category/health', icon: '🏥' },
                      { name: 'Business', path: '/category/business', icon: '💼' },
                    ].map((category) => (
                      <Link
                        key={category.path}
                        to={category.path}
                        className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* More Categories */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                    More
                  </h3>
                  <div className="space-y-2">
                    {[
                      { name: 'Sports', path: '/category/sports', icon: '⚽' },
                      { name: 'Entertainment', path: '/category/entertainment', icon: '🎬' },
                      { name: 'News', path: '/category/news', icon: '📰' },
                      { name: 'Food', path: '/category/food', icon: '🍕' },
                      { name: 'Science', path: '/category/science', icon: '🔬' },
                    ].map((category) => (
                      <Link
                        key={category.path}
                        to={category.path}
                        className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Trending Section */}
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to="/trending"
                  className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                  onClick={() => setIsCategoriesOpen(false)}
                >
                  <FaFire className="mr-2 text-orange-500" />
                  <span>Trending Now</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        <Link to='/trending'>
          <NavbarLink 
            active={path === "/trending"} 
            as={'div'} 
            className='transition-colors hover:text-purple-600 dark:hover:text-purple-400 font-medium'
          >
            Trending
          </NavbarLink>
        </Link>

        <Link to='/news'>
          <NavbarLink 
            active={path === "/news"} 
            as={'div'} 
            className='transition-colors hover:text-purple-600 dark:hover:text-purple-400 font-medium'
          >
            News
          </NavbarLink>
        </Link>

        <Link to='/entertainment'>
          <NavbarLink 
            active={path === "/entertainment"} 
            as={'div'} 
            className='transition-colors hover:text-purple-600 dark:hover:text-purple-400 font-medium'
          >
            Entertainment
          </NavbarLink>
        </Link>

        <Link to='/sports'>
          <NavbarLink 
            active={path === "/sports"} 
            as={'div'} 
            className='transition-colors hover:text-purple-600 dark:hover:text-purple-400 font-medium'
          >
            Sports
          </NavbarLink>
        </Link>

        <Link to='/about'>
          <NavbarLink 
            active={path === "/about"} 
            as={'div'} 
            className='transition-colors hover:text-purple-600 dark:hover:text-purple-400 font-medium'
          >
            About
          </NavbarLink>
        </Link>
      </NavbarCollapse>
    </Navbar>
  );
}