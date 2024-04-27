import { paramCase } from 'src/utils/change-case';

import { _id, _postTitles } from 'src/_mock/assets';

import { ERole } from 'src/types/client';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
  V2: '/v2',
};

// ----------------------------------------------------------------------

// Create a type that represents all roles' paths using TypeScript's keyof typeof
export type Roles = keyof typeof paths.v2;

// Create a generic type that extracts the paths for a specific role
export type PathsForRole<Role extends Roles> = (typeof paths.v2)[Role];

// Usage example to get the path types for 'admin'

// Function to get path

export const paths = {
  comingSoon: ROOTS.DASHBOARD,
  maintenance: ROOTS.DASHBOARD,
  pricing: ROOTS.DASHBOARD,
  payment: ROOTS.DASHBOARD,
  about: ROOTS.DASHBOARD,
  contact: ROOTS.DASHBOARD,
  faqs: ROOTS.DASHBOARD,
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: ROOTS.DASHBOARD,
  docs: ROOTS.DASHBOARD,
  changelog: ROOTS.DASHBOARD,
  zoneUI: ROOTS.DASHBOARD,
  minimalUI: ROOTS.DASHBOARD,
  freeUI: ROOTS.DASHBOARD,
  figma: ROOTS.DASHBOARD,
  register: `/complete-registration`,
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id: string) => `/product/${id}`,
    demo: {
      details: `/product/${MOCK_ID}`,
    },
  },
  post: {
    root: `/post`,
    details: (title: string) => `/post/${paramCase(title)}`,
    demo: {
      details: `/post/${paramCase(MOCK_TITLE)}`,
    },
  },
  // AUTH
  auth: {
    amplify: {
      login: `${ROOTS.AUTH}/amplify/login`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      register: `${ROOTS.AUTH}/amplify/register`,
      newPassword: `${ROOTS.AUTH}/amplify/new-password`,
      forgotPassword: `${ROOTS.AUTH}/amplify/forgot-password`,
    },
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
    main: {
      login: `${ROOTS.AUTH}/main/login`,
      verify: `${ROOTS.AUTH}/main/verify`,
      register: `${ROOTS.AUTH}/main/register`,
      verified: `${ROOTS.AUTH}/main/verified`,
      deletedSuccess: `${ROOTS.AUTH}/main/deleted-success`,
      deletedDataSuccess: `${ROOTS.AUTH}/main/deleted-data-success`,
      retry: `${ROOTS.AUTH}/main/retry`,
      forgotPassword: `${ROOTS.AUTH}/main/forgot-password`,
      resetPassword: `${ROOTS.AUTH}/main/reset-password`,
    },
    auth0: {
      login: `${ROOTS.AUTH}/auth0/login`,
    },
    supabase: {
      login: `${ROOTS.AUTH}/supabase/login`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      register: `${ROOTS.AUTH}/supabase/register`,
      newPassword: `${ROOTS.AUTH}/supabase/new-password`,
      forgotPassword: `${ROOTS.AUTH}/supabase/forgot-password`,
    },
  },
  authDemo: {
    classic: {
      login: `${ROOTS.AUTH_DEMO}/classic/login`,
      register: `${ROOTS.AUTH_DEMO}/classic/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/classic/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/classic/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/classic/verify`,
    },
    modern: {
      login: `${ROOTS.AUTH_DEMO}/modern/login`,
      register: `${ROOTS.AUTH_DEMO}/modern/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/modern/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/modern/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/modern/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: `${ROOTS.DASHBOARD}`,
    ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
    analytics: {
      root: `${ROOTS.DASHBOARD}/analytics`,
      userPerformance: `${ROOTS.DASHBOARD}/analytics/user-performance`,
      userEngagment: `${ROOTS.DASHBOARD}/analytics/user-engagement`,
      campaignPerformance: `${ROOTS.DASHBOARD}/analytics/campaign-performance`,
      marketingCompetitive: `${ROOTS.DASHBOARD}/analytics/marketing-competitive`,
      merchandiseAnalysis: `${ROOTS.DASHBOARD}/analytics/merchandise`,
      customerSegmentation: `${ROOTS.DASHBOARD}/analytics/customer-segmentation`,
    },

    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    userRoutes: {
      root: `${ROOTS.DASHBOARD}/user-routes`,
      new: `${ROOTS.DASHBOARD}/user-routes/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/user-routes/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/user-routes/${id}/edit`,
    },
    general: {
      main: `${ROOTS.DASHBOARD}/main`,
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      },
    },
    client: {
      root: `${ROOTS.DASHBOARD}/client`,
      new: `${ROOTS.DASHBOARD}/client/new`,
      list: `${ROOTS.DASHBOARD}/client/list`,
      cards: `${ROOTS.DASHBOARD}/client/cards`,
      account: `${ROOTS.DASHBOARD}/client/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/client/${id}/edit`,
    },
    project: {
      root: `${ROOTS.DASHBOARD}/project`,
      new: `${ROOTS.DASHBOARD}/project/new`,
      list: `${ROOTS.DASHBOARD}/project/list`,
      product: `${ROOTS.DASHBOARD}/project/product`,
      report: `${ROOTS.DASHBOARD}/project/report`,
      analysis: `${ROOTS.DASHBOARD}/project/analysis`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/client/project/${id}/edit`,
    },
    routes: {
      root: `${ROOTS.DASHBOARD}/routes`,
      new: `${ROOTS.DASHBOARD}/routes/new`,
    },

    campaign: {
      root: `${ROOTS.DASHBOARD}/campaign`,
      new: `${ROOTS.DASHBOARD}/campaign/new`,
      list: `${ROOTS.DASHBOARD}/campaign/list`,
      cards: `${ROOTS.DASHBOARD}/campaign/cards`,
      account: `${ROOTS.DASHBOARD}/campaign/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/campaign/${id}/edit`,
    },
    report: {
      root: `${ROOTS.DASHBOARD}/report`,
      new: `${ROOTS.DASHBOARD}/report/new`,
      list: `${ROOTS.DASHBOARD}/report/list`,
      cards: `${ROOTS.DASHBOARD}/report/cards`,
      account: `${ROOTS.DASHBOARD}/report/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/report/${id}/edit`,
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
      },
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title: string) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}`,
      edit: (title: string) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}/edit`,
      },
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id: string) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
      },
    },
    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      },
    },
    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
      },
    },
  },
  v2: {
    [ERole.SUPERADMIN]: {
      root: `${ROOTS.V2}/superadmin/dashboard`,
      dashboard: `${ROOTS.V2}/superadmin/dashboard`,
    },
    [ERole.ADMIN]: {
      root: `${ROOTS.V2}/admin/dashboard`,
      dashboard: `${ROOTS.V2}/admin/dashboard`,
      product: {
        root: `${ROOTS.V2}/admin/dashboard/product`,
        new: `${ROOTS.V2}/admin/dashboard/product/new`,
        details: (id: string) => `${ROOTS.V2}/dashboard/product/${id}`,
        edit: (id: string) => `${ROOTS.V2}/dashboard/product/${id}/edit`,
      },
      invoice: {
        root: `${ROOTS.V2}/admin/dashboard/invoice`,
        list: `${ROOTS.V2}/admin/dashboard/invoice`,
        new: `${ROOTS.V2}/admin/dashboard/invoice/new`,
        edit: (id: string) => `${ROOTS.V2}/admin/dashboard/invoice/${id}/edit`,
        details: (id: string) => `${ROOTS.V2}/admin/dashboard/invoice/${id}`,
      },
      project: {
        root: `${ROOTS.V2}/client/dashboard/project`,
        list: `${ROOTS.V2}/client/dashboard/project`,
        new: `${ROOTS.V2}/client/dashboard/project/new`,
        edit: (id: string) => `${ROOTS.V2}/client/dashboard/project/${id}/edit`,
      },
      client: {
        root: `${ROOTS.V2}/admin/dashboard/client`,
        list: `${ROOTS.V2}/admin/dashboard/client`,
        new: `${ROOTS.V2}/admin/dashboard/client/new`,
        edit: (id: string) => `${ROOTS.V2}/admin/dashboard/client/${id}/edit`,
      },
      report: {
        root: `${ROOTS.V2}/admin/dashboard/report`,
        list: `${ROOTS.V2}/admin/dashboard/report`,
        new: `${ROOTS.V2}/admin/dashboard/report/new`,
        edit: (id: string) => `${ROOTS.V2}/admin/dashboard/report/${id}/edit`,
      },
      campaign: {
        root: `${ROOTS.V2}/admin/dashboard/campaign`,
        list: `${ROOTS.V2}/admin/dashboard/campaign`,
        new: `${ROOTS.V2}/admin/dashboard/campaign/new`,
        edit: (id: string) => `${ROOTS.V2}/admin/dashboard/campaign/${id}/edit`,
      },
      'campaign-performance': `${ROOTS.V2}/admin/dashboard/campaign-performance`,
      'activity-tracker': `${ROOTS.V2}/client/dashboard/activity-tracker`,
    },
    [ERole.CLIENT]: {
      root: `${ROOTS.V2}/client/dashboard`,
      dashboard: `${ROOTS.V2}/client/dashboard`,
      project: {
        root: `${ROOTS.V2}/client/dashboard/project`,
        list: `${ROOTS.V2}/client/dashboard/project`,
        new: `${ROOTS.V2}/client/dashboard/project/new`,
        edit: (id: string) => `${ROOTS.V2}/client/dashboard/project/${id}/edit`,
      },
      product: {
        root: `${ROOTS.V2}/client/product`,
        new: `${ROOTS.V2}/client/product/new`,
        details: (id: string) => `${ROOTS.V2}/client/product/${id}`,
        edit: (id: string) => `${ROOTS.V2}/client/product/${id}/edit`,
      },
      reports: {
        root: `${ROOTS.V2}/client/dashboard/report`,
        list: `${ROOTS.V2}/client/dashboard/report`,
        new: `${ROOTS.V2}/client/dashboard/report/new`,
        edit: (id: string) => `${ROOTS.V2}/client/dashboard/report/${id}/edit`,
      },
      campaign: {
        root: `${ROOTS.V2}/client/dashboard/campaign`,
        list: `${ROOTS.V2}/client/dashboard/campaign`,
        new: `${ROOTS.V2}/client/dashboard/campaign/new`,
        edit: (id: string) => `${ROOTS.V2}/client/dashboard/campaign/${id}/edit`,
      },
      'campaign-performance': `${ROOTS.V2}/client/dashboard/campaign-performance`,
      'activity-tracker': `${ROOTS.V2}/client/dashboard/activity-tracker`,
    },
    [ERole.PROJECT_MANAGER]: {
      root: `${ROOTS.V2}/project-manager/dashboard`,
      dashboard: `${ROOTS.V2}/project-manager/dashboard`,
      project: {
        root: `${ROOTS.V2}/project-manager/dashboard/project`,
        list: `${ROOTS.V2}/project-manager/dashboard/project`,
        new: `${ROOTS.V2}/project-manager/dashboard/project/new`,
        edit: (id: string) => `${ROOTS.V2}/project-manager/dashboard/project/${id}/edit`,
      },
      product: {
        root: `${ROOTS.V2}/project-manager/dashboard/product`,
        new: `${ROOTS.V2}/project-manager/dashboard/product/new`,
        details: (id: string) => `${ROOTS.V2}/project-manager/dashboard/product/${id}`,
        edit: (id: string) => `${ROOTS.V2}/project-manager/dashboard/product/${id}/edit`,
      },
      reports: {
        root: `${ROOTS.V2}/project-manager/dashboard/report`,
        list: `${ROOTS.V2}/project-manager/dashboard/report`,
        new: `${ROOTS.V2}/project-manager/dashboard/report/new`,
        edit: (id: string) => `${ROOTS.V2}/project-manager/dashboard/report/${id}/edit`,
      },
      campaign: {
        root: `${ROOTS.V2}/project-manager/dashboard/campaign`,
        list: `${ROOTS.V2}/project-manager/dashboard/campaign`,
        new: `${ROOTS.V2}/project-manager/dashboard/campaign/new`,
        edit: (id: string) => `${ROOTS.V2}/project-manager/dashboard/campaign/${id}/edit`,
      },
      'campaign-performance': `${ROOTS.V2}/project-manager/dashboard/campaign-performance`,
      'activity-tracker': `${ROOTS.V2}/project-manager/dashboard/activity-tracker`,
    },
    [ERole.TEAM_LEAD]: {
      root: `${ROOTS.V2}/team-lead/dashboard`,
      dashboard: `${ROOTS.V2}/team-lead/dashboard`,
    },
    [ERole.AGENT]: {
      root: `${ROOTS.V2}/agent/dashboard`,
      dashboard: `${ROOTS.V2}/agent/dashboard`,
    },
  },
} as const;
// export const paths = {

//   v2: {
//     root: `${ROOTS.V2}`,
//     superadmin: {
//       root: `${ROOTS.V2}/superadmin/dashboard`,
//       dashboard: `${ROOTS.V2}/superadmin/dashboard`,
//     },
//     admin: {
//       root: `${ROOTS.V2}/admin/dashboard`,
//       dashboard: `${ROOTS.V2}/admin/dashboard`,
//       product: `${ROOTS.V2}/admin/dashboard/product`,
//       invoice: {
//         root: `${ROOTS.V2}/admin/dashboard/invoice`,
//         list: `${ROOTS.V2}/admin/dashboard/invoice`,
//         new: `${ROOTS.V2}/admin/dashboard/invoice/new`,
//         edit: (id: string) => `${ROOTS.V2}/admin/dashboard/invoice/${id}/edit`,
//         details: (id: string) => `${ROOTS.V2}/admin/dashboard/invoice/${id}`,
//       },
//       project: {
//         root: `${ROOTS.V2}/client/dashboard/project`,
//         list: `${ROOTS.V2}/client/dashboard/project`,
//         new: `${ROOTS.V2}/client/dashboard/project/new`,
//         edit: (id: string) => `${ROOTS.V2}/client/dashboard/project/${id}/edit`,
//       },
//       client: {
//         root: `${ROOTS.V2}/admin/dashboard/client`,
//         list: `${ROOTS.V2}/admin/dashboard/client`,
//         new: `${ROOTS.V2}/admin/dashboard/client/new`,
//         edit: (id: string) => `${ROOTS.V2}/admin/dashboard/client/${id}/edit`,
//       },
//       report: {
//         root: `${ROOTS.V2}/admin/dashboard/report`,
//         list: `${ROOTS.V2}/admin/dashboard/report`,
//         new: `${ROOTS.V2}/admin/dashboard/report/new`,
//         edit: (id: string) => `${ROOTS.V2}/admin/dashboard/report/${id}/edit`,
//       },
//       campaign: {
//         root: `${ROOTS.V2}/admin/dashboard/campaign`,
//         list: `${ROOTS.V2}/admin/dashboard/campaign`,
//         new: `${ROOTS.V2}/admin/dashboard/campaign/new`,
//         edit: (id: string) => `${ROOTS.V2}/admin/dashboard/campaign/${id}/edit`,
//       },
//       'campaign-performance': `${ROOTS.V2}/admin/dashboard/campaign-performance`,
//       'activity-tracker': `${ROOTS.V2}/client/dashboard/activity-tracker`,
//     },
//     client: {
//       root: `${ROOTS.V2}/client/dashboard`,
//       dashboard: `${ROOTS.V2}/client/dashboard`,
//       project: {
//         root: `${ROOTS.V2}/client/dashboard/project`,
//         list: `${ROOTS.V2}/client/dashboard/project`,
//         new: `${ROOTS.V2}/client/dashboard/project/new`,
//         edit: (id: string) => `${ROOTS.V2}/client/dashboard/project/${id}/edit`,
//       },
//       reports: {
//         root: `${ROOTS.V2}/client/dashboard/report`,
//         list: `${ROOTS.V2}/client/dashboard/report`,
//         new: `${ROOTS.V2}/client/dashboard/report/new`,
//         edit: (id: string) => `${ROOTS.V2}/client/dashboard/report/${id}/edit`,
//       },
//       campaign: {
//         root: `${ROOTS.V2}/client/dashboard/campaign`,
//         list: `${ROOTS.V2}/client/dashboard/campaign`,
//         new: `${ROOTS.V2}/client/dashboard/campaign/new`,
//         edit: (id: string) => `${ROOTS.V2}/client/dashboard/campaign/${id}/edit`,
//       },
//       'campaign-performance': `${ROOTS.V2}/client/dashboard/campaign-performance`,
//       'activity-tracker': `${ROOTS.V2}/client/dashboard/activity-tracker`,
//     },
//     'project-manager': {
//       root: `${ROOTS.V2}/project-manager/dashboard`,
//       dashboard: `${ROOTS.V2}/project-manager/dashboard`,
//       project: {
//         root: `${ROOTS.V2}/project-manager/dashboard/project`,
//         list: `${ROOTS.V2}/project-manager/dashboard/project`,
//         new: `${ROOTS.V2}/project-manager/dashboard/project/new`,
//         edit: (id: string) => `${ROOTS.V2}/project-manager/dashboard/project/${id}/edit`,
//       },
//       reports: {
//         root: `${ROOTS.V2}/project-manager/dashboard/report`,
//         list: `${ROOTS.V2}/project-manager/dashboard/report`,
//         new: `${ROOTS.V2}/project-manager/dashboard/report/new`,
//         edit: (id: string) => `${ROOTS.V2}/project-manager/dashboard/report/${id}/edit`,
//       },
//       campaign: {
//         root: `${ROOTS.V2}/project-manager/dashboard/campaign`,
//         list: `${ROOTS.V2}/project-manager/dashboard/campaign`,
//         new: `${ROOTS.V2}/project-manager/dashboard/campaign/new`,
//         edit: (id: string) => `${ROOTS.V2}/project-manager/dashboard/campaign/${id}/edit`,
//       },
//       'campaign-performance': `${ROOTS.V2}/project-manager/dashboard/campaign-performance`,
//       'activity-tracker': `${ROOTS.V2}/project-manager/dashboard/activity-tracker`,
//     },
//     'team-lead': {
//       root: `${ROOTS.V2}/team-lead/dashboard`,
//       dashboard: `${ROOTS.V2}/team-lead/dashboard`,
//     },
//     agent: {
//       root: `${ROOTS.V2}/agent/dashboard`,
//       dashboard: `${ROOTS.V2}/agent/dashboard`,
//     },
//   },
// };
