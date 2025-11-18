import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DemoProvider, useDemo } from '@/contexts/demo-context'
import type { Demo } from '@/lib/demos/types'

// Mock del logActivity
jest.mock('@/app/actions/client-activities', () => ({
  logActivity: jest.fn().mockResolvedValue(undefined)
}))

// Mock del gtag global
const mockGtag = jest.fn()
Object.defineProperty(window, 'gtag', {
  value: mockGtag,
  writable: true
})

// Componente de prueba
const TestComponent = () => {
  const { activeDemo, openDemo, closeDemo, demoHistory, isLoading, error } = useDemo()

  const mockDemo: Demo = {
    id: 'test-demo',
    name: 'Test Demo',
    summary: 'A test demo',
    description: 'Test description',
    status: 'active',
    tags: ['test'],
    interactiveUrl: 'https://example.com/demo',
    demoType: 'bot'
  }

  return (
    <div>
      <button onClick={() => openDemo(mockDemo)}>Open Demo</button>
      <button onClick={closeDemo}>Close Demo</button>

      {activeDemo && <div data-testid="active-demo">{activeDemo.name}</div>}
      {isLoading && <div data-testid="loading">Loading...</div>}
      {error && <div data-testid="error">{error}</div>}
      <div data-testid="history-count">{demoHistory.length}</div>
    </div>
  )
}

describe('DemoContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render without crashing', () => {
    render(
      <DemoProvider>
        <TestComponent />
      </DemoProvider>
    )

    expect(screen.getByText('Open Demo')).toBeInTheDocument()
    expect(screen.getByText('Close Demo')).toBeInTheDocument()
  })

  it('should open demo successfully', async () => {
    render(
      <DemoProvider>
        <TestComponent />
      </DemoProvider>
    )

    const openButton = screen.getByText('Open Demo')
    fireEvent.click(openButton)

    // Should show loading state
    expect(screen.getByTestId('loading')).toBeInTheDocument()

    // Wait for demo to open
    await waitFor(() => {
      expect(screen.getByTestId('active-demo')).toHaveTextContent('Test Demo')
    })

    // Check history
    expect(screen.getByTestId('history-count')).toHaveTextContent('1')

    // Check that logActivity was called
    expect(require('@/app/actions/client-activities').logActivity).toHaveBeenCalledWith(
      'demo-opened',
      'Abrió la demo "Test Demo"',
      expect.objectContaining({
        demoId: 'test-demo',
        demoName: 'Test Demo'
      })
    )

    // Check that gtag was called
    expect(mockGtag).toHaveBeenCalledWith('event', 'demo_opened', {
      demo_name: 'Test Demo',
      demo_type: 'bot',
      demo_id: 'test-demo'
    })
  })

  it('should close demo', async () => {
    render(
      <DemoProvider>
        <TestComponent />
      </DemoProvider>
    )

    // Open demo first
    const openButton = screen.getByText('Open Demo')
    fireEvent.click(openButton)

    await waitFor(() => {
      expect(screen.getByTestId('active-demo')).toBeInTheDocument()
    })

    // Close demo
    const closeButton = screen.getByText('Close Demo')
    fireEvent.click(closeButton)

    await waitFor(() => {
      expect(screen.queryByTestId('active-demo')).not.toBeInTheDocument()
    })
  })

  it('should handle demo without interactiveUrl', async () => {
    const TestComponentWithoutUrl = () => {
      const { openDemo, error } = useDemo()

      const mockDemoWithoutUrl: Demo = {
        id: 'test-demo-no-url',
        name: 'Test Demo No URL',
        summary: 'A test demo without URL',
        description: 'Test description',
        status: 'active',
        tags: ['test'],
        demoType: 'bot'
        // No interactiveUrl
      }

      return (
        <div>
          <button onClick={() => openDemo(mockDemoWithoutUrl)}>Open Demo Without URL</button>
          {error && <div data-testid="error">{error}</div>}
        </div>
      )
    }

    render(
      <DemoProvider>
        <TestComponentWithoutUrl />
      </DemoProvider>
    )

    const button = screen.getByText('Open Demo Without URL')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Esta demo no tiene una URL interactiva configurada')
    })
  })

  it('should maintain demo history with max 10 items', async () => {
    const TestComponentMultiple = () => {
      const { openDemo, demoHistory } = useDemo()

      const createMockDemo = (id: string): Demo => ({
        id,
        name: `Demo ${id}`,
        summary: `Summary ${id}`,
        description: `Description ${id}`,
        status: 'active',
        tags: ['test'],
        interactiveUrl: `https://example.com/${id}`,
        demoType: 'bot'
      })

      return (
        <div>
          <button onClick={() => {
            for (let i = 1; i <= 12; i++) {
              openDemo(createMockDemo(`demo-${i}`))
            }
          }}>
            Open 12 Demos
          </button>
          <div data-testid="history-length">{demoHistory.length}</div>
        </div>
      )
    }

    render(
      <DemoProvider>
        <TestComponentMultiple />
      </DemoProvider>
    )

    const button = screen.getByText('Open 12 Demos')
    fireEvent.click(button)

    // Wait for all demos to be processed and check history is limited to 10
    await waitFor(() => {
      expect(screen.getByTestId('history-length')).toHaveTextContent('10')
    })
  })

  it('should throw error when useDemo is used outside provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow('useDemo must be used within a DemoProvider')

    consoleSpy.mockRestore()
  })
})

