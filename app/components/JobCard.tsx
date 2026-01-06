'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// 1. Define what a "Job" looks like
interface Job {
  id: any; // We use 'any' here to be safe (it could be a number or a text UUID)
  company_name: string;
  job_title: string;
  status: string;
  date_applied: string;
  interview_date: string; // formatting as string is standard for dates from DB
}

export default function JobCard({ job }: { job: Job }) {
  // 1. State to track if we are in "Edit Mode"
  const [isEditing, setIsEditing] = useState(false)
  
  // 2. State for the form fields
  const [status, setStatus] = useState(job.status)
  const [interviewDate, setInterviewDate] = useState(job.interview_date || '')
  const [loading, setLoading] = useState(false)

  // Function to save changes
  const handleUpdate = async () => {
    setLoading(true)
    
    const { error } = await supabase
      .from('applications')
      .update({ 
        status: status,
        interview_date: interviewDate || null
      })
      .eq('id', job.id) // IMPORTANT: Only update THIS job ID

    setLoading(false)

    if (error) {
      console.error(error)
      alert('Error updating job')
    } else {
      setIsEditing(false) // Turn off edit mode
      window.location.reload() // Refresh to see changes
    }
  }

  // --- VIEW MODE (What you see normally) ---
  if (!isEditing) {
    return (
      <div 
        onClick={() => setIsEditing(true)} // Click to enter Edit Mode
        className="border p-6 rounded-lg shadow-sm hover:shadow-md transition bg-white cursor-pointer group relative"
      >
        <div className="flex justify-between items-start">
          <div>
              <h2 className="text-xl font-bold">{job.company_name}</h2>
              <p className="text-gray-600">{job.job_title}</p>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded 
            ${job.status === 'Applied' ? 'bg-gray-100 text-gray-800' : ''}
            ${job.status === 'Interviewing' ? 'bg-yellow-100 text-yellow-800' : ''}
            ${job.status === 'Offer' ? 'bg-green-100 text-green-800' : ''}
            ${job.status === 'Rejected' ? 'bg-red-100 text-red-800' : ''}
          `}>
            {job.status}
          </span>
        </div>
        
        <div className="mt-4 text-sm text-gray-400">
          <p>Applied: {job.date_applied}</p>
          {job.interview_date && (
             <p className="text-blue-600 font-semibold mt-1">Interview: {job.interview_date}</p>
          )}
        </div>
        
        <p className="text-xs text-gray-300 mt-2 opacity-0 group-hover:opacity-100 transition">
          Click to edit
        </p>
      </div>
    )
  }

  // --- EDIT MODE (What you see when you click) ---
  return (
    <div className="border p-6 rounded-lg shadow-lg bg-blue-50 ring-2 ring-blue-200">
      <h3 className="font-bold mb-2 text-blue-900">Editing {job.company_name}</h3>
      
      {/* Status Dropdown */}
      <label className="block text-xs font-bold mb-1 text-gray-500">Status</label>
      <select 
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full border p-2 rounded mb-3 bg-white"
      >
        <option value="Applied">Applied</option>
        <option value="Interviewing">Interviewing</option>
        <option value="Offer">Offer</option>
        <option value="Rejected">Rejected</option>
      </select>

      {/* Interview Date Picker */}
      <label className="block text-xs font-bold mb-1 text-gray-500">Interview Date</label>
      <input 
        type="date"
        value={interviewDate}
        onChange={(e) => setInterviewDate(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      <div className="flex gap-2">
        <button 
          onClick={handleUpdate}
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button 
          onClick={() => setIsEditing(false)}
          className="bg-gray-300 text-black px-3 py-1 rounded text-sm hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}