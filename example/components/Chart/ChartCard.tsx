import React, { ReactNode } from 'react'
import { Card, CardBody } from '@roketid/windmill-react-ui'

interface ChartCardProps {
  title: string
  children: ReactNode
}

function ChartCard({ title, children }: ChartCardProps) {
  return (
    <Card className="mb-8 shadow-md">
      <CardBody className="chart-card">
        <p className="mb-4 font-semibold text-gray-800 dark:text-gray-300">{title}</p>
        <div className="chart-container">
          {children}
        </div>
      </CardBody>
      
      {/* Add specific styles for chart containers */}
      <style jsx>{`
        .chart-card {
          padding: 1rem;
          overflow: hidden;
        }
        
        .chart-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
      `}</style>
    </Card>
  )
}

export default ChartCard