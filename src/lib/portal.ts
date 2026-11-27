// The learning portal (Frappe LMS) lives on its own subdomain.
// This marketing site only showcases Excel Learning Hub, so every
// login / signup entry point sends visitors to the portal.
export const PORTAL_URL = 'https://portal.excel-learninghub.com';
export const PORTAL_LOGIN_URL = `${PORTAL_URL}/login`;
export const PORTAL_SIGNUP_URL = `${PORTAL_URL}/login#signup`;
