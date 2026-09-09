import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Wallet, UtensilsCrossed, Bus, BedDouble, Users } from "lucide-react";

const COLORS = {
  Hotel: "hsl(var(--primary))",
  Transport: "hsl(var(--teal))",
  Food: "hsl(197 37% 44%)",
  Guide: "hsl(43 74% 56%)",
};

export default function BudgetDashboard({ plan, budget, days }) {
  if (!plan) return null;

  const { hotelCost, tCost, guideCost, foodCost, total } = plan.breakdown;

  const chartData = [
    { name: "Hotel", value: hotelCost },
    { name: "Transport", value: tCost },
    { name: "Food", value: foodCost },
    ...(guideCost > 0 ? [{ name: "Guide", value: guideCost }] : []),
  ];

  const remaining = budget - total;
  const utilization = Math.round((total / budget) * 100);

  const stats = [
    { label: "Total Budget", value: budget, icon: Wallet, color: "text-primary", bg: "bg-primary/10" },
    { label: "Hotel", value: hotelCost, icon: BedDouble, color: "text-primary", bg: "bg-primary/10" },
    { label: "Transport", value: tCost, icon: Bus, color: "text-teal", bg: "bg-teal/10" },
    { label: "Food", value: foodCost, icon: UtensilsCrossed, color: "text-foreground", bg: "bg-muted" },
    ...(guideCost > 0 ? [{ label: "Guide", value: guideCost, icon: Users, color: "text-primary", bg: "bg-primary/10" }] : []),
  ];

  return (
    <div className="rounded-2xl bg-card ring-1 ring-border p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" /> Budget Dashboard
        </h3>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${utilization > 100 ? "bg-destructive/15 text-destructive" : "bg-emerald-500/15 text-emerald-600"}`}>
          {utilization}% of budget
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="p-3 rounded-xl bg-muted/60 ring-1 ring-border">
            <div className={`w-8 h-8 rounded-lg ${s.bg} grid place-items-center mb-2`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-base font-bold text-foreground">
              ₹{s.value.toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      {/* Chart + breakdown */}
      <div className="grid md:grid-cols-2 gap-4 items-center">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => `₹${v.toLocaleString("en-IN")}`}
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.75rem",
                  color: "hsl(var(--foreground))",
                  fontSize: "0.75rem",
                }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          {chartData.map((d) => (
            <div key={d.name} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="w-3 h-3 rounded-full" style={{ background: COLORS[d.name] }} />
                {d.name}
              </span>
              <span className="font-semibold text-foreground">
                ₹{d.value.toLocaleString("en-IN")}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-2 border-t border-border text-sm font-bold text-foreground">
            <span>Total Spending</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
          <div className={`flex items-center justify-between text-sm font-semibold pt-1 ${remaining >= 0 ? "text-emerald-600" : "text-destructive"}`}>
            <span>{remaining >= 0 ? "Remaining" : "Over budget"}</span>
            <span>₹{Math.abs(remaining).toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}