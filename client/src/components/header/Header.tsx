import NavLinks from "./NavLinks";
import HeaderActions from "./HeaderActions";
import { getUser } from "@/actions/user";

const Header = async () => {
  const user = await getUser();
  const fullName = user ? `${user.firstName} ${user.lastName}` : null;

  return (
    <header className="sticky top-0 z-50 mx-auto max-w-7xl border-b bg-card">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6 lg:px-8">
        {user && <NavLinks />}
        <HeaderActions fullName={fullName} />
      </div>
    </header>
  );
};

export default Header;