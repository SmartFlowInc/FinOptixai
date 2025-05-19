import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  AlertCircle, 
  ArrowRight, 
  Calendar, 
  Check, 
  Clock, 
  Edit2, 
  FilePlus, 
  MessageCircle, 
  MoreHorizontal, 
  Reply, 
  Send,
  Share, 
  ThumbsUp, 
  Trash2, 
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Types for our comment system
export interface CommentUser {
  id: number;
  name: string;
  avatarUrl?: string;
  role: string;
  isOnline?: boolean;
}

export interface CommentAttachment {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType: 'image' | 'document' | 'spreadsheet' | 'pdf' | 'other';
  fileSize: string;
  uploadedAt: Date;
}

export interface CommentReaction {
  type: 'like' | 'agree' | 'disagree' | 'question' | 'idea';
  count: number;
  users: CommentUser[];
}

export interface Comment {
  id: number;
  content: string;
  user: CommentUser;
  createdAt: Date;
  updatedAt?: Date;
  parentId?: number;
  children?: Comment[];
  attachments?: CommentAttachment[];
  reactions?: CommentReaction[];
  isEditing?: boolean;
  isHighlighted?: boolean;
  isPinned?: boolean;
  mentions?: CommentUser[];
  status?: 'pending' | 'resolved' | 'rejected';
}

export interface Thread {
  id: number;
  title: string;
  description?: string;
  comments: Comment[];
  status: 'active' | 'resolved' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  category?: string;
  tags?: string[];
  pinnedCommentIds?: number[];
  assignedTo?: CommentUser[];
}

export interface ThreadedCommentsProps {
  threads?: Thread[];
  currentUser: CommentUser;
  onAddComment?: (threadId: number, content: string, parentId?: number) => void;
  onEditComment?: (threadId: number, commentId: number, content: string) => void;
  onDeleteComment?: (threadId: number, commentId: number) => void;
  onResolveThread?: (threadId: number) => void;
  onAddReaction?: (threadId: number, commentId: number, reactionType: string) => void;
  editable?: boolean;
  maxHeight?: number;
}

// Mock users for demonstration
const mockUsers: CommentUser[] = [
  { id: 1, name: 'John Doe', role: 'Finance Manager', isOnline: true },
  { id: 2, name: 'Jane Smith', role: 'Marketing Director', isOnline: true },
  { id: 3, name: 'Michael Brown', role: 'CFO', isOnline: false },
  { id: 4, name: 'Emily Wilson', role: 'Budget Analyst', isOnline: true },
  { id: 5, name: 'Robert Taylor', role: 'CEO', isOnline: false }
];

// Mock threads for demonstration
const mockThreads: Thread[] = [
  {
    id: 1,
    title: 'Q4 Marketing Budget Allocation',
    description: 'Discussion for finalizing the Q4 marketing budget allocation across channels',
    comments: [
      {
        id: 1,
        content: 'Based on our Q3 performance, I recommend we increase the digital advertising budget by 15% and decrease print media by 10%.',
        user: mockUsers[1],
        createdAt: new Date('2023-09-10T14:30:00'),
        reactions: [
          { type: 'like', count: 2, users: [mockUsers[0], mockUsers[3]] },
          { type: 'idea', count: 1, users: [mockUsers[4]] }
        ],
        attachments: [
          { 
            id: 1, 
            fileName: 'Q3_Performance_Analysis.xlsx', 
            fileUrl: '#', 
            fileType: 'spreadsheet', 
            fileSize: '1.2 MB', 
            uploadedAt: new Date('2023-09-10T14:30:00') 
          }
        ]
      },
      {
        id: 2,
        content: 'I agree with increasing digital spend, but I think we should maintain print media spending since it performed well with our target demographic last quarter.',
        user: mockUsers[0],
        createdAt: new Date('2023-09-10T15:45:00'),
        parentId: 1
      },
      {
        id: 3,
        content: 'Let\'s look at the data more carefully. Our ROI on print was actually down 8% YoY. I\'ve attached the detailed breakdown.',
        user: mockUsers[3],
        createdAt: new Date('2023-09-10T16:20:00'),
        parentId: 2,
        attachments: [
          { 
            id: 2, 
            fileName: 'Print_Media_ROI_Analysis.pdf', 
            fileUrl: '#', 
            fileType: 'pdf', 
            fileSize: '850 KB', 
            uploadedAt: new Date('2023-09-10T16:20:00') 
          }
        ]
      },
      {
        id: 4,
        content: 'I\'ve reviewed the data and I think we should proceed with Jane\'s recommendation. Let\'s adjust the budget accordingly.',
        user: mockUsers[2],
        createdAt: new Date('2023-09-11T09:15:00'),
        reactions: [
          { type: 'agree', count: 3, users: [mockUsers[0], mockUsers[1], mockUsers[3]] }
        ],
        isPinned: true
      }
    ],
    status: 'active',
    createdAt: new Date('2023-09-10T14:30:00'),
    updatedAt: new Date('2023-09-11T09:15:00'),
    category: 'Budget Planning',
    tags: ['Marketing', 'Q4 Planning', 'Budget Allocation'],
    pinnedCommentIds: [4]
  },
  {
    id: 2,
    title: 'Q1 2024 Financial Forecast',
    status: 'active',
    createdAt: new Date('2023-09-15T10:20:00'),
    updatedAt: new Date('2023-09-16T14:30:00'),
    comments: [
      {
        id: 5,
        content: 'I\'ve started working on our Q1 2024 financial forecast. Based on current trends and pipeline, I\'m projecting a 12% revenue increase YoY.',
        user: mockUsers[0],
        createdAt: new Date('2023-09-15T10:20:00'),
        attachments: [
          { 
            id: 3, 
            fileName: 'Q1_2024_Forecast_Draft.xlsx', 
            fileUrl: '#', 
            fileType: 'spreadsheet', 
            fileSize: '1.5 MB', 
            uploadedAt: new Date('2023-09-15T10:20:00') 
          }
        ]
      },
      {
        id: 6,
        content: 'These projections look optimistic. Have we factored in the potential impact of the new competitors entering the market in December?',
        user: mockUsers[2],
        createdAt: new Date('2023-09-15T11:45:00'),
        parentId: 5
      },
      {
        id: 7,
        content: 'Good point. I\'ll adjust the forecast to account for potential market share impact. Initial analysis suggests it could reduce growth by 2-3%.',
        user: mockUsers[0],
        createdAt: new Date('2023-09-16T09:30:00'),
        parentId: 6
      }
    ],
    category: 'Financial Planning',
    tags: ['Forecast', '2024 Planning', 'Revenue']
  }
];

// Helper function to format comment time
const formatCommentTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);
  
  if (diffMins < 60) {
    return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
  
  return format(date, 'MMM d, yyyy');
};

// Helper function to reconstruct comment hierarchy
const buildCommentHierarchy = (comments: Comment[]): Comment[] => {
  const commentMap: Record<number, Comment> = {};
  const rootComments: Comment[] = [];
  
  // First pass: map each comment by ID
  comments.forEach(comment => {
    commentMap[comment.id] = { ...comment, children: [] };
  });
  
  // Second pass: build hierarchy
  comments.forEach(comment => {
    if (comment.parentId && commentMap[comment.parentId]) {
      if (!commentMap[comment.parentId].children) {
        commentMap[comment.parentId].children = [];
      }
      commentMap[comment.parentId].children!.push(commentMap[comment.id]);
    } else {
      rootComments.push(commentMap[comment.id]);
    }
  });
  
  return rootComments;
};

// File icon helper
const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case 'image':
      return '📷';
    case 'document':
      return '📄';
    case 'spreadsheet':
      return '📊';
    case 'pdf':
      return '📑';
    default:
      return '📎';
  }
};

// Individual comment component
const CommentItem: React.FC<{
  comment: Comment;
  currentUser: CommentUser;
  level?: number;
  threadId: number;
  onReply: (threadId: number, parentId: number) => void;
  onEdit: (threadId: number, commentId: number) => void;
  onDelete: (threadId: number, commentId: number) => void;
  onReaction: (threadId: number, commentId: number, reactionType: string) => void;
  editable?: boolean;
}> = ({
  comment,
  currentUser,
  level = 0,
  threadId,
  onReply,
  onEdit,
  onDelete,
  onReaction,
  editable = true
}) => {
  const isCurrentUser = comment.user.id === currentUser.id;
  const maxLevel = 3; // Maximum level of nesting
  
  return (
    <div className={`mb-3 ${level > 0 ? 'pl-4 ml-3 border-l border-gray-200' : ''} ${comment.isHighlighted ? 'bg-yellow-50 rounded-md p-2 border border-yellow-200' : ''}`}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          {comment.user.avatarUrl ? (
            <AvatarImage src={comment.user.avatarUrl} alt={comment.user.name} />
          ) : (
            <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
          )}
          {comment.user.isOnline && (
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-1 ring-white" />
          )}
        </Avatar>
        
        <div className="flex-1">
          <div className="bg-muted/40 p-3 rounded-lg">
            <div className="flex justify-between items-start mb-1">
              <div>
                <span className="font-medium">{comment.user.name}</span>
                <span className="text-xs text-muted-foreground ml-2">{comment.user.role}</span>
                {comment.isPinned && (
                  <Badge variant="outline" className="ml-2 text-xs">Pinned</Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatCommentTime(comment.createdAt)}
              </div>
            </div>
            
            <div className="text-sm mb-2">{comment.content}</div>
            
            {comment.attachments && comment.attachments.length > 0 && (
              <div className="mt-2 mb-3 flex flex-wrap gap-2">
                {comment.attachments.map(attachment => (
                  <div 
                    key={attachment.id} 
                    className="text-xs bg-background py-1 px-2 rounded-md border flex items-center"
                  >
                    <span className="mr-1">{getFileIcon(attachment.fileType)}</span>
                    <span className="truncate max-w-[140px]">{attachment.fileName}</span>
                    <span className="ml-2 text-muted-foreground">({attachment.fileSize})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Reactions */}
          {comment.reactions && comment.reactions.length > 0 && (
            <div className="flex gap-1 mt-1">
              {comment.reactions.map((reaction, idx) => (
                <div 
                  key={idx}
                  className="inline-flex items-center bg-muted/30 hover:bg-muted/70 px-1.5 py-0.5 rounded-full text-xs cursor-pointer"
                  onClick={() => onReaction(threadId, comment.id, reaction.type)}
                >
                  {reaction.type === 'like' && '👍'}
                  {reaction.type === 'agree' && '✅'}
                  {reaction.type === 'disagree' && '❌'}
                  {reaction.type === 'question' && '❓'}
                  {reaction.type === 'idea' && '💡'}
                  <span className="ml-1">{reaction.count}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Comment actions */}
          <div className="flex items-center gap-2 mt-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs"
              onClick={() => onReply(threadId, comment.id)}
            >
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs"
              onClick={() => onReaction(threadId, comment.id, 'like')}
            >
              <ThumbsUp className="h-3 w-3 mr-1" />
              Like
            </Button>
            
            {isCurrentUser && editable && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2 text-xs"
                  onClick={() => onEdit(threadId, comment.id)}
                >
                  <Edit2 className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onDelete(threadId, comment.id)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Render children comments */}
      {comment.children && comment.children.length > 0 && level < maxLevel && (
        <div className="mt-3">
          {comment.children.map(childComment => (
            <CommentItem
              key={childComment.id}
              comment={childComment}
              currentUser={currentUser}
              level={level + 1}
              threadId={threadId}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onReaction={onReaction}
              editable={editable}
            />
          ))}
        </div>
      )}
      
      {/* If too deeply nested, show a "View more replies" button */}
      {comment.children && comment.children.length > 0 && level >= maxLevel && (
        <div className="mt-2 ml-8 mb-2">
          <Button variant="ghost" size="sm" className="text-xs">
            <ArrowRight className="h-3 w-3 mr-1" />
            View {comment.children.length} more {comment.children.length === 1 ? 'reply' : 'replies'}
          </Button>
        </div>
      )}
    </div>
  );
};

// Thread component
const ThreadedComments: React.FC<ThreadedCommentsProps> = ({
  threads = mockThreads,
  currentUser = mockUsers[0],
  onAddComment,
  onEditComment,
  onDeleteComment,
  onResolveThread,
  onAddReaction,
  editable = true,
  maxHeight = 600
}) => {
  const [activeThreadId, setActiveThreadId] = useState<number>(threads.length > 0 ? threads[0].id : 0);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [newCommentText, setNewCommentText] = useState<string>('');
  
  const activeThread = threads.find(thread => thread.id === activeThreadId);
  
  // Build comment hierarchy for the active thread
  const hierarchicalComments = activeThread 
    ? buildCommentHierarchy(activeThread.comments)
    : [];
  
  // Handler for adding a new comment
  const handleAddComment = () => {
    if (newCommentText.trim() && activeThreadId) {
      if (onAddComment) {
        onAddComment(activeThreadId, newCommentText, replyingTo || undefined);
      }
      
      // Reset state
      setNewCommentText('');
      setReplyingTo(null);
    }
  };
  
  // Handler for starting a reply
  const handleReply = (threadId: number, commentId: number) => {
    setReplyingTo(commentId);
    setNewCommentText('');
    
    // Focus on the textarea
    setTimeout(() => {
      const textarea = document.getElementById('comment-textarea');
      if (textarea) {
        textarea.focus();
      }
    }, 0);
  };
  
  // Handler for editing a comment
  const handleEdit = (threadId: number, commentId: number) => {
    if (onEditComment) {
      // In a real app, we would set the comment to edit mode
      // and populate a form with its content
      onEditComment(threadId, commentId, "Edited comment content");
    }
  };
  
  // Handler for deleting a comment
  const handleDelete = (threadId: number, commentId: number) => {
    if (onDeleteComment) {
      onDeleteComment(threadId, commentId);
    }
  };
  
  // Handler for adding a reaction
  const handleReaction = (threadId: number, commentId: number, reactionType: string) => {
    if (onAddReaction) {
      onAddReaction(threadId, commentId, reactionType);
    }
  };
  
  // Cancel reply
  const cancelReply = () => {
    setReplyingTo(null);
    setNewCommentText('');
  };
  
  return (
    <div className="flex flex-col border rounded-lg overflow-hidden">
      {/* Thread selector */}
      <div className="p-3 bg-muted/20 border-b">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Discussion Threads</h3>
          <Button variant="outline" size="sm">
            <MessageCircle className="h-4 w-4 mr-1" />
            New Thread
          </Button>
        </div>
        
        {/* Thread tabs */}
        <div className="flex gap-2 mt-3">
          {threads.map(thread => (
            <Button
              key={thread.id}
              variant={activeThreadId === thread.id ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveThreadId(thread.id)}
            >
              {thread.title}
              {thread.status === 'resolved' && (
                <Check className="h-3 w-3 ml-1 text-green-600" />
              )}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Active thread content */}
      {activeThread && (
        <>
          <div className="p-4 border-b bg-card">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{activeThread.title}</h2>
                {activeThread.description && (
                  <p className="text-sm text-muted-foreground mt-1">{activeThread.description}</p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {activeThread.status === 'active' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onResolveThread && onResolveThread(activeThread.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Resolve
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Thread Actions</DropdownMenuLabel>
                    <DropdownMenuItem className="flex items-center">
                      <Share className="h-4 w-4 mr-2" />
                      Share Thread
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Assign Users
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Thread
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Thread metadata */}
            <div className="flex flex-wrap gap-2 mt-3">
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                Created {format(activeThread.createdAt, 'MMM d, yyyy')}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <MessageCircle className="h-3 w-3 mr-1" />
                {activeThread.comments.length} comments
              </div>
              
              {activeThread.tags && activeThread.tags.length > 0 && (
                <div className="flex items-center gap-1 ml-2">
                  {activeThread.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Comments section */}
          <div className="relative">
            <ScrollArea className="h-[400px] max-h-[calc(100vh-350px)]">
              <div className="p-4">
                {hierarchicalComments.length > 0 ? (
                  hierarchicalComments.map(comment => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      currentUser={currentUser}
                      threadId={activeThread.id}
                      onReply={handleReply}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onReaction={handleReaction}
                      editable={editable}
                    />
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No comments yet. Start the discussion!</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          
          {/* Comment input */}
          <div className="p-3 border-t bg-card">
            {replyingTo !== null && (
              <div className="flex justify-between items-center mb-2 px-2 py-1 bg-muted/30 rounded-md text-sm">
                <div className="flex items-center">
                  <Reply className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span>Replying to comment</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 py-0"
                  onClick={cancelReply}
                >
                  Cancel
                </Button>
              </div>
            )}
            
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                {currentUser.avatarUrl ? (
                  <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                ) : (
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                )}
                {currentUser.isOnline && (
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-1 ring-white" />
                )}
              </Avatar>
              
              <div className="flex-1 flex flex-col gap-2">
                <Textarea
                  id="comment-textarea"
                  placeholder={replyingTo !== null ? "Write a reply..." : "Add a comment..."}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  rows={2}
                />
                
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <FilePlus className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Attach File</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <AlertCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Mark as Important</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <Button 
                    onClick={handleAddComment}
                    disabled={!newCommentText.trim()}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    {replyingTo !== null ? 'Reply' : 'Comment'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThreadedComments;