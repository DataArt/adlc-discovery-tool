<script setup lang="ts">
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';

interface Crumb {
  text: string;
  link: string;
  hasPage: boolean;
}

const prettify = (name: string) => name.replace(/^\d+\s+/, '');

const { page, frontmatter, theme } = useData<{ indexedDirs: string[] }>();

const indexedDirs = computed(() => new Set(theme.value.indexedDirs ?? []));

const crumbs = computed<Crumb[]>(() => {
  if (frontmatter.value.layout === 'home') return [];

  const rawSegments = page.value.relativePath.split('/').filter(Boolean);
  if (rawSegments.length === 0) return [];

  const isIndexPage = /^(index|README)$/i.test(
    rawSegments[rawSegments.length - 1].replace(/\.md$/, '')
  );
  const segments = isIndexPage ? rawSegments.slice(0, -1) : rawSegments;
  if (segments.length === 0) return [];

  let acc = '';
  return segments.map((segment, i) => {
    const name = segment.replace(/\.md$/, '');
    acc += `/${name}`;
    const isLeafPage = i === segments.length - 1 && !isIndexPage;
    const hasPage = isLeafPage || indexedDirs.value.has(acc.slice(1));
    return { text: prettify(name), link: isLeafPage ? `${acc}.html` : `${acc}/`, hasPage };
  });
});
</script>

<template>
  <nav v-if="crumbs.length" class="breadcrumbs" aria-label="Breadcrumb">
    <template v-for="(crumb, i) in crumbs" :key="crumb.link">
      <span v-if="i > 0" class="crumb-sep">/</span>
      <a v-if="i < crumbs.length - 1 && crumb.hasPage" class="crumb-link" :href="withBase(crumb.link)">{{
        crumb.text
      }}</a>
      <span v-else-if="i < crumbs.length - 1" class="crumb-text">{{ crumb.text }}</span>
      <span v-else class="crumb-current">{{ crumb.text }}</span>
    </template>
  </nav>
</template>

<style scoped>
.breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
  font-size: 13px;
  line-height: 20px;
}

.crumb-link {
  color: var(--vp-c-text-2);
  transition: color 0.25s;
}

.crumb-link:hover {
  color: var(--vp-c-brand-1);
}

.crumb-text {
  color: var(--vp-c-text-2);
}

.crumb-current {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.crumb-sep {
  color: var(--vp-c-divider);
}
</style>