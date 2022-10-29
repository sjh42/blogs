<script setup lang="ts">
interface PropsTypes {
	color?: string
	title?: string
	icon?: string
	desc?: string
	iconBg?: string
}

const prop = defineProps<PropsTypes>()
</script>

<template>
	<div class="w-full flex flex-col p-4 border-l-5 b-rd shadow" :class="[`${prop.color ? prop.color : null}`]">
		<div class="flex items-center">
			<i class="text-2xl mr-1" :class="[`${prop.icon ? `prop.icon` : 'i-carbon-information'} ${prop.iconBg}`]" />
			<label v-if="prop.desc" class="text-sm">{{ prop.desc }}</label>
		</div>
		<slot class="pr-1" name="title" />
	</div>
</template>
