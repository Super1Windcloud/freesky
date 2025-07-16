<template>
	<div class="profile-form">
		<!-- 基本信息 -->
		<section class="section">
			<h1>个人资料</h1>
			<div class="row">
				<section style="display: flex; flex-direction: column; gap: 1rem">
					<div class="form-group">
						<label>昵称</label>
						<input
							v-model="form.nickname"
							type="text"
							placeholder="你的全名或昵称" />
					</div>

					<div class="form-group">
						<label>简介</label>
						<textarea
							v-model="form.profile"
							rows="4"
							placeholder="你可以提及 @其他人 或 #话题"></textarea>
					</div>
				</section>
				<div class="form-group">
					<label>个人资料附加信息</label>
					<div class="tag-grid">
						<div
							v-for="(item, index) in form.extraInfo"
							:key="index"
							class="tag-row">
							<input
								type="text"
								v-model="item.label"
								placeholder="标签" />
							<input
								type="text"
								v-model="item.value"
								placeholder="内容" />
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- 头像 -->
		<section class="section">
			<h2>头像</h2>
			<div class="form-group">
				<p class="note">支持 WEBP, PNG, JPG, 最大 8MB，将缩小到 400x400px</p>
				<input
					type="file"
					accept="image/*"
					@change="onFileChange('avatar', $event)" />
				<p
					v-if="form.avatarName"
					class="file-name">
					已选择：{{ form.avatarName }}
				</p>
				<img
					v-if="form.avatarUrl"
					:src="form.avatarUrl"
					class="cover-preview" />
			</div>
		</section>

		<!-- 封面图 -->
		<section class="section">
			<h2>封面图</h2>
			<div class="form-group">
				<p class="note">支持 WEBP, PNG, JPG, 最大 8MB，分辨率将被压缩至 1500x500px</p>
				<input
					type="file"
					accept="image/*"
					@change="onFileChange('cover', $event)" />
				<p
					v-if="form.coverName"
					class="file-name">
					已选择：{{ form.coverName }}
				</p>
				<img
					v-if="form.coverPreview"
					:src="form.coverPreview"
					class="cover-preview" />
			</div>
		</section>
		<section class="check">
			<div>
				<input
					type="checkbox"
					v-model="form.discoverable" />
				<label>在发现算法中展示你的账号与嘟文</label>
			</div>

			<div>
				<input
					type="checkbox"
					v-model="form.bot" />
				<label>是否添加机器人标志</label>
			</div>
			<div>
				<input
					type="checkbox"
					v-model="form.hideCollections" />
				<label>是否隐藏账户的关注者和粉丝</label>
			</div>
		</section>

		<section
			class="save-btn"
			style="width: 100%; font-size: large; text-align: center; height: 100%; border-radius: 20px; border: none">
			<button
				style="
					width: 100%;
					text-align: center;
					border-radius: 20px;
					color: inherit;
					border: none;
					height: 100%;
					text-align: center;
					font-size: inherit;
					font-weight: bold;
					background-color: inherit;
				"
				@click="save">
				保存
			</button>
		</section>
	</div>
</template>

<script setup lang="ts">
	import { reactive } from 'vue';
	import axios from 'axios';
	import { getInstanceUrlStorage, getAccessTokenStorage } from '~/composable/constant';
	import { useInstanceUrlStore, useAccessTokenStore } from '~/store';
	import { usePersonalAccountIdStore } from '../../store/index';
	const instanceUrl = useInstanceUrlStore().getInstanceUrl || getInstanceUrlStorage();
	const accessToken = useAccessTokenStore().getAccessToken || getAccessTokenStorage();

	const form = reactive({
		nickname: '',
		avatarName: '',
		avatarUrl: '',
		coverName: '',
		profile: '',
		avatarFile: null as File | null,
		coverFile: null as File | null,
		coverPreview: '',
		hideCollections: false,
		extraInfo: Array.from({ length: 4 }, () => ({ label: '', value: '' })),
		discoverable: false,
		bot: false,
	});

	function onFileChange(type: 'avatar' | 'cover', event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files?.length) return;
		const file = input.files[0];
		if (type === 'avatar') {
			form.avatarUrl = URL.createObjectURL(file);
			form.avatarFile = file;
			form.avatarUrl = URL.createObjectURL(file);
		} else {
			form.coverName = file.name;
			form.coverFile = file;
			form.coverPreview = URL.createObjectURL(file);
		}
	}

	async function updateAvatarAndCover() {
		try {
			const formData = new FormData();
			if (form.avatarFile) {
				formData.append('avatar', form.avatarFile);
			}
			if (form.coverFile) {
				formData.append('header', form.coverFile);
			}

			form.extraInfo.forEach((item, index) => {
				formData.append(`fields_attributes[${index}][name]`, item.label);
				formData.append(`fields_attributes[${index}][value]`, item.value);
			});
			const data = await fetch(`${instanceUrl}/api/v1/accounts/update_credentials`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				body: formData,
			});
			return data;
		} catch (error) {
			console.error('update avatar and cover error', error);
			return {};
		}
	}
	async function save() {
		try {
			let res;
			if (form.nickname.trim() && form.profile.trim()) {
				res = await axios.post('/api/account/change_personal_profile', {
					url: instanceUrl,
					accessToken: accessToken,
					displayName: form.nickname,
					note: form.profile,
					hideCollections: form.hideCollections,
					bot: form.bot,
					discoverable: form.discoverable,
					fieldsAttributes: form.extraInfo.map((item) => ({ label: item.label, value: item.value })),
				});
			}

			const result = (await updateAvatarAndCover()) as any;
			console.log(result);
			const data = res?.data || {};
			if (Object.keys(data).length > 0 || result.ok) {
				toast.success({
					position: 'topCenter',
					title: 'Success!',
					zindex: 1000,
					message: '个人资料已更新',
					timeout: 5000,
				});
			} else {
				toast.error({
					position: 'topCenter',
					title: 'Error!',
					zindex: 1000,
					message: '个人资料更新失败',
					timeout: 5000,
				});
			}
		} catch (error) {
			console.error('save profile error', error);
		}
	}

	const toast = useToast();
	const personalId = usePersonalAccountIdStore().getPersonalAccountId;

	onMounted(async () => {
		const res = await axios.post('/api/account/account_info', {
			url: instanceUrl,
			id: personalId,
			accessToken: accessToken,
		});
		const data = res.data; 
		form.avatarUrl = data.avatar;
		form.coverPreview = data.header;
	});
</script>

<style scoped>
	.profile-form {
		background-color: transparent;
		color: inherit;
		padding: 2rem;
		max-width: 900px;
		margin: auto;
		font-family: sans-serif;
	}

	.section {
		margin-bottom: 2rem;
	}

	h2 {
		font-size: 1.2rem;
		border-bottom: 1px solid #333;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
	}

	.form-group {
		flex: 1;
		margin-bottom: 1rem;
	}

	input[type='text'],
	input[type='file'],
	textarea {
		width: 100%;
		background-color: inherit;
		border: 1px solid #444;
		border-radius: 6px;
		padding: 10px;
		color: inherit;
		box-sizing: border-box;
		font-size: 14px;
	}

	textarea {
		resize: vertical;
	}

	.note {
		font-size: 0.85rem;
		color: gray;
		margin-bottom: 0.5rem;
	}

	.file-name {
		margin-top: 0.5rem;
		color: #7ad17a;
		font-size: 0.9rem;
	}

	.cover-preview {
		margin-top: 1rem;
		max-width: 300px;
		border-radius: 8px;
	}

	.tag-grid {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.tag-row {
		display: flex;
		gap: 10px;
		color: inherit;
		background-color: transparent;
	}

	.tag-row input {
		flex: 1;
	}

	.save-btn {
		background-color: mediumpurple;
		&:hover {
			background-color: purple;
		}
	}

	.check {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 2rem;
		text-align: center;
		justify-content: start;
		align-items: start;
	}
</style>
