<script setup lang="ts">
interface MarkdownTitle {
  leftTitle?: string
  rightTitle?: string
}
const props = defineProps<MarkdownTitle>()
</script>

<template>
  <table>
    <tr class="sm:w-full sm:flex-row flex flex-col">
      <th class="pl-2">
        {{ props.leftTitle }}
        <tr>
          <td class="w-100">
            <slot name="left" />
          </td>
        </tr>
      </th>
      <th class="pl-2">
        {{ props.rightTitle }}
        <tr>
          <td class="w-100">
            <slot name="right" />
          </td>
        </tr>
      </th>
    </tr>
  </table>
</template>
