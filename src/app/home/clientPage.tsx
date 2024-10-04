'use client';

import { Check, ChevronsUpDown, Menu, PlusIcon, UserIcon } from 'lucide-react';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { MenubarSeparator } from '@/components/ui/menubar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { elysia } from '@/lib/util';
import { cn } from '@/lib/utils';
import { treaty } from '@elysiajs/eden';
import { DisplayFilter, Note, NoteType } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { CheckboxItem } from '@radix-ui/react-dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

const noteTypes = [
  { value: 'note', label: 'Klasická poznámka' },
  { value: 'mind_map', label: 'Myšlenková mapa' },
  { value: 'document', label: 'Dokument' },
  { value: 'notes', label: 'Skupina poznámek' },
];

const filters2 = {
  Vše: DisplayFilter.ALL,
  Oblíbené: DisplayFilter.FAVORITES,
  Rozpracované: DisplayFilter.IN_PROGRESS,
  Soukromé: DisplayFilter.PRIVATE,
  'Textové poznámky': NoteType.TEXT,
  'Myšlenkové mapy': NoteType.MINDMAP,
  Dokumenty: NoteType.DOCUMENT,
};

function NavMenu({ iconUrl }: { iconUrl?: string }) {
  const router = useRouter();
  const [logoutAll, setLogoutAll] = React.useState(false);

  return (
    <div className="border-b flex py-2 px-2">
      <div className="max-w-72 mr-2 py-1 items-center gap-x-2 cursor-pointer flex border rounded min-w-48 px-2">
        Hledat...
        <kbd className="flex ml-auto justify-center border-slate-800 px-1 border rounded">
          ⌘K
        </kbd>
      </div>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="ml-auto cursor-pointer">
              <AvatarImage src={iconUrl} />
              <AvatarFallback>
                <UserIcon className="stroke-black" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Nastavení</DropdownMenuItem>
            <AlertDialogTrigger>
              <DropdownMenuItem>Odhlásit se</DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent className="bg-black">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Jsi si jist, že se chceš odhlásit?
            </AlertDialogTitle>
            <AlertDialogDescription className="flex items-center gap-x-4">
              <Checkbox
                onCheckedChange={(c) => {
                  if (c) {
                    setLogoutAll(true);
                  } else {
                    setLogoutAll(false);
                  }
                }}
              />{' '}
              Můžeš se také odhlásit ze všech zařízení.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušit</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                router.push(`/signout${logoutAll ? '?all=true' : ''}`);
              }}
            >
              Odhlásit se
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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

function SideBarItem({
  children,
  onSelect,
  selected,
}: {
  selected: boolean;
  children: React.ReactNode;
  onSelect?: () => void;
}) {
  return (
    <div
      className={`select-none ${selected && 'font-bold'}`}
      onClick={() => {
        if (onSelect) onSelect();
      }}
    >
      {children}
    </div>
  );
}

function SideBarListing({
  items,
  onSelect,
}: {
  items: string[];
  onSelect: (selected: string) => void;
}) {
  const [selected, setSelected] = React.useState(0);
  return (
    <div className="flex-1 flex-col flex gap-y-2">
      {items.map((item, i) => {
        if (item === 'separator') {
          return <MenubarSeparator key={i} />;
        }
        return (
          <SideBarItem
            onSelect={() => {
              setSelected(i);
              onSelect(item);
            }}
            selected={i == selected}
            key={i}
          >
            {item}
          </SideBarItem>
        );
      })}
    </div>
  );
}

function SideBar({ onSelect }: { onSelect: (selected: string) => void }) {
  const [shown, setShown] = React.useState(true);

  return (
    <div
      className={`h-full w-0 gap-y-8 flex flex-col ease-in-out transition-[width] duration-300 overflow-hidden ${!shown ? 'w-0' : 'sm:w-56 border-r p-4'}`}
    >
      <div className="flex gap-x-12 justify-between items-center">
        <h1 className="font-semibold text-lg">Vy</h1>
        <Button onClick={() => setShown(false)} size={'icon'}>
          <Menu />
        </Button>
      </div>
      <SideBarListing
        onSelect={onSelect}
        items={Object.keys(filters2).toSpliced(4, 0, 'separator')}
      />
    </div>
  );
}

function createNotePreview(note: Note) {
  return (
    <Card key={note.id} className="w-48">
      <CardHeader>
        <CardTitle className="text-lg">{note.title}</CardTitle>
      </CardHeader>
      <CardContent>{note.content?.substring(0, 100) + '...'}</CardContent>
    </Card>
  );
}

export function HomePage({ id }: { id: string }) {
  const [open, setOpen] = React.useState(false);
  const [activeFilter, setActiveFilter] = React.useState<string>(filters2.Vše);
  const [value, setValue] = React.useState('');
  const [user, setUser] = React.useState<any>({});
  const [notes, setNotes] = React.useState<Note[]>([]);

  const dayPart = getPartOfDay();

  const t = treaty<typeof elysia>('localhost:3000');

  React.useEffect(() => {
    const fetchUser = async () => {
      const data = (await t.api.user.me.get()).data;
      setUser(data);
      setNotes(data!!.notes);
    };

    fetchUser();
  }, []);

  return (
    <main className="h-screen flex flex-col">
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
        <DrawerContent className="bg-black">
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
      <div className="flex flex-1">
        <SideBar
          onSelect={(item) =>
            setActiveFilter(filters2[item as keyof typeof filters2] as string)
          }
        />
        <div className="m-4 flex flex-1 flex-col">
          <h1 className="font-extrabold text-3xl">
            Dobr{dayPart === 'večer' ? 'ý' : 'é'} {dayPart},
          </h1>
          <h2 className="font-semibold text-2xl">
            {user.username || 'Načítání...'}
          </h2>
          <div className="flex-1 pt-28 flex flex-col gap-y-4">
            <h3 className="text-xl">
              Tvoje poznámky (
              {Object.keys(filters2).find(
                (f) => filters2[f as keyof typeof filters2] === activeFilter,
              )}
              )
            </h3>
            <div className="flex gap-x-4">
              {notes.length > 0 ? (
                notes
                  .filter(
                    (note) =>
                      note.type.toString() === activeFilter ||
                      note.filters
                        .map((f) => f.toString())
                        .includes(activeFilter),
                  )
                  .map(createNotePreview)
              ) : (
                <Card
                  key={0}
                  className="bg-transparent w-48 border-dashed h-64"
                >
                  <CardContent className="text-white p-4 flex-col gap-y-8 flex justify-center text-center items-center">
                    <p>
                      Ještě nemáš žádné poznámky, vytvoř novou kliknutím na
                      plus!
                    </p>
                    <div>
                      <PlusIcon />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
