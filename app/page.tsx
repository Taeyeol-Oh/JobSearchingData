import { supabase } from './lib/supabaseClient';
import AddJobForm from './components/AddJobForm';
import JobList from './components/JobList'; // Import the new list component

export default async function Home() {
  
  // 1. Fetch data from Supabase
  // We don't need .order() here anymore because JobList handles it!
  const { data: applications, error } = await supabase
    .from('applications')
    .select('*');

  if (error) {
    console.error('Error fetching:', error);
  }

  return (
    <div className="min-h-screen p-8 font-sans max-w-5xl mx-auto">
      <main>
        <h1 className="text-3xl font-bold mb-6">My Job Applications</h1>

        <AddJobForm />

        <div className="mt-8">
            {/* 2. Pass the data to the Client Component */}
            <JobList jobs={applications} />
        </div>
        
      </main>
    </div>
  );
}