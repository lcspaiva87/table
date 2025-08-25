"use client"

import { useVirtualizer } from "@tanstack/react-virtual"
import { useRef, useMemo } from "react"
import { cn } from "@/lib/utils"

// Estrutura de dados para as linhas da tabela
interface TableRow {
  id: number
  name: string
  email: string
  age: number
  city: string
  company: string
  salary: number
  department: string
}

// Função para gerar dados de exemplo
const generateMockData = (count: number): TableRow[] => {
  const names = [
    "João Silva",
    "Maria Santos",
    "Pedro Oliveira",
    "Ana Costa",
    "Carlos Ferreira",
    "Lucia Pereira",
    "Rafael Lima",
    "Fernanda Souza",
  ]
  const cities = [
    "São Paulo",
    "Rio de Janeiro",
    "Belo Horizonte",
    "Salvador",
    "Brasília",
    "Fortaleza",
    "Recife",
    "Porto Alegre",
  ]
  const companies = [
    "Tech Corp",
    "Inovação Ltda",
    "Digital Solutions",
    "Future Systems",
    "Smart Tech",
    "Data Analytics",
    "Cloud Services",
    "AI Solutions",
  ]
  const departments = ["Desenvolvimento", "Marketing", "Vendas", "RH", "Financeiro", "Operações", "Suporte", "Design"]

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: names[index % names.length],
    email: `user${index + 1}@email.com`,
    age: Math.floor(Math.random() * 40) + 20,
    city: cities[index % cities.length],
    company: companies[index % companies.length],
    salary: Math.floor(Math.random() * 100000) + 30000,
    department: departments[index % departments.length],
  }))
}

// Definição das colunas da tabela
const columns = [
  { key: "id" as keyof TableRow, label: "ID", width: 80 },
  { key: "name" as keyof TableRow, label: "Nome", width: 150 },
  { key: "email" as keyof TableRow, label: "Email", width: 200 },
  { key: "age" as keyof TableRow, label: "Idade", width: 80 },
  { key: "city" as keyof TableRow, label: "Cidade", width: 150 },
  { key: "company" as keyof TableRow, label: "Empresa", width: 150 },
  { key: "salary" as keyof TableRow, label: "Salário", width: 120 },
  { key: "department" as keyof TableRow, label: "Departamento", width: 150 },
]

export function VirtualTable() {
  // Referência para o container da tabela
  const parentRef = useRef<HTMLDivElement>(null)

  // Gerar dados de exemplo com 10.000 linhas para demonstrar performance
  const data = useMemo(() => generateMockData(10000), [])

  // Altura fixa para cada linha da tabela
  const ROW_HEIGHT = 50

  // Configuração do virtualizador
  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10, // Renderizar 10 itens extras para melhor performance de scroll
  })

  // Formatação de valores para exibição
  const formatValue = (value: any, key: keyof TableRow): string => {
    if (key === "salary") {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value)
    }
    return String(value)
  }

  return (
    <div className="w-full">
      {/* Cabeçalho da tabela */}
      <div className="border border-border rounded-t-lg bg-muted/50">
        <div className="flex">
          {columns.map((column) => (
            <div
              key={column.key}
              className="px-4 py-3 text-sm font-medium text-muted-foreground border-r border-border last:border-r-0"
              style={{ width: column.width, minWidth: column.width }}
            >
              {column.label}
            </div>
          ))}
        </div>
      </div>

      {/* Container virtualizador com scroll */}
      <div
        ref={parentRef}
        className="h-[600px] overflow-auto border-x border-b border-border rounded-b-lg bg-card"
        style={{
          contain: "strict", // Otimização de performance
        }}
      >
        {/* Container interno com altura total calculada */}
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {/* Renderização apenas dos itens visíveis */}
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const row = data[virtualItem.index]

            return (
              <div
                key={virtualItem.key}
                className={cn(
                  "absolute top-0 left-0 w-full flex border-b border-border hover:bg-muted/50 transition-colors",
                  virtualItem.index % 2 === 0 ? "bg-background" : "bg-muted/20",
                )}
                style={{
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                {columns.map((column) => (
                  <div
                    key={column.key}
                    className="px-4 py-3 text-sm border-r border-border last:border-r-0 flex items-center"
                    style={{ width: column.width, minWidth: column.width }}
                  >
                    <span className="truncate">{formatValue(row[column.key], column.key)}</span>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* Informações sobre a tabela */}
      <div className="mt-4 text-sm text-muted-foreground">
        <p>
          Exibindo {virtualizer.getVirtualItems().length} de {data.length} linhas (Virtual Scroll ativo)
        </p>
        <p className="mt-1">
          Scroll Range: {Math.round(virtualizer.scrollOffset)} - {Math.round(virtualizer.scrollOffset + 600)}px
        </p>
      </div>
    </div>
  )
}
