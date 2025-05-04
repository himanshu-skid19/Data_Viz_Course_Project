// pages/tourism-predictions.tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import Layout from 'example/containers/Layout';
import PageTitle from 'example/components/Typography/PageTitle';
import ChartCard from 'example/components/Chart/ChartCard';
import CTA from 'example/components/CTA';
import FlourishChart from '../../components/FlourishChart';
import { Card, CardBody } from '@roketid/windmill-react-ui';

const TourismPredictionsPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'methodology' | 'forecast'>('overview');
  const [chartKey, setChartKey] = useState(Date.now());
  
  // Force reload Flourish charts when tab changes
  useEffect(() => {
    // Reset chart key to force re-render
    setChartKey(Date.now());
  }, [activeTab]);
  
  return (
    <Layout>
      <Head>
        <title>Tourism Revenue Forecast Model | India Tourism Analysis</title>
        <meta name="description" content="Predictive model for Foreign Exchange Earnings (FEE) from tourism in India, including COVID-19 impact analysis and future projections." />
      </Head>

      <PageTitle>Tourism Revenue Forecast Model</PageTitle>
      <p className="text-xl text-gray-600 dark:text-gray-400 text-center mb-8">
        Analyzing and predicting India's Foreign Exchange Earnings (FEE) from tourism
      </p>

      {/* Tab Navigation - styled like the dashboard */}
      <div className="flex flex-wrap mb-4 border-b dark:border-gray-700">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white rounded-t-lg border-purple-600'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'methodology'
              ? 'bg-purple-600 text-white rounded-t-lg border-purple-600'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => setActiveTab('methodology')}
        >
          Methodology
        </button>
        
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'forecast'
              ? 'bg-purple-600 text-white rounded-t-lg border-purple-600'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => setActiveTab('forecast')}
        >
          Forecast Results
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          <Card className="mb-8 shadow-md">
            <CardBody>
              <h2 className="text-2xl font-semibold text-purple-600 dark:text-purple-400 mb-4">Tourism FEE Analysis & Forecasting</h2>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                This interactive dashboard presents a comprehensive analysis of India's Foreign Exchange Earnings (FEE) 
                from tourism, highlighting the significant impact of COVID-19 and providing data-driven forecasts for future recovery and growth.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Our analysis reveals that the tourism sector experienced steady growth from 2001 to 2019, followed by a dramatic 
                decline during the COVID-19 pandemic years (2020-2021), and shows strong signs of recovery starting in 2022.
              </p>
              
              <div className="grid gap-6 mb-6 md:grid-cols-3">
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">Pre-COVID Growth</h3>
                  <p className="text-gray-700 dark:text-gray-300">Consistent annual growth averaging 14-16% from 2001-2019, reaching ₹216,467 crores in 2019.</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">COVID-19 Impact</h3>
                  <p className="text-gray-700 dark:text-gray-300">55.8% drop in 2020 followed by further 33.2% decline in 2021, reaching a low of ₹63,978 crores.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">Recovery Trajectory</h3>
                  <p className="text-gray-700 dark:text-gray-300">Strong 165.6% rebound in 2022, with projections showing complete recovery by 2024-2025.</p>
                </div>
              </div>
            </CardBody>
          </Card>

          
        </>
      )}

      {/* Methodology Tab */}
      {activeTab === 'methodology' && (
        <Card className="mb-8 shadow-md">
          <CardBody>
            <h2 className="text-2xl font-semibold text-purple-600 dark:text-purple-400 mb-4">Forecasting Methodology</h2>
            
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our forecasting approach uses multiple time series models carefully adjusted to handle the COVID-19 
              anomaly. By using pre-COVID data to establish baseline trends and combining different modeling 
              techniques, we produce robust predictions that account for both historical patterns and recent recovery trends.
            </p>

            <div className="border-l-4 border-purple-500 pl-4 mb-6">
              <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-2">COVID-19 Anomaly Handling</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                The COVID-19 pandemic created a significant anomaly in tourism data. To generate accurate forecasts, 
                we implemented several strategies:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 ml-4">
                <li>Using pre-COVID data (2001-2019) to train baseline models</li>
                <li>Implementing linear interpolation across the COVID period</li>
                <li>Applying weighted averaging that favors recent recovery patterns</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Models Employed</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-purple-800 dark:text-purple-200 font-medium">1</span>
                    </div>
                    <div>
                      <span className="font-medium">ARIMA Model:</span> Time series forecasting that captures autoregressive trends and moving averages
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-purple-800 dark:text-purple-200 font-medium">2</span>
                    </div>
                    <div>
                      <span className="font-medium">Exponential Smoothing:</span> Multiplicative trend model that captures accelerating growth patterns
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-purple-800 dark:text-purple-200 font-medium">3</span>
                    </div>
                    <div>
                      <span className="font-medium">Polynomial Regression:</span> Captures non-linear growth patterns and recovery curves
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-purple-800 dark:text-purple-200 font-medium">4</span>
                    </div>
                    <div>
                      <span className="font-medium">Weighted Ensemble:</span> Combines all models with optimized weights based on performance
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Evaluation Metrics</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Models were evaluated using a combination of statistical measures and business relevance:
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-purple-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <div><span className="font-medium">RMSE</span> (Root Mean Square Error)</div>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-purple-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <div><span className="font-medium">MAE</span> (Mean Absolute Error)</div>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-purple-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <div><span className="font-medium">CAGR</span> consistency with historical patterns</div>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-purple-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <div><span className="font-medium">Recovery trajectory</span> validation with recent data</div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900 p-5 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Technical Implementation</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                The forecasting models were implemented using Python with the following libraries:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="bg-white dark:bg-gray-700 py-2 px-3 rounded text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  Pandas
                </div>
                <div className="bg-white dark:bg-gray-700 py-2 px-3 rounded text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  NumPy
                </div>
                <div className="bg-white dark:bg-gray-700 py-2 px-3 rounded text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  Statsmodels
                </div>
                <div className="bg-white dark:bg-gray-700 py-2 px-3 rounded text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  Scikit-learn
                </div>
                <div className="bg-white dark:bg-gray-700 py-2 px-3 rounded text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  Matplotlib
                </div>
                <div className="bg-white dark:bg-gray-700 py-2 px-3 rounded text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  Seaborn
                </div>
                <div className="bg-white dark:bg-gray-700 py-2 px-3 rounded text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  Plotly
                </div>
                <div className="bg-white dark:bg-gray-700 py-2 px-3 rounded text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  Flourish
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Forecast Results Tab */}
      {activeTab === 'forecast' && (
        <>
          <Card className="mb-8 shadow-md">
            <CardBody>
              <h2 className="text-2xl font-semibold text-purple-600 dark:text-purple-400 mb-4">Forecast Results (2024-2028)</h2>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Our ensemble model projects a robust recovery trajectory for India's tourism Foreign Exchange Earnings (FEE),
                forecasting a return to pre-pandemic levels by 2024, followed by continued growth through 2028.
              </p>
            </CardBody>
          </Card>

          {/* Tourism Forecast Chart 1 */}
          <ChartCard title="FEE Growth and Forecast Trends">
            <div className="relative w-full h-96">
              <FlourishChart 
                key={`forecast-chart1-${chartKey}`}
                src="22985122"
              />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 italic text-center mt-2">
              Source: Ministry of Tourism, Government of India. Visualization powered by Flourish.
            </div>
          </ChartCard>

          {/* Tourism Forecast Chart 2 */}
          <ChartCard title="Annual Tourism Growth Rate">
            <div className="relative w-full h-96">
              <FlourishChart 
                key={`forecast-chart2-${chartKey}`}
                src="22984925"
              />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 italic text-center mt-2">
              Source: Ministry of Tourism, Government of India. Visualization powered by Flourish.
            </div>
          </ChartCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">Key Insights</h3>
                <ul className="space-y-2 ml-1">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-purple-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="text-gray-700 dark:text-gray-300">Full recovery to pre-COVID levels achieved by 2024</div>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-purple-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="text-gray-700 dark:text-gray-300">Projected CAGR of 32.7% for 2024-2028 period</div>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-purple-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="text-gray-700 dark:text-gray-300">2028 forecast is 4.3x the pre-COVID peak value</div>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-purple-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="text-gray-700 dark:text-gray-300">Growth rate accelerates in later forecast years</div>
                  </li>
                </ul>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">Confidence Analysis</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  The confidence in our forecasts varies by time horizon:
                </p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Short-term (2024-2025)</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">High Confidence</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Medium-term (2026-2027)</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Moderate Confidence</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Long-term (2028)</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Lower Confidence</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <Card className="mb-8">
            <CardBody>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">External Factors Affecting Forecast</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Upside Potential</h4>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 ml-2">
                    <li>Government initiatives to boost tourism</li>
                    <li>Infrastructure improvements</li>
                    <li>Increasing global travel appetite</li>
                    <li>Growth in high-spending international tourists</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Downside Risks</h4>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 ml-2">
                    <li>New pandemic-like disruptions</li>
                    <li>Global economic downturns</li>
                    <li>Geopolitical instability</li>
                    <li>Environmental challenges</li>
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>
        </>
      )}

      <Card>
        <CardBody className="text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>© 2025 Tourism Analysis Project. All data sourced from Ministry of Tourism, Government of India.</p>
          <p className="mt-2">Created as part of Data Visualization Course Project.</p>
        </CardBody>
      </Card>
    </Layout>
  );
};

export default TourismPredictionsPage;