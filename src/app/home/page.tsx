import { ChevronsUpDown, PlusIcon, Check, Menu } from 'lucide-react';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Drawer,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { MenubarSeparator } from '@/components/ui/menubar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { validateRequest } from '@/lib/util';
import { HomePage } from './clientPage';
import { redirect } from 'next/navigation';

const noteTypes = [
  { value: 'note', label: 'Klasická poznámka' },
  { value: 'mind_map', label: 'Myšlenková mapa' },
  { value: 'document', label: 'Dokument' },
  { value: 'notes', label: 'Skupina poznámek' },
];

const filters = ['Vše', 'Oblíbené', 'Rozpracované', 'Soukromé', 'Textové poznámky', 'Myšlenkové mapy', 'Dokumenty']

function NavMenu() {
  return (
    <div className="border-b py-2">
      <div className="max-w-72 ml-2 mr-2 py-1 items-center gap-x-2 cursor-pointer flex border rounded min-w-48 px-2">
        Hledat...
        <kbd className="flex ml-auto justify-center border-slate-800 px-1 border rounded">
          ⌘K
        </kbd>
      </div>
    </div>
  );
}

function getPartOfDay(): 'ráno' | 'odpoledne' | 'večer' {
  const hours = new Date().getHours();
  if (hours < 12) {
    return 'ráno';
  } else if (hours < 18) {
    return 'odpoledne';
  } else {
    return 'večer';
  }
}

function SideBarItem({ children, onSelect, selected }: { selected: boolean; children: React.ReactNode; onSelect?: () => void }) {

  return (
    <div className={`select-none ${selected && 'font-bold'}`} onClick={() => {
      if (onSelect) onSelect();
    }}>
      {children}
    </div>
  );
}

function SideBarListing({ items, onSelect }: { items: string[], onSelect: (selected: string) => void }) {
  const [selected, setSelected] = React.useState(0);
  return (
    <div className='flex-1 flex-col flex gap-y-2'>
      {items.map((item, i) => {
        if (item === 'separator') {
          return <MenubarSeparator key={i} />;
        }
        return <SideBarItem onSelect={() => {
          setSelected(i);
          onSelect(item);
        }} selected={i == selected} key={i}>{item}</SideBarItem>
      })}
    </div>
  );
}

function SideBar({ onSelect }: { onSelect: (selected: string) => void }) {

  const [shown, setShown] = React.useState(true);

  return (
    <div className={`h-full gap-y-8 flex flex-col ease-in-out transition-[width] duration-300 overflow-hidden ${!shown ? 'w-0' : 'w-56 border-r p-4'}`}>
      <div className='flex gap-x-12 justify-between items-center'>
        <h1 className='font-semibold text-lg'>Vy</h1>
        <Button onClick={() => setShown(false)} size={'icon'}>
          <Menu />
        </Button>
      </div>
      <SideBarListing onSelect={onSelect} items={filters.toSpliced(4, 0, 'separator')} />
    </div>
  );
}

export default async function App() {
  
  const { user } = await validateRequest();

  if (!user) redirect('/signin');

  return <HomePage />;
}
