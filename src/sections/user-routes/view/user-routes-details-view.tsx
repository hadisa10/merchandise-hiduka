'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { _mapContact } from 'src/_mock';

import ContactMap from '../contact-map';

// ----------------------------------------------------------------------

export default function UserRoutesView() {
  return (
    <Container sx={{ py: 10 }}>
      <Box
        gap={10}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
      >
        <ContactMap contacts={_mapContact} />
      </Box>
    </Container>
  );
}
