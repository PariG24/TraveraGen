import { Json } from '@/database.types';
import { supabase } from './supabaseClient'

export type Location = {
  Address: string | null;
  Country: string | null;
  created_at: string;
  id: number;
  Latitude: number | null;
  Location_Name: string | null;
  Longitude: number | null;
  URL: string | null;
}

export const fetchLocations = async (): Promise<Json> => {
  const { data, error } = await supabase
    .from('Locations') // Ensure the table name is exactly 'Locations' in Supabase
    .select('id, Location_Name, Country, Address, URL, Latitude, Longitude')

  if (error) {
    console.error('Error fetching locations:', error)
    return []
  }

  if (!data) {
    console.error('No data returned from Supabase')
    return []
  }

  console.log(data)
  return data

  // Map the fetched data to match the Location type
  // return data.map((item) => ({
  //   id: item.id,
  //   name: item.Location_Name, // Make sure this matches the column name in Supabase
  //   address: item.Address,    // Make sure this matches the column name in Supabase
  //   country: item.Country,    
  //   instagramLink: item.URL,  
  //   coordinates: [item.Latitude, item.Longitude], // Assuming this is the correct order for lat, long
  // })) as Location[]
}
