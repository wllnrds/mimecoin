export default function Home({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-8 h-full bg-foreground">
      <aside className="border-r-1 border-foreground-600 p-8">
        <menu>
          <a>Teste</a>
        </menu>
      </aside>
      <main className="col-span-7 flex flex-row">
        <div className="flex-1 grid grid-cols-8 gap-8 p-8">
          <div className="bg-primary-400 col-span-2 rounded-lg p-8 text-primary-foreground">{ children }</div>
          <div className="bg-primary-400 row-span-2 rounded-lg p-8 text-primary-foreground">{ children }</div>
          <div className="bg-primary-400 col-span-2 rounded-lg p-8 text-primary-foreground">{ children }</div>
          <div className="bg-primary-400 col-span-2 rounded-lg p-8 text-primary-foreground">{ children }</div>
          <div className="bg-primary-400 col-span-2 rounded-lg p-8 text-primary-foreground">{ children }</div>
          <div className="bg-primary-400 col-span-2 rounded-lg p-8 text-primary-foreground">{ children }</div>
          <div className="bg-primary-400 col-span-2 rounded-lg p-8 text-primary-foreground">{ children }</div>
          <div className="bg-primary-400 col-span-2 rounded-lg p-8 text-primary-foreground">{ children }</div>
        </div>
      </main>
    </div>
  )
}
