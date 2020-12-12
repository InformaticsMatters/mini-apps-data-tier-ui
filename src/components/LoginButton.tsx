import { Button } from '@material-ui/core';
import { useKeycloak } from '@react-keycloak/web';

import { useIsAuthenticated } from '../hooks';
import DataTierAPI from '../Services/DataTierAPI';
import LocalStorageService from '../Services/LocalStorageService';

const LoginButton = () => {
  const isAuthenticated = useIsAuthenticated();
  const { keycloak } = useKeycloak();

  const authLogin = () => {
    keycloak && keycloak.login();
  };
  const authLogout = () => {
    LocalStorageService.removeKeycloakTokens();
    DataTierAPI.removeToken();
    keycloak && keycloak.logout();
  };

  return (
    <Button
      variant={isAuthenticated ? 'outlined' : 'contained'}
      color={!isAuthenticated ? 'secondary' : 'default'}
      onClick={!isAuthenticated ? authLogin : authLogout}
    >
      {!!isAuthenticated ? 'logout' : 'login'}
    </Button>
  );
};

export default LoginButton;
