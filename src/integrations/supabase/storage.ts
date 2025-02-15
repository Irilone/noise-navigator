
import { supabase } from "./client";

// Initialize storage bucket for noise data
export const noiseDataBucket = supabase.storage.from('noiuse-data');

// Helper function to handle file uploads
export async function uploadNoiseData(file: File) {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    const { data, error } = await noiseDataBucket.upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }

    return { filePath: data?.path };
  } catch (error) {
    console.error('Error in uploadNoiseData:', error);
    throw error;
  }
}

// Helper function to download files
export async function downloadNoiseData(filePath: string) {
  try {
    const { data, error } = await noiseDataBucket.download(filePath);
    
    if (error) {
      console.error('Error downloading file:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in downloadNoiseData:', error);
    throw error;
  }
}

// Helper function to list files in the bucket
export async function listNoiseData() {
  try {
    const { data, error } = await noiseDataBucket.list();
    
    if (error) {
      console.error('Error listing files:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in listNoiseData:', error);
    throw error;
  }
}

// Helper function to delete a file
export async function deleteNoiseData(filePath: string) {
  try {
    const { error } = await noiseDataBucket.remove([filePath]);
    
    if (error) {
      console.error('Error deleting file:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteNoiseData:', error);
    throw error;
  }
}

// Helper function to get a public URL for a file
export function getNoiseDataUrl(filePath: string) {
  const { data } = noiseDataBucket.getPublicUrl(filePath);
  return data.publicUrl;
}
