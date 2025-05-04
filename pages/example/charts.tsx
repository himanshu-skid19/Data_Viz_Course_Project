import React from 'react';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import ChartCard from 'example/components/Chart/ChartCard';
import ChartLegend from 'example/components/Chart/ChartLegend';
import PageTitle from 'example/components/Typography/PageTitle';
import Layout from 'example/containers/Layout';
// Import the updated InfogramEmbed component
import InfogramEmbed from '../../components/InfogramEmbed';

import {
  doughnutOptions,
  lineOptions,
  barOptions,
  doughnutLegends,
  lineLegends,
  barLegends,
} from 'utils/demo/chartsData';

import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

function Charts() {
  Chart.register(
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  return (
    <Layout>
      <PageTitle>Charts</PageTitle>

      {/* Infogram Embed */}
      <ChartCard title="Double Comparison (Infogram)">
        <div className="relative w-full" style={{ height: "500px" }}>
          <InfogramEmbed
            dataId="9270796b-5b21-4fde-b962-a632008687a4"
            dataType="interactive"
            dataTitle="Double Comparison"
            height="500px"
          />
        </div>
      </ChartCard>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard title="Doughnut">
          <Doughnut {...doughnutOptions} />
          <ChartLegend legends={doughnutLegends} />
        </ChartCard>

        <ChartCard title="Lines">
          <Line {...lineOptions} />
          <ChartLegend legends={lineLegends} />
        </ChartCard>

        <ChartCard title="Bars">
          <Bar {...barOptions} />
          <ChartLegend legends={barLegends} />
        </ChartCard>
      </div>
    </Layout>
  );
}

export default Charts;