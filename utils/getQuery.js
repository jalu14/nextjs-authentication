import { useRouter } from "next/router";

export const getQuery = (route) => {
    if (!route) {
        route = useRouter().asPath;
    }
    let queryParams = route.split('?')[1];
    if (!queryParams) return {};
    let queries = queryParams.split('&');

    const query = {};
    queries.forEach(q => {
        let [param, value] = q.split('=');
        query[param] = value;
    });
    return query;
}