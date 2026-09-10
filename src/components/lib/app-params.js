const isNode = typeof window === 'undefined';

const isClearAccessTokenRequested = () =>
	!isNode && new URLSearchParams(window.location.search).get("clear_access_token") === 'true';

const clearStoredAccessToken = () => {
	if (!isNode) {
		window.localStorage.removeItem('access_token');
		window.localStorage.removeItem('token');
	}
}

const getAccessToken = () => {
	if (isNode) return '';
	return window.localStorage.getItem('access_token') || window.localStorage.getItem('token') || '';
}

const getAppParams = () => {
	if (isClearAccessTokenRequested()) {
		clearStoredAccessToken();
	}
	return {
		appId: 'bharat-yatra',
		token: getAccessToken(),
		functionsVersion: 'v1',
		appBaseUrl: '',
	}
}

export const appParams = {
	...getAppParams()
}
