import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { PlusIcon } from "lucide-react";

function NavMenu() {
  return (
    <div className='border-b py-2'>
      <div className='max-w-72 ml-2 mr-2 py-1 items-center gap-x-2 cursor-pointer flex border rounded min-w-48 px-2'>
          Hledat...
          <kbd className="flex ml-auto justify-center border-slate-800 px-1 border rounded">
            ⌘K
          </kbd>
        </div>
    </div>
  );
}

export default function App() {

  return (<main>
    <NavMenu />
    <Button variant={'outline'} size='icon' className="rounded-xl scale-150 absolute right-[5vh] border-0 bg-slate-900 bottom-[5vh]">
      <PlusIcon className="fill-[url(#MyGradient)]" />
    </Button>
  </main>);
}
