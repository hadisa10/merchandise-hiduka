"use client"

import { useMemo } from 'react'

import { Card } from '@mui/material'

import { paths } from 'src/routes/paths'
import { useRouter } from 'src/routes/hooks';

import { useShowLoader } from 'src/hooks/realm'

import { fDateTime } from 'src/utils/format-time'
import { formatFilterAndRemoveFields } from 'src/utils/helpers'

import { DataGridFlexible } from 'src/components/data-grid'
import { LoadingScreen } from 'src/components/loading-screen'
import { IGenericColumn } from 'src/components/data-grid/data-grid-flexible'

import { IProject } from 'src/types/realm/realm-types'


function ClientProjectsDataGrid({ projects, loading }: { projects: IProject[] | null, loading: boolean }) {

  const router = useRouter();

  const showLoader = useShowLoader(loading, 300)

  const handleEditProject = (_id: string) => {
    router.push(paths.v2.client.project.edit(_id));
  }

  const handleViewDetails = (_id: string) => {
    router.push(paths.v2.client.project.edit(_id));

  }

  const columns: IGenericColumn<IProject>[] = useMemo(() => {
    const cols: Omit<IGenericColumn<IProject>, "order">[] = [
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
        field: "createdAt",
        label: "Created Date",
        type: "date",
        minWidth: 120
      },
      {
        field: "updatedAt",
        label: "Last Updated",
        type: "date",
        minWidth: 120
      },
      {
        field: "actions",
        label: "Actions",
        type: "actions",
        action: {
          edit: {
            label: 'Edit',
            icon: 'material-symbols:edit-outline',
            action: handleEditProject,
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
  }, [projects]);

  const cleanedProjects = useMemo(() => {
    if (!Array.isArray(projects)) return []
    const filtered = formatFilterAndRemoveFields(
      projects,
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
      ],
      undefined
    ) ?? []
    return filtered
  }, [projects])

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
      {!showLoader && cleanedProjects &&
        <DataGridFlexible
          data={cleanedProjects}
          columns={columns}
          hideColumn={{ _id: false }}
          title='title'
          getRowIdFn={(row) => row._id.toString()}
        />
      }
    </Card>
  )
}

export default ClientProjectsDataGrid