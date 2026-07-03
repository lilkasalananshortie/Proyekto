import { lazy, Suspense } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import FeedPage from '@/pages/feed/FeedPage'
import MainLayout from '@/components/layout/MainLayout'
import { LoadingState } from '@/components/ui/LoadingState'

// Lazy-load the paper detail page — it's a heavy route (comment tree,
// modals, etc.) and shouldn't be in the main bundle for users who only
// hit /login or /feed.
const PaperDetailPage = lazy(() =>
  import('@/features/thesis/pages/PaperDetailPage').then((m) => ({ default: m.default }))
)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Auth routes — no MainLayout, keep the split-panel AuthLayout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* App routes — wrapped in MainLayout for dark bg */}
          <Route element={<MainLayout />}>
            <Route path="/feed" element={<FeedPage />} />
            <Route
              path="/paper/:id"
              element={
                <Suspense fallback={<LoadingState label="Loading paper..." className="min-h-[60vh]" />}>
                  <PaperDetailPage />
                </Suspense>
              }
            />
            <Route path="*" element={<Navigate to="/feed" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
