const AuthGuard = ({ children }) => {
  // Temporarily bypass the auth wall to allow preview/click-through of all pages
  return children;
};

export default AuthGuard;
