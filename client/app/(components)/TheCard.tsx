export default function TheCard({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="p-4 bg-slate-50 shadow-md rounded">
      {children}
    </div>
  )
}