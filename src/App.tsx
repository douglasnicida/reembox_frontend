import { CartesianGrid, LabelList, Line, LineChart, XAxis, Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import api from "./api/axios"
import { useEffect, useState } from "react"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const chartConfig2 = {
  count: {
    label: "Contador",
    color: "var(--color-total)",
  },
  aberto: {
    label: "ABERTO",
    color: "var(--color-chrome)",
  },
  submetido: {
    label: "SUBMETIDO",
    color: "var(--color-safari)",
  },
  aprovado: {
    label: "APROVADO",
    color: "var(--color-firefox)",
  },
  rejeitado: {
    label: "REJEITADO",
    color: "var(--color-edge)",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

function App() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartPieData, setChartPieData] = useState<any[]>([]);

  function handleLineChartData(data: any) {
    const monthlyReports: { [key: string]: number } = {};

    // Array com os nomes dos meses em português
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    data.payload.forEach((report: any) => {
      const date = new Date(report.createdAt);
      const month = date.getMonth();

      // Incrementa a contagem para o mês correspondente
      if (monthlyReports[month]) {
        monthlyReports[month] += 1;
      } else {
        monthlyReports[month] = 1;
      }
    });

    // Converte o objeto de contagem em um array para o chartData
    const formattedChartData = meses.map((mes, index) => ({
      createdAt: mes,
      total: monthlyReports[index] ? monthlyReports[index] : 0
    }));

    setChartData(formattedChartData);
  }

  function handlePieChartData(data: any) {
    const statusCounter = [
      { label: 'ABERTO', count: 0, fill: 'white' },
      { label: 'SUBMETIDO', count: 0, fill: 'blue' },
      { label: 'REJEITADO', count: 0, fill: 'red' },
      { label: 'APROVADO', count: 0, fill: 'green' },
      { label: 'PROCESSAMENTO PENDENTE', count: 0, fill: 'yellow' },
      { label: 'ERRO PROCESSAMENTO', count: 0, fill: 'purple' },
      { label: 'PROCESSANDO PAGAMENTO', count: 0, fill: 'pink' },
  ];

  data.payload.forEach((report: any) => {
    switch(report.status) {
        case 'OPEN':
          statusCounter.find(status => status.label === 'ABERTO')!.count++;
            break;
        case 'SUBMITTED':
            statusCounter.find(status => status.label === 'SUBMETIDO')!.count++;
            break;
        case 'REJECTED':
            statusCounter.find(status => status.label === 'REJEITADO')!.count++;
            break;
        case 'APPROVED':
            statusCounter.find(status => status.label === 'APROVADO')!.count++;
            break;
        case 'PROCESSING PENDING':
            statusCounter.find(status => status.label === 'PROCESSAMENTO PENDENTE')!.count++;
            break;
        case 'PROCESSING ERROR':
            statusCounter.find(status => status.label === 'ERRO PROCESSAMENTO')!.count++;
            break;
        case 'PROCESSING PAYMENT':
            statusCounter.find(status => status.label === 'PROCESSANDO PAGAMENTO')!.count++;
            break;
    }
  });

    setChartPieData(statusCounter)
  }

  async function fetchReports() {
    const { data } = await api.get('/reports/findAllByCompany');
    
    handleLineChartData(data);
    handlePieChartData(data);
  }

  function ComponentLineChart() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Relatórios do ano</CardTitle>
          <CardDescription>Janeiro - Junho 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 20,
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="createdAt"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                dataKey="total"
                type="natural"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-desktop)",
                }}
                activeDot={{
                  r: 6,
                }}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Line>
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="leading-none text-muted-foreground">
            Total de relatórios criados por mês no ano de 2024
          </div>
        </CardFooter>
      </Card>
    )
  }

  function ComponentPie() {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Status Relatórios</CardTitle>
          <CardDescription>Janeiro - Dezembro 2024</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig2}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie data={chartPieData} dataKey="count" nameKey="label" />
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="leading-none text-muted-foreground">
            Total de relatórios por status
          </div>
        </CardFooter>
      </Card>
    )
  }

  useEffect(() => {
    fetchReports()
  }, [])

  return (
    <div className="">
      <div className="h-screen grid grid-cols-3 grid-rows-2 p-24 overflow-y-scroll gap-6">
        <ComponentLineChart />
        <ComponentPie />
      </div>
    </div>
  )
}

export default App
