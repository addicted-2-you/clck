import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { NavLink, Outlet } from 'react-router';

function Layout() {
  const auth = useAuth();

  const onUsernameClick = () => {
    if (auth.user?.access_token) {
      window.navigator.clipboard.writeText(auth.user?.access_token);
    }
  };

  useEffect(() => {
    if (auth.user?.access_token) {
      window.localStorage.setItem('token', auth.user.access_token);
    } else {
      window.localStorage.removeItem('token');
    }
  }, [auth.user?.access_token]);

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  return (
    <div className="h-screen w-full min-w-[550px] overflow-hidden flex flex-col">
      <header className="px-10 flex justify-between border-b-2 border-black">
        <div className="flex gap-5 ">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${isActive ? 'text-white bg-black' : ''} px-2 hover:underline`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              `${isActive ? 'text-white bg-black' : ''} px-2 hover:underline`
            }
          >
            Leaderboard
          </NavLink>
        </div>

        <div className="flex gap-5">
          {auth.isAuthenticated ? (
            <>
              <button
                className="hover:underline active:opacity-50"
                onClick={onUsernameClick}
              >
                {auth.user?.profile?.email}
              </button>
              <button
                className="hover:underline active:opacity-50"
                onClick={() => auth.removeUser()}
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              className="hover:underline active:opacity-50"
              onClick={() => auth.signinRedirect()}
            >
              Sign in
            </button>
          )}
        </div>
      </header>
      <div className="p-10 flex-grow">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
