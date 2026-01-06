import { supabase } from './lib/supabaseClient';
import AddJobForm from './components/AddJobForm';
import JobCard from './components/JobCard'; // Import the new card

export default async function Home() {
  
  const { data: applications, error } = await supabase
    .from('applications')
    .select('*')
    .order('date_applied', { ascending: false });

  if (error) {
    console.error('Error fetching:', error);
  }

  return (
    <div className="min-h-screen p-8 font-sans max-w-5xl mx-auto">
      <main>
        <h1 className="text-3xl font-bold mb-6">My Job Applications</h1>

        <AddJobForm />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          
          {applications?.map((job) => (
            // We now use the JobCard component for each item
            <JobCard key={job.id} job={job} />
          ))}

          {(!applications || applications.length === 0) && (
            <p className="text-gray-500 col-span-3">No applications found.</p>
          )}

        </div>
      </main>
    </div>
  );
}