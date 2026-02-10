// src/pages/Profile.jsx

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

// Reusable input for tidy JSX
const ProfileInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1">
      <input
        type={type}
        name={name}
        id={name}
        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

function Profile() {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editError, setEditError] = useState('');

  // Avatar upload state
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    location: '',
    website: '',
    socialLinks: { twitter: '', github: '', linkedin: '' },
  });

  // Avoid setting state after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  // Load stories + seed form data when user changes
  useEffect(() => {
    const init = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      // Seed form with user data
      setFormData({
        fullName: user.fullName || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        socialLinks: {
          twitter: user.socialLinks?.twitter || '',
          github: user.socialLinks?.github || '',
          linkedin: user.socialLinks?.linkedin || '',
        },
      });

      // Fetch stories
      try {
        setError(null);
        const response = await apiService.request(`/users/${user.username}/stories`);
        if (!mountedRef.current) return;
        setStories(response?.stories || []);
      } catch (err) {
        if (!mountedRef.current) return;
        setStories([]);
        setError('Failed to load your stories.');
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    init();
  }, [user]);

  // Toggle edit mode
  const handleEditToggle = () => {
    setIsEditing(prev => !prev);
    setEditError('');
    setAvatarError('');
    // Reset ephemeral avatar state on toggle off
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
      setAvatarFile(null);
    }
  };

  // Handlers for profile fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setEditError('');

    try {
      const updatedUser = await apiService.updateProfile(formData);
      setUser(updatedUser);
      // Keep localStorage user in sync if your app uses it elsewhere
      try {
        const lsUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...lsUser, ...updatedUser }));
      } catch (_) { }
      setIsEditing(false);
    } catch (err) {
      setEditError(err?.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleDeleteStory = async (storyId) => {
    if (window.confirm('Are you sure you want to delete this story? This cannot be undone.')) {
      try {
        await apiService.deleteStory(storyId);
        setStories(prev => prev.filter(s => s._id !== storyId));
      } catch (err) {
        setError('Failed to delete the story. Please try again.');
      }
    }
  };

  // ------ AVATAR: select/validate/upload ------
  const validateAvatar = (file) => {
    if (!file) return 'No file selected.';
    const maxMB = 5; // adjust as needed
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (!allowed.includes(file.type)) return 'Only JPG, PNG, WEBP, or GIF images are allowed.';
    if (file.size > maxMB * 1024 * 1024) return `File is too large. Max ${maxMB}MB.`;
    return '';
  };

  const onPickAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e) => {
    setAvatarError('');
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateAvatar(file);
    if (err) {
      setAvatarError(err);
      setAvatarFile(null);
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(null);
      }
      return;
    }
    // Preview
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    const url = URL.createObjectURL(file);
    setAvatarFile(file);
    setAvatarPreview(url);
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      setAvatarError('Please select an image first.');
      return;
    }
    setAvatarUploading(true);
    setAvatarError('');

    const fd = new FormData();
    fd.append('avatar', avatarFile);

    try {
      const updatedUser = await apiService.updateUserAvatar(fd);
      setUser(updatedUser);
      try {
        const lsUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...lsUser, ...updatedUser }));
      } catch (_) { }

      // Clear local preview and input
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
      setAvatarFile(null);
    } catch (err) {
      setAvatarError(err?.message || 'Failed to upload avatar.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleAvatarCancel = () => {
    setAvatarError('');
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(null);
    setAvatarFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (loading) {
    return <div className="text-center p-8">Loading profile...</div>;
  }
  if (!user) {
    return <div className="text-center p-8">Please log in to view your profile.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* PROFILE CARD */}
      <div className="bg-white rounded-2xl shadow-xl shadow-teal-500/10 p-8 mb-8 border border-teal-100 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-teal-50 to-white/0 -z-0"></div>

        {isEditing ? (
          // ----- EDIT MODE (form only here) -----
          <form onSubmit={handleSave} className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start">
              {/* Avatar block with upload controls */}
              <div className="flex flex-col items-center sm:items-start">
                <div className="w-32 h-32 bg-teal-50 rounded-full flex items-center justify-center text-premium-gold text-4xl font-bold mb-6 overflow-hidden relative group border-4 border-white shadow-lg">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="New avatar preview" className="w-full h-full object-cover" />
                  ) : user.avatar ? (
                    <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    (user.fullName?.charAt(0) || user.username?.charAt(0) || '?').toUpperCase()
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={avatarUploading}
                />

                <div className="flex flex-col gap-3 w-full">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-bold text-premium-gold border-2 border-premium-gold rounded-full hover:bg-teal-50 transition-colors w-full"
                    onClick={onPickAvatarClick}
                    disabled={avatarUploading}
                  >
                    {avatarPreview ? 'Pick another' : 'Choose avatar'}
                  </button>

                  {avatarPreview && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="flex-1 btn-primary text-xs py-2"
                        onClick={handleAvatarUpload}
                        disabled={avatarUploading}
                      >
                        {avatarUploading ? '...' : 'Upload'}
                      </button>
                      <button
                        type="button"
                        className="flex-1 px-3 py-2 text-xs font-bold text-gray-500 hover:text-red-500 transition-colors"
                        onClick={handleAvatarCancel}
                        disabled={avatarUploading}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {avatarError && (
                  <div className="mt-2 text-sm text-red-600 text-center sm:text-left">{avatarError}</div>
                )}
              </div>

              <div className="sm:ml-12 w-full text-left mt-8 sm:mt-0">
                <div className="space-y-6">
                  <ProfileInput
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                  />
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-premium-text mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      className="shadow-sm block w-full sm:text-sm border-teal-200 rounded-xl focus:ring-premium-gold focus:border-premium-gold bg-teal-50/30"
                      placeholder="A short bio about yourself"
                      value={formData.bio}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileInput
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, Country"
                    />
                    <ProfileInput
                      label="Website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://your-website.com"
                    />
                  </div>

                  <div className="pt-4 border-t border-teal-50">
                    <h3 className="text-sm font-bold text-premium-text uppercase tracking-wide mb-4">Social Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <ProfileInput
                        label="Twitter"
                        name="twitter"
                        value={formData.socialLinks.twitter}
                        onChange={handleSocialChange}
                        placeholder="@username"
                      />
                      <ProfileInput
                        label="GitHub"
                        name="github"
                        value={formData.socialLinks.github}
                        onChange={handleSocialChange}
                        placeholder="username"
                      />
                      <ProfileInput
                        label="LinkedIn"
                        name="linkedin"
                        value={formData.socialLinks.linkedin}
                        onChange={handleSocialChange}
                        placeholder="username"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="sm:ml-auto mt-8 sm:mt-0 flex flex-col gap-3 self-start min-w-[120px]">
                <button type="submit" className="btn-primary w-full" disabled={isSubmitting || avatarUploading}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={handleEditToggle} className="btn-secondary w-full text-center" disabled={isSubmitting || avatarUploading}>
                  Cancel
                </button>
              </div>
            </div>

            {editError && <div className="mt-4 text-center text-red-600">{editError}</div>}
          </form>
        ) : (
          // ----- VIEW MODE (no form here) -----
          <div className="flex flex-col sm:flex-row items-start relative z-10">
            <div className="w-32 h-32 bg-teal-50 rounded-full flex items-center justify-center text-premium-gold text-4xl font-bold mb-6 sm:mb-0 overflow-hidden relative group flex-shrink-0 border-4 border-white shadow-lg">
              {user.avatar ? (
                <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                (user.fullName?.charAt(0) || user.username?.charAt(0) || '?').toUpperCase()
              )}
            </div>

            <div className="sm:ml-12 w-full text-center sm:text-left">
              <h1 className="text-3xl font-bold text-premium-text font-serif">{user.fullName}</h1>
              <p className="text-premium-gold font-medium">@{user.username}</p>
              <p className="text-premium-slate mt-4 max-w-2xl leading-relaxed">{user.bio || 'No bio available'}</p>

              <div className="flex flex-wrap gap-4 mt-6 text-sm text-premium-slate-text">
                {user.location && <span className="flex items-center">📍 {user.location}</span>}
                {user.website && <span className="flex items-center">🔗 <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:text-premium-gold transition-colors">{user.website.replace(/^https?:\/\//, '')}</a></span>}
              </div>

              <div className="flex justify-center sm:justify-start space-x-12 mt-8 py-6 border-y border-teal-50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-premium-text font-serif">{user.stats?.totalStories || 0}</div>
                  <div className="text-xs font-bold text-premium-slate uppercase tracking-wider mt-1">Stories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-premium-text font-serif">{user.stats?.followerCount || 0}</div>
                  <div className="text-xs font-bold text-premium-slate uppercase tracking-wider mt-1">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-premium-text font-serif">{user.stats?.followingCount || 0}</div>
                  <div className="text-xs font-bold text-premium-slate uppercase tracking-wider mt-1">Following</div>
                </div>
              </div>
            </div>

            <div className="sm:ml-auto mt-8 sm:mt-0 flex flex-col gap-3 self-start min-w-[140px]">
              <button type="button" onClick={handleEditToggle} className="btn-primary w-full text-sm">
                Edit Profile
              </button>
              <button type="button" onClick={handleLogout} className="px-4 py-2 text-sm font-bold text-premium-slate hover:text-red-500 transition-colors">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* STORIES LIST */}
      <div className="bg-white rounded-2xl shadow-xl shadow-teal-500/10 p-8 border border-teal-100">
        <div className="flex justify-between items-center mb-8 border-b border-teal-100 pb-4">
          <h2 className="text-2xl font-bold text-premium-text font-serif">My Stories</h2>
          <button className="btn-primary flex items-center gap-2" type="button" onClick={() => navigate('/write')}>
            <span>+</span> Create New Story
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100">{error}</div>
        )}

        {stories.length === 0 && !error ? (
          <div className="text-center py-12 bg-teal-50/30 rounded-xl border border-teal-100 border-dashed">
            <p className="text-premium-slate">You haven't written any stories yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stories.map((story) => (
              <div key={story._id} className="bg-white border border-teal-100 rounded-xl p-6 flex flex-col justify-between hover:shadow-lg hover:shadow-teal-500/5 transition-all group">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-premium-text group-hover:text-premium-gold transition-colors font-serif">{story.title}</h3>
                      <span className="inline-block bg-teal-50 text-premium-gold text-xs font-bold px-2 py-1 rounded-md mt-2 uppercase tracking-wide border border-teal-100">
                        {story.category}
                      </span>
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${story.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{story.status}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-teal-50">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-teal-50 px-2 py-1 rounded-full">
                      <span className="text-yellow-400 text-xs">★</span>
                      <span className="ml-1 text-xs font-bold text-premium-text">
                        {typeof story.rating === 'number' ? story.rating.toFixed(1) : '0.0'}
                      </span>
                    </div>
                    <div className="text-xs text-premium-slate">{story.stats?.views || 0} views</div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/edit-story/${story.slug}`)}
                      className="text-premium-gold hover:text-premium-gold-dark font-bold text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteStory(story._id)}
                      className="text-premium-slate hover:text-red-500 font-bold text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
