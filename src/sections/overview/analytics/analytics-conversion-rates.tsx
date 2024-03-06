import { ApexOptions } from 'apexcharts';

import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';

import { fNumber } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export interface IChartSeries {
  _id?: string;
  label: string;
  value: number;
}

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chart: {
    colors?: string[];
    series: IChartSeries[];
    options?: ApexOptions;
  };
  onClickHandler?: (val: IChartSeries) => void;
}

export default function AnalyticsConversionRates({ title, subheader, chart, onClickHandler, ...other }: Props) {
  const { colors, series, options } = chart;

  const chartSeries = series.map((i) => i.value);

  const chartOptions = useChart({
    colors,
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (value: number) => fNumber(value),
        title: {
          formatter: () => '',
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '28%',
        borderRadius: 2,
      },
    },
    xaxis: {
      categories: series.map((i) => i.label),
    },
    chart: {
      events: {
        click: (event, chartContext, config) => {
          const index = config.dataPointIndex;
          const val = series[index];
          if (typeof onClickHandler === "function") {
            onClickHandler(val);
          }
        }
      }
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ mx: 3 }}>
        <Chart
          dir="ltr"
          type="bar"
          series={[{ data: chartSeries }]}
          options={chartOptions}
          width="100%"
          height={364}
        />
      </Box>
    </Card>
  );
}
