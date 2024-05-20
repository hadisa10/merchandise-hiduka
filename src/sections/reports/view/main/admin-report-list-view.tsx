'use client';

import React from 'react';

import { Button } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { useRolePath } from 'src/hooks/use-path-role';

import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ReportListDataGrid from '../report-list-data-grid';

export default function AdminReportListView() {
  const rolePath = useRolePath();
  return (
    <>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: rolePath?.root },
          {
            name: 'Report',
            // @ts-expect-error expected
            href: rolePath.report.root,
          },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            // @ts-expect-error expected
            href={rolePath.report.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Report
          </Button>
        }
        sx={{
          mb: {
            xs: 3,
            md: 5,
          },
        }}
      />
      <ReportListDataGrid />
    </>
  );
}
