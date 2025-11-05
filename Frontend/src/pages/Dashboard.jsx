import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashRequestBlogger from '../components/DashRequestBlogger'
import DashApplicant from '../components/DashApplicant';
import DashPost from '../components/DashPost';
import NewPost from '../components/NewPost';


export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed z-50 p-2 m-2 rounded-lg bg-gray-100 dark:bg-gray-700"
      >
        {sidebarOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Sidebar */}
      <DashSidebar 
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />
      
      {/* Main content */}
      <div className="flex-1 p-4 md:mt-0" style={{ marginBottom: '60px' }}>
        {/* Profile */}
        {tab === 'profile' && <DashProfile />}
        {tab === 'blogger' && <DashRequestBlogger />}
        {tab === 'applicant' && <DashApplicant />}
        {tab === 'post' &&  <DashPost />}
        {(tab === 'newpost' && <NewPost />) }
  
      </div>
    </div>
  );
}