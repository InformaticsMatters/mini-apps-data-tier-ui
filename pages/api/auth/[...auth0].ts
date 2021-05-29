import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export default handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res, {
        authorizationParams: {
          // Add the `offline_access` scope to also get a Refresh Token
          scope: 'openid profile email offline_access',
        },
      });
    } catch (error) {
      res.status(error.status || 400).end(error.message);
    }
  },
});
