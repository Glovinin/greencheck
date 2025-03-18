import { NextResponse } from 'next/server';

export async function POST() {
  // Retornar 403 Forbidden para qualquer tentativa de criar um administrador mestre
  return NextResponse.json(
    { error: 'Esta funcionalidade foi desativada por motivos de segurança.' },
    { status: 403 }
  );
} 