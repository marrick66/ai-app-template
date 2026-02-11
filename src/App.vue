<script lang="ts">
export const iframeHeight = "800px"
export const description = "A sidebar with submenus."
</script>

<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { RouterLink, RouterView, useRoute } from "vue-router"
import { useColorMode } from '@vueuse/core'
import { computed } from "vue"

const mode = useColorMode()
mode.value = "light"

const route = useRoute()
const breadcrumbs = computed(() =>
  (route.meta.breadcrumbs as Array<{ title: string; path: string }>) ?? []
)

</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b bg-primary text-primary-foreground">
        <div class="flex items-center gap-2 px-3">
          <SidebarTrigger class="text-primary-foreground" />
          <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4 text-primary-foreground" style="font-weight: bold;"/>
          <Breadcrumb>
            <BreadcrumbList>
              <template v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
                <BreadcrumbSeparator v-if="index > 0" class="hidden md:block" :class="index < breadcrumbs.length - 1 ? 'text-muted' : 'text-accent'" />
                <BreadcrumbItem :class="[{ 'hidden md:block': index < breadcrumbs.length - 1 }, index < breadcrumbs.length - 1 ? 'text-muted' : 'text-accent']">
                  <BreadcrumbPage v-if="index === breadcrumbs.length - 1" class="breadcrumb-current">
                    {{ crumb.title }}
                  </BreadcrumbPage>
                  <BreadcrumbLink v-else as-child>
                    <RouterLink :to="crumb.path">
                      {{ crumb.title }}
                    </RouterLink>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </template>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4">
        <RouterView />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<style scoped>
.breadcrumb-current {
    font-weight: bold;
    color: var(--color-primary-foreground);
}
</style>
