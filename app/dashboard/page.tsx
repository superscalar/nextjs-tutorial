import styles from '@/app/ui/home.module.css';

type ReactChildren = { children: React.ReactNode; };
export default function Page({children}: ReactChildren) {
  return (
     <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <h1 className="text-white text-[3rem]">Dashboard</h1>
      </div>
    </main>
  );
}
