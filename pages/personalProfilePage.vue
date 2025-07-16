<script setup lang="ts">
import Back from '~/components/comman/back.vue';
import AvatarCommon from '~/components/accounts/avatarCommon.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAccessTokenStore, useInstanceUrlStore } from '~/store';
import { getAccessTokenStorage, getInstanceUrlStorage } from '~/composable/constant';
import { formatTime } from '~/utils';
import { NTabs, NTabPane } from 'naive-ui';
import { isChineseSkip } from '~/utils';
interface UserDataStruct
{
	username: string;
	acct: string;
	id: string;
	displayName: string;
	bio: boolean;
	avatar: string;
	createdAt: string;
	header: string;
	url: string;
	statusesCount: number;
	followersCount: number;
	followingCount: number;
}

const route = useRoute();

const personalData = reactive<UserDataStruct>({} as UserDataStruct);
const instanceUrl = useInstanceUrlStore().getInstanceUrl || getInstanceUrlStorage();
const accessToken = useAccessTokenStore().getAccessToken || getAccessTokenStorage();
const personalPosts = ref([]) as any;
const personalComments = ref([]) as any;
const personalMedias = ref([]) as any;
const replyUserInfo = ref([]) as any;

onMounted(async () =>
{
	if (route?.query?.id)
	{
		const id = String(route.query.id || '');
		if (!id)
		{
			console.error('special account id is not exist');
			return;
		}

		try
		{
			const res = await axios.post('/api/account/special_account_detail/', {
				id: id,
				url: instanceUrl,
				accessToken: accessToken,
			});
			const data = res.data;
			Object.assign(personalData, data);
		} catch (error)
		{
			console.error('account detail profile error', error);
		}
		try
		{
			const res1 = await axios.post('/api/account/get_share_and_publish_post', {
				url: instanceUrl,
				accessToken: accessToken,
				id: id,
			});
			const posts = res1.data;
			personalPosts.value = posts;

			const res2 = await axios.post('/api/account/get_published_comments', {
				url: instanceUrl,
				accessToken: accessToken,
				id: id,
			});
			const comments = res2.data;
			personalComments.value = comments;

			const res3 = await axios.post('/api/account/get_published_medias', {
				id,
				url: instanceUrl,
				accessToken: accessToken,
			});
			const medias = res3.data;
			personalMedias.value = medias;
		} catch (error)
		{
			console.error('personal profile data fetch  error', error);
		}
	} else
	{
		const url = new URL(window.location.href);
		const id = url.searchParams.get('id');
		if (!id)
		{
			console.error('special account id is not exist from href');
			return;
		}
		try
		{
			const res = await axios.post('/api/account/special_account_detail/', {
				id: id,
				url: instanceUrl,
				accessToken: accessToken,
			});
			const data = res.data;
			Object.assign(personalData, data);
		} catch (error)
		{
			console.error('account detail profile error', error);
		}
		try
		{
			const res1 = await axios.post('/api/account/get_share_and_publish_post', {
				url: instanceUrl,
				accessToken: accessToken,
				id: id,
			});
			const posts = res1.data;
			personalPosts.value = posts;

			const res2 = await axios.post('/api/account/get_published_comments', {
				url: instanceUrl,
				accessToken: accessToken,
				id: id,
			});
			const comments = res2.data;
			personalComments.value = comments;

			const res3 = await axios.post('/api/account/get_published_medias', {
				id,
				url: instanceUrl,
				accessToken: accessToken,
			});
			const medias = res3.data;
			personalMedias.value = medias;
		} catch (error)
		{
			console.error('personal profile data fetch  error', error);
		}
	}

	console.log('personalData', personalData);
});

const userInstanceUrl = computed(() =>
{
	const url = personalData.url;
	if (!url) return 'unknown url';
	const arr = url.split('/');
	const userName = arr[arr.length - 1];
	let instanceUrl = getInstanceUrlStorage();
	instanceUrl = instanceUrl.replace('https://', '');
	return `${userName}@${instanceUrl}`;
});

const languages = usePreferredLanguages();
const router = useRouter();
async function editPersonalProfile()
{
	const langs = languages.value as string[];

	if (langs.length)
	{
		await isChineseSkip(
			langs,
			async () =>
			{
				await router.push({
					path: `/zh/settings/edit-personal-info`,
				});
			},
			async () =>
			{
				await router.push({
					path: `/settings/edit-personal-info`,
				});
			},
		);
	}
}

watch(
	personalComments,
	async () =>
	{
		if (personalComments.value.length)
		{
			const replyToAccountId = personalComments.value.map((comment) => comment.inReplyToAccountId);
			const tasks = replyToAccountId.map((accountId) =>
				axios.post('/api/account/special_account_detail/', {
					id: accountId,
					url: instanceUrl,
					accessToken,
				}),
			);

			const responses = await Promise.all(tasks);
			replyUserInfo.value = responses.map((r) => r.data);
		}
	},
	{ deep: true },
);
</script>

<template>
	<div class="back">
		<Back />
	</div>
	<div class="bg-img">
		<img :src="personalData.header" alt="" />
	</div>

	<main class="personal-container">
		<div class="user-info">
			<div class="avatar">
				<img :src="personalData.avatar" alt="" />
				<button @click.stop="editPersonalProfile" class="edit-btn">
					{{ $t('editProfile') }}
				</button>
			</div>
			<div class="name-info">
				<h2>{{ personalData.displayName || personalData.username }}</h2>
				<section
					style="display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%">
					<span style="opacity: 0.8; font-size: medium; font-weight: bold">{{
						userInstanceUrl || personalData.acct
					}}</span>
					<span style="margin-left: auto; margin-right: 10px">🌏{{ formatTime(personalData.createdAt)
					}}</span>
				</section>
				<section style="
						display: flex;
						flex-direction: row;
						justify-content: start;
						align-items: center;
						width: 100%;
						gap: 20px;
						color: mediumpurple;
					">
					<span>{{ personalData.statusesCount }} {{ $t('postCounts') }}</span>
					<span>{{ personalData.followersCount }} {{ $t('fans') }}</span>
					<span>{{ personalData.followingCount }} {{ $t('followingPerson') }}</span>
				</section>
				<n-tabs default-value="posts" type="bar" justify-content="space-around"
					style="width: 100%; background-color: transparent; color: inherit"
					tab-style="font-weight: bold;background-color: transparent; color : inherit "
					pane-wrapper-style=" background-color: transparent; color : inherit "
					pane-style=" background-color: transparent; color : inherit ">
					<n-tab-pane name="posts" :tab="$t('statuses')" style="font-weight: bold; width: 100%; height: 100%">


					</n-tab-pane>
					{{ personalPosts.length ? personalPosts : 'No Posts' }}
					<n-tab-pane name="postsComment" :tab="$t('postsComment')"
						style="font-weight: bold; width: 100%; height: 100%">
						<main style="display: flex; width: 100%;height: auto;"
							v-for="(comment, index) in personalComments" :key="index">
							<section v-if="personalComments.length"
								style="display: flex;width :100%;height: auto;flex-direction: column;justify-content: start;align-items: start;gap:10px;">
								<div class="reply-user-name" style="opacity: 0.8;">
									<template v-if="replyUserInfo && replyUserInfo[index]">
										📤📢{{ replyUserInfo[index].displayName || replyUserInfo[index].username }}
									</template>
								</div>
								<div class="comment-user"
									style="display: flex;flex-direction: row;justify-content: start;align-items: center;gap: 10px;">
									<img style="width: 50px;width: 50px;border: 20%;" :src="comment.avatar" />
									<span style="font-size: large;font-weight: bold;">{{ comment.displayName ||
										comment.username }}</span>
									<span style="margin-left: auto;margin-right: 10px;">{{ formatTime(comment.createdAt)
									}}</span>
								</div>
							</section>
							<div v-else>🛜'No Comments'</div>
						</main>
					</n-tab-pane>
					<n-tab-pane name="media" :tab="$t('media')" style="font-weight: bold; width: 100%; height: 100%">
						{{ personalMedias.length ? personalMedias : 'No Medias' }}
					</n-tab-pane>
				</n-tabs>
			</div>
		</div>
	</main>
</template>

<style scoped>
.name-info {
	width: 100%;
}

.bg-img {
	width: 100%;
	aspect-ratio: 3 / 1;
	/* 或者你根据实际图像比例设置 */
	border-radius: 20px;
	overflow: hidden;
	position: relative;
	border: none;
}

.bg-img img {
	position: absolute;
	margin-top: 50px;
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.avatar {
	display: flex;
	flex-direction: row;
	justify-content: start;
	align-items: center;
	width: 100%;
	height: auto;
	background-color: transparent;

	button {
		padding: 10px;
		margin-left: auto;
		margin-right: 20px;
		border-radius: 10px;
		border: 1px solid mediumpurple;
		background-color: transparent;
		color: inherit;
		font-weight: bold;

		&:hover {
			scale: 1.1;
			background-color: skyblue;
		}
	}
}

img {
	width: 20%;
	height: auto;
	border-radius: 20px;
	margin-top: -10%;
}

.user-info {
	display: flex;
	flex-direction: column;
	justify-content: start;
	align-items: start;
	z-index: 100;
	width: 100%;
	height: 100%;
	margin-left: 10px;
	margin-right: 10px;
}

.back {
	position: absolute;
	z-index: 1000;
}

.personal-container {
	width: 100%;
	height: 89%;
	display: flex;
	flex-direction: column;
	justify-content: start;
	align-items: stretch;
	background-color: transparent;
}
</style>
