// Query key factory for the news domain (public site + admin CMS).
export const newsKeys = {
    all: ['news'],
    publicList: (params) => ['news', 'public', 'list', params],
    publicOne: (idOrSlug) => ['news', 'public', 'one', idOrSlug],
    adminList: (params) => ['news', 'admin', 'list', params],
};
