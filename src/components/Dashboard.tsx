'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2, Server, Shield, Wifi, Activity, BarChart2 } from 'lucide-react'
import { ReportGenerator } from './ReportGenerator'
import { NetworkVisualization } from './NetworkVisualization'
import { PerformanceChart } from './PerformanceChart'
import { startScan, getRecommendations, createTicket, getHistoricalData, getLogs } from '@/lib/api'
import { trainPredictiveModel, predictPerformance } from '@/lib/ml-model'
import { analyzeLogs, generateTestLogs } from '@/lib/log-analysis'

interface Analysis {
  infrastructure: { status: string; details: string; cpuUsage: number; memoryUsage: number };
  security: { status: string; details: string };
  network: { status: string; details: string; traffic: number };
}

interface LogAnalysis {
  totalLogs: number;
  errorCount: number;
  errorTypes: { key: string; doc_count: number }[];
}

export default function Dashboard() {
  const [scanStatus, setScanStatus] = useState('idle')
  const [clientInfo, setClientInfo] = useState({ name: '', ip: '' })
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [networkData, setNetworkData] = useState<{ nodes: any[]; links: any[] } | null>(null)
  const [predictiveModel, setPredictiveModel] = useState<any>(null)
  const [performancePrediction, setPerformancePrediction] = useState<number | null>(null)
  const [logAnalysis, setLogAnalysis] = useState<LogAnalysis | null>(null)
  const [historicalPerformance, setHistoricalPerformance] = useState<{ date: Date; score: number }[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simular datos de red para la visualización
    setNetworkData({
      nodes: [
        { id: 'Server', group: 1 },
        { id: 'Router', group: 2 },
        { id: 'Switch', group: 2 },
        { id: 'Client1', group: 3 },
        { id: 'Client2', group: 3 },
      ],
      links: [
        { source: 'Server', target: 'Router', value: 1 },
        { source: 'Router', target: 'Switch', value: 2 },
        { source: 'Switch', target: 'Client1', value: 1 },
        { source: 'Switch', target: 'Client2', value: 1 },
      ]
    })
  }, [])

  const startScanHandler = async () => {
    setScanStatus('scanning')
    setError(null)
    try {
      // Simular el análisis para propósitos de desarrollo
      const analysisResult: Analysis = {
        infrastructure: { 
          status: 'ok', 
          details: 'All systems operational', 
          cpuUsage: 45, 
          memoryUsage: 60 
        },
        security: { 
          status: 'warning', 
          details: 'Firewall rules need updating' 
        },
        network: { 
          status: 'ok', 
          details: 'Network throughput is optimal', 
          traffic: 75 
        }
      }
      setAnalysis(analysisResult)

      // Simular recomendaciones
      const recommendationsResult = [
        'Update firewall rules',
        'Optimize database queries',
        'Upgrade RAM on server 2'
      ]
      setRecommendations(recommendationsResult)

      // Simular datos históricos
      const historicalData = Array.from({length: 30}, (_, i) => ({
        timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        performanceScore: Math.random() * 100
      }))
      setHistoricalPerformance(historicalData.map(d => ({ date: new Date(d.timestamp), score: d.performanceScore })))

      // Simular modelo predictivo
      const model = { predict: (data: number[]) => Math.random() * 100 }
      setPredictiveModel(model)
      const currentData = [analysisResult.infrastructure.cpuUsage, analysisResult.infrastructure.memoryUsage, analysisResult.network.traffic]
      const prediction = model.predict(currentData)
      setPerformancePrediction(prediction)

      // Simular análisis de logs
      const logs = generateTestLogs(100)
      const logAnalysisResult = await analyzeLogs(logs)
      setLogAnalysis(logAnalysisResult)

      setScanStatus('complete')
    } catch (error) {
      console.error('Scan failed:', error)
      setScanStatus('error')
      setError('An error occurred during the scan. Please try again.')
    }
  }

  const createJiraTicket = async () => {
    try {
      const ticketId = await createTicket({
        title: `Infrastructure issues for ${clientInfo.name}`,
        description: `Analysis results: ${JSON.stringify(analysis)}\n\nRecommendations: ${recommendations.join('\n')}`,
        priority: 'High'
      })
      alert(`Jira ticket created with ID: ${ticketId}`)
    } catch (error) {
      console.error('Failed to create Jira ticket:', error)
      alert('Failed to create Jira ticket')
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <motion.h1 
        className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        AmazonTI Advanced Diagnostic System
      </motion.h1>
      <Card className="backdrop-blur-md bg-white/10">
        <CardHeader>
          <CardTitle className="text-2xl">Client Information</CardTitle>
          <CardDescription>Enter the client details to initiate the comprehensive diagnostic</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Client Name</Label>
              <Input 
                id="name" 
                placeholder="Enter client name"
                value={clientInfo.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientInfo({...clientInfo, name: e.target.value})}
                className="bg-white/20 border-white/30 text-white placeholder-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ip">IP Address</Label>
              <Input 
                id="ip" 
                placeholder="Enter IP address"
                value={clientInfo.ip}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientInfo({...clientInfo, ip: e.target.value})}
                className="bg-white/20 border-white/30 text-white placeholder-white/50"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={startScanHandler} 
            disabled={scanStatus === 'scanning'}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            {scanStatus === 'scanning' ? 'Scanning...' : 'Initiate Comprehensive Scan'}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Card className="bg-red-100 border-red-400 text-red-700 p-4 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </Card>
      )}

      {scanStatus === 'complete' && analysis && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs defaultValue="infrastructure" className="mt-8">
            <TabsList className="grid grid-cols-5 gap-4 bg-white/10 p-2 rounded-lg">
              <TabsTrigger value="infrastructure" className="data-[state=active]:bg-blue-500">
                <Server className="mr-2" />
                Infrastructure
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-blue-500">
                <Shield className="mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="network" className="data-[state=active]:bg-blue-500">
                <Wifi className="mr-2" />
                Network
              </TabsTrigger>
              <TabsTrigger value="predictive" className="data-[state=active]:bg-blue-500">
                <Activity className="mr-2" />
                Predictive Analysis
              </TabsTrigger>
              <TabsTrigger value="logs" className="data-[state=active]:bg-blue-500">
                <BarChart2 className="mr-2" />
                Log Analysis
              </TabsTrigger>
            </TabsList>
            <TabsContent value="infrastructure">
              <Card className="backdrop-blur-md bg-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Server className="mr-2" />
                    Infrastructure Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="flex items-center text-lg">
                    {analysis.infrastructure.status === 'ok' 
                      ? <CheckCircle2 className="mr-2 text-green-500" />
                      : <AlertCircle className="mr-2 text-yellow-500" />
                    }
                    {analysis.infrastructure.details}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="security">
              <Card className="backdrop-blur-md bg-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Shield className="mr-2" />
                    Security Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="flex items-center text-lg">
                    {analysis.security.status === 'ok' 
                      ? <CheckCircle2 className="mr-2 text-green-500" />
                      : <AlertCircle className="mr-2 text-red-500" />
                    }
                    {analysis.security.details}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="network">
              <Card className="backdrop-blur-md bg-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Wifi className="mr-2" />
                    Network Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="flex items-center text-lg mb-4">
                    {analysis.network.status === 'ok' 
                      ? <CheckCircle2 className="mr-2 text-green-500" />
                      : <AlertCircle className="mr-2 text-yellow-500" />
                    }
                    {analysis.network.details}
                  </p>
                  {networkData && <NetworkVisualization data={networkData} />}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="predictive">
              <Card className="backdrop-blur-md bg-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl">Predictive Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {performancePrediction !== null && (
                    <div className="space-y-4">
                      <p className="text-lg">Predicted performance score: {performancePrediction.toFixed(2)}</p>
                      <PerformanceChart data={historicalPerformance} prediction={performancePrediction} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="logs">
              <Card className="backdrop-blur-md bg-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl">Log Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {logAnalysis && (
                    <div className="space-y-4">
                      <p className="text-lg">Total logs analyzed: {logAnalysis.totalLogs}</p>
                      <p className="text-lg">Error count: {logAnalysis.errorCount}</p>
                      <h3 className="text-xl font-semibold mt-4">Top error types:</h3>
                      <ul className="list-disc pl-5">
                        {logAnalysis.errorTypes.map((error, index) => (
                          <li key={index} className="text-lg">{error.key}: {error.doc_count}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="mt-8 backdrop-blur-md bg-white/10">
            <CardHeader>
              <CardTitle className="text-2xl">AI-Powered Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {recommendations.map((recommendation, index) => (
                  <li key={index} className="text-lg">{recommendation}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="mt-8 flex space-x-4">
            <ReportGenerator clientInfo={clientInfo} analysis={analysis} recommendations={recommendations} />
            <Button onClick={createJiraTicket} className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300">
              Create Jira Ticket
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}