import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaGithub, FaEnvelope, FaHeart } from 'react-icons/fa';
// import { useSelector } from 'react-redux';

export default function Footer() {
//   const { theme } = useSelector(state => state.theme);
  const currentYear = new Date().getFullYear();

  const blogCategories = [
    { name: 'Technology', path: '/category/technology' },
    { name: 'Lifestyle', path: '/category/lifestyle' },
    { name: 'Travel', path: '/category/travel' },
    { name: 'Health & Wellness', path: '/category/health' },
    { name: 'Business', path: '/category/business' },
    { name: 'Entertainment', path: '/category/entertainment' },
    { name: 'Sports', path: '/category/sports' },
    { name: 'Science', path: '/category/science' }
  ];

  const companyLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Our Team', path: '/team' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' }
  ];

  const resourcesLinks = [
    { name: 'Help Center', path: '/help' },
    { name: 'Community', path: '/community' },
    { name: 'Blog Guidelines', path: '/guidelines' },
    { name: 'Content Policy', path: '/content-policy' },
    { name: 'Writer Resources', path: '/resources' },
    { name: 'API', path: '/api' }
  ];

  const socialLinks = [
    { name: 'Twitter', icon: FaTwitter, url: 'https://twitter.com' },
    { name: 'Facebook', icon: FaFacebook, url: 'https://facebook.com' },
    { name: 'Instagram', icon: FaInstagram, url: 'https://instagram.com' },
    { name: 'LinkedIn', icon: FaLinkedin, url: 'https://linkedin.com' },
    { name: 'GitHub', icon: FaGithub, url: 'https://github.com' }
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 print:hidden">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <img 
                src='/src/assets/blog-logo.png' 
                alt='ModernBlog' 
                width='40' 
                height='40'
                className='rounded-lg'
              />
              <div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  ModernBlog
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Stories That Matter
                </p>
              </div>
            </Link>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
              Your premier destination for insightful articles, trending stories, and thought-provoking content. 
              Join our community of readers and writers today.
            </p>
            
            {/* Newsletter Subscription */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Stay Updated
              </h4>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                  <FaEnvelope className="text-sm" />
                </button>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Categories
            </h3>
            <ul className="space-y-3">
              {blogCategories.map((category) => (
                <li key={category.path}>
                  <Link
                    to={category.path}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Resources
            </h3>
            <ul className="space-y-3">
              {resourcesLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>© {currentYear} ModernBlog. All rights reserved.</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center">
                Made with <FaHeart className="text-red-500 mx-1" /> by our team
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Additional Links */}
            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <Link to="/privacy" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
                Terms
              </Link>
              <Link to="/sitemap" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
                Sitemap
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">10K+</div>
              <div>Articles Published</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">50K+</div>
              <div>Monthly Readers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">1K+</div>
              <div>Writers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">5M+</div>
              <div>Words Written</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile App CTA */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-white mb-2">
                Get the ModernBlog App
              </h3>
              <p className="text-purple-100 text-sm">
                Read your favorite articles on the go. Available on iOS and Android.
              </p>
            </div>
            <div className="flex space-x-4">
              <button className="px-6 py-2 bg-white text-purple-600 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors duration-200">
                App Store
              </button>
              <button className="px-6 py-2 bg-white text-purple-600 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors duration-200">
                Google Play
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}