import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type IndustryInsight = Database['public']['Tables']['industry_insights']['Row'];

interface Metric {
  name: string;
  value: number;
}

const isMetricsArray = (metrics: unknown): metrics is Metric[] => {
  return Array.isArray(metrics) && metrics.every(metric => 
    typeof metric === 'object' && 
    metric !== null &&
    'name' in metric && 
    'value' in metric &&
    typeof metric.name === 'string' &&
    typeof metric.value === 'number'
  );
};

const NoiseAnalysis = () => {
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>('all');
  const [selectedMetricView, setSelectedMetricView] = useState<'bar' | 'line'>('bar');

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

  // If "all" is selected, combine metrics from all industries
  const getAggregatedMetrics = (): Metric[] => {
    if (!industries || selectedIndustryId !== 'all') {
      const currentMetrics = currentIndustry?.metrics;
      return isMetricsArray(currentMetrics) ? currentMetrics : [];
    }

    const allMetrics: { [key: string]: number } = {};
    let metricCounts: { [key: string]: number } = {};

    industries.forEach(industry => {
      const industryMetrics = industry.metrics;
      if (isMetricsArray(industryMetrics)) {
        industryMetrics.forEach(metric => {
          if (!allMetrics[metric.name]) {
            allMetrics[metric.name] = 0;
            metricCounts[metric.name] = 0;
          }
          allMetrics[metric.name] += metric.value;
          metricCounts[metric.name]++;
        });
      }
    });

    return Object.entries(allMetrics).map(([name, value]) => ({
      name,
      value: Math.round(value / metricCounts[name])
    }));
  };

  const currentIndustry = industries?.find(i => i.industry_id === selectedIndustryId);
  const metrics = getAggregatedMetrics();
  const decision_hygiene = currentIndustry?.decision_hygiene || {};

  if (error) {
    return <div className="w-full max-w-4xl mx-auto p-6">Error loading data</div>;
  }

  if (isLoading) {
    return <div className="w-full max-w-4xl mx-auto p-6">Loading...</div>;
  }

  const renderMetricsChart = () => {
    if (selectedMetricView === 'bar') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={metrics} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-background border p-2 rounded-lg shadow-lg">
                    <p className="font-semibold">{label}</p>
                    <p className="text-sm text-muted-foreground">Value: {payload[0].value}</p>
                  </div>
                );
              }
              return null;
            }} />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={metrics} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background border p-2 rounded-lg shadow-lg">
                  <p className="font-semibold">{label}</p>
                  <p className="text-sm text-muted-foreground">Value: {payload[0].value}</p>
                </div>
              );
            }
            return null;
          }} />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

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
                <SelectItem value="all">All Industries</SelectItem>
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
              {selectedIndustryId === 'all' ? 'Cross-Industry' : currentIndustry?.name} Analysis
            </h3>
            <p className="text-muted-foreground">
              {selectedIndustryId === 'all' 
                ? 'Aggregated analysis across all industries'
                : currentIndustry?.description}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 card-hover">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Noise Metrics</h3>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 rounded ${selectedMetricView === 'bar' ? 'bg-primary text-white' : 'bg-secondary'}`}
                onClick={() => setSelectedMetricView('bar')}
              >
                Bar
              </button>
              <button
                className={`px-3 py-1 rounded ${selectedMetricView === 'line' ? 'bg-primary text-white' : 'bg-secondary'}`}
                onClick={() => setSelectedMetricView('line')}
              >
                Line
              </button>
            </div>
          </div>
          <div className="h-48">
            {renderMetricsChart()}
          </div>
        </Card>

        <Card className="p-6 card-hover">
          <h3 className="text-lg font-semibold mb-4">Key Findings</h3>
          <div className="space-y-4">
            {selectedIndustryId === 'all' ? (
              <p className="text-muted-foreground">Select a specific industry to view detailed findings.</p>
            ) : (
              currentIndustry?.key_findings?.map((finding, index) => (
                <div key={index} className="p-4 bg-secondary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <span className="mr-2">📋</span>
                    {finding}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>

        {selectedIndustryId !== 'all' && (
          <Card className="p-6 card-hover col-span-2">
            <h3 className="text-lg font-semibold mb-4">Decision Hygiene Framework</h3>
            <Tabs defaultValue="checklists" className="space-y-4">
              <TabsList>
                <TabsTrigger value="checklists">Checklists</TabsTrigger>
                <TabsTrigger value="techniques">Techniques</TabsTrigger>
                <TabsTrigger value="impact">Impact Metrics</TabsTrigger>
              </TabsList>

              <TabsContent value="checklists" className="space-y-4">
                <Accordion type="single" collapsible className="w-full">
                  {(decision_hygiene.checklists as any[] || []).map((checklist: any, index: number) => (
                    <AccordionItem key={index} value={`checklist-${index}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center space-x-2">
                          <span>{checklist.title}</span>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 p-4">
                          <p className="text-sm text-muted-foreground mb-2">{checklist.description}</p>
                          <ul className="space-y-2">
                            {checklist.items.map((item: string, itemIndex: number) => (
                              <li key={itemIndex} className="flex items-start text-sm">
                                <span className="mr-2">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>

              <TabsContent value="techniques" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(decision_hygiene.techniques || {}).map(([key, technique]: [string, any]) => (
                    <Card key={key} className="p-4">
                      <h4 className="font-medium mb-2">{key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h4>
                      <p className="text-sm text-muted-foreground">{technique.description}</p>
                      {technique.examples?.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {technique.examples.map((example: string, index: number) => (
                            <li key={index} className="text-sm">• {example}</li>
                          ))}
                        </ul>
                      )}
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="impact" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(decision_hygiene.impact_metrics as any[] || []).map((impact: any, index: number) => (
                    <Card key={index} className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{impact.value}%</div>
                        <div className="text-sm font-medium">{impact.metric}</div>
                        <div className="text-xs text-muted-foreground mt-1">{impact.description}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NoiseAnalysis;
