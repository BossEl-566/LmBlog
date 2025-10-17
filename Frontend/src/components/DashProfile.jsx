import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card, TextInput, Badge, Tabs, Progress } from 'flowbite-react';
import { Client, Storage } from 'appwrite';
import { updateStart, updateSuccess, updateFailure, signoutSuccess } from '../redux/user/userSlice';
import { Eye, EyeOff, Calendar, FileText, Users, TrendingUp, Edit3, Bookmark, Settings, Bell, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function DashProfile() {
  const { currentUser, loading } = useSelector(state => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [uploadImageError, setUploadImageError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  // Mock data for blog statistics
  const blogStats = {
    postsPublished: 24,
    totalViews: 15420,
    followers: 1280,
    readingTime: 42,
    engagementRate: 68,
    avgReadTime: '4.2 min'
  };

  const recentPosts = [
    { title: 'The Future of Web Development', views: 1240, date: '2024-01-15' },
    { title: 'Mastering React Hooks', views: 890, date: '2024-01-10' },
    { title: 'Building Scalable APIs', views: 670, date: '2024-01-05' }
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    const client = new Client()
      .setEndpoint(import.meta.env.VITE_APPWRITE_API_ENDPOINT)
      .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
  
    const storage = new Storage(client);
  
    try {
      const response = await storage.createFile(
        import.meta.env.VITE_APPWRITE_BUCKET_ID,
        "unique()",
        imageFile
      );
      
      console.log('Image upload response:', response);
      const imageUrl = storage.getFilePreview(
        import.meta.env.VITE_APPWRITE_BUCKET_ID,
        response.$id
      )
      
      console.log('Image URL:', imageUrl);
      setImageFileUrl(imageUrl);
      setFormData({ ...formData, profilePicture: imageUrl });
  
      // ✅ Immediately update database
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profilePicture: imageUrl }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
  
      dispatch(updateSuccess(data));
      toast.success('Profile picture updated successfully');
    } catch (error) {
      setUploadImageError('Image upload failed. Please try again.');
      toast.error(error.message || 'Image upload failed.');
      setImageFile(null);
      setImageFileUrl(null);
    } finally {
      setImageFileUploading(false);
    }
  };
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      toast.error('No changes made');
      return;
    }
    if (imageFileUploading) {
      toast.error('Please wait for image upload to complete');
      return;
    }
    
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      
      dispatch(updateSuccess(data));
      toast.success('Profile updated successfully');
    } catch (error) {
      dispatch(updateFailure(error.message));
      toast.error(error.message);
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch('api/user/signout', {
        method: 'POST',
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      
      dispatch(signoutSuccess());
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Writer Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your profile, content, and audience engagement
          </p>
        </div>
        <Button gradientDuoTone="purpleToBlue" className="flex items-center gap-2">
          <Edit3 size={16} />
          Write New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Profile Overview */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card className="rounded-xl shadow-lg">
            <div className="flex flex-col items-center text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={filePickerRef}
                hidden
              />
              <div
                className="w-32 h-32 cursor-pointer relative group mb-4"
                onClick={() => filePickerRef.current.click()}
              >
                <img
                  src={imageFileUrl || currentUser.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm font-medium">Change</span>
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentUser.username}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {currentUser.email}
              </p>
              
              <div className="flex gap-2 mt-3">
                <Badge color={currentUser.isAuthor ? "success" : "gray"} className="text-xs">
                  {currentUser.isAuthor ? "Verified Author" : "Reader"}
                </Badge>
                {currentUser.isAdmin && (
                  <Badge color="purple" className="text-xs">Admin</Badge>
                )}
              </div>

              {imageFileUploading && (
                <div className="mt-3 w-full">
                  <Progress progress={45} color="blue" />
                  <p className="text-xs text-blue-600 mt-1">Uploading image...</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {blogStats.postsPublished}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {blogStats.followers}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Followers</div>
              </div>
            </div>
          </Card>

          {/* Navigation Card */}
          <Card className="rounded-xl shadow-lg">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Settings size={18} />
                Profile Settings
              </button>
              <button
                onClick={() => setActiveTab('posts')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'posts'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <FileText size={18} />
                My Posts
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'analytics'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <TrendingUp size={18} />
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'bookmarks'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Bookmark size={18} />
                Saved Posts
              </button>
            </div>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'profile' && (
            <Card className="rounded-xl shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <Settings size={20} />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Profile Settings
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Username
                    </label>
                    <TextInput
                      id="username"
                      defaultValue={currentUser.username}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <TextInput
                      type="email"
                      id="email"
                      defaultValue={currentUser.email}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={3}
                    placeholder="Tell readers about yourself..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <TextInput
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      placeholder="••••••••"
                      onChange={handleChange}
                      className="w-full"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Leave blank to keep current password
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="button"
                    color="light"
                    onClick={handleSignout}
                    className="flex items-center gap-2"
                  >
                    <Shield size={16} />
                    Sign Out
                  </Button>
                  <Button
                    type="submit"
                    gradientDuoTone="purpleToBlue"
                    disabled={loading || imageFileUploading}
                    className="flex items-center gap-2"
                  >
                    {loading ? 'Saving Changes...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'analytics' && (
            <Card className="rounded-xl shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp size={20} />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Content Analytics
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {blogStats.totalViews.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Views</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {blogStats.engagementRate}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Engagement</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {blogStats.avgReadTime}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avg Read Time</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {blogStats.readingTime}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Reading Time (min)</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Recent Posts Performance</h4>
                {recentPosts.map((post, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{post.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge color="gray">{post.views.toLocaleString()} views</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Add similar cards for other tabs (posts, bookmarks) */}
          {activeTab !== 'profile' && activeTab !== 'analytics' && (
            <Card className="rounded-xl shadow-lg">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {activeTab === 'posts' && 'My Posts Management'}
                  {activeTab === 'bookmarks' && 'Saved Posts'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  This section is coming soon with more advanced features!
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}