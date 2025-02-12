
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const industries = [
  { id: 'legal', name: 'Legal', description: 'Analyze sentencing inconsistency trends' },
  { id: 'medical', name: 'Medical', description: 'Identify diagnostic variability' },
  { id: 'finance', name: 'Finance', description: 'Measure investment decision noise' },
  { id: 'hr', name: 'HR', description: 'Assess recruitment bias patterns' },
  { id: 'education', name: 'Education', description: 'Study grading inconsistencies' },
];

const NoiseAnalysis = () => {
  const [selectedIndustry, setSelectedIndustry] = useState(industries[0].id);

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
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry.id} value={industry.id}>
                    {industry.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <h3 className="text-lg font-semibold mb-2">
              {industries.find(i => i.id === selectedIndustry)?.name} Industry Analysis
            </h3>
            <p className="text-muted-foreground">
              {industries.find(i => i.id === selectedIndustry)?.description}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 card-hover">
          <h3 className="text-lg font-semibold mb-4">Noise Metrics</h3>
          <div className="h-48 bg-secondary rounded-lg flex items-center justify-center">
            Chart Placeholder
          </div>
        </Card>

        <Card className="p-6 card-hover">
          <h3 className="text-lg font-semibold mb-4">Decision Patterns</h3>
          <div className="h-48 bg-secondary rounded-lg flex items-center justify-center">
            Visualization Placeholder
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NoiseAnalysis;
