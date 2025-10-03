import React, {useState, useEffect} from 'react'
import { getComments } from '../api'

export default function PostCard({post, onDelete, onComment, onLike}){
  const [showComments,setShowComments]=useState(false)
  const [commentText,setCommentText]=useState('')
  const [comments,setComments]=useState([])

  useEffect(()=>{ if(showComments) loadComments() },[showComments])

  const loadComments = async ()=>{
    try{
      const res = await getComments({ post_id: post._id })
      setComments(res.data || [])
    }catch(e){ console.error(e) }
  }

  const submitComment = (e)=>{
    e.preventDefault()
    if(!commentText) return
    onComment(post._id, commentText)
    setCommentText('')
    setShowComments(true)
  }

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="flex justify-between">
        <div>
          <div className="font-semibold">{post.user_name || post.user}</div>
          <div className="text-sm text-gray-600">{post.text}</div>
        </div>
        <div className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</div>
      </div>

      {post.media && (
        <div className="mt-3">
          <img src={import.meta.env.VITE_API_BASE_URL + '/' + post.media} alt="media" className="max-h-60 object-contain" />
        </div>
      )}

      <div className="flex gap-2 mt-3">
        <button onClick={()=>onLike(post._id)} className="px-2 py-1 border rounded">Like {post.likes || 0}</button>
        <button onClick={()=>setShowComments(s=>!s)} className="px-2 py-1 border rounded">Comments</button>
      <button onClick={() => onDelete(post._id || post.id)} className="px-2 py-1 border rounded text-red-600">Delete</button>

      </div>

      {showComments && (
        <div className="mt-3">
          {comments.length===0 && <p className="text-sm text-gray-500">No comments</p>}
          {comments.map(c=>(
            <div key={c._id} className="text-sm border-b py-1">
              <strong>{c.user_name||c.user}</strong>: {c.comment}
            </div>
          ))}

          <form onSubmit={submitComment} className="mt-2">
            <input value={commentText} onChange={e=>setCommentText(e.target.value)} className="w-full border p-2 rounded" placeholder="Write a comment"/>
          </form>
        </div>
      )}
    </div>
  )
}
