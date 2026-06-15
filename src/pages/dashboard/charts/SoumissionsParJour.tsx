import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { PointGraphe } from '../useDashboardData'
import { ChartCard } from './ChartCard'
import { formatDate } from '../../../lib/format'

export function SoumissionsParJour({ data }: { data: PointGraphe[] }) {
  return (
    <ChartCard titre="Soumissions par jour (synchronisation)">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef1f4" />
          <XAxis
            dataKey="label"
            fontSize={12}
            tickFormatter={(v: string) => formatDate(v)}
          />
          <YAxis allowDecimals={false} fontSize={12} />
          <Tooltip labelFormatter={(v) => formatDate(String(v))} />
          <Line
            type="monotone"
            dataKey="valeur"
            name="Soumissions"
            stroke="#1f5f8b"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
