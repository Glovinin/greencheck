import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <h2 className="text-2xl font-bold mb-4">Página não encontrada</h2>
      <p className="mb-6 text-muted-foreground">Esta página não existe ou foi removida.</p>
      <Link 
        href="/"
        className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
      >
        Voltar à Página Inicial
      </Link>
    </div>
  )
}
