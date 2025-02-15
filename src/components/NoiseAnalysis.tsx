
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type IndustryInsight = Database['public']['Tables']['industry_insights']['Row'];

const NoiseAnalysis = () => {
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>('legal');

  // Fetch all industries with enhanced logging
  const { data: industries, isLoading, error } = useQuery({
    queryKey: ['industries'],
    queryFn: async () => {
      console.log('Fetching industries from Supabase...');
      const { data, error } = await supabase
        .from('industry_insights')
        .select('*');
      
      if (error) {
        console.error('Error fetching industries:', error);
        throw error;
      }

      console.log('Successfully fetched industries:', data);
      return data as IndustryInsight[];
    }
  });

  // Log current industry data for debugging
  const currentIndustry = industries?.find(i => i.industry_id === selectedIndustryId);
  console.log('Current industry:', currentIndustry);

  const metrics = Array.isArray(currentIndustry?.metrics) ? currentIndustry.metrics : [];

  if (error) {
    console.error('Error in NoiseAnalysis:', error);
    return <div className="w-full max-w-4xl mx-auto p-6">Error loading data</div>;
  }

  if (isLoading) {
    return <div className="w-full max-w-4xl mx-auto p-6">Loading...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-6">
      <div className="space-y-2 text-center fade-in">
        <span className="px-3 py-1 text-sm font-medium bg-secondary inline-block rounded-full">
          Decision Analysis Tool
        </span>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          Noise Decision Analysis
        </h1>
        <p className="text-muted-foreground max-w-[600px] mx-auto">
          Visualize and understand judgment noise across different industries
        </p>
      </div>

      <Card className="p-6 slide-up">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Industry</Label>
            <Select value={selectedIndustryId} onValueChange={setSelectedIndustryId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
              <SelectContent>
                {industries?.map((industry) => (
                  <SelectItem key={industry.industry_id} value={industry.industry_id}>
                    {industry.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <h3 className="text-lg font-semibold mb-2">
              {currentIndustry?.name} Industry Analysis
            </h3>
            <p className="text-muted-foreground">
              {currentIndustry?.description}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 card-hover">
          <h3 className="text-lg font-semibold mb-4">Noise Metrics</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 card-hover">
          <h3 className="text-lg font-semibold mb-4">Key Findings</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {currentIndustry?.key_findings?.map((finding, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 card-hover col-span-2">
          <h3 className="text-lg font-semibold mb-4">Decision Hygiene</h3>
          <div className="space-y-6">
            {(currentIndustry?.decision_hygiene as any)?.checklists?.map((checklist: any, index: number) => (
              <div key={index} className="space-y-2">
                <h4 className="font-medium">{checklist.title}</h4>
                <ul className="space-y-2">
                  {checklist.items.map((item: string, itemIndex: number) => (
                    <li key={itemIndex} className="flex items-start text-sm text-muted-foreground">
                      <span className="mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="space-y-2">
              <h4 className="font-medium">Best Practices</h4>
              <ul className="space-y-2">
                {(currentIndustry?.decision_hygiene as any)?.best_practices?.map((practice: string, index: number) => (
                  <li key={index} className="flex items-start text-sm text-muted-foreground">
                    <span className="mr-2">•</span>
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Impact Metrics</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(currentIndustry?.decision_hygiene as any)?.impact_metrics?.map((impact: any, index: number) => (
                  <Card key={index} className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{impact.value}%</div>
                      <div className="text-sm text-muted-foreground">{impact.metric}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NoiseAnalysis;
