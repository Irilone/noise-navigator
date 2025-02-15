
import { Card } from "@/components/ui/card";
import type { Database } from "@/integrations/supabase/types";

type Technique = Database['public']['Tables']['techniques']['Row'];

interface TechniqueCardProps {
  technique: Technique;
}

const TechniqueCard = ({ technique }: TechniqueCardProps) => {
  return (
    <Card className="p-4">
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
  );
};

export default TechniqueCard;
