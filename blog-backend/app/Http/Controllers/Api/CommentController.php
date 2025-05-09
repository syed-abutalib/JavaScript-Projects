<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Post $post)
    {
        $comments = $post->comments()
                        ->with('user')
                        ->where('is_approved', true)
                        ->orderBy('created_at', 'desc')
                        ->get();
        
        return response()->json($comments);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Post $post)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        $comment = $post->comments()->create([
            'content' => $request->content,
            'user_id' => Auth::id(),
            'is_approved' => true, // Auto-approve for now, in a real app you might want to moderate
        ]);

        $comment->load('user');
        
        return response()->json($comment, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post, Comment $comment)
    {
        // Ensure the comment belongs to the post
        if ($comment->post_id !== $post->id) {
            return response()->json(['message' => 'Comment not found for this post'], 404);
        }

        $comment->load('user');
        
        return response()->json($comment);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post, Comment $comment)
    {
        // Ensure the comment belongs to the post
        if ($comment->post_id !== $post->id) {
            return response()->json(['message' => 'Comment not found for this post'], 404);
        }

        // Ensure the user owns the comment
        if ($comment->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'content' => 'required|string',
        ]);

        $comment->update([
            'content' => $request->content,
        ]);

        $comment->load('user');
        
        return response()->json($comment);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post, Comment $comment)
    {
        // Ensure the comment belongs to the post
        if ($comment->post_id !== $post->id) {
            return response()->json(['message' => 'Comment not found for this post'], 404);
        }

        // Ensure the user owns the comment or is an admin
        if ($comment->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();
        
        return response()->json(null, 204);
    }
}

