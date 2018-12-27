
<template>
    <el-menu
    mode="vertical" :default-openeds="openeds" :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF"
    >
      <sidebar-item v-for="route in permission_routers" :key="route.name" :item="route" :base-path="route.path"></sidebar-item>
    </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  data() {
    return {
      openeds: ['/worktrack']
    }
  },
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
