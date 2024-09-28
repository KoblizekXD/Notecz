'use client';

import { ChevronsUpDown, PlusIcon, Check, Menu } from 'lucide-react';

import * as React from 'react';
import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';

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

const noteTypes = [
  { value: 'note', label: 'Klasická poznámka' },
  { value: 'mind_map', label: 'Myšlenková mapa' },
  { value: 'document', label: 'Dokument' },
  { value: 'notes', label: 'Skupina poznámek' },
];

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

function SideBarListing({ items }: { items: string[] }) {
  const [selected, setSelected] = React.useState(0);
  return (
    <div className='flex-1 flex-col flex gap-y-2'>
      {items.map((item, i) => {
        if (item === 'separator') {
          return <MenubarSeparator key={i} />;
        }
        return <SideBarItem onSelect={() => setSelected(i)} selected={i == selected} key={i}>{item}</SideBarItem>
      })}
    </div>
  );
}

function SideBar() {

  const [shown, setShown] = React.useState(true);

  return (
    <div className={`h-full gap-y-8 flex flex-col ease-in-out transition-[width] duration-300 overflow-hidden ${!shown ? 'w-0' : 'w-56 border-r p-4'}`}>
      <div className='flex gap-x-12 justify-between items-center'>
        <h1 className='font-semibold text-lg'>Vy</h1>
        <Button onClick={() => setShown(false)} size={'icon'}>
          <Menu />
        </Button>
      </div>
      <SideBarListing items={['Vše', 'Oblíbené', 'Rozpracované', 'Soukromé', 'separator', 'Textové poznámky', 'Myšlenkové mapy', 'Dokumenty']} />
    </div>
  );
}

export default function App() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  const dayPart = getPartOfDay();

  return (
    <main className='h-screen flex flex-col'>
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant={'outline'}
            size="icon"
            className="rounded-xl scale-150 absolute right-8 border-0 bg-slate-900 bottom-8"
          >
            <PlusIcon className="fill-[url(#MyGradient)]" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto flex gap-y-4 flex-col w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle className="text-center">
                Vytvořit novou poznámku
              </DrawerTitle>
            </DrawerHeader>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className=""
                >
                  {value
                    ? noteTypes.find((framework) => framework.value === value)
                        ?.label
                    : 'Vyber typ poznámky'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandList>
                    <CommandGroup>
                      {noteTypes.map((framework) => (
                        <CommandItem
                          key={framework.value}
                          value={framework.value}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? '' : currentValue,
                            );
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              value === framework.value
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          {framework.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Input placeholder="Jméno poznámky" />
            <Input placeholder="Popis" />
            <DrawerFooter>
              <Button>Vytvořit</Button>
              <DrawerClose asChild>
                <Button variant="outline">Zrušit</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
      <NavMenu />
      <div className='flex flex-1'>
        <SideBar />
        <div className='m-4 flex flex-1 flex-col'>
          <h1 className='font-extrabold text-3xl'>Dobr{dayPart === 'večer' ? 'ý' : 'é'} {dayPart},</h1>
          <h2 className='font-semibold text-2xl'>Test User</h2>
          <div className='flex-1 pt-28 flex flex-col gap-y-4'>
            <h3 className='text-xl'>Tvoje poznámky</h3>
            <div className='flex gap-x-4'>
              <Card className='w-48'>
                <CardHeader>
                  <CardTitle className='text-lg'>Poznámka 1</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Kys</p>
                </CardContent>
              </Card>
              <Card className='w-48'>
                <CardHeader>
                  <CardTitle className='text-lg'>Poznámka 1</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Kys</p>
                </CardContent>
              </Card>
              <Card className='bg-transparent w-48 border-dashed h-64'>
                <CardContent className='text-white p-4 flex-col gap-y-8 flex justify-center text-center items-center'>
                  <p>Ještě nemáš žádné poznámky, vytvoř novou kliknutím na plus!</p>
                  <div className=''>
                    <PlusIcon />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
