export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        <h2 className="text-2xl font-semibold text-foreground">Carregando...</h2>
        <p className="text-muted-foreground">Preparando sua experiência no Aqua Vista Monchique</p>
      </div>
    </div>
  )
} 