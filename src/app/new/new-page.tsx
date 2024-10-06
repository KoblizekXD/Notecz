'use client';

import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { noteTypes } from "../home/clientPage";
import Markdown from 'markdown-to-jsx';

export function NewPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (array: [string, string][]) => {
      const params = new URLSearchParams(searchParams.toString())
      
      for (const [key, value] of array) {
        params.set(key, value)
      }
 
      return params.toString()
    },
    [searchParams]
  );

  useEffect(() => {
    const params: [string, string][] = [];
    if (!searchParams.has("type") || !Object.keys(noteTypes).includes(searchParams.get("type")!)) {
      params.push(["type", "note"]);
    }
    if (!searchParams.has('name')) {
      params.push(["name", "Nová poznámka"]);
    }
    if (params.length > 0) router.push(pathname + "?" + createQueryString(params));
  }, [searchParams, router, pathname, createQueryString]);

  const noteName = searchParams.get('name');

  return (
    <div className="flex flex-col h-screen">
      <nav className='flex relative border-b py-4 px-4 justify-between items-center'>
        <div onClick={() => router.push('/home')} className='flex justify-center items-center text-blue-500 cursor-pointer'>
          <ArrowLeft />
          Zpět domů
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className='text-xl hover:bg-[#ffffff1a] px-4 py-1 rounded-md select-none cursor-pointer font-semibold'>{noteName}</h1>
        </div>
        <div>
        </div>
      </nav>
      <div className="flex-1 flex">
        <NoteEditor />
      </div>
    </div>
  );
}

const H1 = ({ children }: { children: React.ReactNode }) => <h1 className="text-2xl underline-offset-4 underline font-bold">{children}</h1>;
const H2 = ({ children }: { children: React.ReactNode }) => <h2 className="text-xl underline font-bold">{children}</h2>;
const H3 = ({ children }: { children: React.ReactNode }) => <h3 className="text-lg underline font-bold">{children}</h3>;
const H4 = ({ children }: { children: React.ReactNode }) => <h4 className="text-base font-bold">{children}</h4>;
const H5 = ({ children }: { children: React.ReactNode }) => <h5 className="text-sm font-bold">{children}</h5>;
const H6 = ({ children }: { children: React.ReactNode }) => <h6 className="text-xs font-bold">{children}</h6>;

function NoteEditor() {
  const [text, setText] = useState('*A zde se objeví náhled! (Podporuji Markdown!)*');

  return (
    <>
      <textarea onInput={e => {
        setText(e.currentTarget.value === '' ? 'A zde se objeví náhled! (Podporuji Markdown!)' : e.currentTarget.value.replaceAll('\n', '<br>\n'));
      }} placeholder="Začni psát zde..." className='m-4 basis-1/2 resize-none p-2 select-none outline-none rounded bg-transparent' />
      <Markdown options={{
        forceBlock: true,
        forceWrapper: true,
        overrides: {
          h1: {
            component: H1
          },
          h2: {
            component: H2
          },
          h3: {
            component: H3
          },
          h4: {
            component: H4
          },
          h5: {
            component: H5
          },
          h6: {
            component: H6
          }
        }
      }} className="basis-1/2 m-4 p-2">
        {text}
      </Markdown>
    </>
  );
}