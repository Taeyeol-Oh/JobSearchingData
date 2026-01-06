'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// 1. Updated Interface to include notes
interface Job {
  id: any;
  company_name: string;
  job_title: string;
  status: string;
  date_applied: string;
  interview_date: string;
  notes: string; // New field
}

export default function JobCard({ job }: { job: Job }) {
  const [isEditing, setIsEditing] = useState(false)
  
  // State for all editable fields
  const [status, setStatus] = useState(job.status)
  const [interviewDate, setInterviewDate] = useState(job.interview_date || '')
  const [dateApplied, setDateApplied] = useState(job.date_applied) // Now editable
  const [notes, setNotes] = useState(job.notes || '') // New state for notes
  
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    setLoading(true)
    
    const { error } = await supabase
      .from('applications')
      .update({ 
        status: status,
        interview_date: interviewDate || null,
        date_applied: dateApplied,
        notes: notes
      })
      .eq('id', job.id)

    setLoading(false)

    if (error) {
      console.error(error)
      alert('Error updating job')
    } else {
      setIsEditing(false)
      window.location.reload()
    }
  }

  // --- VIEW MODE ---
  if (!isEditing) {
    return (
      <div 
        onClick={() => setIsEditing(true)} 
        className="border p-6 rounded-lg shadow-sm hover:shadow-md transition bg-white cursor-pointer group flex flex-col justify-between h-full"
      >
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
                <h2 className="text-xl font-bold leading-tight">{job.company_name}</h2>
                <p className="text-gray-600 font-medium">{job.job_title}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-bold rounded 
              ${job.status === 'Applied' ? 'bg-gray-100 text-gray-800' : ''}
              ${job.status === 'Interviewing' ? 'bg-yellow-100 text-yellow-800' : ''}
              ${job.status === 'Offer' ? 'bg-green-100 text-green-800' : ''}
              ${job.status === 'Rejected' ? 'bg-red-100 text-red-800' : ''}
            `}>
              {job.status}
            </span>
          </div>

          {/* Display Notes if they exist */}
          {job.notes && (
            <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 mt-3 mb-3 italic">
              "{job.notes}"
            </div>
          )}
        </div>
        
        <div className="mt-4 text-sm text-gray-400 border-t pt-2">
          <p>Applied: {job.date_applied}</p>
          {job.interview_date && (
             <p className="text-blue-600 font-bold mt-1">Interview: {job.interview_date}</p>
          )}
          <p className="text-xs text-gray-300 mt-1 opacity-0 group-hover:opacity-100 transition">
            Click to edit details
          </p>
        </div>
      </div>
    )
  }

  // --- EDIT MODE ---
  return (
    <div className="border p-6 rounded-lg shadow-xl bg-white ring-2 ring-blue-500 z-10 relative">
      <h3 className="font-bold mb-4 text-gray-900 border-b pb-2">Editing {job.company_name}</h3>
      
      <div className="space-y-3">
        
        {/* Status */}
        <div>
          <label className="block text-xs font-bold mb-1 text-gray-500 uppercase">Status</label>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border p-2 rounded bg-gray-50"
          >
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Applied Date */}
        <div>
          <label className="block text-xs font-bold mb-1 text-gray-500 uppercase">Date Applied</label>
          <input 
            type="date"
            value={dateApplied}
            onChange={(e) => setDateApplied(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Interview Date */}
        <div>
          <label className="block text-xs font-bold mb-1 text-gray-500 uppercase">Interview Date</label>
          <input 
            type="date"
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold mb-1 text-gray-500 uppercase">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes here (e.g. salary range, tech stack)..."
            className="w-full border p-2 rounded h-24 text-sm"
          />
        </div>

      </div>

      <div className="flex gap-2 mt-4 pt-2 border-t">
        <button 
          onClick={handleUpdate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 font-medium"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <button 
          onClick={() => setIsEditing(false)}
          className="bg-gray-100 text-gray-600 px-4 py-2 rounded text-sm hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}