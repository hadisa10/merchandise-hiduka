import { paramCase } from 'src/utils/change-case';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
  V2: '/v2'
};

// ----------------------------------------------------------------------

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
      retry: `${ROOTS.AUTH}/main/retry`,
      forgotPassword: `${ROOTS.AUTH}/main/forgot-password`,
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
      edit: (id: string) => `${ROOTS.DASHBOARD}/user-routes/${id}/edit`
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
      edit: (id: string) => `${ROOTS.DASHBOARD}/client/${id}/edit`
    },
    project: {
      root: `${ROOTS.DASHBOARD}/project`,
      new: `${ROOTS.DASHBOARD}/project/new`,
      list: `${ROOTS.DASHBOARD}/project/list`,
      product: `${ROOTS.DASHBOARD}/project/product`,
      report: `${ROOTS.DASHBOARD}/project/report`,
      analysis: `${ROOTS.DASHBOARD}/project/analysis`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/client/project/${id}/edit`
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
      edit: (id: string) => `${ROOTS.DASHBOARD}/campaign/${id}/edit`
    },
    report: {
      root: `${ROOTS.DASHBOARD}/report`,
      new: `${ROOTS.DASHBOARD}/report/new`,
      list: `${ROOTS.DASHBOARD}/report/list`,
      cards: `${ROOTS.DASHBOARD}/report/cards`,
      account: `${ROOTS.DASHBOARD}/report/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/report/${id}/edit`
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
    root: `${ROOTS.V2}`,
    superadmin: {
      root: `${ROOTS.V2}/superadmin/dashboard`,
      dashboard: `${ROOTS.V2}/superadmin/dashboard`,
    },
    admin: {
      root: `${ROOTS.V2}/admin/dashboard`,
      dashboard: `${ROOTS.V2}/admin/dashboard`,
      campaign: {
        root: `${ROOTS.V2}/admin/dashboard/campaign`,
        list: `${ROOTS.V2}/admin/dashboard/campaign`,
        edit: (id: string) => `${ROOTS.V2}/admin/dashboard/campaign/${id}/edit`,
      }
    },
    client: {
      root: `${ROOTS.V2}/client/dashboard`,
      dashboard: `${ROOTS.V2}/client/dashboard`,
      campaign: {
        root: `${ROOTS.V2}/client/dashboard/campaign`,
        list: `${ROOTS.V2}/client/dashboard/campaign`,
        new: `${ROOTS.V2}/client/dashboard/campaign/new`,
        edit: (id: string) => `${ROOTS.V2}/client/dashboard/campaign/${id}/edit`,
      }
    },
    "project-manager": {
      root: `${ROOTS.V2}/project-manager/dashboard`,
      dashboard: `${ROOTS.V2}/project-manager/dashboard`,
    },
    "team-lead": {
      root: `${ROOTS.V2}/team-lead/dashboard`,
      dashboard: `${ROOTS.V2}/team-lead/dashboard`,
    },
    agent: {
      root: `${ROOTS.V2}/agent/dashboard`,
      dashboard: `${ROOTS.V2}/agent/dashboard`,
    }

  }
};
