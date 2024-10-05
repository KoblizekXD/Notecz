'use client';

import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { noteTypes } from "../home/clientPage";

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
    <div>
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
    </div>
  );
}