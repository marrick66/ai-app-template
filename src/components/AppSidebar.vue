<script setup lang="ts">
import type { SidebarProps } from "@/components/ui/sidebar"
import { computed } from "vue"
import { RouterLink, useRoute } from "vue-router"

import { GalleryVerticalEnd } from "lucide-vue-next"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { IconReport, IconVs } from "@tabler/icons-vue"

const props = defineProps<SidebarProps>()
const route = useRoute()

const data = computed(() => ({
  navMain: [
    {
      title: "SEC Reports",
      url: "/reports",
      icon: IconReport,
      isActive: route.path === "/reports",
      items: [
        {
          title: "Comparisons",
          url: "/reports/comparisons",
          icon: IconVs,
          isActive: route.path === "/reports/comparisons",
        },
      ],
    },
  ],
}))
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <a href="#">
              <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd class="size-4" />
              </div>
              <div class="flex flex-col gap-0.5 leading-none">
                <span class="font-medium">Documentation</span>
                <span class="">v1.0.0</span>
              </div>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem v-for="item in data.navMain" :key="item.title">
            <SidebarMenuButton as-child :is-active="item.isActive">
              <RouterLink :to="item.url" class="font-medium">
                <component :is="item.icon" />
                <span>{{ item.title }}</span>
              </RouterLink>
            </SidebarMenuButton>
            <SidebarMenuSub v-if="item.items.length">
              <SidebarMenuSubItem v-for="childItem in item.items" :key="childItem.title">
                <SidebarMenuSubButton as-child :is-active="childItem.isActive">
                    <RouterLink :to="childItem.url" class="font-medium">
                        <component :is="childItem.icon" />
                        <span>{{ childItem.title }}</span>
                    </RouterLink>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarRail />
  </Sidebar>
</template>
