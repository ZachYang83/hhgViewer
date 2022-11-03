import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)


const routes = [
  {
    path: '/',
    name: 'Default',
    redirect: '/home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    meta: { title: "首页", icon: "el-icon-house" },
    component: Home,
    meta: {
      requireAuth: false
    },
    children: [
      {
        path: '/population',
        name: '人防业关联',
        meta: { title: "人口感知", icon: "wlsys-renkou" },
        component: () => import('@/views/population/index.vue'),
        children: [
          {
            path: '/population/queryMap',
            meta: { title: "人口画像", icon: "el-icon-position" },
            component: () => import('@/views/population/QueryMap.vue'),
          },
          {
            path: '/population/census',
            meta: { title: "人口普查", icon: "el-icon-position" },
            component: () => import('@/views/population/census/Census.vue'),
          },
        ]
      },
      {
        path: '/industry',
        name: '产业监测',
        meta: { title: "产业信息", icon: "wlsys-qiyechaxun" },
        component: () => import('@/views/industry/index.vue'),
        children:[
          {
            path: '/industry/qiye',
            meta: { title: "企业概况", icon: "el-icon-position" },
            component: () => import('@/views/industry/Qiye.vue'),
          },
          {
            path: '/industry/dynamic',
            meta: { title: "企业动态", icon: "el-icon-position" },
            component: () => import('@/views/industry/dynamic/Dynamic.vue'),
          },
          {
            path: '/industry/enterprise',
            meta: { title: "重点企业", icon: "el-icon-position" },
            component: () => import('@/views/industry/Enterprise.vue'),
          },
          {
            path: '/industry/chanyelian',
            meta: { title: "产业链条", icon: "el-icon-position" },
            component: () => import('@/views/industry/chanyelian.vue'),
          },
         
        ]
      },
      {
        path: '/landuse',
        name: '土地信息',
        meta: { title: "土地信息", icon: "wlsys-tudi" },
        component: () => import('@/views/landuse/index.vue'),
        children: [
          {
            path: '/landuse/konggui',
            meta: { title: "控规", icon: "el-icon-position" },
            component: () => import('@/views/landuse/Konggui.vue'),
          },
          {
            path: '/landuse/yongdizheng',
            meta: { title: "用地证", icon: "el-icon-position" },
            component: () => import('@/views/landuse/Xukezheng.vue'),
          },
          {
            path: '/landuse/building3d',
            meta: { title: "建筑面", icon: "el-icon-position" },
            component: () => import('@/views/landuse/Building3d.vue'),
          },
        ]
      },
      {
        path: '/afjf',
        name: '安防技防',
        meta: { title: "安防技防", icon: "wlsys-tudi" },
        component: () => import('@/views/afjf/index.vue'),
        children: [
          {
            path: '/yqfk/yqfk',
            meta: { title: "安防技防", icon: "el-icon-position" },
            component: () => import('@/views/afjf/afjf.vue'),
          },
        ]
      },
      {
        path: '/yqfk',
        name: '疫情防控',
        meta: { title: "疫情防控", icon: "wlsys-tudi" },
        component: () => import('@/views/yqfk/index.vue'),
        children: [
          {
            path: '/yqfk/yqfk',
            meta: { title: "疫情防控", icon: "el-icon-position" },
            component: () => import('@/views/yqfk/yqfk.vue'),
          },
        ]
      },
      {
        path: '/publicInfo',
        name: '基础设施',
        meta: { title: "基础设施", icon: "wlsys-nav_jijiandangan" },
        component: () => import('@/views/publicInfo/index.vue'),
        children: [
          {
            path: '/publicInfo/eduInfo',
            meta: { title: "教育设施", icon: "el-icon-position" },
            component: () => import('@/views/publicInfo/EduInfo.vue'),
          },
          {
            path: '/publicInfo/medInfo',
            meta: { title: "医疗设施", icon: "el-icon-position" },
            component: () => import('@/views/publicInfo/MedInfo.vue'),
          },
          {
            path: '/publicInfo/civInfo',
            meta: { title: "行政设施", icon: "el-icon-position" },
            component: () => import('@/views/publicInfo/CivInfo.vue'),
          },
          {
            path: '/publicInfo/culInfo',
            meta: { title: "文体设施", icon: "el-icon-position" },
            component: () => import('@/views/publicInfo/CulInfo.vue'),
          },
          {
            path: '/publicInfo/huanwei',
            meta: { title: "环卫设施", icon: "el-icon-position" },
            component: () => import('@/views/publicInfo/huanwei.vue'),
          },
          {
            path: '/publicInfo/dianli',
            meta: { title: "电力设施", icon: "el-icon-position" },
            component: () => import('@/views/publicInfo/dianli.vue'),
          },
          {
            path: '/publicInfo/xuanchuan',
            meta: { title: "宣传设施", icon: "el-icon-position" },
            component: () => import('@/views/publicInfo/xuanchuan.vue'),
          },
          {
            path: '/publicInfo/Qita',
            meta: { title: "其他设施", icon: "el-icon-position" },
            component: () => import('@/views/publicInfo/Qita.vue'),
          },
        ]
      },
      {
        path: '/traffic',
        name: '交通运行',
        meta: { title: "交通运行", icon: "wlsys-tudi" },
        component: () => import('@/views/traffic/index.vue'),
        children: [
          {
            path: '/traffic/sxod',
            meta: { title: "市县货运OD", icon: "el-icon-position" },
            component: () => import('@/views/traffic/sxod.vue'),
          },
          {
            path: '/traffic/sqod',
            meta: { title: "社区货运OD", icon: "el-icon-position" },
            component: () => import('@/views/traffic/sqod.vue'),
          },
          {
            path: '/traffic/dsq',
            meta: { title: "交通等时圈", icon: "el-icon-position" },
            component: () => import('@/views/traffic/dsq.vue'),
          },
          {
            path: '/traffic/duanmian',
            meta: { title: "道路断面负载", icon: "el-icon-position" },
            component: () => import('@/views/traffic/duanmian.vue'),
          },
        ]
      },
    ]
  }
]

const router = new VueRouter({
  // mode:'history',
  routes
})

export default router
