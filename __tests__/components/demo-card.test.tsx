import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DemoCard } from '@/components/dashboard/demo-card'
import type { Demo } from '@/lib/demos/types'

// Mock del contexto
const mockUseDemo = jest.fn()
jest.mock('@/contexts/demo-context', () => ({
  useDemo: () => mockUseDemo()
}))

// Mock del toast
const mockToast = jest.fn()
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast })
}))

// Mock del logActivity
jest.mock('@/app/actions/client-activities', () => ({
  logActivity: jest.fn().mockResolvedValue(undefined)
}))

describe('DemoCard', () => {
  const mockDemo: Demo = {
    id: 'test-demo',
    name: 'Test Demo',
    summary: 'A test demo summary',
    description: 'Detailed test description',
    status: 'active',
    tags: ['test', 'demo'],
    interactiveUrl: 'https://example.com/demo',
    demoType: 'bot',
    daysRemaining: 30,
    usageDays: 15,
    totalDays: 30
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseDemo.mockReturnValue({
      openDemo: jest.fn().mockResolvedValue(undefined),
      isLoading: false,
      error: null
    })
  })

  it('should render demo card with basic information', () => {
    render(<DemoCard demo={mockDemo} />)

    expect(screen.getByText('Test Demo')).toBeInTheDocument()
    expect(screen.getByText('A test demo summary')).toBeInTheDocument()
    expect(screen.getByText('Activa')).toBeInTheDocument()
    expect(screen.getByText('#test')).toBeInTheDocument()
    expect(screen.getByText('#demo')).toBeInTheDocument()
  })

  it('should show expiration information for active demos', () => {
    render(<DemoCard demo={mockDemo} />)

    expect(screen.getByText('Tiempo restante')).toBeInTheDocument()
    expect(screen.getByText('30 días restantes')).toBeInTheDocument()
    expect(screen.getByText('Uso: 15 de 30 días')).toBeInTheDocument()
  })

  it('should show progress bar for in-development demos', () => {
    const inDevDemo = { ...mockDemo, status: 'in-development' as const, progress: 75 }
    render(<DemoCard demo={inDevDemo} />)

    expect(screen.getByText('En Desarrollo')).toBeInTheDocument()
    expect(screen.getByText('Progreso')).toBeInTheDocument()
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('should show available demos with request button', () => {
    const availableDemo = { ...mockDemo, status: 'available' as const }
    render(<DemoCard demo={availableDemo} />)

    expect(screen.getByText('Disponible')).toBeInTheDocument()
    expect(screen.getByText('Solicitar Demo')).toBeInTheDocument()
  })

  it('should show expired demos with contract button', () => {
    const expiredDemo = { ...mockDemo, status: 'expired' as const }
    render(<DemoCard demo={expiredDemo} />)

    expect(screen.getByText('Expirada')).toBeInTheDocument()
    expect(screen.getByText('Contratar Servicio')).toBeInTheDocument()
  })

  it('should open demo modal when "Abrir Demo" is clicked', async () => {
    const mockOpenDemo = jest.fn().mockResolvedValue(undefined)
    mockUseDemo.mockReturnValue({
      openDemo: mockOpenDemo,
      isLoading: false,
      error: null
    })

    render(<DemoCard demo={mockDemo} />)

    const openButton = screen.getByText('Abrir Demo')
    fireEvent.click(openButton)

    await waitFor(() => {
      expect(mockOpenDemo).toHaveBeenCalledWith(mockDemo)
    })
  })

  it('should show loading state on demo button', () => {
    mockUseDemo.mockReturnValue({
      openDemo: jest.fn(),
      isLoading: true,
      error: null
    })

    render(<DemoCard demo={mockDemo} />)

    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })

  it('should disable demo button when loading', () => {
    mockUseDemo.mockReturnValue({
      openDemo: jest.fn(),
      isLoading: true,
      error: null
    })

    render(<DemoCard demo={mockDemo} />)

    const button = screen.getByText('Cargando...')
    expect(button).toBeDisabled()
  })

  it('should show error toast when demo has no URL', async () => {
    const demoWithoutUrl = { ...mockDemo, interactiveUrl: undefined }

    render(<DemoCard demo={demoWithoutUrl} />)

    const openButton = screen.getByText('Abrir Demo')
    fireEvent.click(openButton)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Demo no disponible",
        description: "Esta demo aún no tiene una URL configurada.",
        variant: "destructive",
      })
    })
  })

  it('should show critical expiration warning', () => {
    const criticalDemo = { ...mockDemo, daysRemaining: 2 }
    render(<DemoCard demo={criticalDemo} />)

    expect(screen.getByText('Tu demo expira pronto. Considera contratar o ampliar.')).toBeInTheDocument()
  })

  it('should show session and feedback counts when available', () => {
    const demoWithStats = {
      ...mockDemo,
      sessionsCount: 42,
      feedbackCount: 8,
      lastUsedAt: '2024-01-15T10:00:00Z'
    }
    render(<DemoCard demo={demoWithStats} />)

    expect(screen.getByText('42 sesiones')).toBeInTheDocument()
    expect(screen.getByText('8 feedbacks')).toBeInTheDocument()
    expect(screen.getByText('Última prueba: 15 ene')).toBeInTheDocument()
  })

  it('should handle demo without expiration data', () => {
    const demoWithoutExpiration = {
      ...mockDemo,
      daysRemaining: undefined,
      usageDays: undefined,
      totalDays: undefined
    }
    render(<DemoCard demo={demoWithoutExpiration} />)

    // Should not crash and should still show basic info
    expect(screen.getByText('Test Demo')).toBeInTheDocument()
    expect(screen.getByText('Abrir Demo')).toBeInTheDocument()
  })

  it('should render demo description when available', () => {
    render(<DemoCard demo={mockDemo} />)

    expect(screen.getByText('Detalles operativos')).toBeInTheDocument()
    expect(screen.getByText('Detailed test description')).toBeInTheDocument()
  })
})

