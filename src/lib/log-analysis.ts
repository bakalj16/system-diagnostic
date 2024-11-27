import { Client } from '@elastic/elasticsearch'

// Definir la estructura de un log
interface Log {
  timestamp: string;
  level: string;
  message: string;
  service: string;
}

// Definir la estructura del resultado del análisis
interface LogAnalysisResult {
  totalLogs: number;
  errorCount: number;
  errorTypes: { key: string; doc_count: number }[];
  topServices: { key: string; doc_count: number }[];
  timeDistribution: { key_as_string: string; doc_count: number }[];
}

export async function analyzeLogs(logs: Log[]): Promise<LogAnalysisResult> {
  // En un escenario real, conectaríamos con Elasticsearch
  // const client = new Client({ node: process.env.ELASTICSEARCH_URL })

  // Simulamos el análisis de logs
  const totalLogs = logs.length;
  const errorLogs = logs.filter(log => log.level === 'ERROR');
  const errorCount = errorLogs.length;

  // Contar tipos de errores
  const errorTypes = errorLogs.reduce((acc, log) => {
    const errorType = log.message.split(':')[0];
    acc[errorType] = (acc[errorType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Contar servicios
  const services = logs.reduce((acc, log) => {
    acc[log.service] = (acc[log.service] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Distribución de tiempo (simulada)
  const timeDistribution = Array.from({ length: 24 }, (_, i) => ({
    key_as_string: `${i}:00`,
    doc_count: Math.floor(Math.random() * 100)
  }));

  return {
    totalLogs,
    errorCount,
    errorTypes: Object.entries(errorTypes).map(([key, doc_count]) => ({ key, doc_count })),
    topServices: Object.entries(services)
      .map(([key, doc_count]) => ({ key, doc_count }))
      .sort((a, b) => b.doc_count - a.doc_count)
      .slice(0, 5),
    timeDistribution
  };
}

// Función para generar logs de prueba
export function generateTestLogs(count: number): Log[] {
  const services = ['web-server', 'database', 'auth-service', 'api-gateway', 'cache-service'];
  const levels = ['INFO', 'WARN', 'ERROR'];
  const errorMessages = [
    'Connection refused',
    'Timeout exceeded',
    'Invalid input',
    'Resource not found',
    'Internal server error'
  ];

  return Array.from({ length: count }, () => ({
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(),
    level: levels[Math.floor(Math.random() * levels.length)],
    message: levels[Math.floor(Math.random() * levels.length)] === 'ERROR'
      ? errorMessages[Math.floor(Math.random() * errorMessages.length)]
      : 'Operation completed successfully',
    service: services[Math.floor(Math.random() * services.length)]
  }));
}