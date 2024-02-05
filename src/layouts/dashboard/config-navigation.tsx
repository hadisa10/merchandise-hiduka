import { useMemo } from 'react';
// import Label from 'src/components/label';
import { TFunction } from 'i18next';

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
  client: <Iconify icon="mdi:book-account" sx={{ width: 1, height: 1 }} />,
  route: <Iconify icon="eos-icons:route" sx={{ width: 1, height: 1 }} />,
  project: <Iconify icon="material-symbols:construction-rounded" sx={{ width: 1, height: 1 }} />,
  campaign: <Iconify icon="ic:baseline-campaign" sx={{ width: 1, height: 1 }} />,
  report: <Iconify icon="iconoir:reports-solid" sx={{ width: 1, height: 1 }} />
};
const renderAdmin = (t: TFunction<"translation", undefined>) => ([
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
      { title: t('clients'), path: paths.dashboard.client.root, icon: ICONS.client },
      { title: t('projects'), path: paths.dashboard.project.root, icon: ICONS.client },
      // { title: t('teams'), path: paths.dashboard.client.root, icon: ICONS.client },
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
      { title: t('analytics'), path: paths.dashboard.general.analytics, icon: ICONS.analytics }
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
      { title: t('analytics'), path: paths.dashboard.general.ecommerce, icon: ICONS.analytics }
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: t('management'),
    items: [
      // CLIENT
      {
        title: t('projects'), path: paths.dashboard.project.root, icon: ICONS.project,
        children: [
          { title: t('list'), path: paths.dashboard.project.root, icon: ICONS.project },
          { title: t('products'), path: paths.dashboard.project.product, icon: ICONS.product },
          { title: t('campaigns'), path: paths.dashboard.project.campaign, icon: ICONS.campaign },
          { title: t('reports'), path: paths.dashboard.project.report, icon: ICONS.report },
        ]
      },
      { title: t('account'), path: paths.dashboard.invoice.root, icon: ICONS.user },
      // { title: t('products'), path: paths.dashboard.product.root, icon: ICONS.product },
      // { title: t('routes'), path: paths.dashboard.userRoutes.root, icon: ICONS.route }
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
      { title: t('analytics'), path: paths.dashboard.general.ecommerce, icon: ICONS.analytics }
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: t('management'),
    items: [
      // CLIENT
      {
        title: t('projects'), path: paths.dashboard.project.root, icon: ICONS.project,
        children: [
          { title: t('list'), path: paths.dashboard.project.root, icon: ICONS.project },
          { title: t('products'), path: paths.dashboard.project.product, icon: ICONS.product },
          { title: t('campaigns'), path: paths.dashboard.project.campaign, icon: ICONS.campaign },
          { title: t('reports'), path: paths.dashboard.project.report, icon: ICONS.report },
        ]
      },
      { title: t('account'), path: paths.dashboard.invoice.root, icon: ICONS.user },
      // { title: t('products'), path: paths.dashboard.product.root, icon: ICONS.product },
      // { title: t('routes'), path: paths.dashboard.userRoutes.root, icon: ICONS.route }
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
