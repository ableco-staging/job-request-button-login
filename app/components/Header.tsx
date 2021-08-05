import { Link, Routes, useMutation } from "blitz";
import { HomeIcon } from "@heroicons/react/outline";
import logout from "app/auth/mutations/logout";

function Header() {
  const [logoutMutation] = useMutation(logout);

  return (
    <div className="flex justify-between p-8">
      <Link href={Routes.Home()}>
        <a className="flex space-x-2">
          <HomeIcon className="h-6 w-6" />
          <h1 className="font-bold text-base">Doable</h1>
        </a>
      </Link>
      <div className="space-x-8">
        <Link href={Routes.SettingsPage()}>Settings</Link>
        <Link href="/login">
          <a onClick={() => logoutMutation()}>Logout</a>
        </Link>
      </div>
    </div>
  );
}

export default Header;
