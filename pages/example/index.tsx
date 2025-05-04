import React, { useState } from 'react'
import dynamic from 'next/dynamic'

import CTA from 'example/components/CTA'
import ChartCard from 'example/components/Chart/ChartCard'
import PageTitle from 'example/components/Typography/PageTitle'
import Layout from 'example/containers/Layout'

// Import Chart.js registration code
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

// Dynamically import components
const BootstrapCarousel = dynamic(() => import('../../components/BootstrapCarousel'), {
  ssr: false,
})

// Import our new iframe-based chart component
import IframeFlourishChart from '../../components/FlourishChart'

// Type definitions
type DemographicsFilterType = 'gender' | 'age' | 'mode';

function Dashboard() {
  // Register Chart.js components
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

  // State variables
  const [demographicsFilter, setDemographicsFilter] = useState<DemographicsFilterType>('gender');

  // Visualization mapping
  const visualizationIds: Record<DemographicsFilterType, string> = {
    gender: '22596350',
    age: '22596141',
    mode: '22596471',
  };

  // Chart titles
  const chartTitles: Record<DemographicsFilterType, string> = {
    gender: 'Gender Distribution of Foreign Tourists',
    age: 'Age Wise Distribution of Tourist Arrivals',
    mode: 'Distribution of Tourists based on Mode of Travel',
  };

  return (
    <Layout>
      <PageTitle>Tourism Analysis Dashboard</PageTitle>

      {/* Bootstrap Carousel */}
      <div className="mb-8">
        <BootstrapCarousel />
      </div>

      <CTA />

      <PageTitle>Demographics Analysis</PageTitle>
      
      {/* Filter tabs */}
      <div className="flex flex-wrap mb-4 border-b">
        <button
          className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
            demographicsFilter === 'gender'
              ? 'bg-purple-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => setDemographicsFilter('gender')}
        >
          Gender Distribution
        </button>
        
        <button
          className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
            demographicsFilter === 'age'
              ? 'bg-purple-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => setDemographicsFilter('age')}
        >
          Age Distribution
        </button>
        
        <button
          className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
            demographicsFilter === 'mode'
              ? 'bg-purple-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => setDemographicsFilter('mode')}
        >
          Mode of Travel
        </button>
      </div>

      {/* Only render the currently selected visualization */}
      <ChartCard title={chartTitles[demographicsFilter]}>
        <div className="relative w-full h-96">
          {/* Key includes the filter type and timestamp to force remount when filter changes */}
          <IframeFlourishChart 
            key={`chart-${demographicsFilter}-${Date.now()}`}
            src={visualizationIds[demographicsFilter]}
          />
        </div>
      </ChartCard>
      
      {/* Other Charts */}
      <ChartCard title="Top Countries with Foreign Tourist Arrivals">
        <div className="relative w-full h-96">
          <IframeFlourishChart 
            src="22473410" 
          />
        </div>
      </ChartCard>
      
      <PageTitle>Charts</PageTitle>
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard title="Monthly Tourist Arrivals in India">
          <div className="relative w-full h-96">
            <IframeFlourishChart 
              src="22595001" 
            />
          </div>
        </ChartCard>
        
        <ChartCard title="Monthly Foreign Exchange Earnings in USD (in billions)">
          <div className="relative w-full h-96">
            <IframeFlourishChart 
              src="22595129" 
            />
          </div>
        </ChartCard>
        
        <ChartCard title="Top Country Rankings Based on Foreign Tourist Arrivals">
          <div className="relative w-full h-96">
            <IframeFlourishChart 
              src="22592845" 
            />
          </div>
        </ChartCard>
        
        <ChartCard title="Top State Rankings Based on Foreign Tourist Arrivals">
          <div className="relative w-full h-96">
            <IframeFlourishChart 
              src="22594604" 
            />
          </div>
        </ChartCard>
      </div>
      
      <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
        Visit Details
      </button>
    </Layout>
  )
}

export default Dashboard;