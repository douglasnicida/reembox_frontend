import { CartesianGrid, LabelList, Line, LineChart, XAxis, Pie, PieChart, Tooltip } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import api from "./api/axios"
import { useEffect, useState } from "react"
import { useAuth } from "./hooks/useAuth"


const chartConfig = {
  totalLastYear: {
    label: Number(new Date().getFullYear() - 1).toString(),
    color: "hsl(var(--chart-2))",
  },
  totalCurrentYear: {
    label: Number(new Date().getFullYear()).toString(),
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

const chartConfig2 = {
  count: {
    label: "Contador",
    color: "var(--color-total)",
  },
  ABERTO: {
    label: "ABERTO",
    color: "hsl(var(--chart-1))",
  },
  SUBMETIDO: {
    label: "SUBMETIDO",
    color: "hsl(var(--chart-3))",
  },
  APROVADO: {
    label: "APROVADO",
    color: "hsl(var(--chart-2))",
  },
  REJEITADO: {
    label: "REJEITADO",
    color: "red",
  },
  PROCESSAMENTO_PENDENTE: {
    label: "PROCESSAMENTO PENDENTE",
    color: "yellow",
  },
  ERRO_PROCESSAMENTO: {
    label: "ERRO PROCESSAMENTO",
    color: "hsl(var(--chart-4))",
  },
  PROCESSANDO_PAGAMENTO: {
    label: "PROCESSANDO PAGAMENTO",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

function App() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartUserData, setChartUserData] = useState<any[]>([]);
  const [chartPieData, setChartPieData] = useState<any[]>([]);

  const { user } = useAuth()

  function handleLineChartData(data: any,  isUser: boolean, data2?: any) {
    const monthlyReports: { [key: string]: number } = {};
    const monthlyReports2: { [key: string]: number } = {};
    
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

    if(data2 && !isUser) {
      data2.payload.forEach((report: any) => {
        const date = new Date(report.createdAt);
        const month = date.getMonth();
  
        // Incrementa a contagem para o mês correspondente
        if (monthlyReports2[month]) {
          monthlyReports2[month] += 1;
        } else {
          monthlyReports2[month] = 1;
        }
      });
    }

    // Converte o objeto de contagem em um array para o chartData
    const formattedChartData = meses.map((mes, index) => {
      return {
        createdAt: mes,
        totalCurrentYear: monthlyReports[index] ? monthlyReports[index] : 0,
        totalLastYear: monthlyReports2[index] ? monthlyReports2[index] : 0, 
      };
    });

    if(!isUser){
      setChartData(formattedChartData)  
    } else {
      setChartUserData(formattedChartData)
    }
  }

  function handlePieChartData(data: any) {
    const statusCounter = [
      { label: 'ABERTO', count: 0, fill: 'var(--color-ABERTO)' },
      { label: 'SUBMETIDO', count: 0, fill: 'var(--color-SUBMETIDO)' },
      { label: 'REJEITADO', count: 0, fill: 'var(--color-REJEITADO)' },
      { label: 'APROVADO', count: 0, fill: 'var(--color-APROVADO)' },
      { label: 'PROCESSAMENTO_PENDENTE', count: 0, fill: 'var(--color-PROCESSAMENTO_PENDENTE)' },
      { label: 'ERRO_PROCESSAMENTO', count: 0, fill: 'var(--color-ERRO_PROCESSAMENTO)' },
      { label: 'PROCESSANDO_PAGAMENTO', count: 0, fill: 'var(--color-PROCESSANDO_PAGAMENTO)' },
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
            statusCounter.find(status => status.label === 'PROCESSAMENTO_PENDENTE')!.count++;
            break;
        case 'PROCESSING ERROR':
            statusCounter.find(status => status.label === 'ERRO_PROCESSAMENTO')!.count++;
            break;
        case 'PROCESSING PAYMENT':
            statusCounter.find(status => status.label === 'PROCESSANDO_PAGAMENTO')!.count++;
            break;
    }
  });

  setChartPieData(statusCounter.map(status => ({
    label: status.label,
    count: status.count,
    fill: status.fill
  })))
}

  async function fetchReports() {
    const currentYearReports = await api.get('/reports/findAllByCompany', {
      params: {
        query: {
          year: new Date().getFullYear()
        }
      }
    });

    const currentYearReportsIndividual = await api.get('/reports/findAllByCompany', {
      params: {
        query: {
          year: new Date().getFullYear(),
          user: true
        }
      }
    });

    const lastYearReports = await api.get('/reports/findAllByCompany', {
      params: {
        query: {
          year: Number(new Date().getFullYear())-1
        }
      }
    });
    
    
    handleLineChartData(currentYearReports.data, false, lastYearReports.data);
    handleLineChartData(currentYearReportsIndividual.data, true);
    handlePieChartData(currentYearReports.data);
  }

  function ComponentLineChart() {
    const year = Number(new Date().getFullYear().toString().slice(2,4))
    return (
      <Card className="">
        <CardHeader>
          <CardTitle>Quantidade Relatórios</CardTitle>
          <CardDescription>Janeiro - Dezembro 20{year-1}-{year}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="w-auto">
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
                dataKey="totalLastYear"
                type="natural"
                stroke="var(--color-totalLastYear)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-totalLastYear)",
                }}
                activeDot={{
                  r: 6,
                }}
              ></Line>

              <Line
                dataKey="totalCurrentYear"
                type="natural"
                stroke="var(--color-totalCurrentYear)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-totalCurrentYear)",
                }}
                activeDot={{
                  r: 6,
                }}
              >
              </Line>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
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

  function ComponentUserLineChart() {
    const year = Number(new Date().getFullYear().toString().slice(2,4))
    return (
      <Card className="">
        <CardHeader>
          <CardTitle>Relatórios do ano ({user?.name})</CardTitle>
          <CardDescription>Janeiro - Dezembro 20{year}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="w-auto">
            <LineChart
              accessibilityLayer
              data={chartUserData}
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
                dataKey="totalCurrentYear"
                type="natural"
                stroke="hsl(var(--chart-4))"
                strokeWidth={2}
                dot={{
                  fill: "hsl(var(--chart-4))",
                }}
                activeDot={{
                  r: 6,
                }}
              >
              </Line>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
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
                <CardDescription>Todos relatórios</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig2}
                    className="mx-auto aspect-square max-h-[350px]"
                >
                    <PieChart>
                        <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie data={chartPieData} dataKey="count" nameKey="label" fill="gray"/>
                        <ChartLegend 
                        content={<ChartLegendContent nameKey="label" key={'label'}/>} 
                        className="-translate-y-2 text-[10px] grid grid-cols-3 gap-x-4 gap-y-2 [&>*]:items-center [&>*]:justify-left"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    Total de relatórios por status
                </div>
            </CardFooter>
        </Card>
    );
}

  useEffect(() => {
    fetchReports()
  }, [])

  return (
    <div className="flex flex-wrap h-full p-9 gap-4 w-full mx-auto max-w-screen-2xl items-center">
      <div className="h-fit flex-1 min-w-[300px]">
        <ComponentLineChart />
      </div>

      <div className="h-fit flex-1 min-w-[300px]">
        <ComponentPie />
      </div>

      <div className="h-fit flex-1 min-w-[300px]">
        <ComponentUserLineChart />
      </div>
</div>
  )
}

export default App
