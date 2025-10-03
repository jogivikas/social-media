// src/pages/Home.jsx
import React, { useEffect, useState } from 'react'
import { getAllPosts, createPost, deletePost, commentPost, likePost } from '../api'
import PostCard from '../components/PostCard'

export default function Home() {
  const [posts, setPosts] = useState([]) // always keep an array here
  const [loading, setLoading] = useState(false)
  const [media, setMedia] = useState(null)
  const [text, setText] = useState('')

  // normalise possible response shapes into an array
  const normalizePosts = (resData) => {
    // common shapes:
    // 1) res.data is an array -> return resData
    // 2) res.data = { posts: [...] } -> return resData.posts
    // 3) res.data = { data: [...] } -> return resData.data
    // 4) res.data = { success: true, posts: [...] } -> posts
    // fallback: return empty array
    if (!resData) return []
    if (Array.isArray(resData)) return resData
    if (Array.isArray(resData.posts)) return resData.posts
    if (Array.isArray(resData.data)) return resData.data
    // sometimes endpoint returns { result: [...] }
    if (Array.isArray(resData.result)) return resData.result
    // if the server returned an object keyed by id or something, convert to array
    if (typeof resData === 'object') {
      // find first array property
      for (const k of Object.keys(resData)) {
        if (Array.isArray(resData[k])) return resData[k]
      }
    }
    return []
  }

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await getAllPosts()
      // axios returns the full response; data is usually res.data
      const got = res?.data
      const arr = normalizePosts(got)
      setPosts(arr)
    } catch (err) {
      console.error('Failed to fetch posts:', err)
      alert('Failed to fetch posts')
      setPosts([]) // ensure it's an array
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    try {
      const fd = new FormData()
      fd.append('text', text)
      if (media) fd.append('media', media)
      await createPost(fd)
      setText('')
      setMedia(null)
      fetch()
    } catch (err) {
      console.error(err)
      alert('Create failed')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete post?')) return
    try {
      await deletePost({ post_id: id })
      setPosts(prev => prev.filter(p => (p._id || p.id) !== id))
    } catch (err) {
      console.error(err)
      alert('Delete failed')
    }
  }

  const handleComment = async (postId, comment) => {
    try {
      await commentPost({ post_id: postId, comment })
      fetch()
    } catch (err) {
      console.error(err)
    }
  }

  const handleLike = async (postId) => {
    try {
      await likePost({ post_id: postId })
      fetch()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <form onSubmit={submit} className="mb-4 bg-white p-4 rounded shadow">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full border p-2 rounded mb-2"
        />
        <input type="file" onChange={e => setMedia(e.target.files[0])} className="mb-2" />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Post</button>
      </form>

      {loading ? <p>Loading...</p> : (
        posts.length === 0 ? (
          <p className="text-gray-600">No posts yet.</p>
        ) : (
          posts.map(p => (
            <PostCard
              key={p._id || p.id || JSON.stringify(p).slice(0, 8)}
              post={p}
              onDelete={handleDelete}
              onComment={handleComment}
              onLike={handleLike}
            />
          ))
        )
      )}
    </div>
  )
}
