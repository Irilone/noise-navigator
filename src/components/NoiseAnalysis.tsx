
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Industry data structured from our knowledge base
const industries = [
  {
    id: 'legal',
    name: 'Legal',
    description: 'Analyze sentencing inconsistency trends in the criminal justice system',
    metrics: [
      { name: 'Sentencing Disparity', value: 55 },
      { name: 'Judicial Agreement', value: 45 },
      { name: 'Case Consistency', value: 35 }
    ],
    keyFindings: [
      'In 16 of 20 cases, there was no unanimity on whether incarceration was appropriate',
      'Sentences for similar crimes varied from 5 to 18 years for bank robbery cases',
      'External factors like time of day and local sports results affected judicial decisions'
    ]
  },
  {
    id: 'medical',
    name: 'Medical',
    description: 'Identify diagnostic variability in healthcare decisions',
    metrics: [
      { name: 'Diagnostic Agreement', value: 65 },
      { name: 'Treatment Variance', value: 48 },
      { name: 'Protocol Adherence', value: 52 }
    ],
    keyFindings: [
      'Different doctors make varying judgments about skin cancer, breast cancer, and heart disease',
      'Noise is especially high in psychiatry where subjective judgment is important',
      'Unexpected variations found in X-ray readings among professionals'
    ]
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Measure investment decision noise and forecasting variance',
    metrics: [
      { name: 'Investment Variance', value: 41 },
      { name: 'Forecast Accuracy', value: 59 },
      { name: 'Risk Assessment', value: 45 }
    ],
    keyFindings: [
      'Asset management study showed 41% median noise in stock valuations',
      'Professional forecasters show high variability in sales and growth predictions',
      'Significant variations found in bankruptcy risk assessments'
    ]
  },
  {
    id: 'hr',
    name: 'HR',
    description: 'Assess recruitment bias patterns and performance evaluation variance',
    metrics: [
      { name: 'Interview Consistency', value: 38 },
      { name: 'Performance Rating', value: 43 },
      { name: 'Candidate Assessment', value: 52 }
    ],
    keyFindings: [
      'Interviewers make widely different assessments of the same candidates',
      'Performance ratings depend more on the assessor than actual performance',
      'Significant variability found in recruitment decisions'
    ]
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Study grading inconsistencies and assessment variations',
    metrics: [
      { name: 'Grading Consistency', value: 45 },
      { name: 'Assessment Alignment', value: 55 },
      { name: 'Evaluation Standards', value: 48 }
    ],
    keyFindings: [
      'Different professors produce varying rankings of the same essays',
      'Grades for identical work vary significantly between evaluators',
      'Pattern noise evident in educational assessment processes'
    ]
  }
];

const NoiseAnalysis = () => {
  const [selectedIndustry, setSelectedIndustry] = useState(industries[0].id);
  const currentIndustry = industries.find(i => i.id === selectedIndustry);

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
              <BarChart data={currentIndustry?.metrics} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <script async
  src="https://agent-85dc56168cdd086adf1b-mm5vl.ondigitalocean.app/static/chatbot/widget.js"
  data-agent-id="7aee0893-ea13-11ef-bf8f-4e013e2ddde4"
  data-chatbot-id="b3YYgRKBXp2m_Fqr6PFZ_EWeYcTLTNO4"
  data-name="Noise Consultant"
  data-primary-color="#2C3E50"
  data-secondary-color="#ECF0F1"
  data-button-background-color="#3498DB"
  data-starting-message="Hello! What do you want to learn about noise?"
  data-logo="https://imgur.com/4BAPnid">
</script>

        <Card className="p-6 card-hover">
          <h3 className="text-lg font-semibold mb-4">Key Findings</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {currentIndustry?.keyFindings.map((finding, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default NoiseAnalysis;
