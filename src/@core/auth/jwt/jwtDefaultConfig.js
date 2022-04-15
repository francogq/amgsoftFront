export default {
  // Endpoints
  loginEndpoint: process.env.VUE_APP_BASE_URL + '/auth/login',
  registerEndpoint: '/jwt/register',
  refreshEndpoint: process.env.VUE_APP_BASE_URL + '/auth/refresh',
  logoutEndpoint: process.env.VUE_APP_BASE_URL + '/auth/logout',
  loginEndpoint2: process.env.VUE_APP_BASE_URL + '/auth/login2',
  // This will be prefixed in authorization header with token
  // e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken',
}
