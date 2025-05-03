import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

import CTA from 'example/components/CTA'
import ChartCard from 'example/components/Chart/ChartCard'
import PageTitle from 'example/components/Typography/PageTitle'
import Layout from 'example/containers/Layout'
import response, { ITableData } from 'utils/demo/tableData'

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

// Import FlourishChart directly since we've updated it
import FlourishChart from '../../components/FlourishChart'

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
  const [showChart, setShowChart] = useState(true);
  const [chartKey, setChartKey] = useState(Date.now());
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ITableData[]>([]);

  // Visualization mapping
  const visualizationIds: Record<DemographicsFilterType, string> = {
    gender: 'visualisation/22596350',
    age: 'visualisation/22596141',
    mode: 'visualisation/22596471',
  };

  // Chart titles
  const chartTitles: Record<DemographicsFilterType, string> = {
    gender: 'Gender Distribution of Foreign Tourists',
    age: 'Age Wise Distribution of Tourist Arrivals',
    mode: 'Distribution of Tourists based on Mode of Travel',
  };

  // Handle filter change with smooth transitions
  const handleDemographicsFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value as DemographicsFilterType;
    
    setShowChart(false);
    setTimeout(() => {
      setDemographicsFilter(newFilter);
      setChartKey(Date.now());
      setTimeout(() => {
        setShowChart(true);
      }, 300);
    }, 100);
  };

  // Pagination settings
  const resultsPerPage = 10;
  const totalResults = response.length;

  // Pagination change handler
  function onPageChange(p: number) {
    setPage(p);
  }

  // Monitor filter changes
  useEffect(() => {
    console.log("Filter changed to:", demographicsFilter);
    
    // Force reload if window.Flourish exists
    if (typeof window !== 'undefined' && window.Flourish) {
      setTimeout(() => {
        if (typeof window.Flourish.reload === 'function') {
          window.Flourish.reload();
        }
      }, 300);
    }
  }, [demographicsFilter]);

  // Update data on page change
  useEffect(() => {
    setData(response.slice((page - 1) * resultsPerPage, page * resultsPerPage));
  }, [page]);

  return (
    <Layout>
      <div className="dashboard-container">
        <PageTitle>Tourism Analysis Dashboard</PageTitle>

        {/* Bootstrap Carousel */}
        <div className="carousel-wrapper">
          <BootstrapCarousel />
        </div>

        <CTA />

        <PageTitle>Demographics Analysis</PageTitle>
        
        {/* Filter dropdown */}
        <div className="filter-container">
          <label className="filter-label">
            Select View:
          </label>
          <select
            className="filter-select"
            value={demographicsFilter}
            onChange={handleDemographicsFilterChange}
          >
            <option value="gender">Gender Distribution</option>
            <option value="age">Age Wise Distribution</option>
            <option value="mode">Distribution of Tourists by mode of travel</option>
          </select>
        </div>

        {/* Demographics charts with loading state */}
        {showChart ? (
          <ChartCard title={chartTitles[demographicsFilter]}>
            <div className="chart-container">
              <FlourishChart 
                key={`flourish-chart-${demographicsFilter}-${chartKey}`}
                src={visualizationIds[demographicsFilter]}
                title={chartTitles[demographicsFilter]}
              />
            </div>
          </ChartCard>
        ) : (
          <div className="chart-loader">
            <div className="text-center">
              <p>Loading chart...</p>
              <div className="spinner"></div>
            </div>
          </div>
        )}
        
        {/* Top Countries chart */}
        <ChartCard title="Top Countries with Foreign Tourist Arrivals">
          <div className="chart-container">
            <FlourishChart 
              key="flourish-chart-top-countries"
              src="visualisation/22473410" 
            />
          </div>
        </ChartCard>

        <PageTitle>Charts</PageTitle>
        
        {/* Grid of charts */}
        <div className="grid gap-6 mb-8 md:grid-cols-2">
          {/* Monthly Tourist Arrivals */}
          <ChartCard title="Monthly Tourist Arrivals in India">
            <div className="chart-container">
              <FlourishChart 
                key="flourish-chart-monthly-arrivals"
                src="visualisation/22595001" 
              />
            </div>
          </ChartCard>
          
          {/* Foreign Exchange Earnings */}
          <ChartCard title="Monthly Foreign Exchange Earnings in USD (in billions)">
            <div className="chart-container">
              <FlourishChart 
                key="flourish-chart-forex-earnings"
                src="visualisation/22595129" 
              />
            </div>
          </ChartCard>
          
          {/* Country Rankings */}
          <ChartCard title="Top Country Rankings Based on Foreign Tourist Arrivals">
            <div className="chart-container">
              <FlourishChart 
                key="flourish-chart-country-rankings"
                src="visualisation/22592845" 
              />
            </div>
          </ChartCard>
          
          {/* State Rankings */}
          <ChartCard title="Top State Rankings Based on Foreign Tourist Arrivals">
            <div className="chart-container">
              <FlourishChart 
                key="flourish-chart-state-rankings"
                src="visualisation/22594604" 
              />
            </div>
          </ChartCard>
        </div>
        
        <button className="detail-button">
          Visit Details
        </button>

        {/* Use styled-jsx for component-scoped styles */}
        <style jsx>{`
          .dashboard-container {
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
          }
          
          .carousel-wrapper {
            margin-bottom: 2rem;
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          
          .filter-container {
            margin-bottom: 1rem;
          }
          
          .filter-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
          }
          
          .filter-select {
            display: block;
            width: 100%;
            padding: 0.5rem;
            border-radius: 0.25rem;
            border: 1px solid rgba(0, 0, 0, 0.2);
            background-color: white;
          }
          
          .chart-container {
            position: relative;
            width: 100%;
            height: 400px;
            border-radius: 0.5rem;
            overflow: hidden;
            margin-bottom: 1.5rem;
          }
          
          .chart-loader {
            width: 100%;
            height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 1.5rem;
          }
          
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-left-color: #9333ea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-top: 1rem;
          }
          
          .detail-button {
            display: inline-block;
            padding: 0.5rem 1rem;
            background-color: #dc2626;
            color: white;
            border-radius: 0.25rem;
            font-weight: 500;
            transition: background-color 0.2s;
            border: none;
            cursor: pointer;
          }
          
          .detail-button:hover {
            background-color: #b91c1c;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          /* Dark mode styles */
          :global(.dark) .filter-select {
            background-color: #1a1c23;
            border-color: #4c4f52;
            color: #e5e7eb;
          }
          
          :global(.dark) .chart-loader {
            background-color: #1a1c23;
          }
          
          :global(.dark) .spinner {
            border-color: rgba(255, 255, 255, 0.1);
            border-left-color: #9333ea;
          }
        `}</style>
      </div>
    </Layout>
  );
}

export default Dashboard;