import { useMemo } from 'react';
// import Label from 'src/components/label';
import { TFunction } from 'i18next';

import { SxProps } from '@mui/system';

import { paths } from 'src/routes/paths';

import { getPathsForRole } from 'src/hooks/use-path-role';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
// import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { useRealmApp } from 'src/components/realm';

import { ERole } from 'src/types/client';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);
const styleSmall: SxProps = { width: 0.7, height: 0.7 };
const style: SxProps = { width: 1, height: 1 };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  // product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  product: <Iconify icon="fluent-mdl2:product-variant" />,
  client: <Iconify icon="mdi:book-account" sx={style} />,
  marketAnalysis: <Iconify icon="icon-park-outline:market-analysis" />,
  customerSegmentation: <Iconify icon="carbon:heat-map" />,
  userEngagement: <Iconify icon="dashicons:buddicons-groups" />,
  userPerformace: <Iconify icon="fluent:live-20-regular" />,
  merchandiging: <Iconify icon="dicon-park-outline:sales-report" />,
  route: <Iconify icon="eos-icons:route" sx={styleSmall} />,
  project: <Iconify icon="material-symbols:construction-rounded" sx={style} />,
  campaign: <Iconify icon="ic:baseline-campaign" sx={style} />,
  report: <Iconify icon="iconoir:reports-solid" sx={styleSmall} />,
  create: <Iconify icon="ion:create-outline" sx={style} />,
  productSmall: <SvgColor src="/assets/icons/navbar/ic_product.svg" sx={styleSmall} />,
  campaignSmall: <Iconify icon="ic:baseline-campaign" sx={styleSmall} />,
  projectSmall: <Iconify icon="material-symbols:construction-rounded" sx={styleSmall} />,
};
const renderAdmin = (t: TFunction<'translation', undefined>) => {
  const adminPath = getPathsForRole(ERole.ADMIN);
  return [
    // Dashboard
    // ----------------------------------------------------------------------
    {
      subheader: t('Dasboard'),
      items: [{ title: t('Dashboard'), path: adminPath.root, icon: ICONS.dashboard }],
    },
    // ANALYSIS
    // ----------------------------------------------------------------------
    {
      subheader: t('Analysis'),
      items: [
        {
          title: t('Campaign Performance'),
          path: paths.v2.admin['campaign-performance'],
          icon: ICONS.campaign,
        },
        {
          title: t('Activity Tracker'),
          path: paths.v2.admin['activity-tracker'],
          icon: ICONS.userPerformace,
        },
      ],
    },

    // User App
    // ----------------------------------------------------------------------
    {
      subheader: t('User App'),
      items: [
        {
          title: t('App'),
          path: paths.v2.admin.userApp.root,
          icon: ICONS.campaign,
        },
      ],
    },
    // MANAGEMENT
    // ----------------------------------------------------------------------
    {
      subheader: t('management'),
      items: [
        // CLIENT
        {
          title: t('clients'),
          path: adminPath.client.root,
          icon: ICONS.client,
          children: [
            { title: t('list'), path: adminPath.client.list },
            { title: t('create'), path: adminPath.client.new },
          ],
        },
        {
          title: t('products'),
          path: paths.v2.admin.product.root,
          icon: ICONS.product,
        },
        // {
        //   title: t('invoice'), path: paths.v2.admin.invoice.root, icon: ICONS.invoice,
        // },
        // PROJECT
        {
          title: t('projects'),
          path: paths.v2.admin.project.root,
          icon: ICONS.project,
          children: [
            { title: t('list'), path: paths.v2.admin.project.root },
            { title: t('create'), path: paths.v2.admin.project.new },
          ],
        },
        // CAMPAIGNS
        {
          title: t('campaign'),
          path: paths.v2.admin.campaign.root,
          icon: ICONS.campaign,
          children: [
            { title: t('list'), path: paths.v2.admin.campaign.list },
            { title: t('create'), path: paths.v2.admin.campaign.new },
          ],
        },
        // REPORTS
        {
          title: t('reports'),
          path: paths.v2.admin.report.root,
          icon: ICONS.report,
          children: [
            { title: t('list'), path: paths.v2.admin.report.list },
            { title: t('create'), path: paths.v2.admin.report.new },
          ],
        },
      ],
    },
  ];
};

const renderClient = (t: TFunction<'translation', undefined>) => {
  const clientPath = getPathsForRole(ERole.CLIENT);

  return [
    // OVERVIEW
    // ----------------------------------------------------------------------
    {
      subheader: t('overview'),
      items: [{ title: t('Dashboard'), path: clientPath.root, icon: ICONS.dashboard }],
    },
    // ANALYSIS
    // ----------------------------------------------------------------------
    {
      subheader: t('Analysis'),
      items: [
        {
          title: t('Campaign Performance'),
          path: clientPath['campaign-performance'],
          icon: ICONS.campaign,
        },
        {
          title: t('Activity Tracker'),
          path: clientPath['activity-tracker'],
          icon: ICONS.userPerformace,
        },
      ],
    },
    // User App
    // ----------------------------------------------------------------------
    {
      subheader: t('User App'),
      items: [
        {
          title: t('App'),
          path: paths.v2.client.userApp.root,
          icon: ICONS.campaign,
        },
      ],
    },

    // MANAGEMENT
    // ----------------------------------------------------------------------
    {
      subheader: t('management'),
      items: [
        // PROJECT
        {
          title: t('projects'),
          path: clientPath.project.root,
          icon: ICONS.project,
          children: [
            { title: t('list'), path: clientPath.project.root },
            { title: t('create'), path: clientPath.project.root },
          ],
        },
        // CAMPAIGNS
        {
          title: t('campaign'),
          path: clientPath.campaign.root,
          icon: ICONS.campaign,
          children: [
            { title: t('list'), path: clientPath.campaign.root },
            { title: t('create'), path: clientPath.campaign.new },
          ],
        },
        // REPORTS
        {
          title: t('reports'),
          path: clientPath.reports.root,
          icon: ICONS.report,
          children: [
            { title: t('list'), path: clientPath.reports.root },
            { title: t('create'), path: clientPath.reports.new },
          ],
        },
      ],
    },
  ];
};
// ----------------------------------------------------------------------

const renderProjectManager = (t: TFunction<'translation', undefined>) => {
  const pmPaths = getPathsForRole(ERole.PROJECT_MANAGER);
  return [
    // OVERVIEW
    // ----------------------------------------------------------------------
    {
      subheader: t('overview'),
      items: [{ title: t('Dashboard'), path: pmPaths.root, icon: ICONS.dashboard }],
    },
    // ANALYSIS
    // ----------------------------------------------------------------------
    {
      subheader: t('Analysis'),
      items: [
        {
          title: t('Campaign Performance'),
          path: pmPaths['campaign-performance'],
          icon: ICONS.campaign,
        },
        {
          title: t('Activity Tracker'),
          path: pmPaths['activity-tracker'],
          icon: ICONS.userPerformace,
        },
      ],
    },
    // User App
    // ----------------------------------------------------------------------
    {
      subheader: t('User App'),
      items: [
        {
          title: t('App'),
          path: paths.v2.client.userApp.root,
          icon: ICONS.campaign,
        },
      ],
    },

    // MANAGEMENT
    // ----------------------------------------------------------------------
    {
      subheader: t('management'),
      items: [
        // PROJECT
        {
          title: t('projects'),
          path: pmPaths.project.root,
          icon: ICONS.project,
        },
        // CAMPAIGNS
        {
          title: t('campaign'),
          path: pmPaths.campaign.root,
          icon: ICONS.campaign,
          children: [
            { title: t('list'), path: pmPaths.campaign.root },
            { title: t('create'), path: pmPaths.campaign.new },
          ],
        },
        // REPORTS
        {
          title: t('reports'),
          path: pmPaths.reports.root,
          icon: ICONS.report,
          children: [
            { title: t('list'), path: pmPaths.reports.root },
            { title: t('create'), path: pmPaths.reports.new },
          ],
        },
      ],
    },
  ];
};
// ----------------------------------------------------------------------

const renderTeamLead = (t: TFunction<'translation', undefined>) => [
  // User App
  // ----------------------------------------------------------------------
  {
    subheader: t('User App'),
    items: [
      {
        title: t('App'),
        path: paths.v2['team-lead'].userApp.root,
        icon: ICONS.campaign,
      },
    ],
  },
  // OVERVIEW
  // ----------------------------------------------------------------------
  {
    subheader: t('overview'),
    items: [],
  },
  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: t('management'),
    items: [],
  },
];
// ----------------------------------------------------------------------

const renderAgent = (t: TFunction<'translation', undefined>) => {
  const agentPath = getPathsForRole(ERole.AGENT);

  return [
    // User App
    // ----------------------------------------------------------------------
    {
      subheader: t('User App'),
      items: [
        {
          title: t('App'),
          path: paths.v2.agent.userApp.root,
          icon: ICONS.campaign,
        },
      ],
    },
    // Dashboard
    // ----------------------------------------------------------------------
    {
      subheader: t('Dasboard'),
      items: [{ title: t('Dashboard'), path: agentPath.root, icon: ICONS.dashboard }],
    },
    // MANAGEMENT
    // // ----------------------------------------------------------------------
    // {
    //   subheader: t('management'),
    //   items: [
    //     // CAMPAIGNS
    //     {
    //       title: t('campaign'),
    //       path: agentPath.campaign.root,
    //       icon: ICONS.campaign,
    //       children: [
    //         { title: t('list'), path: agentPath.campaign.root },
    //         { title: t('create'), path: agentPath.campaign.new },
    //       ],
    //     },
    //   ],
    // },
  ];
};
// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();
  const realmApp = useRealmApp();
  const rle = useMemo(
    () => realmApp.currentUser?.customData?.role as unknown as string,
    [realmApp.currentUser?.customData?.role]
  );
  const data = useMemo(() => {
    switch (rle) {
      case ERole.SUPERADMIN:
        return renderAdmin(t);
      case ERole.ADMIN:
        return renderAdmin(t);
      case ERole.CLIENT:
        return renderClient(t);
      case ERole.PROJECT_MANAGER:
        return renderProjectManager(t);
      case ERole.TEAM_LEAD:
        return renderTeamLead(t);
      case ERole.AGENT:
      default:
        return renderAgent(t);
    }
  }, [t, rle]);

  return data;
}
