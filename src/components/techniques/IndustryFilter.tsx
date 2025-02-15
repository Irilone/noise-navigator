
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IndustryFilterProps {
  selectedIndustry: string;
  onIndustryChange: (value: string) => void;
}

const IndustryFilter = ({ selectedIndustry, onIndustryChange }: IndustryFilterProps) => {
  return (
    <div className="space-y-2">
      <Label>Filter by Industry</Label>
      <Select value={selectedIndustry} onValueChange={onIndustryChange}>
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
  );
};

export default IndustryFilter;
