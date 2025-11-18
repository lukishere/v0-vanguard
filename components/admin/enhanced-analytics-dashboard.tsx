"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Users,
  Clock,
  Star,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  Target,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

type TimeRange = "7d" | "30d" | "90d" | "1y"
type MetricType = "users" | "sessions" | "conversion" | "engagement"

interface MetricData {
  label: string
  value: number
  change: number
  trend: "up" | "down" | "stable"
  target?: number
}

interface ChartData {
  date: string
  users: number
  sessions: number
  conversion: number
  engagement: number
}

interface TopItem {
  name: string
  value: number
  change: number
  category: string
}

interface EnhancedAnalyticsDashboardProps {
  overview: {
    activeClients: number
    totalClients: number
    demosAssigned: number
    avgSessionsPerClient: number
    conversionRate: number
    avgFeedbackScore: number
  }
  trends: ChartData[]
  topEngagement: TopItem[]
}

const COLORS = {
  primary: "#3C8FF0",
  secondary: "#10B981",
  tertiary: "#F59E0B",
  quaternary: "#EF4444",
  background: "#1F2937"
}

const timeRangeLabels = {
  "7d": "Últimos 7 días",
  "30d": "Últimos 30 días",
  "90d": "Últimos 90 días",
  "1y": "Último año"
}

export function EnhancedAnalyticsDashboard({
  overview,
  trends,
  topEngagement
}: EnhancedAnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d")
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("users")
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("area")

  // Internal handlers for refresh and export
  const handleRefresh = () => {
    console.log("Refreshing analytics data")
    // In a real implementation, this would trigger a data refresh
    // For now, we'll just reload the page
    window.location.reload()
  }

  const handleExport = (format: "csv" | "pdf") => {
    console.log(`Exporting analytics data as ${format}`)
    // In a real implementation, this would generate and download the export
    // For now, we'll just show an alert
    alert(`Export functionality for ${format.toUpperCase()} would be implemented here`)
  }

  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`

  const getMetricIcon = (metric: MetricType) => {
    switch (metric) {
      case "users": return Users
      case "sessions": return Activity
      case "conversion": return Target
      case "engagement": return Star
      default: return Activity
    }
  }

  const getMetricColor = (metric: MetricType) => {
    switch (metric) {
      case "users": return "text-blue-400"
      case "sessions": return "text-emerald-400"
      case "conversion": return "text-amber-400"
      case "engagement": return "text-purple-400"
      default: return "text-gray-400"
    }
  }

  const renderChart = () => {
    const ChartComponent = chartType === "line" ? RechartsLineChart :
                          chartType === "area" ? AreaChart : BarChart

    const DataComponent = chartType === "line" ? Line :
                         chartType === "area" ? Area : Bar

    const dataKey = selectedMetric
    const color = getMetricColor(selectedMetric)

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={trends}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
          />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#F9FAFB"
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES')}
          />
          {chartType === "line" && <Line
            type="monotone"
            dataKey={dataKey}
            stroke={COLORS.primary}
            strokeWidth={2}
            dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: COLORS.primary, strokeWidth: 2 }}
          />}
          {chartType === "area" && <Area
            type="monotone"
            dataKey={dataKey}
            stroke={COLORS.primary}
            fill={`${COLORS.primary}20`}
            strokeWidth={2}
          />}
          {chartType === "bar" && <Bar
            dataKey={dataKey}
            fill={COLORS.primary}
            radius={[4, 4, 0, 0]}
          />}
        </ChartComponent>
      </ResponsiveContainer>
    )
  }

  const renderConversionFunnel = () => {
    const funnelData = [
      { stage: "Visitantes", value: 1000, percentage: 100 },
      { stage: "Registros", value: overview.totalClients, percentage: (overview.totalClients / 1000) * 100 },
      { stage: "Activos", value: overview.activeClients, percentage: (overview.activeClients / overview.totalClients) * 100 },
      { stage: "Convertidos", value: Math.round(overview.activeClients * overview.conversionRate), percentage: overview.conversionRate * 100 }
    ]

    return (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={funnelData} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis type="number" stroke="#9CA3AF" />
          <YAxis dataKey="stage" type="category" stroke="#9CA3AF" fontSize={12} width={100} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#F9FAFB"
            }}
          />
          <Bar dataKey="value" fill={COLORS.secondary} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  const renderEngagementDistribution = () => {
    const distributionData = topEngagement.slice(0, 5).map(item => ({
      name: item.name,
      value: item.value,
      fill: `hsl(${(item.value / Math.max(...topEngagement.map(i => i.value))) * 360}, 70%, 50%)`
    }))

    return (
      <ResponsiveContainer width="100%" height={250}>
        <RechartsPieChart>
          <Pie
            data={distributionData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {distributionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#F9FAFB"
            }}
          />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Analytics del portal</h2>
          <p className="text-sm text-gray-600">
            Métricas clave sobre uso de demos, sesiones programadas y feedback de clientes activos.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {(["7d", "30d", "90d", "1y"] as TimeRange[]).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="text-xs"
              >
                {timeRangeLabels[range]}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-gray-200 bg-white/80 text-gray-900 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Clientes activos</CardTitle>
            <Users className="h-4 w-4 text-vanguard-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{overview.activeClients}</div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <span>{overview.totalClients} total registrados</span>
              <Badge variant="outline" className="text-xs">
                {formatPercentage(overview.activeClients / overview.totalClients)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white/80 text-gray-900 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Demos asignadas</CardTitle>
            <Activity className="h-4 w-4 text-emerald-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{overview.demosAssigned}</div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <span>Promedio {overview.avgSessionsPerClient.toFixed(1)} sesiones/cliente</span>
              <TrendingUp className="h-3 w-3 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white/80 text-gray-900 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Conversión</CardTitle>
            <Target className="h-4 w-4 text-emerald-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{formatPercentage(overview.conversionRate)}</div>
            <Progress value={overview.conversionRate * 100} className="h-2 mt-2" />
            <p className="text-xs text-gray-500 mt-1">
              Clientes activos que pasan a etapa de contratación
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white/80 text-gray-900 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Feedback promedio</CardTitle>
            <Star className="h-4 w-4 text-amber-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{overview.avgFeedbackScore.toFixed(1)}</div>
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < Math.floor(overview.avgFeedbackScore) ? "text-amber-400 fill-current" : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Escala 1-5 · {timeRangeLabels[timeRange]}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          <TabsTrigger value="funnel">Embudo</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <Card className="border-white/10 bg-slate-900/40 text-white shadow-lg shadow-black/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  {React.createElement(getMetricIcon(selectedMetric), { className: "h-5 w-5" })}
                  Tendencia de {selectedMetric === "users" ? "usuarios" :
                               selectedMetric === "sessions" ? "sesiones" :
                               selectedMetric === "conversion" ? "conversión" : "engagement"}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {(["users", "sessions", "conversion", "engagement"] as MetricType[]).map((metric) => (
                      <Button
                        key={metric}
                        variant={selectedMetric === metric ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedMetric(metric)}
                        className="text-xs"
                      >
                        {metric === "users" ? "Usuarios" :
                         metric === "sessions" ? "Sesiones" :
                         metric === "conversion" ? "Conversión" : "Engagement"}
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    {(["line", "area", "bar"] as const).map((type) => (
                      <Button
                        key={type}
                        variant={chartType === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setChartType(type)}
                        className="text-xs"
                      >
                        {type === "line" ? "Línea" : type === "area" ? "Área" : "Barras"}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {renderChart()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          <Card className="border-white/10 bg-slate-900/40 text-white shadow-lg shadow-black/10">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                Embudo de conversión
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderConversionFunnel()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-white/10 bg-slate-900/40 text-white shadow-lg shadow-black/10">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Distribución de engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderEngagementDistribution()}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-slate-900/40 text-white shadow-lg shadow-black/10">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Top demos por engagement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topEngagement.slice(0, 5).map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-vanguard-blue/20 text-vanguard-blue text-xs font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{item.name}</p>
                        <p className="text-xs text-white/50">{item.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">{item.value}</p>
                      <div className="flex items-center gap-1 text-xs">
                        {item.change > 0 ? (
                          <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-rose-400" />
                        )}
                        <span className={cn(
                          "font-medium",
                          item.change > 0 ? "text-emerald-400" : "text-rose-400"
                        )}>
                          {Math.abs(item.change)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="border-white/10 bg-slate-900/40 text-white shadow-lg shadow-black/10">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">KPI clave</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-white/70">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Tiempo medio entre sesión y feedback</span>
                    <Clock className="h-4 w-4 text-vanguard-blue" />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">17 horas · objetivo ≤ 24h</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Ratio demostración → reunión</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">42%</p>
                  <p className="text-xs text-gray-500">Clientes que solicitan reunión tras probar una demo</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Feedback destacado</p>
                  <p className="mt-2 text-sm italic text-gray-600">
                    "El flujo de contratos digitales redujo el tiempo de firma a minutos; queremos escalarlo a más equipos."
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-slate-900/40 text-white shadow-lg shadow-black/10 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">Tendencia de uso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {trends.slice(-7).map((item, index) => (
                  <div key={item.date} className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">
                        {new Date(item.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}
                      </span>
                      <Badge variant="outline" className="border-white/20 text-white">
                        {item.sessions} sesiones
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Sesiones demo</span>
                          <span>{item.sessions}</span>
                        </div>
                        <Progress value={Math.min(item.sessions, 80) / 0.8} className="h-2 bg-gray-700" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Feedback</span>
                          <span>{Math.round(item.engagement * 10)}</span>
                        </div>
                        <Progress value={item.engagement * 10} className="h-2 bg-gray-700" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Reuniones</span>
                          <span>{Math.round(item.conversion * 20)}</span>
                        </div>
                        <Progress value={item.conversion * 20} className="h-2 bg-gray-700" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
