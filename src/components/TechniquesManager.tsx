
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

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
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tighter">Decision-Making Techniques</h2>
        <p className="text-muted-foreground">
          Explore standardized techniques to reduce noise in decision-making
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Filter by Industry</Label>
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {isLoading ? (
              <p>Loading techniques...</p>
            ) : (
              techniques?.map((technique) => (
                <Card key={technique.id} className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{technique.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{technique.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Impact Metrics</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(technique.impact_metrics).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="font-medium">
                            {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:
                          </span>
                          <span className="ml-1">{value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {technique.implementation_steps && technique.implementation_steps.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Implementation Steps</h4>
                      <ul className="list-disc list-inside text-sm">
                        {technique.implementation_steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TechniquesManager;
