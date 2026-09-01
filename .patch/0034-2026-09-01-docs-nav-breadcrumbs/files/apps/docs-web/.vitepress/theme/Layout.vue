<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import GiscusComments from './GiscusComments.vue';
import Breadcrumbs from './Breadcrumbs.vue';

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #doc-before>
      <Breadcrumbs />
    </template>
    <template #doc-after>
      <GiscusComments />
    </template>
  </Layout>
</template>
