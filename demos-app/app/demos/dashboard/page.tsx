"use client"

import { useState } from "react"

export default function DashboardDemo() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Vista General', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'users', label: 'Usuarios', icon: '👥' },
    { id: 'settings', label: 'Configuración', icon: '⚙️' }
  ]

  const stats = [
    { label: 'Usuarios Activos', value: '2,543', change: '+12%', trend: 'up' },
    { label: 'Sesiones Hoy', value: '1,247', change: '+8%', trend: 'up' },
    { label: 'Tasa Conversión', value: '3.2%', change: '-2%', trend: 'down' },
    { label: 'Revenue', value: '$12,543', change: '+15%', trend: 'up' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎛️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Dashboard Empresarial</h1>
                <p className="text-white/70">Panel de control completo para gestión empresarial</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/70 text-sm">Sistema Activo</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-8 bg-white/5 rounded-xl p-1 backdrop-blur-sm border border-white/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-white/70 text-sm">{stat.label}</div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  stat.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chart 1 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Actividad de Usuarios</h3>
              <div className="h-48 flex items-end justify-between gap-2">
                {[65, 45, 78, 52, 89, 34, 67].map((height, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="bg-gradient-to-t from-indigo-500 to-blue-500 rounded-t w-full transition-all hover:from-indigo-400 hover:to-blue-400"
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="text-xs text-white/50 mt-2">D{index + 1}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Revenue por Canal</h3>
              <div className="space-y-3">
                {[
                  { channel: 'Web Directa', value: 45, color: 'bg-blue-500' },
                  { channel: 'Redes Sociales', value: 30, color: 'bg-purple-500' },
                  { channel: 'Email Marketing', value: 15, color: 'bg-green-500' },
                  { channel: 'Referidos', value: 10, color: 'bg-yellow-500' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-20 text-xs text-white/70">{item.channel}</div>
                    <div className="flex-1 bg-white/10 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-xs text-white/70">{item.value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Activity Feed */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Actividad Reciente</h3>
              <div className="space-y-4">
                {[
                  { user: 'Juan Pérez', action: 'Completó onboarding', time: '2 min ago', type: 'success' },
                  { user: 'María García', action: 'Actualizó perfil', time: '5 min ago', type: 'info' },
                  { user: 'Carlos López', action: 'Realizó compra', time: '12 min ago', type: 'success' },
                  { user: 'Ana Rodríguez', action: 'Canceló suscripción', time: '1 hour ago', type: 'warning' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'success' ? 'bg-green-400' :
                      activity.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                    }`}></div>
                    <div className="flex-1">
                      <div className="text-white text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </div>
                      <div className="text-white/50 text-xs">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Acciones Rápidas</h3>
              <div className="space-y-2">
                {[
                  { label: 'Exportar Datos', icon: '📤' },
                  { label: 'Generar Reporte', icon: '📊' },
                  { label: 'Enviar Notificación', icon: '📧' },
                  { label: 'Configurar Alertas', icon: '🚨' }
                ].map((action, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                  >
                    <span>{action.icon}</span>
                    <span className="text-white text-sm">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Demo Features */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Características del Dashboard</h3>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-white/70">Métricas en tiempo real</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-white/70">Widgets personalizables</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-white/70">Reportes automáticos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-white/70">Alertas inteligentes</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-white/70">Multi-usuario</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-white/70">API integrada</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-white/70">Exportación de datos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-white/70">Seguridad avanzada</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

