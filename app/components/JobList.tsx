'use client'

import { useState } from 'react'
import JobCard from './JobCard'

interface Job {
  id: any;
  company_name: string;
  job_title: string;
  status: string;
  date_applied: string;
  interview_date: string;
  notes: string;
}

export default function JobList({ jobs }: { jobs: Job[] | null }) {
  const [sortType, setSortType] = useState('date') // Sort state
  const [searchTerm, setSearchTerm] = useState('') // Search state

  // 1. First, Filter the jobs based on the search term
  const filteredJobs = jobs?.filter((job) => {
    const term = searchTerm.toLowerCase()
    return (
      job.company_name.toLowerCase().includes(term) || 
      job.job_title.toLowerCase().includes(term)
    )
  }) || []

  // 2. Second, Sort the filtered list
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortType) {
      case 'name':
        return a.company_name.localeCompare(b.company_name)
      case 'status':
        return a.status.localeCompare(b.status)
      case 'date':
      default:
        return new Date(b.date_applied).getTime() - new Date(a.date_applied).getTime()
    }
  })

  return (
    <div>
      {/* Controls Bar: Search + Sort */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        
        {/* Search Input */}
        <div className="w-full md:w-1/2">
            <input 
                type="text" 
                placeholder="Search by company or role..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border p-2 rounded-lg pl-4 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-sm text-gray-500 font-bold uppercase whitespace-nowrap">Sort By:</span>
          <select 
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="border p-2 rounded text-sm bg-white cursor-pointer"
          >
            <option value="date">Date Applied (Newest)</option>
            <option value="name">Company Name (A-Z)</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* The Grid of Jobs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}

        {/* Show a specific message if search finds nothing */}
        {sortedJobs.length === 0 && (
           <div className="col-span-3 text-center py-10 text-gray-500">
             {searchTerm ? `No results found for "${searchTerm}"` : 'No applications found.'}
           </div>
        )}
      </div>
    </div>
  )
}