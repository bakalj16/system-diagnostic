// Definimos la interfaz para el objeto de análisis
export interface Analysis {
    infrastructure: {
      status: string;
      details: string;
      cpuUsage: number;
      memoryUsage: number;
    };
    security: {
      status: string;
      details: string;
    };
    network: {
      status: string;
      details: string;
      traffic: number;
    };
  }
  
  // Función para iniciar el escaneo
  export async function startScan(ip: string): Promise<Analysis> {
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data.analysis;
    } catch (error) {
      console.error('Error during scan:', error);
      throw error;
    }
  }
  
  // Función para obtener recomendaciones basadas en el análisis
  export async function getRecommendations(analysis: Analysis): Promise<string[]> {
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ analysis }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data.recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  }
  
  // Función para crear un ticket en el sistema de gestión de proyectos
  export async function createTicket(issue: { title: string; description: string; priority: string }): Promise<string> {
    try {
      const response = await fetch('/api/create-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(issue),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data.ticketId;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  }
  
  // Función para obtener datos históricos para análisis predictivo
  export async function getHistoricalData(clientId: string): Promise<any[]> {
    try {
      const response = await fetch(`/api/historical-data/${clientId}`);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data.historicalData;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }
  
  // Función para obtener logs
  export async function getLogs(ip: string): Promise<string[]> {
    try {
      const response = await fetch(`/api/logs/${ip}`);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data.logs;
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }
  }