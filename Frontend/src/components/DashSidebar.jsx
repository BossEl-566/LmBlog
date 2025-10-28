import React, { useEffect, useState, useRef } from 'react';
import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { HiArrowSmRight, HiTable, HiUser, HiAnnotation, HiChartPie, } from "react-icons/hi";
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';


export default function DashSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { currentUser } = useSelector(state => state.user);
  const [tab, setTab] = useState('');
  const dispatch = useDispatch();
  const sidebarRef = useRef(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleSignout = async () => {
    try {
      const res = await fetch('api/user/signout', {
        method: 'POST',
      });
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        toast.success('Successfully signed out!');
        onClose();
      }
    } catch (error) {
      console.log(error.message);
      toast.error('An error occurred during sign out.');
    }
  };

  // Wrapper function for sidebar items that closes the sidebar
  const SidebarLink = ({ to, tabValue, children, ...props }) => (
    <Link 
      to={to} 
      onClick={() => {
        setTab(tabValue);
        onClose();
      }}
      {...props}
    >
      {children}
    </Link>
  );

  return (
    <div 
      ref={sidebarRef}
      className={`fixed md:relative z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}
      style={{ height: 'calc(100vh - 60px)', overflowY: 'auto' }}
    >
      <Sidebar className='w-64 md:w-56'>
        <SidebarItems>
          {currentUser && currentUser.isAdmin && (
            <SidebarItemGroup className='flex flex-col gap-1'>
              <SidebarLink to='/dashboard?tab=dash' tabValue='dash'>
                <SidebarItem active={tab === 'dash' || !tab} href="#" icon={HiChartPie} as='div'>
                  Dashboard
                </SidebarItem>
              </SidebarLink>
            </SidebarItemGroup>
            
          )}
          
          <SidebarItemGroup className='flex flex-col gap-1'>
            <SidebarLink to='/dashboard?tab=profile' tabValue='profile'>
              <SidebarItem active={tab === 'profile'} href="#" icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'Author'} labelColor='dark' as='div'>
                Profile
              </SidebarItem>
            </SidebarLink>
            
            {!currentUser.isAuthor && (
              <SidebarLink to='/dashboard?tab=blogger' tabValue='blogger'>
                <SidebarItem active={tab === 'blogger'} href="#" icon={HiTable}>
                  Request Author
                </SidebarItem>
              </SidebarLink>
            )}
            {currentUser && currentUser.isAdmin && (
            <SidebarItemGroup className='flex flex-col gap-1'>
              <SidebarLink to='/dashboard?tab=applicant' tabValue='applicant'>
                <SidebarItem active={tab === 'applicant'} href="#" icon={HiTable} as='div'>
                  Blogger Applications
                
                </SidebarItem>
                </SidebarLink>
            </SidebarItemGroup>
          )}
            <SidebarItem 
              onClick={() => {
                handleSignout();
                onClose();
              }} 
              icon={HiArrowSmRight} 
              as='div'
            >
              Sign Out
            </SidebarItem>
          </SidebarItemGroup>
        </SidebarItems>
      </Sidebar>
    </div>
  );
}