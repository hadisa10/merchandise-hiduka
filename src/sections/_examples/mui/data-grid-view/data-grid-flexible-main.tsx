"use client"

import { Typography } from '@mui/material';
import {
  GridColDef,
  GridRowModel,
} from '@mui/x-data-grid';

// Additional imports remain the same

// Define generic types for rows and columns
interface DataGridFlexibleProps<RowType extends GridRowModel> {
  data: RowType[];
  columnDefinitions: GridColDef[];
}

// Use these generic types in your component
export default function DataGridFlexible<RowType extends GridRowModel>({
  data: rows,
  columnDefinitions,
}: DataGridFlexibleProps<RowType>) {
  return (
    Array.isArray(rows) &&
    rows.map((row, i) => (
      <Typography key={i} >{JSON.stringify(row)}</Typography>
    ))

  )

  // Component implementation remains largely the same
}

