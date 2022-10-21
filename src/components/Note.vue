<script setup lang="ts">
export interface PropsTypes {
  color?: string
  title: string
  icon?: string
  desc?: string
  iconBg?: string
}

const prop = defineProps<PropsTypes>()
</script>

<template>
  <div :class="[`${prop.color ? prop.color: null}`,'w-full flex flex-col p-4 border-l-5 b-rd shadow']">
    <div class="flex items-center">
      <i :class="[`${prop.icon ? `prop.icon` : 'i-carbon-information'} ${prop.iconBg}`, 'text-2xl mr-1']" />
      <label class="text-sm" v-if="prop.desc">{{prop.desc}}</label>
    </div>
    <slot class="pr-1" name="title" />
  </div>
</template>
