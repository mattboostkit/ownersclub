export const metadata = {
  title: 'Owners Club Studio',
  description: 'Content management for Owners Club',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-[100]">
      {children}
    </div>
  )
}
