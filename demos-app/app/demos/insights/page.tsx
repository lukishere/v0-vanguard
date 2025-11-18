"use client"

import { useState } from "react"

export default function InsightsDemo() {
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [timeRange, setTimeRange] = useState('30d')

  const metrics = {
    revenue: { value: '$125,430', change: '+12.5%', label: 'Ingresos Totales' },
    users: { value: '8,542', change: '+8.2%', label: 'Usuarios Activos' },
    conversion: { value: '3.24%', change: '+0.8%', label: 'Tasa de Conversión' },
    satisfaction: { value: '94.7%', change: '+2.1%', label: 'Satisfacción' }
  }

  const chartData = [
    { month: 'Ene', value: 12000 },
    { month: 'Feb', value: 15000 },
    { month: 'Mar', value: 18000 },
    { month: 'Abr', value: 22000 },
    { month: 'May', value: 28000 },
    { month: 'Jun', value: 35000 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Insights 360</h1>
              <p className="text-white/70">Panel de análisis y métricas en tiempo real</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Controls */}
        <div className="flex gap-4 mb-6">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="1y">Último año</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.entries(metrics).map(([key, metric]) => (
            <div
              key={key}
              onClick={() => setSelectedMetric(key)}
              className={`bg-white/5 backdrop-blur-sm rounded-xl border p-6 cursor-pointer transition-all hover:bg-white/10 ${
                selectedMetric === key ? 'border-purple-400 bg-purple-500/10' : 'border-white/20'
              }`}
            >
              <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-sm text-green-400 mb-2">{metric.change}</div>
              <div className="text-sm text-white/70">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Chart Area */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">Tendencia de {metrics[selectedMetric].label}</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {chartData.map((data, index) => {
              const maxValue = Math.max(...chartData.map(d => d.value))
              const height = (data.value / maxValue) * 100

              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-gradient-to-t from-purple-500 to-pink-500 rounded-t w-full transition-all hover:from-purple-400 hover:to-pink-400"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-xs text-white/70 mt-2">{data.month}</div>
                  <div className="text-xs text-white/50">${data.value.toLocaleString()}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Insights Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <h4 className="text-lg font-semibold text-white mb-4">💡 Insights Automáticos</h4>
            <div className="space-y-3">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <div className="text-green-400 font-medium">Tendencia Positiva</div>
                <div className="text-white/70 text-sm">Los ingresos han aumentado 12.5% este mes</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <div className="text-blue-400 font-medium">Pico de Actividad</div>
                <div className="text-white/70 text-sm">Mayor engagement los fines de semana</div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <div className="text-yellow-400 font-medium">Oportunidad</div>
                <div className="text-white/70 text-sm">Segmento B2B subexplotado (+45% potencial)</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <h4 className="text-lg font-semibold text-white mb-4">🎯 Recomendaciones</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <span className="text-purple-400 mt-1">📈</span>
                <div>
                  <div className="text-white font-medium">Optimizar campañas</div>
                  <div className="text-white/70 text-sm">Enfocarse en canales con mayor ROI</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <span className="text-blue-400 mt-1">👥</span>
                <div>
                  <div className="text-white font-medium">Expandir segmento</div>
                  <div className="text-white/70 text-sm">Targetear usuarios similares al perfil top</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <span className="text-green-400 mt-1">⚡</span>
                <div>
                  <div className="text-white font-medium">Automatizar procesos</div>
                  <div className="text-white/70 text-sm">Implementar flujos de nurturing automático</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Features */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Características de Insights 360</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-white/70">Métricas en tiempo real</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-white/70">Dashboards personalizables</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-white/70">Alertas inteligentes</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-white/70">Análisis predictivo</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-white/70">Reportes automatizados</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-white/70">Integración multi-fuente</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-white/70">Machine Learning</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-white/70">APIs abiertas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-white/70">Exportación de datos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

