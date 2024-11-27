import React from 'react';
import { Button } from "@/components/ui/button"
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: '#112233',
    paddingBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#112233'
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666666'
  },
  section: {
    margin: 10,
    padding: 10
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#112233'
  },
  content: {
    fontSize: 12,
    marginBottom: 5,
    color: '#444444'
  },
  status: {
    fontSize: 12,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  statusOk: {
    color: '#22C55E'
  },
  statusWarning: {
    color: '#F59E0B'
  },
  statusError: {
    color: '#EF4444'
  },
  recommendationList: {
    marginTop: 10,
    paddingLeft: 15
  },
  recommendation: {
    fontSize: 12,
    marginBottom: 5,
    color: '#444444'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#666666',
    fontSize: 10,
    borderTop: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 10
  }
});

interface Analysis {
  infrastructure: { status: string; details: string };
  security: { status: string; details: string };
  network: { status: string; details: string };
}

interface ReportGeneratorProps {
  clientInfo: { name: string; ip: string };
  analysis: Analysis;
  recommendations: string[];
}

const PDFReport: React.FC<ReportGeneratorProps> = ({ clientInfo, analysis, recommendations }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>AmazonTI Diagnostic Report</Text>
        <Text style={styles.subtitle}>Client: {clientInfo.name}</Text>
        <Text style={styles.subtitle}>IP Address: {clientInfo.ip}</Text>
        <Text style={styles.subtitle}>Date: {new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Infrastructure Analysis</Text>
        <Text style={[
          styles.status,
          analysis.infrastructure.status === 'ok' ? styles.statusOk : styles.statusWarning
        ]}>
          Status: {analysis.infrastructure.status.toUpperCase()}
        </Text>
        <Text style={styles.content}>Details: {analysis.infrastructure.details}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security Analysis</Text>
        <Text style={[
          styles.status,
          analysis.security.status === 'ok' ? styles.statusOk : styles.statusWarning
        ]}>
          Status: {analysis.security.status.toUpperCase()}
        </Text>
        <Text style={styles.content}>Details: {analysis.security.details}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Network Analysis</Text>
        <Text style={[
          styles.status,
          analysis.network.status === 'ok' ? styles.statusOk : styles.statusWarning
        ]}>
          Status: {analysis.network.status.toUpperCase()}
        </Text>
        <Text style={styles.content}>Details: {analysis.network.details}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI-Powered Recommendations</Text>
        <View style={styles.recommendationList}>
          {recommendations.map((recommendation, index) => (
            <Text key={index} style={styles.recommendation}>
              • {recommendation}
            </Text>
          ))}
        </View>
      </View>

      <Text style={styles.footer}>
        This report was generated automatically by AmazonTI Diagnostic System.
        For support, please contact support@amazonti.com
      </Text>
    </Page>
  </Document>
);

export const ReportGenerator: React.FC<ReportGeneratorProps> = (props) => {
  return (
    <PDFDownloadLink
      document={<PDFReport {...props} />}
      fileName={`amazonti-diagnostic-report-${props.clientInfo.name.toLowerCase().replace(/\s+/g, '-')}.pdf`}
    >
      {({ loading }) => (
        <Button disabled={loading} className="btn-gradient">
          {loading ? 'Generating report...' : 'Download PDF Report'}
        </Button>
      )}
    </PDFDownloadLink>
  );
};