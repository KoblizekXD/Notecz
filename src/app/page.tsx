'use client';

import * as React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Heart } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Alert Dialog',
    href: '/docs/primitives/alert-dialog',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '/docs/primitives/hover-card',
    description:
      'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '/docs/primitives/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Scroll-area',
    href: '/docs/primitives/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '/docs/primitives/tabs',
    description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
  {
    title: 'Tooltip',
    href: '/docs/primitives/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  },
];

export default function HomePage() {

  const isTodayFriday = new Date().getDay() === 5;

  return (
    <>
      <div
        className={`flex h-screen bg-cover bg-[url("/wave-haikei.svg")] bg-no-repeat flex-col`}
      >
        <NavBar />
        <div className="h-[30vh]" />
        <div className={'flex items-center gap-y-6 justify-center flex-col'}>
          <h1 className="text-5xl font-extrabold">Notecz</h1>
          <p className="text-xl text-center">
            Sdílení poznámek nikdy nebylo jednodušší. Vytvořte si účet a začněte
            hned!
          </p>
          <div className="gap-4 flex">
            <Button className="w-28" variant="default">
              Hledat
            </Button>
            <Button className="w-28" variant="secondary" asChild>
              <Link href={'/signup'}>Vytvořit účet</Link>
            </Button>
          </div>
        </div>
        <div className="flex mt-auto mb-[8vh] flex-col gap-y-4 items-center justify-center">
          <h3 className="animate-bounce">Dozvědet se více</h3>
          <Button
            onClick={() => {
              document
                .getElementById('section2')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            variant="ghost"
            className="rounded-3xl"
            size="icon"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div
        id="section2"
        className="flex w-full h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
      >
        <div className='bg-[url("/blob-haikei.svg")] justify-center gap-y-8 items-center flex flex-col bg-cover bg-black mt-2  w-full'>
          <div className="flex gap-x-12 justify-center items-center">
            <Card className="h-[60vh] w-[20vw]">
              <CardHeader>
                <CardTitle>Proč?</CardTitle>
              </CardHeader>
              <CardContent>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
                nam neque sed beatae maxime maiores voluptatum quas natus
                nostrum quod cumque ducimus eaque, sapiente, rem exercitationem
                tempore, quia excepturi aperiam.
              </CardContent>
            </Card>
            <Card className="h-[60vh] w-[20vw]">
              <CardHeader>
                <CardTitle>Sočka?</CardTitle>
              </CardHeader>
              <CardContent>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
                nam neque sed beatae maxime maiores voluptatum quas natus
                nostrum quod cumque ducimus eaque, sapiente, rem exercitationem
                tempore, quia excepturi aperiam.
              </CardContent>
            </Card>
          </div>
          <a
            href="mailto:janprokupek04@gmail.com"
            className="text-neutral-500 underline"
          >
            Máš otázku? Napiš mi mail!
          </a>
        </div>
      </div>
      <footer className='w-screen gap-y-4 flex justify-center flex-col items-center bg-zinc-900 h-[30vh]'>
        <p className='flex items-center gap-x-2'>
          Made with <Heart className='text-red-400' /> by UFC*
        </p>
        <p className='italic'>*Unified Femboy Corporation</p>
        <p className={`${isTodayFriday && 'bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-400'}`}>Dnes {isTodayFriday ? 'je' : 'není'} femboy friday!</p>
      </footer>
    </>
  );
}

function NavBar() {
  return (
    <NavigationMenu className="justify-between max-h-[8vh] h-[8vh] backdrop-blur-lg border-b-gray-700 border-b px-4 py-2">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} font-extrabold text-xl`}
            >
              Notecz.
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Začínáme</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Začínáme s Notecz.
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Notecz[Nouc] je platforma, primárně určená pro studenty,
                      pro jednoduché a efektivní tvoření a sdílení poznámek.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem
                href="/docs/primitives/typography"
                title="Pravidla platformy"
              >
                Základní pravidla, platící na celé platformě, pro všechny :).
              </ListItem>
              <ListItem href="/docs" title="Tvorba poznámek">
                Jak správně a efektivně tvořit & nahrávat poznámky.
              </ListItem>
              <ListItem href="/docs/installation" title="Sdílení">
                Sdílení poznámek s ostatními.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Poznámky</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/api/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Dokumentace
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/signin" legacyBehavior passHref>
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} bg-blue-600`}
            >
              Příhlásit se
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
