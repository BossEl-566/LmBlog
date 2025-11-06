import React, { useState, useEffect } from 'react';
import { Button, Card, Table, Badge, Pagination, Select, TextInput, Modal, Spinner, Alert, Dropdown, TableHead, TableHeadCell, TableBody, DropdownItem, ModalHeader, ModalBody, ModalFooter, TableRow, TableCell, DropdownDivider } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { Eye, Edit, Search, Filter, MoreVertical, Calendar, User, Clock, BarChart3, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function PostsManagement() {
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterAndSortPosts();
  }, [posts, searchTerm, statusFilter, categoryFilter, sortBy]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const endpoint = currentUser.isAdmin 
        ? '/api/post/getAll' 
        : `/api/post/${currentUser._id}`;

      const response = await fetch(endpoint, {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch posts');
      }
      
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPosts = () => {
    let filtered = [...posts];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(post => post.status === statusFilter);
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(post => post.category?._id === categoryFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'views':
        filtered.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      case 'likes':
        filtered.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
        break;
      default:
        break;
    }

    setFilteredPosts(filtered);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: 'gray', text: 'Draft' },
      pending_review: { color: 'yellow', text: 'Pending Review' },
      published: { color: 'success', text: 'Published' },
      archived: { color: 'failure', text: 'Archived' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return <Badge color={config.color}>{config.text}</Badge>;
  };

  const handleEditPost = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  const handleViewPost = (post) => {
    if (post.status === 'published' && post.slug) {
      window.open(`/post/${post.slug}`, '_blank');
    } else {
      toast.error('This post is not published yet');
    }
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;
    
    setDeleting(true);
    try {
      const response = await fetch(`/api/post/${postToDelete._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete post');
      }

      toast.success('Post deleted successfully');
      setShowDeleteModal(false);
      setPostToDelete(null);
      fetchPosts(); // Refresh the list
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusUpdate = async (postId, newStatus) => {
    try {
      const response = await fetch(`/api/posts/${postId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update post status');
      }

      toast.success(`Post status updated to ${newStatus}`);
      fetchPosts(); // Refresh the list
    } catch (error) {
      console.error('Error updating post status:', error);
      toast.error(error.message);
    }
  };

  // Get unique categories for filter
  const categories = [...new Set(posts.map(post => post.category).filter(Boolean))];
  
  // Get current posts for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card>
          <div className="flex items-center justify-center py-12">
            <Spinner size="xl" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {currentUser.isAdmin ? 'All Posts' : 'My Posts'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and track your blog posts
          </p>
        </div>
        <Button
          onClick={() => navigate('/dashboard?tab=newpost')}
        >
          Create New Post
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {posts.length}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Posts</p>
        </Card>
        
        <Card className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge color="success" className="w-2 h-2 rounded-full" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {posts.filter(p => p.status === 'published').length}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Published</p>
        </Card>
        
        <Card className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge color="yellow" className="w-2 h-2 rounded-full" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {posts.filter(p => p.status === 'pending_review').length}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Pending Review</p>
        </Card>
        
        <Card className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge color="gray" className="w-2 h-2 rounded-full" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {posts.filter(p => p.status === 'draft').length}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Drafts</p>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1 flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <TextInput
                icon={Search}
                placeholder="Search posts by title, excerpt, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-40"
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="pending_review">Pending Review</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </Select>
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-40"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            )}

            {/* Sort */}
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-40"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
              <option value="views">Most Views</option>
              <option value="likes">Most Likes</option>
            </Select>
          </div>
          
          <Button
            color="light"
            onClick={fetchPosts}
          >
            Refresh
          </Button>
        </div>
      </Card>

      {/* Posts Table */}
      <Card>
        {currentPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BarChart3 size={64} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Posts Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter || categoryFilter 
                ? 'Try adjusting your filters to see more results.'
                : "You haven't created any posts yet."
              }
            </p>
            <Button onClick={() => navigate('/create-post')}>
              Create Your First Post
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table hoverable>
                <TableHead>
                  <TableHeadCell>Title</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  <TableHeadCell>Category</TableHeadCell>
                  {currentUser.isAdmin && <TableHeadCell>Author</TableHeadCell>}
                  <TableHeadCell>Created</TableHeadCell>
                  <TableHeadCell>Views</TableHeadCell>
                  <TableHeadCell>Likes</TableHeadCell>
                  <TableHeadCell>Actions</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                  {currentPosts.map((post) => (
                    <TableRow key={post._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="font-medium text-gray-900 dark:text-white truncate">
                            {post.title}
                          </div>
                          {post.excerpt && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {post.excerpt}
                            </div>
                          )}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {post.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} color="gray" size="xs">
                                  <Tag size={10} className="mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                              {post.tags.length > 2 && (
                                <Badge color="gray" size="xs">
                                  +{post.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(post.status)}
                      </TableCell>
                      <TableCell>
                        {post.category ? (
                          <Badge color="blue">{post.category.name}</Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">Uncategorized</span>
                        )}
                      </TableCell>
                      {currentUser.isAdmin && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-gray-400" />
                            <span className="text-sm">{post.author?.username}</span>
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar size={14} />
                          {formatDate(post.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye size={14} className="text-gray-400" />
                          <span className="text-sm font-medium">{post.viewCount || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">{post.likeCount || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="xs"
                            color="light"
                            onClick={() => handleViewPost(post)}
                            disabled={post.status !== 'published'}
                          >
                            <Eye size={14} />
                          </Button>
                          <Button
                            size="xs"
                            color="blue"
                            onClick={() => handleEditPost(post._id)}
                          >
                            <Edit size={14} />
                          </Button>
                          
                          {/* Admin Actions Dropdown */}
                          {currentUser.isAdmin && (
                            <Dropdown
                              label=""
                              renderTrigger={() => (
                                <Button size="xs" color="gray">
                                  <MoreVertical size={14} />
                                </Button>
                              )}
                            >
                              {post.status === 'pending_review' && (
                                <>
                                  <DropdownItem onClick={() => handleStatusUpdate(post._id, 'published')}>
                                    Approve & Publish
                                  </DropdownItem>
                                  <DropdownItem onClick={() => handleStatusUpdate(post._id, 'draft')}>
                                    Send Back to Draft
                                  </DropdownItem>
                                </>
                              )}
                              {post.status === 'published' && (
                                <DropdownItem onClick={() => handleStatusUpdate(post._id, 'archived')}>
                                  Archive
                                </DropdownItem>
                              )}
                              {post.status === 'archived' && (
                                <DropdownItem onClick={() => handleStatusUpdate(post._id, 'published')}>
                                  Unarchive
                                </DropdownItem>
                              )}
                              <DropdownDivider />
                              <DropdownItem 
                                onClick={() => handleDeleteClick(post)}
                                className="text-red-600"
                              >
                                Delete Post
                              </DropdownItem>
                            </Dropdown>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, filteredPosts.length)} of {filteredPosts.length} posts
                </p>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  showIcons
                />
              </div>
            )}
          </>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} size="md">
        <ModalHeader>Delete Post</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Alert color="failure">
              <span className="font-medium">Warning!</span> This action cannot be undone.
            </Alert>
            <p className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete the post "{postToDelete?.title}"? 
              This will permanently remove the post and all its data.
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="gray"
            onClick={() => setShowDeleteModal(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            color="failure"
            onClick={handleDeletePost}
            disabled={deleting}
          >
            {deleting ? <Spinner size="sm" /> : 'Delete Post'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}