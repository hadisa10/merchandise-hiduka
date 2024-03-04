import { useMemo } from 'react';
// import Label from 'src/components/label';
import { TFunction } from 'i18next';

import { SxProps } from '@mui/system';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
// import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { useRealmApp } from 'src/components/realm';

import { IRole } from 'src/types/user_realm';

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

const ICONS = {
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
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
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


  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: t('management'),
    items: [
      // CLIENT
      {
        title: t('clients'), path: paths.dashboard.client.root, icon: ICONS.client,
        children: [
          { title: t('list'), path: paths.dashboard.client.root },
          { title: t('create'), path: paths.dashboard.client.new },
        ]
      },
      {
        title: t('products'), path: paths.dashboard.product.root, icon: ICONS.product,
      },
      // CAMPAIGNS
      {
        title: t('campaign'), path: paths.dashboard.campaign.root, icon: ICONS.campaign,
        children: [
          { title: t('list'), path: paths.dashboard.campaign.root },
          { title: t('create'), path: paths.dashboard.campaign.new }
        ]
      },
      // REPORTS
      {
        title: t('reports'), path: paths.dashboard.report.root, icon: ICONS.report,
        children: [
          { title: t('list'), path: paths.dashboard.report.root },
          { title: t('create'), path: paths.dashboard.report.new },
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
      { title: t('Campaign Performance'), path: paths.dashboard.analytics.campaignPerformance, icon: ICONS.campaign },
      { title: t('Activity Tracker'), path: paths.dashboard.analytics.userPerformance, icon: ICONS.userPerformace },
      { title: t('Merchandising'), path: paths.dashboard.analytics.merchandiseAnalysis, icon: ICONS.product },
      { title: t('Customer Segmentation'), path: paths.dashboard.analytics.customerSegmentation, icon: ICONS.customerSegmentation },
      { title: t('Market and Competitive'), path: paths.dashboard.analytics.marketingCompetitive, icon: ICONS.marketAnalysis }
    ],
  },

])

const renderClient = (t: TFunction<"translation", undefined>) => ([
  // OVERVIEW
  // ----------------------------------------------------------------------
  {
    subheader: t('overview'),
    items: [
      { title: t('dashboard'), path: paths.dashboard.root, icon: ICONS.dashboard },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: t('management'),
    items: [
      // CLIENT
      { title: t('projects'), path: paths.dashboard.client.root, icon: ICONS.client },
      { title: t('account'), path: paths.dashboard.client.root, icon: ICONS.client },
    ],
  },

])

const renderLead = (t: TFunction<"translation", undefined>) => ([
  // OVERVIEW
  // ----------------------------------------------------------------------
  {
    subheader: t('overview'),
    items: [
      { title: t('dashboard'), path: paths.dashboard.root, icon: ICONS.dashboard },
      { title: t('analytics'), path: paths.dashboard.general.analytics, icon: ICONS.analytics }
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: t('management'),
    items: [
      // CLIENT
      { title: t('projects'), path: paths.dashboard.project.root, icon: ICONS.project },
      { title: t('campaigns'), path: paths.dashboard.campaign.root, icon: ICONS.client },
      { title: t('teams'), path: paths.dashboard.client.root, icon: ICONS.client },
    ],
  },

])



const renderBrandAmbassador = (t: TFunction<"translation", undefined>) => ([
  // OVERVIEW
  // ----------------------------------------------------------------------
  {
    subheader: t('overview'),
    items: [
      { title: t('dashboard'), path: paths.dashboard.root, icon: ICONS.dashboard },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: t('management'),
    items: [
      // MERCHANT
      {
        title: t('campaign'), path: paths.dashboard.campaign.root, icon: ICONS.campaign,
        children: [
          { title: t('list'), path: paths.dashboard.campaign.root },
          {
            title: t('routes'), path: paths.dashboard.routes.root, icon: ICONS.route,
            children: [
              { title: t('list'), path: paths.dashboard.routes.root },
              { title: t('create'), path: paths.dashboard.routes.new },
            ]
          },
          {
            title: t('reports'), path: paths.dashboard.report.root, icon: ICONS.report,
            children: [
              { title: t('list'), path: paths.dashboard.report.root },
              { title: t('create'), path: paths.dashboard.report.new },
            ]
          },
        ]
      },
      { title: t('account'), path: paths.dashboard.user.account, icon: ICONS.user }
    ],
  },
])

const renderMerchant = (t: TFunction<"translation", undefined>) => ([
  // OVERVIEW
  // ----------------------------------------------------------------------
  {
    subheader: t('overview'),
    items: [
      { title: t('dashboard'), path: paths.dashboard.root, icon: ICONS.dashboard },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: t('management'),
    items: [
      // MERCHANT
      {
        title: t('campaign'), path: paths.dashboard.campaign.root, icon: ICONS.campaign,
        children: [
          { title: t('list'), path: paths.dashboard.campaign.root },
        ]
      },
      {
        title: t('routes'), path: paths.dashboard.routes.root, icon: ICONS.route,
        children: [
          { title: t('list'), path: paths.dashboard.routes.root },
          { title: t('create'), path: paths.dashboard.routes.new },
        ]
      },

      {
        title: t('reports'), path: paths.dashboard.report.root, icon: ICONS.report,
        children: [
          { title: t('list'), path: paths.dashboard.report.root },
          { title: t('create'), path: paths.dashboard.report.new },
        ]
      },
      { title: t('account'), path: paths.dashboard.user.account, icon: ICONS.user }
    ],
  },
])
// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();
  const realmApp = useRealmApp();
  const role = useMemo(() => realmApp.currentUser?.customData?.role as unknown as IRole, [realmApp.currentUser?.customData?.role])
  const data = useMemo(
    () => {
      switch (role) {
        case "admin":
          return renderAdmin(t);
        case "client":
          return renderClient(t);
        case "brand_ambassador":
          return renderBrandAmbassador(t);
        case "merchant":
          return renderMerchant(t);
        case "lead":
        default:
          return renderLead(t);
      }
    }, [t, role]);

  return data;
}
