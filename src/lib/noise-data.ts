
import { supabase } from "@/integrations/supabase/client";
import { noiseDataBucket, uploadNoiseData, downloadNoiseData } from "@/integrations/supabase/storage";

// Define the impact metrics structure
interface ImpactMetrics {
  efficiency_gain?: number;
  cost_reduction?: number;
  decision_quality?: number;
  consistency_improvement?: number;
  time_savings?: number;
}

// Define the technique structure following decision hygiene principles
interface Technique {
  id: string;
  name: string;
  description: string;
  industries: string[];  // Array of industry IDs
  impact_metrics: ImpactMetrics;
  implementation_steps?: string[];
  validation_criteria?: string[];
  references?: {
    source: string;
    page?: number;
    description?: string;
  }[];
}

interface ProcessNoiseDataParams {
  industryId: string;
  dataType: 'metrics' | 'findings' | 'hygiene' | 'techniques';
  content: any;
}

/**
 * Processes noise data according to decision hygiene principles from "Noise" (Kahneman et al., 2021)
 * Implements systematic data processing to reduce variability in decision-making
 */
export async function processNoiseData({ industryId, dataType, content }: ProcessNoiseDataParams) {
  try {
    // Log the processing attempt for audit purposes
    console.log(`Processing ${dataType} data for industry ${industryId}`, {
      timestamp: new Date().toISOString(),
      type: dataType,
      industry: industryId
    });

    const { data, error } = await supabase.functions.invoke('process-noise-data', {
      body: {
        industry_id: industryId,
        data_type: dataType,
        content
      }
    });

    if (error) {
      console.error('Error processing noise data:', error);
      throw error;
    }

    // Log successful processing for audit trail
    console.log('Successfully processed noise data:', {
      timestamp: new Date().toISOString(),
      type: dataType,
      industry: industryId,
      status: 'success'
    });

    return data;
  } catch (error) {
    // Log processing failures for systematic error analysis
    console.error('Error in processNoiseData:', {
      timestamp: new Date().toISOString(),
      type: dataType,
      industry: industryId,
      error: error
    });
    throw error;
  }
}

/**
 * Uploads and processes noise data following structured decision protocols
 * Implements file validation and standardized processing steps
 */
export async function uploadAndProcessNoiseData(
  file: File, 
  industryId: string, 
  dataType: ProcessNoiseDataParams['dataType']
) {
  try {
    // Validate file before processing
    if (!validateNoiseDataFile(file)) {
      throw new Error('Invalid file format or content');
    }

    // First upload the file
    const { filePath } = await uploadNoiseData(file);
    
    if (!filePath) {
      throw new Error('File upload failed');
    }

    // Get the file content
    const fileData = await downloadNoiseData(filePath);
    
    if (!fileData) {
      throw new Error('Failed to read uploaded file');
    }

    // Parse and validate the file content
    const content = JSON.parse(await fileData.text());
    
    // Process the data
    return await processNoiseData({
      industryId,
      dataType,
      content
    });
  } catch (error) {
    console.error('Error in uploadAndProcessNoiseData:', error);
    throw error;
  }
}

/**
 * Validates noise data files according to standardized criteria
 * Implements systematic validation to reduce data quality variance
 */
function validateNoiseDataFile(file: File): boolean {
  // Implement validation logic based on file type and content
  const validTypes = ['application/json', 'text/plain'];
  
  if (!validTypes.includes(file.type)) {
    console.error('Invalid file type:', file.type);
    return false;
  }

  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    console.error('File size exceeds limit');
    return false;
  }

  return true;
}

