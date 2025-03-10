export default function RoomLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

// Configuração para geração estática das páginas
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ]
} 