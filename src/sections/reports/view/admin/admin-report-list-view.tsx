"use client"

import React from "react";

import {
    Button
} from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

import { ReportDataGrid } from "../../list";


export default function AdminReportListView() {
    return (
        <>
            <CustomBreadcrumbs
                heading="List"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    {
                        name: 'Report',
                        href: paths.dashboard.report.root,
                    },
                    { name: 'List' },
                ]}
                action={
                    <Button
                        component={RouterLink}
                        href={paths.dashboard.report.new}
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
            <ReportDataGrid />
        </>
    );
}
