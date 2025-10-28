import React, { useState, useEffect } from 'react';
import { Button, Card, Badge, Table, Textarea, Modal, Alert, Spinner, TableHead, TableHeadCell, TableBody, TableRow, TableCell, ModalHeader, ModalBody, ModalFooter, Pagination, Select } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { Clock, CheckCircle, XCircle, Eye, Mail, MapPin, Link, FileText, User, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashApplicant() {
  const { currentUser } = useSelector(state => state.user);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminRemarks, setAdminRemarks] = useState('');
  const [aiEvaluationScore, setAiEvaluationScore] = useState(0);
  const [processing, setProcessing] = useState(false);
  
  // Pagination and filtering states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => {
    fetchApplications();
  }, [currentPage, statusFilter, sortBy]);

  const fetchApplications = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: '20',
        ...(statusFilter && { status: statusFilter }),
        sort: sortBy
      });

      const response = await fetch(`/api/requestblogger/applications?${params}`, {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch applications');
      }
      
      setApplications(data.applications || []);
      setTotalPages(data.pages || 1);
      setTotalApplications(data.total || 0);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setAdminRemarks(application.admin?.remarks || '');
    setAiEvaluationScore(application.admin?.ai_evaluation_score || 0);
    setShowModal(true);
  };

  const handleStatusUpdate = async (status) => {
    if (!selectedApplication) return;
    
    setProcessing(true);
    
    try {
      const response = await fetch(`/api/requestblogger/update-status/${selectedApplication._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: status,
          remarks: adminRemarks,
          ai_evaluation_score: aiEvaluationScore
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update application');
      }

      toast.success(`Application ${status} successfully`);
      setShowModal(false);
      fetchApplications(); // Refresh the list
      
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'yellow', icon: Clock, text: 'Pending Review' },
      under_review: { color: 'blue', icon: Clock, text: 'Under Review' },
      approved: { color: 'success', icon: CheckCircle, text: 'Approved' },
      rejected: { color: 'failure', icon: XCircle, text: 'Rejected' },
      withdrawn: { color: 'gray', icon: XCircle, text: 'Withdrawn' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <Badge color={config.color} className="flex items-center gap-1 w-fit">
        <IconComponent size={14} />
        {config.text}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusCount = (status) => {
    return applications.filter(app => app.status === status).length;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <div className="flex items-center justify-center py-12">
            <Spinner size="xl" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blogger Applications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and review blogger applications ({totalApplications} total)
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            Pending: {getStatusCount('pending')}
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Under Review: {getStatusCount('under_review')}
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Approved: {getStatusCount('approved')}
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            Rejected: {getStatusCount('rejected')}
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1 flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-40"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-40"
              >
                <option value="createdAt">Newest First</option>
                <option value="-createdAt">Oldest First</option>
                <option value="updatedAt">Recently Updated</option>
                <option value="fullName">Name A-Z</option>
              </Select>
            </div>
          </div>
          
          <Button
            color="light"
            onClick={fetchApplications}
            className="flex items-center gap-2"
          >
            <Search size={16} />
            Refresh
          </Button>
        </div>
      </Card>

      {/* Applications Table */}
      <Card>
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Applications Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {statusFilter 
                ? `No applications found with status "${statusFilter}"`
                : 'There are no blogger applications to review at this time.'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table hoverable>
                <TableHead>
                  <TableHeadCell>Applicant</TableHeadCell>
                  <TableHeadCell>Niches</TableHeadCell>
                  <TableHeadCell>Experience</TableHeadCell>
                  <TableHeadCell>Country</TableHeadCell>
                  <TableHeadCell>Applied On</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  <TableHeadCell>AI Score</TableHeadCell>
                  <TableHeadCell>Actions</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                  {applications.map((application) => (
                    <TableRow key={application._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <User className="w-8 h-8 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {application.fullName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Mail size={12} />
                              {application.contactEmail}
                            </div>
                            {application.phoneNumber && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {application.phoneNumber}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {application.niches?.map((niche, index) => (
                            <Badge key={index} color="gray" className="text-xs">
                              {niche}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {application.writingExperience}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="text-gray-400" />
                          <span className="text-sm">{application.country}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(application.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(application.status)}
                      </TableCell>
                      <TableCell>
                        {application.admin?.ai_evaluation_score ? (
                          <Badge color={
                            application.admin.ai_evaluation_score >= 8 ? 'success' :
                            application.admin.ai_evaluation_score >= 6 ? 'warning' : 'failure'
                          }>
                            {application.admin.ai_evaluation_score}/10
                          </Badge>
                        ) : (
                          <span className="text-xs text-gray-400">Not scored</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="xs"
                          color="light"
                          onClick={() => handleViewApplication(application)}
                          className="flex items-center gap-1"
                        >
                          <Eye size={14} />
                          View
                        </Button>
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
                  Showing page {currentPage} of {totalPages}
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

      {/* Application Detail Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} size="4xl">
        <ModalHeader>
          Application Details - {selectedApplication?.fullName}
        </ModalHeader>
        <ModalBody>
          {selectedApplication && (
            <div className="space-y-6">
              {/* Applicant Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Personal Information</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                      <p className="text-gray-900 dark:text-white">{selectedApplication.fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Email</label>
                      <p className="text-gray-900 dark:text-white flex items-center gap-1">
                        <Mail size={14} />
                        {selectedApplication.contactEmail}
                      </p>
                    </div>
                    {selectedApplication.phoneNumber && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</label>
                        <p className="text-gray-900 dark:text-white">{selectedApplication.phoneNumber}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Country</label>
                      <p className="text-gray-900 dark:text-white flex items-center gap-1">
                        <MapPin size={14} />
                        {selectedApplication.country}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Preferred Language</label>
                      <p className="text-gray-900 dark:text-white">{selectedApplication.preferredLanguage}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Blogging Details</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Niches</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedApplication.niches?.map((niche, index) => (
                          <Badge key={index} color="blue">
                            {niche}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Writing Experience</label>
                      <p className="text-gray-900 dark:text-white">{selectedApplication.writingExperience}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Bio & Writing Style</label>
                <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                    {selectedApplication.bio}
                  </p>
                </div>
                <div className="text-right text-xs text-gray-500 mt-1">
                  {selectedApplication.bio?.length || 0}/500 characters
                </div>
              </div>

              {/* Sample Posts */}
              {selectedApplication.samplePosts?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Sample Posts</h4>
                  <div className="space-y-3">
                    {selectedApplication.samplePosts.map((post, index) => (
                      post.url && (
                        <Card key={index} className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Link size={14} className="text-gray-400" />
                                <a 
                                  href={post.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline font-medium"
                                >
                                  {post.title || 'Sample Post'}
                                </a>
                              </div>
                              {post.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {post.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </Card>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {Object.values(selectedApplication.socialLinks || {}).some(link => link) && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Social Links</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(selectedApplication.socialLinks || {}).map(([platform, url]) => 
                      url && (
                        <div key={platform} className="flex items-center gap-2">
                          <Link size={14} className="text-gray-400" />
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm capitalize"
                          >
                            {platform.replace('_', ' ')}
                          </a>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Admin Review Section */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Review Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="aiEvaluationScore" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      AI Evaluation Score (0-10)
                    </label>
                    <Select
                      id="aiEvaluationScore"
                      value={aiEvaluationScore}
                      onChange={(e) => setAiEvaluationScore(parseInt(e.target.value))}
                    >
                      {[0,1,2,3,4,5,6,7,8,9,10].map(score => (
                        <option key={score} value={score}>{score}</option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="adminRemarks" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Admin Remarks
                    </label>
                    <Textarea
                      id="adminRemarks"
                      value={adminRemarks}
                      onChange={(e) => setAdminRemarks(e.target.value)}
                      placeholder="Add remarks for the applicant..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Current Status and Review Info */}
              <Alert color={
                selectedApplication.status === 'approved' ? 'success' :
                selectedApplication.status === 'rejected' ? 'failure' : 
                selectedApplication.status === 'under_review' ? 'info' : 'warning'
              }>
                <div className="flex flex-col gap-2">
                  <div>Current Status: {getStatusBadge(selectedApplication.status)}</div>
                  {selectedApplication.admin?.reviewDate && (
                    <div className="text-sm">
                      Last reviewed: {formatDate(selectedApplication.admin.reviewDate)}
                    </div>
                  )}
                  {selectedApplication.admin?.remarks && (
                    <div className="text-sm">
                      Previous remarks: {selectedApplication.admin.remarks}
                    </div>
                  )}
                </div>
              </Alert>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              <Button
                color="gray"
                onClick={() => handleStatusUpdate('under_review')}
                disabled={processing || selectedApplication?.status === 'under_review'}
                className="flex-1"
              >
                {processing ? <Spinner size="sm" /> : 'Mark Under Review'}
              </Button>
              <Button
                color="failure"
                onClick={() => handleStatusUpdate('rejected')}
                disabled={processing || selectedApplication?.status === 'rejected'}
                className="flex-1"
              >
                {processing ? <Spinner size="sm" /> : 'Reject Application'}
              </Button>
              <Button
                color="success"
                onClick={() => handleStatusUpdate('approved')}
                disabled={processing || selectedApplication?.status === 'approved'}
                className="flex-1"
              >
                {processing ? <Spinner size="sm" /> : 'Approve Application'}
              </Button>
            </div>
            <Button
              color="light"
              onClick={() => setShowModal(false)}
            >
              Close
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
}