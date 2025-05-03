import React, { FC, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { EmptyProps } from '../../types';
import { AuthContext } from '../../services/AuthService';

const AuthRoute: FC<EmptyProps> = React.memo(({children}) => {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
});

export default AuthRoute;