import React, {useState, useEffect} from 'react'
import { getProfile, uploadProfilePicture, updateProfileData } from '../api'

export default function Profile(){
  const [profile,setProfile]=useState(null)
  const [loading,setLoading]=useState(false)
  const [file,setFile]=useState(null)
  const [bio,setBio]=useState('')

  const fetch = async ()=>{
    setLoading(true)
    try{
      const res = await getProfile({})
      setProfile(res.data)
      setBio(res.data?.bio || '')
    }catch(e){ console.error(e) }
    finally{ setLoading(false) }
  }

  useEffect(()=>{ fetch() },[])

  const upload = async ()=>{
    if(!file) return alert('choose file')
    const fd = new FormData()
    fd.append('profile_picture', file)
    try{ await uploadProfilePicture(fd); alert('Uploaded'); fetch() }catch(e){ console.error(e) }
  }

  const save = async ()=>{
    try{ await updateProfileData({ bio }); alert('Saved'); fetch() }catch(e){ console.error(e) }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl mb-2">Your Profile</h2>
        {loading ? <p>Loading...</p> : profile && (
          <>
            <div className="mb-2">
              <img src={profile.profile_picture ? (import.meta.env.VITE_API_BASE_URL + '/' + profile.profile_picture) : ''} alt="" className="w-32 h-32 object-cover rounded-full"/>
            </div>
            <div className="mb-2"><strong>{profile.name}</strong></div>
            <div className="mb-2 text-sm text-gray-600">{profile.email}</div>

            <div className="mb-2">
              <textarea value={bio} onChange={e=>setBio(e.target.value)} className="w-full border p-2 rounded" />
            </div>

            <div className="flex gap-2">
              <input type="file" onChange={e=>setFile(e.target.files[0])}/>
              <button onClick={upload} className="px-3 py-1 bg-blue-600 text-white rounded">Upload</button>
              <button onClick={save} className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
