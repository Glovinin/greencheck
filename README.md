# Aqua Vista Monchique - Hotel Website

Website para o hotel de luxo Aqua Vista Monchique, desenvolvido com Next.js, TypeScript, Tailwind CSS e Firebase.

## Tecnologias Utilizadas

- **Frontend**:
  - Next.js 13+ com App Router
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - Shadcn/UI
  - Radix UI

- **Backend**:
  - Firebase Authentication
  - Firebase Firestore
  - Firebase Storage

## Estrutura do Projeto

```
/app
  /admin
    /(protected)  # Rotas protegidas que requerem autenticação
      /dashboard  # Dashboard administrativo
    /login        # Página de login
  /booking        # Sistema de reservas
  /rooms          # Página de quartos
  /contato        # Formulário de contato
  /components     # Componentes reutilizáveis
  layout.tsx      # Layout principal
  page.tsx        # Página inicial

/components       # Componentes globais
  /ui             # Componentes de UI (Shadcn)
  /auth           # Componentes de autenticação

/lib
  /firebase       # Configuração e serviços do Firebase
    config.ts     # Configuração do Firebase
    auth.ts       # Serviços de autenticação
    firestore.ts  # Serviços do Firestore
    storage.ts    # Serviços do Storage
  /context        # Contextos React
    auth-context.tsx  # Contexto de autenticação
  /utils          # Funções utilitárias
```

## Funcionalidades

- **Área Pública**:
  - Página inicial com apresentação do hotel
  - Galeria de quartos
  - Sistema de reservas
  - Formulário de contato

- **Área Administrativa**:
  - Login seguro com Firebase Authentication
  - Dashboard com estatísticas
  - Gerenciamento de reservas
  - Gerenciamento de quartos
  - Gerenciamento de mensagens de contato

## Configuração do Firebase

O projeto utiliza o Firebase como backend. A configuração está no arquivo `lib/firebase/config.ts`.

```typescript
// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBXP9lR0NzxRNgwuvRNnNb7ZRTx1bwDRZA",
  authDomain: "aqua-vista.firebaseapp.com",
  projectId: "aqua-vista",
  storageBucket: "aqua-vista.firebasestorage.app",
  messagingSenderId: "250949444714",
  appId: "1:250949444714:web:5bff7589e221ad3dcdd613"
}
```

## Modelos de Dados

### Quartos (Rooms)

```typescript
interface Room {
  id?: string
  name: string
  description: string
  price: number
  capacity: number
  amenities: string[]
  images: string[]
  available: boolean
  featured?: boolean
  createdAt?: Timestamp
  updatedAt?: Timestamp
}
```

### Reservas (Bookings)

```typescript
interface Booking {
  id?: string
  userId?: string
  guestName: string
  guestEmail: string
  guestPhone: string
  roomId: string
  roomName: string
  checkIn: Timestamp
  checkOut: Timestamp
  adults: number
  children: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  specialRequests?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}
```

### Contatos (Contacts)

```typescript
interface Contact {
  id?: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied'
  createdAt?: Timestamp
  updatedAt?: Timestamp
}
```

## Instalação e Execução

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Execute o servidor de desenvolvimento: `npm run dev`
4. Acesse `http://localhost:3000`

## Autenticação

Para acessar a área administrativa, utilize o endpoint `/admin/login`. A autenticação é feita com Firebase Authentication.

> **Nota**: A configuração inicial do administrador mestre já foi realizada. O sistema não permite a criação de novos administradores mestres por motivos de segurança.

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature: `git checkout -b feature/nova-feature`
3. Commit suas mudanças: `git commit -m 'Adiciona nova feature'`
4. Push para a branch: `git push origin feature/nova-feature`
5. Abra um Pull Request 