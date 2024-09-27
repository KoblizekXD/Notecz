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
  CommandEmpty,
  CommandGroup,
  CommandInput,
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

function SideBar() {

  const [shown, setShown] = React.useState(true);

  return (
    <div className={`h-full border-r ease-in-out delay-500 transition-transform ${shown ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className='flex p-2 gap-x-12 items-center'>
        <h1 className='font-semibold text-lg'>Vy</h1>
        <Button onClick={() => setShown(false)} size={'icon'}>
          <Menu />
        </Button>
      </div>
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
        <div className='m-4 font-extrabold text-3xl'>
          <h1>Dobr{dayPart === 'večer' ? 'ý' : 'é'} {dayPart},</h1>
        </div>
      </div>
    </main>
  );
}
