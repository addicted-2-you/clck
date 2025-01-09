import { useAuth } from 'react-oidc-context';
import { NavLink, Outlet } from 'react-router';

function Layout() {
  const auth = useAuth();

  const onUsernameClick = () => {};

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  return (
    <div className="h-screen w-full overflow-hidden">
      <header className="px-5 py-1 flex justify-end border-b-2 border-black">
        <div className="flex gap-5">
          {auth.isAuthenticated ? (
            <>
              <button
                className="hover:underline active:opacity-50"
                onClick={onUsernameClick}
              >
                {auth.user?.profile.email}
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
      <Outlet />
      <footer className="absolute right-0 bottom-0 left-0 mx-auto px-5 py-1 w-fit flex gap-5 border-t-2 border-black">
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
      </footer>
    </div>
  );
}

export default Layout;
