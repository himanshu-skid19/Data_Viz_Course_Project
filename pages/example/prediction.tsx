// pages/tourism-predictions.tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import Layout from 'example/containers/Layout';
import PageTitle from 'example/components/Typography/PageTitle';
import ChartCard from 'example/components/Chart/ChartCard';
import FlourishChart from '../../components/FlourishChart';

const TourismPredictionsPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'methodology' | 'forecast'>('overview');
  const [chartKey, setChartKey] = useState(Date.now());
  
  // Force reload Flourish charts when tab changes
  useEffect(() => {
    // Reset chart key to force re-render
    setChartKey(Date.now());
    
    // Force reload if window.Flourish exists
    if (typeof window !== 'undefined' && window.Flourish) {
      setTimeout(() => {
        if (typeof window.Flourish.reload === 'function') {
          window.Flourish.reload();
        }
      }, 300);
    }
  }, [activeTab]);
  
  return (
    <Layout>
      <Head>
        <title>Tourism Revenue Forecast Model | India Tourism Analysis</title>
        <meta name="description" content="Predictive model for Foreign Exchange Earnings (FEE) from tourism in India, including COVID-19 impact analysis and future projections." />
      </Head>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-fade-in-down">
          <PageTitle>Tourism Revenue Forecast Model</PageTitle>
          <p className="text-xl text-gray-600 text-center mb-8">
            Analyzing and predicting India's Foreign Exchange Earnings (FEE) from tourism
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 rounded-xl bg-blue-100 p-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'methodology', label: 'Methodology' },
              { id: 'forecast', label: 'Forecast Results' }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => setActiveTab(tab.id as any)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-semibold text-blue-700 mb-4">Tourism FEE Analysis & Forecasting</h2>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  This interactive dashboard presents a comprehensive analysis of India's Foreign Exchange Earnings (FEE) 
                  from tourism, highlighting the significant impact of COVID-19 and providing data-driven forecasts for future recovery and growth.
                </p>
                <p className="text-gray-700 mb-4">
                  Our analysis reveals that the tourism sector experienced steady growth from 2001 to 2019, followed by a dramatic 
                  decline during the COVID-19 pandemic years (2020-2021), and shows strong signs of recovery starting in 2022.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Pre-COVID Growth</h3>
                  <p className="text-gray-700">Consistent annual growth averaging 14-16% from 2001-2019, reaching ₹216,467 crores in 2019.</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">COVID-19 Impact</h3>
                  <p className="text-gray-700">55.8% drop in 2020 followed by further 33.2% decline in 2021, reaching a low of ₹63,978 crores.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Recovery Trajectory</h3>
                  <p className="text-gray-700">Strong 165.6% rebound in 2022, with projections showing complete recovery by 2024-2025.</p>
                </div>
              </div>

              {/* Tourism Overview Chart */}
              {/* <ChartCard title="Tourism FEE Growth and Forecast (2001-2028)">
                <div className="chart-container" style={{ height: "500px" }}>
                  <FlourishChart 
                    key={`overview-chart-${chartKey}`}
                    src="visualisation/22985122"
                    title="Tourism Revenue Forecast"
                  />
                </div>
                <div className="text-xs text-gray-500 italic text-center mt-2">
                  Source: Ministry of Tourism, Government of India. Visualization powered by Flourish.
                </div>
              </ChartCard> */}
            </div>
          )}

          {/* Methodology Tab */}
          {activeTab === 'methodology' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-semibold text-blue-700 mb-4">Forecasting Methodology</h2>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Our forecasting approach uses multiple time series models carefully adjusted to handle the COVID-19 
                  anomaly. By using pre-COVID data to establish baseline trends and combining different modeling 
                  techniques, we produce robust predictions that account for both historical patterns and recent recovery trends.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4 mb-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">COVID-19 Anomaly Handling</h3>
                <p className="text-gray-700 mb-3">
                  The COVID-19 pandemic created a significant anomaly in tourism data. To generate accurate forecasts, 
                  we implemented several strategies:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li>Using pre-COVID data (2001-2019) to train baseline models</li>
                  <li>Implementing linear interpolation across the COVID period</li>
                  <li>Applying weighted averaging that favors recent recovery patterns</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Models Employed</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-blue-800 font-medium">1</span>
                      </div>
                      <div>
                        <span className="font-medium">ARIMA Model:</span> Time series forecasting that captures autoregressive trends and moving averages
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-blue-800 font-medium">2</span>
                      </div>
                      <div>
                        <span className="font-medium">Exponential Smoothing:</span> Multiplicative trend model that captures accelerating growth patterns
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-blue-800 font-medium">3</span>
                      </div>
                      <div>
                        <span className="font-medium">Polynomial Regression:</span> Captures non-linear growth patterns and recovery curves
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-blue-800 font-medium">4</span>
                      </div>
                      <div>
                        <span className="font-medium">Weighted Ensemble:</span> Combines all models with optimized weights based on performance
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Evaluation Metrics</h3>
                  <p className="text-gray-700 mb-3">
                    Models were evaluated using a combination of statistical measures and business relevance:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <div><span className="font-medium">RMSE</span> (Root Mean Square Error)</div>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <div><span className="font-medium">MAE</span> (Mean Absolute Error)</div>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <div><span className="font-medium">CAGR</span> consistency with historical patterns</div>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <div><span className="font-medium">Recovery trajectory</span> validation with recent data</div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 p-5 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Technical Implementation</h3>
                <p className="text-gray-700 mb-3">
                  The forecasting models were implemented using Python with the following libraries:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="bg-white py-2 px-3 rounded text-center text-sm font-medium text-gray-700">
                    Pandas
                  </div>
                  <div className="bg-white py-2 px-3 rounded text-center text-sm font-medium text-gray-700">
                    NumPy
                  </div>
                  <div className="bg-white py-2 px-3 rounded text-center text-sm font-medium text-gray-700">
                    Statsmodels
                  </div>
                  <div className="bg-white py-2 px-3 rounded text-center text-sm font-medium text-gray-700">
                    Scikit-learn
                  </div>
                  <div className="bg-white py-2 px-3 rounded text-center text-sm font-medium text-gray-700">
                    Matplotlib
                  </div>
                  <div className="bg-white py-2 px-3 rounded text-center text-sm font-medium text-gray-700">
                    Seaborn
                  </div>
                  <div className="bg-white py-2 px-3 rounded text-center text-sm font-medium text-gray-700">
                    Plotly
                  </div>
                  <div className="bg-white py-2 px-3 rounded text-center text-sm font-medium text-gray-700">
                    Flourish
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Forecast Results Tab */}
          {activeTab === 'forecast' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-semibold text-blue-700 mb-4">Forecast Results (2024-2028)</h2>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Our ensemble model projects a robust recovery trajectory for India's tourism Foreign Exchange Earnings (FEE),
                  forecasting a return to pre-pandemic levels by 2024, followed by continued growth through 2028.
                </p>
              </div>

              {/* Tourism Forecast Chart 1 */}
              <ChartCard title="FEE Growth and Forecast Trends">
                <div className="chart-container" style={{ height: "400px", marginBottom: "2rem" }}>
                  <FlourishChart 
                    key={`forecast-chart1-${chartKey}`}
                    src="visualisation/22985122"
                    title="Tourism Revenue Forecast"
                  />
                </div>
              </ChartCard>

              {/* Tourism Forecast Chart 2 */}
              <ChartCard title="Annual Tourism Growth Rate">
                <div className="chart-container" style={{ height: "400px", marginBottom: "2rem" }}>
                  <FlourishChart 
                    key={`forecast-chart2-${chartKey}`}
                    src="visualisation/22984925"
                    title="Tourism Growth Rate Analysis"
                  />
                </div>
              </ChartCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 p-5 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Key Insights</h3>
                  <ul className="space-y-2 ml-1">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                      <div className="text-gray-700">Full recovery to pre-COVID levels achieved by 2024</div>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                      <div className="text-gray-700">Projected CAGR of 32.7% for 2024-2028 period</div>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                      <div className="text-gray-700">2028 forecast is 4.3x the pre-COVID peak value</div>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                      <div className="text-gray-700">Growth rate accelerates in later forecast years</div>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-5 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Confidence Analysis</h3>
                  <p className="text-gray-700 mb-3">
                    The confidence in our forecasts varies by time horizon:
                  </p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Short-term (2024-2025)</span>
                        <span className="text-sm font-medium text-gray-700">High Confidence</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Medium-term (2026-2027)</span>
                        <span className="text-sm font-medium text-gray-700">Moderate Confidence</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Long-term (2028)</span>
                        <span className="text-sm font-medium text-gray-700">Lower Confidence</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">External Factors Affecting Forecast</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-base font-medium text-gray-700 mb-2">Upside Potential</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                      <li>Government initiatives to boost tourism</li>
                      <li>Infrastructure improvements</li>
                      <li>Increasing global travel appetite</li>
                      <li>Growth in high-spending international tourists</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-gray-700 mb-2">Downside Risks</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                      <li>New pandemic-like disruptions</li>
                      <li>Global economic downturns</li>
                      <li>Geopolitical instability</li>
                      <li>Environmental challenges</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-100 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2025 Tourism Analysis Project. All data sourced from Ministry of Tourism, Government of India.</p>
          <p className="mt-2">Created as part of Data Visualization Course Project.</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-down {
          animation: fadeInDown 0.5s ease-in-out;
        }
        
        .chart-container {
          width: 100%;
          min-height: 400px;
          position: relative;
        }
      `}</style>
    </Layout>
  );
};

export default TourismPredictionsPage;