import React, { useState, useEffect } from 'react'
import { Doughnut, Line } from 'react-chartjs-2'
import dynamic from 'next/dynamic'

import CTA from 'example/components/CTA'
import InfoCard from 'example/components/Cards/InfoCard'
import ChartCard from 'example/components/Chart/ChartCard'
import ChartLegend from 'example/components/Chart/ChartLegend'
import PageTitle from 'example/components/Typography/PageTitle'
import RoundIcon from 'example/components/RoundIcon'
import Layout from 'example/containers/Layout'
import response, { ITableData } from 'utils/demo/tableData'
import { ChatIcon, CartIcon, MoneyIcon, PeopleIcon } from 'icons'
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
} from '@roketid/windmill-react-ui'

import {
  doughnutOptions,
  lineOptions,
  doughnutLegends,
  lineLegends,
} from 'utils/demo/chartsData'

import {
  Chart,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

const BootstrapCarousel = dynamic(() => import('../../components/BootstrapCarousel'), {
  ssr: false,
})

interface FlourishChartProps {
  src: string;
  title?: string;
  className?: string;
}

const FlourishChart = dynamic(() => import('../../components/FlourishChart'), {
  ssr: false,
});

type DemographicsFilterType = 'gender' | 'age' | 'mode';

function Dashboard() {
  Chart.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )

  const [demographicsFilter, setDemographicsFilter] = useState<DemographicsFilterType>('gender');
  const [showChart, setShowChart] = useState(true);
  const [chartKey, setChartKey] = useState(Date.now());

  // Map filter types to Flourish visualization IDs
  const visualizationIds: Record<DemographicsFilterType, string> = {
    gender: 'visualisation/22596350',
    age: 'visualisation/22596141',
    mode: 'visualisation/22596471',
  };

  // Chart titles based on filter
  const chartTitles: Record<DemographicsFilterType, string> = {
    gender: 'Gender Distribution of Foreign Tourists',
    age: 'Age Wise Distribution of Tourist Arrivals',
    mode: 'Distribution of Tourists based on Mode of Travel',
  };

  // Handle filter change
  const handleDemographicsFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value as DemographicsFilterType;
    
    // Hide chart first, then change filter, then show chart
    setShowChart(false);
    setTimeout(() => {
      setDemographicsFilter(newFilter);
      setChartKey(Date.now()); // Generate new key to force remount
      setTimeout(() => {
        setShowChart(true);
      }, 300);
    }, 100);
  };
  const [page, setPage] = useState(1)
  const [data, setData] = useState<ITableData[]>([])

  // pagination setup
  const resultsPerPage = 10
  const totalResults = response.length

  // pagination change control
  function onPageChange(p: number) {
    setPage(p)
  }
  
  // Add this useEffect to monitor filter changes and force rerender
  useEffect(() => {
    console.log("Filter changed to:", demographicsFilter);
    
    // Force Flourish script to reload
    if (typeof window !== 'undefined' && window.Flourish) {
      setTimeout(() => {
        if (typeof window.Flourish.reload === 'function') {
          window.Flourish.reload();
        }
      }, 300);
    }
  }, [demographicsFilter]);

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setData(response.slice((page - 1) * resultsPerPage, page * resultsPerPage))
  }, [page])

  return (
    <Layout>
      <PageTitle>Tourism Analysis Dashboard</PageTitle>

      {/* Added Bootstrap Carousel */}
      <div className="mb-8">
        <BootstrapCarousel />
      </div>

      <CTA />

    
     <PageTitle>Demographics Analysis</PageTitle>
      
      {/* Filter dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
          Select View:
        </label>
        <select
          className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
          value={demographicsFilter}
          onChange={handleDemographicsFilterChange}
        >
          <option value="gender">Gender Distribution</option>
          <option value="age">Age Wise Distribution</option>
          <option value="mode">Distribution of Tourists by mode of travel</option>
        </select>
      </div>

      {showChart && (
        <div key={`chart-container-${chartKey}`}>
          {demographicsFilter === 'gender' && (
            <ChartCard title={chartTitles.gender}>
              <div className="relative w-full h-96">
                <FlourishChart 
                  key={`flourish-chart-gender-${chartKey}`}
                  src="visualisation/22596350"
                  title={chartTitles.gender}
                  className="w-full h-full" 
                />
              </div>
            </ChartCard>
          )}

          {demographicsFilter === 'age' && (
            <ChartCard title={chartTitles.age}>
              <div className="relative w-full h-96">
                <FlourishChart 
                  key={`flourish-chart-age-${chartKey}`}
                  src="visualisation/22596141"
                  title={chartTitles.age}
                  className="w-full h-full" 
                />
              </div>
            </ChartCard>
          )}

          {demographicsFilter === 'mode' && (
            <ChartCard title={chartTitles.mode}>
              <div className="relative w-full h-96">
                <FlourishChart 
                  key={`flourish-chart-mode-${chartKey}`}
                  src="visualisation/22596471" 
                  title={chartTitles.mode}
                  className="w-full h-full" 
                />
              </div>
            </ChartCard>
          )}
        </div>
      )}
      {!showChart && (
        <div className="w-full h-96 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="text-center">
            <p className="text-gray-700 dark:text-gray-300">Loading chart...</p>
            <div className="mt-2 inline-block w-8 h-8 border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      
      {/* Chart */}
      <ChartCard title="Top Countries with Foreign Tourist Arrivals">
        <div className="relative w-full h-96">
          <FlourishChart 
            key="flourish-chart-top-countries-22473410"
            src="visualisation/22473410" 
            className="w-full h-full" 
          />
        </div>
      </ChartCard>
      <PageTitle>Charts</PageTitle>
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard title="Monthly Tourist Arrivals in India">
          <div className="relative w-full h-96">
            <FlourishChart 
              key="flourish-chart-monthly-arrivals-22595001"
              src="visualisation/22595001" 
              className="w-full h-full" 
            />
          </div>
        </ChartCard>
        <ChartCard title="Monthly Foreign Exchange Earnings in USD (in billions) in India">
          <div className="relative w-full h-96">
            <FlourishChart 
              key="flourish-chart-forex-earnings-22595129"
              src="visualisation/22595129" 
              className="w-full h-full" 
            />
          </div>
        </ChartCard>
        <ChartCard title="Top Country Rankings Based on Foreign Tourist Arrivals">
          <div className="relative w-full h-96">
            <FlourishChart 
              key="flourish-chart-country-rankings-22592845"
              src="visualisation/22592845" 
              className="w-full h-full" 
            />
          </div>
        </ChartCard>
        <ChartCard title="Top State Rankings Based on Foreign Tourist Arrivals">
          <div className="relative w-full h-96">
            <FlourishChart 
              key="flourish-chart-state-rankings-22594604"
              src="visualisation/22594604" 
              className="w-full h-96" 
            />
          </div>
        </ChartCard>
      </div>
    </Layout>
  )
}

export default Dashboard