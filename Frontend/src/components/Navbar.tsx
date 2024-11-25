// Navbar.tsx
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { useState } from "react";
import { LogoIcon } from "./Icons";
import NewTicket from "./NewTicket";
import { buttonVariants } from "./ui/button";
import { fakedata } from "@/pages/Home";

interface RouteProps {
  href: string;
  label: string;
}

interface navbarprops {
  setTicket: (fakedata: fakedata[]) => void;
  fakedata: fakedata[]
}

const routeList: RouteProps[] = [
  { href: "#home", label: "Home" },
  { href: "#reward points", label: "Reward Points" },
  { href: "#support ticketing", label: "Support Ticketing" },
];

const Modal = ({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export const Navbar = ({ setTicket, fakedata }: navbarprops) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNewTicketClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <header className="sticky border-b-[1px] top-0 z-40 w-full bg-[#B7D5D4] dark:border-b-slate-700 dark:bg-background">
        <NavigationMenu className="mx-auto">
          <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between">
            <NavigationMenuItem className="font-bold flex">
              <a
                rel="noreferrer noopener"
                href="/"
                className="ml-2 font-bold text-xl flex text-black"
              >
                <LogoIcon />
                Ticketing System
              </a>
            </NavigationMenuItem>

            {/* Desktop nav links */}
            <nav className="hidden md:flex gap-2">
              {routeList.map((route, i) => (
                <a
                  key={i}
                  rel="noreferrer noopener"
                  href={route.href}
                  className={`text-[17px] ${buttonVariants({ variant: "ghost" })} text-black hover:text-white-200`}
                >
                  {route.label}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex gap-2">
              <button
                onClick={handleNewTicketClick}
                className={`border text-white px-4 py-2 rounded-md hover:opacity-90`}
                style={{ backgroundColor: "#488286", borderColor: "#488286" }}
              >
                + New Ticket
              </button>
            </div>
          </NavigationMenuList>
        </NavigationMenu>
      </header>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <NewTicket resetForm={closeModal} isModal={true} setTicket={setTicket} fakedata={fakedata}/>
        </Modal>
      )}
    </>
  );
};