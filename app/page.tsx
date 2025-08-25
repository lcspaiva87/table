import { VirtualTable } from "@/components/virtual-table"

export default function Home() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tabela Virtual com @tanstack/react-virtual</h1>
      <VirtualTable />
    </div>
  )
}
