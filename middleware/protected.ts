export default defineNuxtRouteMiddleware(async ({ route }) => {
	const user = useUser();
	if (!user.value) {
		return navigateTo('/auth/login');
	}
});
