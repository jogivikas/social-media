import React, {useEffect, useState} from 'react'
import { getAllUsers, sendConnectionRequest, getMyConnectionRequests, acceptConnectionRequest } from '../api'

export default function Connections(){
  const [users,setUsers]=useState([])
  const [requests,setRequests]=useState([])

  const fetchUsers = async ()=>{ try{ const res=await getAllUsers(); setUsers(res.data || []) }catch(e){console.error(e)} }
  const fetchReq = async ()=>{ try{ const res = await getMyConnectionRequests(); setRequests(res.data || []) }catch(e){console.error(e)} }

  useEffect(()=>{ fetchUsers(); fetchReq() },[])

  const send = async (uid)=>{ try{ await sendConnectionRequest({ to_user: uid }); alert('Sent'); fetchReq() }catch(e){console.error(e)} }
  const accept = async (id)=>{ try{ await acceptConnectionRequest({ request_id: id }); alert('Accepted'); fetchReq() }catch(e){console.error(e)} }

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">People</h3>
        {users.map(u=>(
          <div key={u._id} className="flex justify-between items-center py-2 border-b">
            <div>{u.name} <div className="text-sm text-gray-500">{u.email}</div></div>
            <button onClick={()=>send(u._id)} className="px-3 py-1 bg-blue-600 text-white rounded">Connect</button>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Requests</h3>
        {requests.map(r=>(
          <div key={r._id} className="flex justify-between items-center py-2 border-b">
            <div>{r.from_user_name}</div>
            <button onClick={()=>accept(r._id)} className="px-3 py-1 bg-green-600 text-white rounded">Accept</button>
          </div>
        ))}
      </div>
    </div>
  )
}
