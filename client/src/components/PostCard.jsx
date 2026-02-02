import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';

const PostCard = ({ post }) => {
    const { user, token } = useAuth();
    const [isLiked, setIsLiked] = useState(Boolean(post.likes?.[user?._id]));
    const [likeCount, setLikeCount] = useState(Object.keys(post.likes || {}).length);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(post.comments || []);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLike = async () => {
        if (!user) return;
        try {
            const response = await axios.patch(`/posts/${post._id}/like`,
                { userId: user._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsLiked(!isLiked);
            setLikeCount(Object.keys(response.data.likes).length);
        } catch (err) {
            console.error("Error liking post", err);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setIsLoading(true);
        try {
            const response = await axios.post(`/posts/${post._id}/comment`,
                { userId: user._id, comment: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComments(response.data.comments);
            setNewComment('');
        } catch (err) {
            console.error("Error commenting", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await axios.delete(`/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Ideally we should update the parent state or trigger a reload
            // For now, let's just reload the page or hide the card (simplest for this architecture)
            window.location.reload();
        } catch (err) {
            console.error("Error deleting post", err);
        }
    };

    return (
        <Card variant="default" className="w-full bg-white mb-6 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link to={`/profile/${post.userId}`}>
                        {post.userAvatar ? (
                            <img src={post.userAvatar} alt={post.username} className="w-10 h-10 rounded-full object-cover hover:opacity-80 transition-opacity" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold hover:bg-primary-200 transition-colors">
                                {post.rollNumber?.[0]?.toUpperCase()}
                            </div>
                        )}
                    </Link>
                    <div>
                        <Link to={`/profile/${post.userId}`} className="font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                            {post.rollNumber}
                        </Link>
                        <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                    </div>
                </div>
                {(user?._id === post.userId || user?.role === 'admin') && (
                    <button
                        onClick={() => handleDelete(post._id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Post"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                )}
            </div>

            <div className="p-4">
                <p className="text-gray-700 leading-relaxed mb-4">{post.description}</p>
                {post.filePath && (
                    <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-3">
                        <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                            📄
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="font-semibold text-sm truncate">{post.originalFileName || post.filePath}</p>
                            <a
                                href={`http://localhost:5000/assets/${post.filePath}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary-600 hover:underline"
                            >
                                Download / View
                            </a>
                        </div>
                    </div>
                )}
                {post.picturePath && (
                    <div className="rounded-xl overflow-hidden mb-4 bg-gray-100">
                        <img
                            src={`http://localhost:5000/assets/${post.picturePath}`}
                            alt="Post content"
                            className="w-full h-auto object-cover max-h-96"
                        />
                    </div>
                )}
            </div>

            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                            }`}
                    >
                        <svg className={`w-5 h-5 ${isLiked ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                        <span>{likeCount}</span>
                    </button>
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-500 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M19 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                        <span>{comments.length}</span>
                    </button>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="bg-gray-50 p-4 border-t border-gray-100">
                    <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
                        {comments.map((comment, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold shrink-0">
                                    {comment.rollNumber?.[0]?.toUpperCase()}
                                </div>
                                <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm flex-1">
                                    <div className="flex justify-between items-start">
                                        <span className="font-semibold text-sm text-gray-900">{comment.rollNumber}</span>
                                        <span className="text-xs text-gray-400">Just now</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mt-1">{comment.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleComment} className="flex gap-2">
                        <Input
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="bg-white"
                        />
                        <Button type="submit" size="md" disabled={!newComment.trim()} isLoading={isLoading}>
                            Post
                        </Button>
                    </form>
                </div>
            )}
        </Card>
    );
};

export default PostCard;
