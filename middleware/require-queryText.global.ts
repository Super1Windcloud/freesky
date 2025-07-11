export default defineNuxtRouteMiddleware((to, from) => {
    if (to.path === "/zh/searchResultView") {
        const query = to.query.queryText;
        if (!query || typeof query !== "string" || query.trim() === "") {
            return navigateTo("/");
        }
    }
});