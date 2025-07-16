<script setup lang="ts">
	import { onMounted } from 'vue';

	const { locales, setLocale } = useI18n();

	onMounted(() => {
		function getPreferredLanguage() {
			// 1. 检查URL参数（如 ?lang=zh）
			const urlParams = new URLSearchParams(window.location.search);
			const urlLang = urlParams.get('lang');
			if (urlLang) return urlLang;
			const storedLang = localStorage.getItem('preferredLanguage');
			if (storedLang) return storedLang;
			const browserLang = navigator.language || 'en';
			return /^zh/i.test(browserLang) ? 'zh' : 'en';
		}

		if (getPreferredLanguage() === 'zh') {
			setLocale('zh');
		} else {
			setLocale('en');
		}
	});

	const router = useRouter();
	const languages = usePreferredLanguages();

	async function editPersonalInfo() {
		const langs = languages.value as string[];

		if (langs) {
			await isChineseSkip(
				langs,
				async () => {
					await router.push({
						path: `/zh/settings/edit-personal-info`,
						 
					});
				},
				async () => {
					await router.push({
						path: `/settings/edit-personal-info`,
					 
					});
				},
			);
		}
	}

	async function editPerference() {
		const langs = languages.value as string[];

		if (langs) {
			await isChineseSkip(
				langs,
				async () => {
					await router.push({
						path: `/zh/settings/perference-options`,
						 
					});
				},
				async () => {
					await router.push({
						path: `/settings/perference-options`,
					 
					});
				},
			);
		}
	}
</script>

<template>
	<main class="siderbar">
		<h1 @click.stop="editPersonalInfo">🧑‍🎄{{ $t('personalInformation') }}</h1>
		<h1 @click.stop="editPerference">⚙️{{ $t('perferenceOptions') }}</h1>
	</main>
</template>

<style scoped>
	.siderbar {
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: start;
		margin-top: 20%;
		height: 100%;
		color: inherit;
		width: 100%;
		h1 {
			&:hover {
				color: darkorange;
			}
		}
	}
</style>
