import Layout from '@/components/layout/index.vue'

export default [
  {
    path: '/',
    name: 'WebsiteLayout',
    redirect: '/home',
    component: markRaw(Layout),
    children: [
      {
        path: '/home',
        name: 'WebsiteHome',
        component: () => import('@/views/website/home/index.vue'),
        meta: {
          title: '首页',
          visabled: true,
        },
      },
    ],
  },
]
