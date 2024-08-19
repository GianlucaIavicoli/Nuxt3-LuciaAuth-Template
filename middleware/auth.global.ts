
export default defineNuxtRouteMiddleware(async ({ redirect }) => {
	const user = useUser();
	const data = await useRequestFetch()('/api/user');
	
	if (data) {
		user.value = data;
	}
});
