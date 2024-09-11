import Image from 'next/image';

export default function NotFound() {
  return (
    <main
      className={
        'flex gap-y-16 justify-center items-center flex-col min-h-screen w-full'
      }
    >
      <div className={'flex items-baseline -translate-x-[17rem]'}>
        <h1 className="font-semibold text-7xl">Jejda!</h1>
        <h4 className="text-2xl font-mono text-gray-500">(404)</h4>
      </div>
      <h2 className="font-bold translate-x-[9rem] text-4xl">
        Tak tuhle stránku jsme nenašli!
      </h2>
    </main>
  );
}
