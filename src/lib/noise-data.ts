
import { supabase } from "@/integrations/supabase/client";
import { noiseDataBucket } from "@/integrations/supabase/storage";

interface ProcessNoiseDataParams {
  industryId: string;
  dataType: 'metrics' | 'findings' | 'hygiene';
  content: any;
}

export async function processNoiseData({ industryId, dataType, content }: ProcessNoiseDataParams) {
  try {
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

    return data;
  } catch (error) {
    console.error('Error in processNoiseData:', error);
    throw error;
  }
}

export async function uploadAndProcessNoiseData(file: File, industryId: string, dataType: ProcessNoiseDataParams['dataType']) {
  try {
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

    // Parse the file content (assuming JSON)
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
