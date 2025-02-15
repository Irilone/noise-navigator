
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import TechniqueCard from './techniques/TechniqueCard';
import IndustryFilter from './techniques/IndustryFilter';
import TechniquesHeader from './techniques/TechniquesHeader';

type Technique = Database['public']['Tables']['techniques']['Row'];

const TechniquesManager = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  const { data: techniques, isLoading, error } = useQuery({
    queryKey: ['techniques', selectedIndustry],
    queryFn: async () => {
      console.log('Fetching techniques...');
      let query = supabase.from('techniques').select('*');
      
      if (selectedIndustry !== 'all') {
        query = query.contains('industries', [selectedIndustry]);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching techniques:', error);
        throw error;
      }

      console.log('Successfully fetched techniques:', data);
      return data as Technique[];
    }
  });

  if (error) {
    return <div className="text-red-500">Error loading techniques</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-6">
      <TechniquesHeader 
        title="Decision-Making Techniques"
        description="Explore standardized techniques to reduce noise in decision-making"
      />

      <Card className="p-6">
        <div className="space-y-4">
          <IndustryFilter 
            selectedIndustry={selectedIndustry}
            onIndustryChange={setSelectedIndustry}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {isLoading ? (
              <p>Loading techniques...</p>
            ) : (
              techniques?.map((technique) => (
                <TechniqueCard 
                  key={technique.id} 
                  technique={technique} 
                />
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TechniquesManager;
