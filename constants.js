// constants.js
export const DB_NAME = "videotube";

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    LOGOUT: '/logout',
    PROFILE: (userId) => `/profile/${userId}`,
    BLOG_LIST: '/blog-list',
    BLOG_DETAIL: (id) => `/blogs/${id}`,
    EDIT_PROFILE: (userId) => `/edit-profile/${userId}`,
    // Add more routes as needed
};
