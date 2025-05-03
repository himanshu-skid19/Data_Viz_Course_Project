import React, { useState, useEffect, useRef } from 'react'
import { Doughnut, Line } from 'react-chartjs-2'

import CTA from 'example/components/CTA'
import InfoCard from 'example/components/Cards/InfoCard'
import ChartCard from 'example/components/Chart/ChartCard'
import ChartLegend from 'example/components/Chart/ChartLegend'
import PageTitle from 'example/components/Typography/PageTitle'
import RoundIcon from 'example/components/RoundIcon'
import Layout from 'example/containers/Layout'
import response, { ITableData } from 'utils/demo/tableData'
import { ChatIcon, CartIcon, MoneyIcon, PeopleIcon } from 'icons'
import dynamic from 'next/dynamic';
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


interface FlourishChartProps {
  src: string;
  title?: string;
  className?: string;
}


// const FlourishChart = dynamic(() => import('example/components/FlourishChart'), {
//   ssr: false,
// });
// Update import path to go back 2 folders from current location
const FlourishChart = dynamic(() => import('../../components/FlourishChart'), {
  ssr: false,
});

type DemographicsFilterType =  'gender' | 'age' | 'mode';


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
    // Make sure to use the FULL path including "visualisation/" prefix
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

      <CTA />

      {/* <!-- Cards --> */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Total clients" value="6389">
          {/* @ts-ignore */}
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Account balance" value="$ 46,760.89">
          {/* @ts-ignore */}
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="New sales" value="376">
          {/* @ts-ignore */}
          <RoundIcon
            icon={CartIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Pending contacts" value="35">
          {/* @ts-ignore */}
          <RoundIcon
            icon={ChatIcon}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>
      </div>

      {/* <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Client</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Avatar
                      className="hidden mr-3 md:block"
                      src={user.avatar}
                      alt="User image"
                    />
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {user.job}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">$ {user.amount}</span>
                </TableCell>
                <TableCell>
                  <Badge type={user.status}>{user.status}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {new Date(user.date).toLocaleDateString()}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onPageChange}
          />
        </TableFooter>
      </TableContainer> */}
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
      <ChartCard title="Top Countries wtih Foreign Tourist Arrivals">
        <div className="relative w-full h-96">
          <FlourishChart 
            key="flourish-chart-top-countries-22473410" // Stable, descriptive key
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
          key="flourish-chart-monthly-arrivals-22595001" // Stable, descriptive key
          src="visualisation/22595001" 
          className="w-full h-full" 
        />
      </div>
    </ChartCard>
        <ChartCard title="Monthly Foreign Exchange Earnings in USD (in billions) in India">
      <div className="relative w-full h-96">
        <FlourishChart 
          key="flourish-chart-forex-earnings-22595129" // Stable, descriptive key
          src="visualisation/22595129" 
          className="w-full h-full" 
        />
      </div>
    </ChartCard>
         {/* Flourish Chart - full width with proper key prop */}
         <ChartCard title="Top Country Rankings Based on Foreign Tourist Arrivals">
          <div className="relative w-full h-96">
            <FlourishChart 
              key="flourish-chart-country-rankings-22592845" // Stable, descriptive key
              src="visualisation/22592845" 
              className="w-full h-full" 
            />
          </div>
        </ChartCard>
        <ChartCard title="Top State Rankings Based on Foreign Tourist Arrivals">
        <div className="relative w-full h-96">
          <FlourishChart 
            key="flourish-chart-state-rankings-22594604" // Stable, descriptive key
            src="visualisation/22594604" 
            className="w-full h-full" 
          />
        </div>
      </ChartCard>
      </div>
    </Layout>
  )
}

export default Dashboard