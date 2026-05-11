import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

function FeedPlaceholder() {
  return (
    <div className="min-h-screen bg-base bg-grid flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-xl bg-flame/10 border border-flame/30 flex items-center justify-center">
          <span className="text-flame font-display font-bold text-3xl">P</span>
        </div>
        <h1 className="font-display font-bold text-3xl text-text">Proyekto</h1>
        <p className="text-sm text-text-muted font-mono max-w-md mx-auto">
          Philippine Academic Research Library
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border">
          <div className="w-2 h-2 rounded-full bg-flame animate-pulse" />
          <span className="text-xs font-mono text-text-dim">
            Feed module — coming in next build
          </span>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/feed" replace />} />
          <Route path="/feed" element={<FeedPlaceholder />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}