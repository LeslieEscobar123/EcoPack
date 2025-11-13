import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PackageList } from "@/components/dashboard/package-list"
import { PackageStats } from "@/components/dashboard/package-stats"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <PackageStats />
        <PackageList />
      </main>
    </div>
  )
}
