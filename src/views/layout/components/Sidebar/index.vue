<template>
  <scroll-bar>
    <el-menu mode="vertical" unique-opened :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#fff" active-text-color="#409EFF">
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'sidebar',
      'permissions'
    ]),
    routes() {
      // 不采用动态路由的方式, 因为组件名称等等都需要后台配置,太麻烦,前端固定写router.
      // 这里判断权限,进行相关router的隐藏.

      console.log(this.$router.options.routes)
      console.log(this.permissions)
      this.$router.options.routes.forEach((value, index) => {
        if (value.meta && value.meta.permiss) {
          if (!this.permissions.includes(value.meta.permiss)) {
            value.hidden = true
          }
        }
        // 目前两级菜单,暂不提供无限迭代
        if (value.clildren) {
          value.children.forEach((v, i) => {
            if (value.meta && value.meta.permiss) {
              if (!this.permissions.includes(v.meta.permiss)) {
                v.hidden = true
              }
            }
          })
        }
      })

      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
