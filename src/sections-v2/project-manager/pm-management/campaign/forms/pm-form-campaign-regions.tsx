"use client"

import React from 'react'

function CFormCampaignRegions() {
  return (
    <div>CFormCampaignRegions</div>
  )
}

export default CFormCampaignRegions



// import React, { useState, useEffect, ChangeEvent } from 'react';
// import Autocomplete from '@mui/material/Autocomplete';
// import TextField from '@mui/material/TextField';
// import { Box } from '@mui/material';

// interface Location {
//   label: string;
//   coordinates: [number, number];
// }

// function CFormCampaignRegions() {
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [options, setOptions] = useState<Location[]>([]);

//   useEffect(() => {
//     const fetchLocations = async () => {
//       if (searchTerm.trim() === '') return;

//       const mapboxAccessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
//       const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchTerm)}.json?access_token=${mapboxAccessToken}`;

//       try {
//         const response = await fetch(url);
//         const data = await response.json();
//         const locations: Location[] = data.features.map((feature: any) => ({
//           label: feature.place_name,
//           coordinates: feature.center,
//         }));

//         setOptions(locations);
//       } catch (error) {
//         console.error('Failed to fetch location data:', error);
//       }
//     };

//     fetchLocations();
//   }, [searchTerm]);

//   const handleInputChange = (event: ChangeEvent<{}>, value: string) => {
//     setSearchTerm(value);
//   };

//   return (
//     <Box sx={{ width: 300, margin: 'auto' }}>
//       <Autocomplete
//         freeSolo
//         options={options}
//         // @ts-expect-error expected
//         getOptionLabel={(option) => option.label}
//         onInputChange={handleInputChange}
//         renderInput={(params) => <TextField {...params} label="Search Location" />}
//       />
//       {/* Additional form elements here */}
//     </Box>
//   );
// }

// export default CFormCampaignRegions;
