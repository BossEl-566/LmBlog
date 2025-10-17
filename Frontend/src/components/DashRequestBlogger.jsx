import React, { useState } from 'react';
import { Button, Card, TextInput, Textarea, Label, Select, Alert } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { User, FileText, Link, Award, Hash, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RequestBlogger() {
  const { currentUser } = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    writingExperience: '',
    niche: '',
    socialLinks: {
      website: '',
      twitter: '',
      linkedin: '',
      instagram: ''
    },
    samplePostUrl: ''
  });

  const niches = [
    'Technology',
    'Lifestyle',
    'Travel',
    'Health & Wellness',
    'Business',
    'Entertainment',
    'Sports',
    'Science',
    'Food & Cooking',
    'Personal Development',
    'Finance',
    'Education',
    'Gaming',
    'Art & Design',
    'Other'
  ];

  const experienceLevels = [
    'Beginner (0-1 years)',
    'Intermediate (1-3 years)',
    'Experienced (3-5 years)',
    'Professional (5+ years)'
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    
    if (id.startsWith('social.')) {
      const socialField = id.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.bio || !formData.writingExperience || !formData.niche) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.bio.length < 50) {
      toast.error('Bio should be at least 50 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/requestblogger/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit application');
      }

      toast.success('Application submitted successfully! We\'ll review it soon.');
      
      // Reset form
      setFormData({
        fullName: '',
        bio: '',
        writingExperience: '',
        niche: '',
        socialLinks: {
          website: '',
          twitter: '',
          linkedin: '',
          instagram: ''
        },
        samplePostUrl: ''
      });

    } catch (error) {
      console.error('Application error:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // If user is already an author
  if (currentUser?.isAuthor) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <Award className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              You're Already a Blogger!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              You already have blogger privileges. Start creating amazing content for our community!
            </p>
            <Button gradientDuoTone="greenToBlue" href="/create-post">
              Write Your First Post
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Become a Blogger
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Join our community of writers and share your unique perspective with thousands of readers.
        </p>
      </div>

      {/* Benefits Card */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 border-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Reach Readers</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Share with our growing community</p>
          </div>
          <div>
            <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Build Authority</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Establish yourself as an expert</p>
          </div>
          <div>
            <Hash className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Monetization</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Earn from your quality content</p>
          </div>
        </div>
      </Card>

      {/* Application Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName" value="Full Name *" />
                <TextInput
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="niche" value="Primary Niche *" />
                <Select
                  id="niche"
                  value={formData.niche}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your niche</option>
                  {niches.map(niche => (
                    <option key={niche} value={niche}>{niche}</option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio" value="About You & Writing Style *" />
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself, your writing style, and what makes your perspective unique. (Minimum 50 characters)"
              rows={4}
              required
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formData.bio.length}/50 characters minimum</span>
              <span>{formData.bio.length} characters</span>
            </div>
          </div>

          {/* Writing Experience */}
          <div>
            <Label htmlFor="writingExperience" value="Writing Experience *" />
            <Select
              id="writingExperience"
              value={formData.writingExperience}
              onChange={handleChange}
              required
            >
              <option value="">Select your experience level</option>
              {experienceLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </Select>
          </div>

          {/* Social Links */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Link className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Social Media & Online Presence
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="social.website" value="Website/Blog" />
                <TextInput
                  id="social.website"
                  type="url"
                  value={formData.socialLinks.website}
                  onChange={handleChange}
                  placeholder="https://yourblog.com"
                />
              </div>
              
              <div>
                <Label htmlFor="social.twitter" value="Twitter/X" />
                <TextInput
                  id="social.twitter"
                  type="url"
                  value={formData.socialLinks.twitter}
                  onChange={handleChange}
                  placeholder="https://twitter.com/username"
                />
              </div>
              
              <div>
                <Label htmlFor="social.linkedin" value="LinkedIn" />
                <TextInput
                  id="social.linkedin"
                  type="url"
                  value={formData.socialLinks.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              
              <div>
                <Label htmlFor="social.instagram" value="Instagram" />
                <TextInput
                  id="social.instagram"
                  type="url"
                  value={formData.socialLinks.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/username"
                />
              </div>
            </div>
          </div>

          {/* Sample Work */}
          <div>
            <Label htmlFor="samplePostUrl" value="Sample Work (Optional)" />
            <TextInput
              id="samplePostUrl"
              type="url"
              value={formData.samplePostUrl}
              onChange={handleChange}
              placeholder="https://example.com/your-sample-post"
              helperText="Link to your best work or a writing sample"
            />
          </div>

          {/* Application Tips */}
          <Alert color="info" className="mb-4">
            <div className="text-sm">
              <span className="font-semibold">Tips for a successful application:</span>
              <ul className="mt-2 space-y-1">
                <li>• Write a compelling bio that showcases your unique voice</li>
                <li>• Choose a niche you're passionate and knowledgeable about</li>
                <li>• Include relevant social media profiles to showcase your online presence</li>
                <li>• Provide a writing sample if available</li>
              </ul>
            </div>
          </Alert>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
              We typically review applications within 2-3 business days
            </p>
            <Button
              type="submit"
              gradientDuoTone="purpleToBlue"
              disabled={loading}
              className="min-w-[200px]"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* FAQ Section */}
      <Card className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">How long does approval take?</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              We review applications within 2-3 business days. You'll receive an email notification once your application is processed.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">What are the benefits of being a blogger?</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Bloggers get access to advanced publishing tools, analytics, monetization opportunities, and can build their personal brand.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Can I write about multiple topics?</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Yes! While we ask for your primary niche, you're welcome to write about various topics that interest you.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}