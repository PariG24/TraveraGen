import { Json } from '@/database.types';
import { supabase } from './supabaseClient'

export const fetchLocations = async () => {
  const { data, error } = await supabase
    .from('Locations') // Ensure the table name is exactly 'Locations' in Supabase
    .select('id, Location_Name, Country, Address, URL, Latitude, Longitude, created_at'); // Include created_at

  if (error) {
    console.error('Error fetching locations:', error);
    return [];
  }

  if (!data) {
    console.error('No data returned from Supabase');
    return [];
  }

  // Map the fetched data to match the expected structure
  return data.map((item) => ({
    ...item,
    coordinates: [item.Latitude || 0, item.Longitude || 0],
  }));
};
