// src/pages/WriteStory.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PhotoIcon } from '@heroicons/react/24/outline';
import apiService from '../services/api';

const STORY_CATEGORIES = [
  'Fiction', 'Non-Fiction', 'Romance', 'Thriller', 'Mystery',
  'Science Fiction', 'Fantasy', 'Horror', 'Adventure', 'Drama',
  'Comedy', 'Biography', 'Historical', 'Other'
];

function WriteStory() {
  const { slug } = useParams();
  const isEditMode = Boolean(slug);
  const navigate = useNavigate();

  const [storyId, setStoryId] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchStoryData = async () => {
        try {
          const story = await apiService.getStoryBySlug(slug);
          setStoryId(story._id);
          setTitle(story.title);
          setCategory(story.category);
          setContent(story.content);
          setCoverImagePreview(story.coverImage);
        } catch (err) {
          setError("Failed to load story data for editing.");
        }
      };
      fetchStoryData();
    }
  }, [slug, isEditMode]);

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category || !content) {
      setError('Please fill out all required fields.');
      return;
    }
    if (!isEditMode && !coverImageFile) {
      setError('A cover image is required for a new story.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('content', content);
    if (coverImageFile) {
      formData.append('coverImage', coverImageFile);
    }

    try {
      let resultStory;
      if (isEditMode) {
        resultStory = await apiService.updateStory(storyId, formData);
      } else {
        resultStory = await apiService.createStory(formData);
      }
      navigate(`/story/${resultStory.slug}`);
    } catch (err) {
      setError(err.message || 'Failed to save story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-xl shadow-teal-500/10 p-8 md:p-12 border border-teal-100">
        <h1 className="text-3xl font-bold text-premium-text mb-8 font-serif border-b border-teal-100 pb-4">
          {isEditMode ? 'Edit Your Story' : 'Write Your Story'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-bold text-premium-text mb-2 uppercase tracking-wide">Cover Image</label>
            <div className="relative w-full h-[350px] bg-teal-50/50 rounded-2xl border-2 border-dashed border-teal-200 hover:border-premium-gold transition-colors overflow-hidden group">
              {coverImagePreview ? (
                <>
                  <img src={coverImagePreview} alt="Cover Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold">
                    Click to Change Image
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-premium-slate-text/70 group-hover:text-premium-gold transition-colors">
                  <PhotoIcon className="w-16 h-16 mb-4" />
                  <p className="text-sm font-medium">Click to upload a cover image</p>
                  <p className="text-xs mt-1 opacity-70">Recommended size: 1200x600px</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleCoverImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-premium-text mb-2 uppercase tracking-wide">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full rounded-xl border-teal-200 shadow-sm focus:border-premium-gold focus:ring-premium-gold py-3 px-4 text-premium-text placeholder-premium-slate/50 bg-teal-50/30 transition-all"
                placeholder="Enter a captivating title..."
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-bold text-premium-text mb-2 uppercase tracking-wide">Category</label>
              <select
                name="category"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full rounded-xl border-teal-200 shadow-sm focus:border-premium-gold focus:ring-premium-gold py-3 px-4 text-premium-text bg-teal-50/30 transition-all"
                required
              >
                <option value="">Select a category</option>
                {STORY_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-bold text-premium-text mb-2 uppercase tracking-wide">Story Content</label>
            <textarea
              id="content"
              name="content"
              rows="15"
              className="block w-full rounded-xl border-teal-200 shadow-sm focus:border-premium-gold focus:ring-premium-gold py-4 px-6 text-premium-text placeholder-premium-slate/50 bg-teal-50/30 font-serif text-lg leading-relaxed transition-all"
              placeholder="Begin your story here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>
          {error && <div className="text-red-500 text-center bg-red-50 p-4 rounded-xl border border-red-100 font-medium">{error}</div>}
          <div className="flex justify-end pt-4 border-t border-teal-100">
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Publish Story')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WriteStory;
