// src/pages/StoryDetail.jsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/solid';
import { HandThumbUpIcon as HandThumbUpOutline, HandThumbDownIcon as HandThumbDownOutline } from '@heroicons/react/24/outline';

function StoryDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [story, setStory] = useState(null);
  const [comments, setComments] = useState([]);
  const [relatedStories, setRelatedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isFollowing, setIsFollowing] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);

  useEffect(() => {
    const fetchStoryAndComments = async () => {
      try {
        setLoading(true);
        setError('');

        const storyData = await apiService.getStoryBySlug(slug);
        setStory(storyData);

        setHasLiked(storyData.userEngagement?.hasLiked || false);
        setHasDisliked(storyData.userEngagement?.hasDisliked || false);

        // **FIX:** Correctly check if the current user's ID is in the author's followers array
        if (user && storyData.author?.followers) {
          setIsFollowing(storyData.author.followers.includes(user._id));
        }

        // Fetch comments independently
        if (storyData?._id) {
          try {
            const commentsData = await apiService.getStoryComments(storyData._id);
            setComments(commentsData.comments || []);
          } catch (e) {
            console.error("Failed to load comments:", e);
          }
        }

        // Fetch related stories independently
        if (storyData?._id) {
          try {
            const related = await apiService.getRelatedStories(storyData._id);
            setRelatedStories(related || []);
          } catch (e) {
            console.error("Failed to load related stories:", e);
          }
        }

      } catch (err) {
        console.error("Story load error:", err);
        setError('Failed to load the story. It may not exist or has been removed.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchStoryAndComments();
    }
  }, [slug, user]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      const createdComment = await apiService.createComment({
        content: newComment,
        storyId: story._id
      });
      setComments(prev => [createdComment, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Add comment error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async () => {
    if (!user) return;
    const originalLiked = hasLiked;
    const originalDisliked = hasDisliked;
    setHasLiked(!originalLiked);
    if (originalDisliked) setHasDisliked(false);
    try {
      await apiService.likeStory(story._id);
    } catch (err) {
      setHasLiked(originalLiked);
      setHasDisliked(originalDisliked);
    }
  };

  const handleDislike = async () => {
    if (!user) return;
    const originalLiked = hasLiked;
    const originalDisliked = hasDisliked;
    setHasDisliked(!originalDisliked);
    if (originalLiked) setHasLiked(false);
    try {
      await apiService.dislikeStory(story._id);
    } catch (err) {
      setHasLiked(originalLiked);
      setHasDisliked(originalDisliked);
    }
  };

  const handleFollowToggle = async () => {
    if (!user) return;
    const originalFollowing = isFollowing;
    setIsFollowing(!originalFollowing);
    try {
      if (originalFollowing) {
        await apiService.unfollowUser(story.author._id);
      } else {
        await apiService.followUser(story.author._id);
      }
    } catch (err) {
      setIsFollowing(originalFollowing);
    }
  };

  if (loading) { return <div className="text-center p-8">Loading story...</div>; }
  if (error) { return <div className="text-center p-8 text-red-600">{error}</div>; }
  if (!story) { return <div className="text-center p-8">Story not found.</div>; }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-xl shadow-teal-500/10 overflow-hidden border border-teal-100">
        <div className="relative h-[450px]">
          <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-premium-text/90 via-premium-text/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
            <span className="inline-block bg-premium-gold text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 shadow-lg shadow-teal-900/20">
              {story.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif leading-tight">{story.title}</h1>
            <div className="flex items-center space-x-6">
              <Link to={`/profile/${story.author.username}`} className="flex items-center group">
                <img
                  src={story.author.avatar || `https://ui-avatars.com/api/?name=${story.author.fullName}&background=random`}
                  alt={story.author.fullName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white/50 shadow-md group-hover:border-premium-gold transition-colors"
                />
                <div className="ml-4">
                  <p className="text-lg font-bold group-hover:text-premium-gold-light transition-colors">{story.author.fullName}</p>
                  <p className="text-sm text-teal-100 opacity-90">@{story.author.username}</p>
                </div>
              </Link>
              {user && user._id !== story.author._id && (
                <button onClick={handleFollowToggle} className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all shadow-lg ${isFollowing ? 'bg-white text-premium-text hover:bg-gray-100' : 'bg-premium-gold text-white hover:bg-teal-500'}`}>
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-8">
          <div className="prose prose-lg prose-teal max-w-none">
            <p className="text-premium-slate-text text-lg leading-loose whitespace-pre-line font-serif">{story.content}</p>
          </div>
        </div>

        <div className="border-t border-teal-100 p-8 flex justify-center items-center space-x-8 bg-teal-50/30">
          <button onClick={handleLike} className={`flex items-center space-x-2 transition-all transform active:scale-95 disabled:opacity-50 ${hasLiked ? 'text-premium-gold' : 'text-premium-slate hover:text-premium-gold'}`} disabled={!user}>
            {hasLiked ? <HandThumbUpIcon className="w-8 h-8" /> : <HandThumbUpOutline className="w-8 h-8" />}
            <span className="text-lg font-medium">{story.likes || 0} Likes</span>
          </button>
          <button onClick={handleDislike} className={`flex items-center space-x-2 transition-all transform active:scale-95 disabled:opacity-50 ${hasDisliked ? 'text-red-500' : 'text-premium-slate hover:text-red-500'}`} disabled={!user}>
            {hasDisliked ? <HandThumbDownIcon className="w-8 h-8" /> : <HandThumbDownOutline className="w-8 h-8" />}
            <span className="text-lg font-medium">Dislike</span>
          </button>
        </div>

        {/* Comment Section */}
        <div className="border-t border-teal-100 p-8 md:p-12 bg-white">
          <h3 className="text-2xl font-bold text-premium-text mb-8 font-serif">Comments ({comments.length})</h3>
          <form onSubmit={handleAddComment} className="mb-10 flex items-start space-x-4">
            <div className="hidden md:block w-10 h-10 rounded-full bg-teal-100 overflow-hidden flex-shrink-0">
              {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-premium-gold font-bold">{user?.fullName?.[0]}</div>}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows="3"
                className="w-full p-4 border border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent transition-shadow resize-none bg-teal-50/30 placeholder-gray-400 text-premium-text"
                disabled={!user}
              />
              <div className="mt-3 flex justify-end">
                <button type="submit" className="btn-primary" disabled={isSubmitting || !user}>
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </form>

          <div className="space-y-8">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="flex items-start space-x-4 pb-8 border-b border-teal-50 last:border-0 last:pb-0">
                  <img
                    src={comment.author.avatar || `https://ui-avatars.com/api/?name=${comment.author.fullName}&background=random`}
                    alt={comment.author.fullName}
                    className="w-10 h-10 rounded-full object-cover shadow-sm border border-teal-100"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-premium-text">{comment.author.fullName}</p>
                      <span className="text-xs text-premium-slate">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-premium-slate-text leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-teal-50/50 rounded-xl border border-teal-100 border-dashed">
                <p className="text-premium-slate italic">No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Stories Section */}
      {relatedStories.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-premium-text font-serif mb-8 text-center">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedStories.map((relatedStory) => (
              <div key={relatedStory._id} className="bg-white rounded-2xl shadow-md shadow-teal-500/5 hover:shadow-xl hover:shadow-teal-500/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col border border-teal-50">
                <Link to={`/story/${relatedStory.slug}`} className="block overflow-hidden">
                  <div className="relative h-48 transition-transform duration-500 hover:scale-105">
                    <img src={relatedStory.coverImage || 'https://placehold.co/600x400/f0fdfa/0d9488?text=Narrata'} alt={relatedStory.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </Link>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="mb-3">
                    <span className="inline-block bg-teal-50 text-premium-gold text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider border border-teal-100">
                      {relatedStory.category}
                    </span>
                  </div>
                  <Link to={`/story/${relatedStory.slug}`}>
                    <h3 className="text-lg font-bold text-premium-text mb-2 line-clamp-2 font-serif hover:text-premium-gold transition-colors">{relatedStory.title}</h3>
                  </Link>
                  <div className="flex items-center mt-auto pt-4 border-t border-teal-50">
                    <div className="w-5 h-5 rounded-full bg-teal-100 overflow-hidden mr-2">
                      {relatedStory.author.avatar ? (
                        <img src={relatedStory.author.avatar} alt={relatedStory.author.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-premium-gold">{relatedStory.author.fullName[0]}</div>
                      )}
                    </div>
                    <p className="text-xs text-premium-slate font-medium">by {relatedStory.author.fullName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StoryDetail;
