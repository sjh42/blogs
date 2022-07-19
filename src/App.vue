<template>
	<NavBar />
	<main class="px-7 py-10">
		<backdrop>
			<template #router>
				<router-view />
			</template>
		</backdrop>			
	</main>
	<Footer />
</template>
