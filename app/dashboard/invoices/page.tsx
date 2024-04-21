import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoices',
};

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <h1 className="text-white text-[3rem]">Invoices</h1>
      </div>
    </main>
  );
}
