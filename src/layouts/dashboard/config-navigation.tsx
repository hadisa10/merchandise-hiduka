import { useMemo } from 'react';
// import Label from 'src/components/label';
import { TFunction } from 'i18next';

import { SxProps } from '@mui/system';

import { paths } from 'src/routes/paths';

import { ERole } from 'src/config-global';
import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
// import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { useRealmApp } from 'src/components/realm';


// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);
const styleSmall: SxProps = { width: 0.7, height: 0.7 }
const style: SxProps = { width: 1, height: 1 }

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
  projectSmall: <Iconify icon="material-symbols:construction-rounded" sx={styleSmall} />
};
const renderAdmin = (t: TFunction<"translation", undefined>) => ([
  // Dashboard
  // ----------------------------------------------------------------------
  {
    subheader: t('Dasboard'),
    items: [
      { title: t('Dashboard'), path: paths.v2.admin.root, icon: ICONS.dashboard },
      // { title: t('Activity Tracker'), path: paths.dashboard.analytics.userPerformance, icon: ICONS.userPerformace },
      // { title: t('Merchandising'), path: paths.dashboard.analytics.merchandiseAnalysis, icon: ICONS.product },
      // { title: t('Customer Segmentation'), path: paths.dashboard.analytics.customerSegmentation, icon: ICONS.customerSegmentation },
      // { title: t('Market and Competitive'), path: paths.dashboard.analytics.marketingCompetitive, icon: ICONS.marketAnalysis }
    ],
  },
  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: t('management'),
    items: [
      // CLIENT
      {
        title: t('clients'), path: paths.v2.admin.client.root, icon: ICONS.client,
        children: [
          { title: t('list'), path: paths.v2.admin.client.list },
          { title: t('create'), path: paths.v2.admin.client.new },
        ]
      },
      // {
      //   title: t('products'), path: paths.dashboard.product.root, icon: ICONS.product,
      // },
      // PROJECT
      {
        title: t('projects'), path: paths.v2.admin.project.root, icon: ICONS.project,
        children: [
          { title: t('list'), path: paths.v2.admin.project.root },
          { title: t('create'), path: paths.v2.admin.project.new }
        ]
      },
      // CAMPAIGNS
      {
        title: t('campaign'), path: paths.v2.admin.campaign.root, icon: ICONS.campaign,
        children: [
          { title: t('list'), path: paths.v2.admin.campaign.list },
          { title: t('create'), path: paths.v2.admin.campaign.new }
        ]
      },
      // REPORTS
      {
        title: t('reports'), path: paths.v2.admin.reports.root, icon: ICONS.report,
        children: [
          { title: t('list'), path: paths.v2.admin.reports.list },
          { title: t('create'), path: paths.v2.admin.reports.new },
        ]
      },
      // // ROUTES
      // {
      //   title: t('routes'), path: paths.dashboard.routes.root, icon: ICONS.route,
      //   children: [
      //     { title: t('list'), path: paths.dashboard.routes.root },
      //     { title: t('create'), path: paths.dashboard.routes.new },
      //   ]
      // },
      // { title: t('teams'), path: paths.dashboard.client.root, icon: ICONS.client },
    ],
  },
  // ANALYSIS
  // ----------------------------------------------------------------------
  {
    subheader: t('Analysis'),
    items: [
      { title: t('Campaign Performance'), path: paths.v2.admin["campaign-performance"], icon: ICONS.campaign },
      { title: t('Activity Tracker'), path: paths.v2.admin["activity-tracker"], icon: ICONS.userPerformace },
      // { title: t('Merchandising'), path: paths.dashboard.analytics.merchandiseAnalysis, icon: ICONS.product },
      // { title: t('Customer Segmentation'), path: paths.dashboard.analytics.customerSegmentation, icon: ICONS.customerSegmentation },
      // { title: t('Market and Competitive'), path: paths.dashboard.analytics.marketingCompetitive, icon: ICONS.marketAnalysis }
    ],
  },

])

const renderClient = (t: TFunction<"translation", undefined>) => ([
  // OVERVIEW
  // ----------------------------------------------------------------------
  {
    subheader: t('overview'),
    items: [
      { title: t('Dashboard'), path: paths.v2.client.root, icon: ICONS.dashboard },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: t('management'),
    items: [
      // PROJECT
      {
        title: t('projects'), path: paths.v2.admin.project.root, icon: ICONS.project,
        children: [
          { title: t('list'), path: paths.v2.admin.project.root },
          { title: t('create'), path: paths.v2.admin.project.root }
        ]
      },
      // CAMPAIGNS
      {
        title: t('campaign'), path: paths.v2.client.campaign.root, icon: ICONS.campaign,
        children: [
          { title: t('list'), path: paths.v2.client.campaign.root },
          { title: t('create'), path: paths.v2.client.campaign.new }
        ]
      },
      // REPORTS
      {
        title: t('reports'), path: paths.v2.client.reports.root, icon: ICONS.report,
        children: [
          { title: t('list'), path: paths.v2.client.reports.root },
          { title: t('create'), path: paths.v2.client.reports.new }
        ]
      },
    ],
  },
  // ANALYSIS
  // ----------------------------------------------------------------------
  {
    subheader: t('Analysis'),
    items: [
      { title: t('Campaign Performance'), path: paths.v2.client["campaign-performance"], icon: ICONS.campaign },
      { title: t('Activity Tracker'), path: paths.v2.client["activity-tracker"], icon: ICONS.userPerformace },
    ],
  },
])
// ----------------------------------------------------------------------


const renderProjectManager = (t: TFunction<"translation", undefined>) => ([
  // OVERVIEW
// OVERVIEW
  // ----------------------------------------------------------------------
  {
    subheader: t('overview'),
    items: [
      { title: t('Dashboard'), path: paths.v2['project-manager'].root, icon: ICONS.dashboard },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: t('management'),
    items: [
      // PROJECT
      {
        title: t('projects'), path: paths.v2['project-manager'].project.root, icon: ICONS.project,
      },
      // CAMPAIGNS
      {
        title: t('campaign'), path: paths.v2['project-manager'].campaign.root, icon: ICONS.campaign,
        children: [
          { title: t('list'), path: paths.v2['project-manager'].campaign.root },
          { title: t('create'), path: paths.v2['project-manager'].campaign.new }
        ]
      },
      // REPORTS
      {
        title: t('reports'), path: paths.v2['project-manager'].reports.root, icon: ICONS.report,
        children: [
          { title: t('list'), path: paths.v2['project-manager'].reports.root },
          { title: t('create'), path: paths.v2['project-manager'].reports.new }
        ]
      },
    ],
  },
  // ANALYSIS
  // ----------------------------------------------------------------------
  {
    subheader: t('Analysis'),
    items: [
      { title: t('Campaign Performance'), path: paths.v2.client["campaign-performance"], icon: ICONS.campaign },
      { title: t('Activity Tracker'), path: paths.v2.client["activity-tracker"], icon: ICONS.userPerformace },
    ],
  },
])
// ----------------------------------------------------------------------


const renderTeamLead = (t: TFunction<"translation", undefined>) => ([
  // OVERVIEW
  // ----------------------------------------------------------------------
  {
    subheader: t('overview'),
    items: [
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: t('management'),
    items: [
    ],
  },
])
// ----------------------------------------------------------------------



const renderAgent = (t: TFunction<"translation", undefined>) => ([
  // Dashboard
  // ----------------------------------------------------------------------
  {
    subheader: t('Dasboard'),
    items: [
      { title: t('Dashboard'), path: paths.v2.admin.root, icon: ICONS.dashboard },
      // { title: t('Activity Tracker'), path: paths.dashboard.analytics.userPerformance, icon: ICONS.userPerformace },
      // { title: t('Merchandising'), path: paths.dashboard.analytics.merchandiseAnalysis, icon: ICONS.product },
      // { title: t('Customer Segmentation'), path: paths.dashboard.analytics.customerSegmentation, icon: ICONS.customerSegmentation },
      // { title: t('Market and Competitive'), path: paths.dashboard.analytics.marketingCompetitive, icon: ICONS.marketAnalysis }
    ],
  },
  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: t('management'),
    items: [
      // CLIENT
      // {
      //   title: t('clients'), path: paths.dashboard.client.root, icon: ICONS.client,
      //   children: [
      //     { title: t('list'), path: paths.dashboard.client.root },
      //     { title: t('create'), path: paths.dashboard.client.new },
      //   ]
      // },
      // {
      //   title: t('products'), path: paths.dashboard.product.root, icon: ICONS.product,
      // },
      // PROJECT
      {
        title: t('projects'), path: paths.v2.admin.project.root, icon: ICONS.project,
        children: [
          { title: t('list'), path: paths.v2.admin.project.root },
          { title: t('create'), path: paths.v2.admin.project.new }
        ]
      },
      // CAMPAIGNS
      {
        title: t('campaign'), path: paths.v2.admin.campaign.root, icon: ICONS.campaign,
        children: [
          { title: t('list'), path: paths.v2.admin.campaign.root },
          { title: t('create'), path: paths.v2.admin.campaign.new }
        ]
      },
      // // REPORTS
      // {
      //   title: t('reports'), path: paths.dashboard.report.root, icon: ICONS.report,
      //   children: [
      //     { title: t('list'), path: paths.dashboard.report.root },
      //     { title: t('create'), path: paths.dashboard.report.new },
      //   ]
      // },
      // // ROUTES
      // {
      //   title: t('routes'), path: paths.dashboard.routes.root, icon: ICONS.route,
      //   children: [
      //     { title: t('list'), path: paths.dashboard.routes.root },
      //     { title: t('create'), path: paths.dashboard.routes.new },
      //   ]
      // },
      // { title: t('teams'), path: paths.dashboard.client.root, icon: ICONS.client },
    ],
  }
])
// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();
  const realmApp = useRealmApp();
  const rle = useMemo(() => realmApp.currentUser?.customData?.role as unknown as string, [realmApp.currentUser?.customData?.role])
  const data = useMemo(
    () => {
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
