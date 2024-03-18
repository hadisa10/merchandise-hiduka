"use client"

import { useMemo } from 'react'

import { Card } from '@mui/material'

import { paths } from 'src/routes/paths'
import { useRouter } from 'src/routes/hooks';

import { useShowLoader } from 'src/hooks/realm'

import { fCurrency } from 'src/utils/format-number';
import { fDate, fDateTime } from 'src/utils/format-time'
import { formatFilterAndRemoveFields } from 'src/utils/helpers'

import { DataGridFlexible } from 'src/components/data-grid'
import { LoadingScreen } from 'src/components/loading-screen'
import { IGenericColumn } from 'src/components/data-grid/data-grid-flexible'

import { ICampaign } from 'src/types/realm/realm-types'
import { useRolePath } from 'src/hooks/use-path-role';


function AdminCampaignDataGrid({ campaigns, loading }: { campaigns: ICampaign[] | null, loading: boolean }) {

  const router = useRouter();

  const showLoader = useShowLoader(loading, 300)

  const handleEditCampaign = (_id: string) => {
    router.push(paths.v2.admin.campaign.edit(_id));
  }

  const handleViewDetails = (_id: string) => {
    router.push(paths.v2.admin.campaign.edit(_id));

  }

  const columns: IGenericColumn<ICampaign>[] = useMemo(() => {
    const cols: Omit<IGenericColumn<ICampaign>, "order">[] = [
      {
        field: "_id",
        label: "ID",
        type: "string",
      },
      {
        field: "title",
        label: "Title",
        type: "main",
        minWidth: 300
      },
      {
        field: "clientTitle",
        label: "Client",
        type: "string",
        minWidth: 250
      },
      {
        field: "access_code",
        label: "Access Code",
        type: "string",
        minWidth: 100
      },
      {
        field: "startDate",
        label: "Start Date",
        type: "date",
        minWidth: 120
      },
      {
        field: "endDate",
        label: "End Date",
        type: "date",
        minWidth: 120
      },
      {
        field: "hourlyRate",
        label: "Hourly Rate",
        type: "number",
        minWidth: 100
      },
      // {
      //   field: "today_checkin",
      //   label: "Today's Check-ins",
      //   type: "number",
      //   minWidth: 100
      // },
      // {
      //   field: "total_checkin",
      //   label: "Total Check-ins",
      //   type: "number",
      //   minWidth: 120
      // },
      {
        field: "users",
        label: "Users Count",
        type: "number",
        minWidth: 100
      },
      {
        field: "updatedAt",
        label: "Last Updated",
        type: "date",
        minWidth: 200
      },
      {
        field: "actions",
        label: "Actions",
        type: "actions",
        action: {
          edit: {
            label: 'Edit',
            icon: 'material-symbols:edit-outline',
            action: handleEditCampaign,
          },
          viewDetails: {
            label: 'Details',
            icon: 'material-symbols:visibility-outline',
            action: handleViewDetails,
          }
        }
      }
    ];
    return cols.map((c, i) => ({ ...c, order: i + 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaigns]);

  const cleanedCampaigns = useMemo(() => {
    if (!Array.isArray(campaigns)) return []
    const filtered = formatFilterAndRemoveFields(
      campaigns,
      // @ts-expect-error expected
      ["__typename"],
      [
        {
          key: "_id",
          formatter: (val) => val.toString(),
        },
        {
          key: "updatedAt",
          formatter: fDateTime,
        },
        {
          key: "createdAt",
          formatter: fDateTime,
        },
        {
          key: "startDate",
          formatter: fDate,
        },
        {
          key: "endDate",
          formatter: fDate,
        },
        {
          key: "activeCheckins",
          formatter: (val) => val.toString(),
        },
        {
          key: "client_id",
          formatter: (val) => val.toString(),
        },
        {
          key: "project_id",
          formatter: (val) => val.toString(),
        },
        {
          key: "hourlyRate",
          formatter: fCurrency,
        },
        {
          key: "products",
          formatter: (val) => val?.length ?? 0,
        },
        {
          key: "users",
          formatter: (val) => val?.length ?? 0,
        },
        {
          key: "routes",
          formatter: (val) => val?.length ?? 0,
        }
      ],
      undefined
    ) ?? []
    return filtered
  }, [campaigns])

  return (
    <Card
      sx={{
        height: { xs: 800, md: 600 },
        flexGrow: { md: 1 },
        display: { md: 'flex' },
        flexDirection: { md: 'column' },
      }}
    >
      {showLoader && <LoadingScreen />}
      {!showLoader && cleanedCampaigns &&
        <DataGridFlexible
          data={cleanedCampaigns}
          columns={columns}
          hideColumn={{ _id: false }}
          title='title'
          getRowIdFn={(row) => row._id.toString()}
        />
      }
    </Card>
  )
}

export default AdminCampaignDataGrid