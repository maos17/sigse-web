import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { PointGraphe } from '../useDashboardData'
import { ChartCard, PALETTE } from './ChartCard'

export function AbriChart({ data }: { data: PointGraphe[] }) {
  return (
    <ChartCard titre="Répartition par type d'abri">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="valeur"
            nameKey="label"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={(e) => `${e.label} (${e.valeur})`}
            fontSize={12}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
