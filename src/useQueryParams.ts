import { reactive, onMounted } from "vue";

export function useQueryParams() {
  const queryParams: any = reactive({});

  onMounted(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(searchParams.entries());

    if (Object.keys(params).length > 0) {
      // Remove the query parameters from the URL without affecting the browser history
      const urlWithoutQueryParams = window.location.href.replace(
        window.location.search,
        ""
      );
      window.history.replaceState({}, document.title, urlWithoutQueryParams);
    }

    Object.assign(queryParams, params);
  });

  return queryParams;
}
