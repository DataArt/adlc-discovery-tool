<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import GiscusComments from './GiscusComments.vue';
import Breadcrumbs from './Breadcrumbs.vue';

const { Layout } = DefaultTheme;

// Giscus only works safely with a PUBLIC GitHub repo — pointed at a private
// one, its API still serves that repo's Discussions to any unauthenticated
// caller, bypassing both GitHub's repo permissions and this site's own
// AUTH_MODE gate (confirmed by penetration testing, see
// docs/Engineering Guide/09 Harness Security.md). Off unless explicitly
// enabled via VITE_GISCUS_ENABLED=true in the target repo's env config.
const giscusEnabled = import.meta.env.VITE_GISCUS_ENABLED === 'true';
</script>

<template>
  <Layout>
    <template #doc-before>
      <Breadcrumbs />
    </template>
    <template v-if="giscusEnabled" #doc-after>
      <GiscusComments />
    </template>
  </Layout>
</template>
