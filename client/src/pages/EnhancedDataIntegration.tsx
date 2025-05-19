import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertCircle,
  Database,
  FileSpreadsheet,
  ServerCrash,
  Settings,
  ArrowRight,
  BarChart4,
  Check,
  Clock,
  ExternalLink,
  Shield,
  ShieldCheck,
  Zap,
  Building,
  CreditCard,
  Landmark
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import DataSourceConnector from '@/components/integration/DataSourceConnector';
import ETLPipeline from '@/components/integration/ETLPipeline';

const EnhancedDataIntegration = () => {
  const [activeTab, setActiveTab] = useState('data-sources');
  const { toast } = useToast();

  // Get user data
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ['/api/user'],
    queryFn: async () => {
      const response = await fetch('/api/user');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      return response.json();
    }
  });

  // Integration stats
  const integrationStats = [
    { name: 'Connected Sources', value: '4', change: '+1', period: 'last 30 days' },
    { name: 'Active Pipelines', value: '3', change: '+1', period: 'last 30 days' },
    { name: 'Records Processed', value: '125,432', change: '+23%', period: 'last 30 days' },
    { name: 'Data Synced', value: '482 MB', change: '+15%', period: 'last 30 days' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Data Integration Hub</h1>
        <p className="text-neutral-600">
          Connect, transform, and sync your financial data across systems
        </p>
      </div>

      {/* Integration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {integrationStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div>
                  {index === 0 && <Database className="h-5 w-5 text-blue-500" />}
                  {index === 1 && <Zap className="h-5 w-5 text-purple-500" />}
                  {index === 2 && <BarChart4 className="h-5 w-5 text-green-500" />}
                  {index === 3 && <FileSpreadsheet className="h-5 w-5 text-amber-500" />}
                </div>
              </div>
              <div className="mt-2 text-xs font-medium text-green-600">
                {stat.change} {stat.period}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="data-sources" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Data Sources</span>
          </TabsTrigger>
          <TabsTrigger value="etl-pipelines" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span>ETL Pipelines</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Security & Compliance</span>
          </TabsTrigger>
        </TabsList>

        {/* Data Sources Tab */}
        <TabsContent value="data-sources" className="mt-6">
          <DataSourceConnector 
            onConnect={(source, credentials) => {
              console.log('Connecting source', source, 'with credentials', credentials);
              return Promise.resolve(true);
            }}
            onDisconnect={(sourceId) => {
              console.log('Disconnecting source', sourceId);
              return Promise.resolve(true);
            }}
            onTestConnection={(sourceId) => {
              console.log('Testing connection for source', sourceId);
              return Promise.resolve(true);
            }}
            onSyncNow={(sourceId) => {
              console.log('Syncing data for source', sourceId);
              return Promise.resolve(true);
            }}
          />
        </TabsContent>

        {/* ETL Pipelines Tab */}
        <TabsContent value="etl-pipelines" className="mt-6">
          <ETLPipeline 
            onCreatePipeline={(pipeline) => {
              console.log('Creating pipeline', pipeline);
              return Promise.resolve({
                ...pipeline,
                id: `pipeline-${Date.now()}`,
                createdAt: new Date(),
                updatedAt: new Date()
              });
            }}
            onUpdatePipeline={(pipelineId, updates) => {
              console.log('Updating pipeline', pipelineId, 'with', updates);
              return Promise.resolve({
                ...updates,
                id: pipelineId,
                updatedAt: new Date()
              } as any);
            }}
            onDeletePipeline={(pipelineId) => {
              console.log('Deleting pipeline', pipelineId);
              return Promise.resolve(true);
            }}
            onRunPipeline={(pipelineId) => {
              console.log('Running pipeline', pipelineId);
              return Promise.resolve(true);
            }}
            onPausePipeline={(pipelineId) => {
              console.log('Pausing pipeline', pipelineId);
              return Promise.resolve(true);
            }}
            onResumePipeline={(pipelineId) => {
              console.log('Resuming pipeline', pipelineId);
              return Promise.resolve(true);
            }}
          />
        </TabsContent>

        {/* Security & Compliance Tab */}
        <TabsContent value="security" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Security & Compliance</CardTitle>
                  <CardDescription>
                    Overview of data security, access controls, and compliance features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 p-2 rounded-full">
                        <ShieldCheck className="h-6 w-6 text-green-700" />
                      </div>
                      <div>
                        <h3 className="font-medium">Data Encryption</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          All data is encrypted both in transit and at rest using industry-standard AES-256 encryption.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 p-2 rounded-full">
                        <ShieldCheck className="h-6 w-6 text-green-700" />
                      </div>
                      <div>
                        <h3 className="font-medium">Access Controls</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Role-based access controls ensure users can only access data they're authorized to see.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 p-2 rounded-full">
                        <ShieldCheck className="h-6 w-6 text-green-700" />
                      </div>
                      <div>
                        <h3 className="font-medium">Audit Trail</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Comprehensive audit logging tracks all data access, modifications, and synchronization events.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <Clock className="h-6 w-6 text-amber-700" />
                      </div>
                      <div>
                        <h3 className="font-medium">Data Retention</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Configurable data retention policies to comply with regulatory requirements and internal policies.
                        </p>
                        <Badge variant="outline" className="mt-2">Policy: 7 years</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="font-medium mb-4">Compliance Certifications</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="border rounded-md p-3 text-center">
                        <div className="font-medium">SOC 2</div>
                        <div className="text-xs text-muted-foreground mt-1">Type II Certified</div>
                      </div>
                      <div className="border rounded-md p-3 text-center">
                        <div className="font-medium">GDPR</div>
                        <div className="text-xs text-muted-foreground mt-1">Compliant</div>
                      </div>
                      <div className="border rounded-md p-3 text-center">
                        <div className="font-medium">HIPAA</div>
                        <div className="text-xs text-muted-foreground mt-1">Compliant</div>
                      </div>
                      <div className="border rounded-md p-3 text-center">
                        <div className="font-medium">ISO 27001</div>
                        <div className="text-xs text-muted-foreground mt-1">Certified</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Data Privacy Controls</CardTitle>
                  <CardDescription>
                    Configure data handling policies and consent management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="data-masking">
                      <AccordionTrigger>Data Masking & Anonymization</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Configure how sensitive data is masked or anonymized when synced across systems.
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center py-2 border-b">
                            <div>
                              <div className="font-medium">Personal Identifiable Information (PII)</div>
                              <div className="text-xs text-muted-foreground">Names, addresses, phone numbers</div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">Masked</Badge>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <div>
                              <div className="font-medium">Financial Data</div>
                              <div className="text-xs text-muted-foreground">Account numbers, transaction IDs</div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">Masked</Badge>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <div>
                              <div className="font-medium">Health Information</div>
                              <div className="text-xs text-muted-foreground">Medical records, conditions</div>
                            </div>
                            <Badge className="bg-purple-100 text-purple-800">Anonymized</Badge>
                          </div>
                          
                          <div className="flex justify-between items-center py-2">
                            <div>
                              <div className="font-medium">Geographic Data</div>
                              <div className="text-xs text-muted-foreground">Precise location data</div>
                            </div>
                            <Badge className="bg-gray-100 text-gray-800">Truncated</Badge>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="consent-management">
                      <AccordionTrigger>Consent Management</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Track and manage data sharing consents and preferences.
                        </p>
                        <div className="space-y-4">
                          <div className="p-3 bg-muted/30 rounded-md">
                            <div className="font-medium">Default Data Sharing Policy</div>
                            <p className="text-sm mt-1">
                              Data is only shared with explicitly authorized systems and services
                            </p>
                          </div>
                          
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Consent Required</AlertTitle>
                            <AlertDescription>
                              User consent is required before sharing data with third-party systems
                            </AlertDescription>
                          </Alert>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="audit-logging">
                      <AccordionTrigger>Audit Logging</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Configure detailed audit logging for compliance and security monitoring.
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center py-2 border-b">
                            <div className="font-medium">Data Access Events</div>
                            <Badge variant="outline" className="bg-green-50">Enabled</Badge>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <div className="font-medium">Data Modification Events</div>
                            <Badge variant="outline" className="bg-green-50">Enabled</Badge>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <div className="font-medium">Authentication Events</div>
                            <Badge variant="outline" className="bg-green-50">Enabled</Badge>
                          </div>
                          
                          <div className="flex justify-between items-center py-2">
                            <div className="font-medium">System Configuration Changes</div>
                            <Badge variant="outline" className="bg-green-50">Enabled</Badge>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Button variant="outline" size="sm">
                            View Audit Logs
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Connected Systems</CardTitle>
                  <CardDescription>
                    Security overview of connected systems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-1 rounded">
                            <Building className="h-5 w-5 text-blue-700" />
                          </div>
                          <div className="ml-2 font-medium">QuickBooks Online</div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Secure</Badge>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        OAuth 2.0 authentication with scoped permissions
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          View Permissions
                        </Button>
                        <div className="text-xs text-muted-foreground">
                          Last verified: Today
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-green-100 p-1 rounded">
                            <Landmark className="h-5 w-5 text-green-700" />
                          </div>
                          <div className="ml-2 font-medium">Banking API</div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Secure</Badge>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Encrypted API keys with read-only access
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          View Permissions
                        </Button>
                        <div className="text-xs text-muted-foreground">
                          Last verified: 2 days ago
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-purple-100 p-1 rounded">
                            <CreditCard className="h-5 w-5 text-purple-700" />
                          </div>
                          <div className="ml-2 font-medium">Xero</div>
                        </div>
                        <Badge className="bg-amber-100 text-amber-800">Review</Badge>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        OAuth token requires refresh
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Refresh Token
                        </Button>
                        <div className="text-xs text-muted-foreground">
                          Last verified: 45 days ago
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Run Security Audit
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Data Compliance Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-full p-1 mr-2">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <span>Data encryption in transit</span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-full p-1 mr-2">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <span>Data encryption at rest</span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-full p-1 mr-2">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <span>Secure credential storage</span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-full p-1 mr-2">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <span>Limited data access controls</span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-full p-1 mr-2">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <span>Audit logging enabled</span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-amber-100 rounded-full p-1 mr-2">
                        <Clock className="h-4 w-4 text-amber-600" />
                      </div>
                      <span>Data retention policies</span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-amber-100 rounded-full p-1 mr-2">
                        <Clock className="h-4 w-4 text-amber-600" />
                      </div>
                      <span>Third-party risk assessment</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure Security Settings
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedDataIntegration;