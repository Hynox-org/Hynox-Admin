import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export type Stat = {
  title: string
  value: string
  hint?: string
}

export function StatsCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.title}>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">{s.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{s.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
