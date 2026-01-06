'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AddJobForm() {
  const [company, setCompany] = useState('')
  const [title, setTitle] = useState('')
  
  // 1. New State: Initialize with today's date by default (YYYY-MM-DD)
  const [dateApplied, setDateApplied] = useState(new Date().toISOString().split('T')[0])
  
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('applications')
      .insert([
        { 
          company_name: company, 
          job_title: title, 
          status: 'Applied',
          date_applied: dateApplied // 2. Send the selected date to Supabase
        }
      ])

    setLoading(false)

    if (error) {
      console.error(error)
      alert('Error adding job!')
    } else {
      setCompany('')
      setTitle('')
      // Reset date to today after submitting
      setDateApplied(new Date().toISOString().split('T')[0])
      window.location.reload() 
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Add New Application</h3>
      
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* Company Input */}
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* Job Title Input */}
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* 3. New Date Input */}
        <div>
          <input 
            type="date" 
            value={dateApplied}
            onChange={(e) => setDateApplied(e.target.value)}
            className="border p-2 rounded w-full md:w-auto"
            required
          />
        </div>

        <button 
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400 transition whitespace-nowrap"
        >
          {loading ? 'Saving...' : 'Add Job'}
        </button>
      </div>
    </form>
  )
}