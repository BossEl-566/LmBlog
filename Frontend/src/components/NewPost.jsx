import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { Button, Card, TextInput, Textarea, Label, Select, Alert, Badge, Modal, FileInput, Spinner, ModalHeader, ModalBody, ModalFooter } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Quote, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Image as ImageIcon,
  Link as LinkIcon,
  Code,
  Eye,
  Save,
  Send,
  Tag,
  Clock,
  User,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Client, Storage } from 'appwrite';

// Toolbar component for the editor
const MenuBar = ({ editor, onAddImage }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-t-lg p-2 bg-gray-50 dark:bg-gray-800 flex flex-wrap gap-1">
      {/* Text formatting */}
      <Button
        size="xs"
        color={editor.isActive('bold') ? 'blue' : 'gray'}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </Button>
      
      <Button
        size="xs"
        color={editor.isActive('italic') ? 'blue' : 'gray'}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </Button>
      
      <Button
        size="xs"
        color={editor.isActive('underline') ? 'blue' : 'gray'}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon size={16} />
      </Button>

      {/* Lists */}
      <Button
        size="xs"
        color={editor.isActive('bulletList') ? 'blue' : 'gray'}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </Button>
      
      <Button
        size="xs"
        color={editor.isActive('orderedList') ? 'blue' : 'gray'}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </Button>

      {/* Block elements */}
      <Button
        size="xs"
        color={editor.isActive('blockquote') ? 'blue' : 'gray'}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={16} />
      </Button>
      
      <Button
        size="xs"
        color={editor.isActive('codeBlock') ? 'blue' : 'gray'}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code size={16} />
      </Button>

      {/* Text alignment */}
      <Button
        size="xs"
        color={editor.isActive({ textAlign: 'left' }) ? 'blue' : 'gray'}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <AlignLeft size={16} />
      </Button>
      
      <Button
        size="xs"
        color={editor.isActive({ textAlign: 'center' }) ? 'blue' : 'gray'}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <AlignCenter size={16} />
      </Button>
      
      <Button
        size="xs"
        color={editor.isActive({ textAlign: 'right' }) ? 'blue' : 'gray'}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <AlignRight size={16} />
      </Button>

      {/* Headings */}
      <Select
        size="xs"
        value={editor.getAttributes('heading').level || 'paragraph'}
        onChange={(e) => {
          const level = e.target.value;
          if (level === 'paragraph') {
            editor.chain().focus().setParagraph().run();
          } else {
            editor.chain().focus().toggleHeading({ level: parseInt(level) }).run();
          }
        }}
        className="w-32"
      >
        <option value="paragraph">Paragraph</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="4">Heading 4</option>
      </Select>

      {/* Media */}
      <Button
        size="xs"
        color="gray"
        onClick={onAddImage}
      >
        <ImageIcon size={16} />
      </Button>

      {/* Link */}
      <Button
        size="xs"
        color={editor.isActive('link') ? 'blue' : 'gray'}
        onClick={() => {
          const url = window.prompt('URL');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
      >
        <LinkIcon size={16} />
      </Button>
    </div>
  );
};

export default function CreatePost() {
  const { currentUser } = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [coverImageUploading, setCoverImageUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [coverImageFileUrl, setCoverImageFileUrl] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    status: 'draft',
    tags: [],
    category: '',
    coverImage: {
      url: '',
      altText: ''
    }
  });
  const [newTag, setNewTag] = useState('');

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      // Calculate reading time (approx 200 words per minute)
      const text = editor.getText();
      const wordCount = text.trim().split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    },
  });

  // Handle image upload for editor images
  const handleImageUpload = useCallback(async (file) => {
    setImageUploading(true);
    try {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }

      const client = new Client()
        .setEndpoint(import.meta.env.VITE_APPWRITE_API_ENDPOINT)
        .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

      const storage = new Storage(client);

      const response = await storage.createFile(
        import.meta.env.VITE_APPWRITE_BUCKET_ID,
        "unique()",
        file
      );
      
      const imageUrl = storage.getFilePreview(
        import.meta.env.VITE_APPWRITE_BUCKET_ID,
        response.$id
      );

      // Insert image into editor
      if (editor && imageUrl) {
        editor.chain().focus().setImage({ src: imageUrl }).run();
      }

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  }, [editor]);

  // Handle cover image upload
  const handleCoverImageUpload = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setCoverImageFile(file);
    setCoverImageFileUrl(URL.createObjectURL(file));
    setCoverImageUploading(true);

    try {
      const client = new Client()
        .setEndpoint(import.meta.env.VITE_APPWRITE_API_ENDPOINT)
        .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

      const storage = new Storage(client);

      const response = await storage.createFile(
        import.meta.env.VITE_APPWRITE_BUCKET_ID,
        "unique()",
        file
      );
      
      const imageUrl = storage.getFilePreview(
        import.meta.env.VITE_APPWRITE_BUCKET_ID,
        response.$id
      );

      setFormData(prev => ({
        ...prev,
        coverImage: {
          ...prev.coverImage,
          url: imageUrl,
          altText: prev.coverImage.altText || file.name
        }
      }));

      toast.success('Cover image uploaded successfully');
    } catch (error) {
      console.error('Cover image upload error:', error);
      toast.error('Failed to upload cover image');
    } finally {
      setCoverImageUploading(false);
    }
  };

  // Add image via URL
  const handleAddImage = () => {
    const url = window.prompt('Enter image URL');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  // Add tag
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()]
      }));
      setNewTag('');
    }
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Convert editor content to contentBlocks format
  const convertToContentBlocks = () => {
    if (!editor) return [];

    const blocks = [];
    const doc = editor.getJSON();

    doc.content?.forEach(node => {
      switch (node.type) {
        case 'paragraph':
          blocks.push({
            type: 'paragraph',
            data: {
              text: node.content?.[0]?.text || '',
              align: node.attrs?.textAlign || 'left'
            }
          });
          break;
        case 'heading':
          blocks.push({
            type: 'heading',
            data: {
              level: node.attrs?.level,
              text: node.content?.[0]?.text || '',
              align: node.attrs?.textAlign || 'left'
            }
          });
          break;
        case 'bulletList':
          node.content?.forEach(listItem => {
            blocks.push({
              type: 'bulletList',
              data: {
                items: listItem.content?.map(item => item.content?.[0]?.text || '') || []
              }
            });
          });
          break;
        case 'orderedList':
          node.content?.forEach(listItem => {
            blocks.push({
              type: 'orderedList',
              data: {
                items: listItem.content?.map(item => item.content?.[0]?.text || '') || []
              }
            });
          });
          break;
        case 'blockquote':
          blocks.push({
            type: 'quote',
            data: {
              text: node.content?.[0]?.content?.[0]?.text || '',
              align: node.attrs?.textAlign || 'left'
            }
          });
          break;
        case 'codeBlock':
          blocks.push({
            type: 'code',
            data: {
              code: node.content?.[0]?.text || '',
              language: node.attrs?.language || 'plaintext'
            }
          });
          break;
        case 'image':
          blocks.push({
            type: 'image',
            data: {
              url: node.attrs?.src,
              altText: node.attrs?.alt || '',
              caption: node.attrs?.title || ''
            }
          });
          break;
        default:
          break;
      }
    });

    return blocks;
  };

  // Handle form submission for review
  const handleSubmitForReview = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error('Title is required');
      return;
    }

    if (!editor?.getText().trim()) {
      toast.error('Post content is required');
      return;
    }

    setSaving(true);

    try {
      const contentBlocks = convertToContentBlocks();
      const wordCount = editor.getText().trim().split(/\s+/).length;
      const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

      const postData = {
        ...formData,
        status: 'pending_review', // Always submit for review
        content: editor.getHTML(), // Using content instead of contentBlocks for your controller
        contentBlocks,
        contentMarkdown: editor.getText(), // Fallback content
        readingTimeMinutes
      };

      const response = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit post for review');
      }

      toast.success('Post submitted for review! An admin will review it before publication.');
      
      // Redirect to drafts or posts list
      setTimeout(() => {
        window.location.href = '/dashboard?tab=drafts';
      }, 2000);

    } catch (error) {
      console.error('Post submission error:', error);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Save as draft
  const handleSaveDraft = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error('Title is required');
      return;
    }

    setSaving(true);

    try {
      const contentBlocks = convertToContentBlocks();
      const wordCount = editor?.getText().trim().split(/\s+/).length || 0;
      const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

      const postData = {
        ...formData,
        status: 'draft',
        content: editor?.getHTML() || '',
        contentBlocks,
        contentMarkdown: editor?.getText() || '',
        readingTimeMinutes
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save draft');
      }

      toast.success('Draft saved successfully!');
      
    } catch (error) {
      console.error('Draft save error:', error);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Preview content
  const getPreviewContent = () => {
    if (!editor) return '';
    return editor.getHTML();
  };

  if (!currentUser?.isAuthor) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <User className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Author Access Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              You need to be an approved author to create posts. Please apply for blogger access first.
            </p>
            <Button gradientDuoTone="purpleToBlue" href="/request-blogger">
              Apply to Become a Blogger
            </Button>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Post</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Write and submit your content for admin review
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            color="light"
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2"
          >
            <Eye size={16} />
            Preview
          </Button>
          <Button
            color="gray"
            onClick={handleSaveDraft}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button
            gradientDuoTone="purpleToBlue"
            onClick={handleSubmitForReview}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Send size={16} />
            {saving ? 'Submitting...' : 'Submit for Review'}
          </Button>
        </div>
      </div>

      {/* Review Notice */}
      {!currentUser.isAdmin && (
        <Alert color="info" className="mb-6">
          <div className="flex items-center gap-2">
            <Shield size={20} />
            <div>
              <span className="font-semibold">Admin Review Required</span>
              <p className="text-sm mt-1">
                All posts must be reviewed by an administrator before they can be published. 
                You can save drafts or submit for review.
              </p>
            </div>
          </div>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <Card>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" value="Post Title *" />
                <TextInput
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter a compelling title..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt" value="Excerpt" />
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief summary of your post (max 300 characters)"
                  rows={3}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formData.excerpt.length}/300 characters</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Content Editor */}
          <Card>
            <Label value="Content *" className="block mb-2" />
            <MenuBar editor={editor} onAddImage={handleAddImage} />
            <div className="border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg">
              <EditorContent 
                editor={editor} 
                className="prose prose-lg max-w-none p-4 min-h-[400px] dark:prose-invert focus:outline-none"
              />
            </div>
            {imageUploading && (
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                <Spinner size="sm" />
                Uploading image...
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Post Settings */}
          <Card>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Post Settings</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category" value="Category" />
                <Select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="">Select a category</option>
                  <option value="technology">Technology</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="travel">Travel</option>
                  <option value="business">Business</option>
                  {/* Add more categories as needed */}
                </Select>
              </div>
            </div>
          </Card>

          {/* Cover Image */}
          <Card>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Cover Image</h3>
            <div className="space-y-4">
              {formData.coverImage.url ? (
                <div>
                  <img 
                    src={formData.coverImage.url} 
                    alt={formData.coverImage.altText} 
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <TextInput
                    placeholder="Alt text for accessibility"
                    value={formData.coverImage.altText}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      coverImage: { ...prev.coverImage, altText: e.target.value }
                    }))}
                  />
                  <Button
                    color="red"
                    size="xs"
                    className="mt-2"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      coverImage: { url: '', altText: '' }
                    }))}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div>
                  <FileInput
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleCoverImageUpload(file);
                      }
                    }}
                    helperText="Upload a cover image for your post (max 5MB)"
                  />
                  {coverImageUploading && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <Spinner size="sm" />
                      Uploading cover image...
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Tags */}
          <Card>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <TextInput
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button size="xs" onClick={handleAddTag}>
                  <Tag size={14} />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} color="gray" className="flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* Post Information */}
          <Card>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Post Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Author:</span>
                <span className="font-medium">{currentUser.username}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <Badge color="yellow">Draft</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Reading Time:</span>
                <span className="font-medium flex items-center gap-1">
                  <Clock size={14} />
                  {editor ? Math.max(1, Math.ceil(editor.getText().trim().split(/\s+/).length / 200)) : 1} min
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Word Count:</span>
                <span className="font-medium">
                  {editor ? editor.getText().trim().split(/\s+/).length : 0}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal show={showPreview} onClose={() => setShowPreview(false)} size="7xl">
        <ModalHeader>Post Preview</ModalHeader>
        <ModalBody>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            {formData.coverImage.url && (
              <img 
                src={formData.coverImage.url} 
                alt={formData.coverImage.altText}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}
            <h1>{formData.title}</h1>
            {formData.excerpt && (
              <div className="text-lg text-gray-600 dark:text-gray-400 italic mb-6">
                {formData.excerpt}
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: getPreviewContent() }} />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setShowPreview(false)}>Close Preview</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}