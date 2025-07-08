import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface CalculatorData {
  // Outbound leads
  monthlyOutboundLeads: number;
  outboundTicketSize: number;
  currentOutboundRate: number;
  aiOutboundRate: number;
  appointmentCloseRate: number;
  
  // Inbound calls
  averageMonthlyInbound: number;
  employeesHandlingCalls: number;
  averageSalary: number;
  hasAnsweringService: 'yes' | 'no';
  answeringServiceCost: number;
  missedCalls: number;
  averageInboundValue: number;
  currentInboundCallToAppt: number;
  aiInboundCallToAppt: number;
  inboundApptToCloseRate: number;
  
  // Pricing
  aiUpfrontCost: number;
  aiMonthlyCost: number;
}

interface CalculationResults {
  // Outbound results
  currentOutboundRevenue: number;
  aiOutboundRevenue: number;
  outboundImprovement: number;
  
  // Inbound results
  currentInboundRevenue: number;
  aiInboundRevenue: number;
  missedCallRecovery: number;
  inboundImprovement: number;
  
  // Cost analysis
  currentEmployeeCost: number;
  currentAnsweringCost: number;
  totalMonthlyIncrease: number;
  annualIncrease: number;
  roiPercent: number;
}

const initialData: CalculatorData = {
  monthlyOutboundLeads: 0,
  outboundTicketSize: 0,
  currentOutboundRate: 0,
  aiOutboundRate: 0,
  appointmentCloseRate: 0,
  averageMonthlyInbound: 0,
  employeesHandlingCalls: 0,
  averageSalary: 0,
  hasAnsweringService: 'no',
  answeringServiceCost: 0,
  missedCalls: 0,
  averageInboundValue: 0,
  currentInboundCallToAppt: 0,
  aiInboundCallToAppt: 0,
  inboundApptToCloseRate: 0,
  aiUpfrontCost: 0,
  aiMonthlyCost: 0,
};

export default function Calculator() {
  const [data, setData] = useState<CalculatorData>(initialData);
  const [results, setResults] = useState<CalculationResults>({
    currentOutboundRevenue: 0,
    aiOutboundRevenue: 0,
    outboundImprovement: 0,
    currentInboundRevenue: 0,
    aiInboundRevenue: 0,
    missedCallRecovery: 0,
    inboundImprovement: 0,
    currentEmployeeCost: 0,
    currentAnsweringCost: 0,
    totalMonthlyIncrease: 0,
    annualIncrease: 0,
    roiPercent: 0,
  });

  const updateData = (field: keyof CalculatorData, value: string | number) => {
    setData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    }));
  };

  useEffect(() => {
    calculateResults();
  }, [data]);

  const calculateResults = () => {
    try {
      // Calculate outbound performance
      const currentOutboundAppts = data.monthlyOutboundLeads * (data.currentOutboundRate / 100);
      const currentOutboundSales = currentOutboundAppts * (data.appointmentCloseRate / 100);
      const currentOutboundRevenue = currentOutboundSales * data.outboundTicketSize;
      
      const aiOutboundAppts = data.monthlyOutboundLeads * (data.aiOutboundRate / 100);
      const aiOutboundSales = aiOutboundAppts * (data.appointmentCloseRate / 100);
      const aiOutboundRevenue = aiOutboundSales * data.outboundTicketSize;
      
      const outboundImprovement = aiOutboundRevenue - currentOutboundRevenue;
      
      // Calculate inbound performance
      const currentInboundAppts = data.averageMonthlyInbound * (data.currentInboundCallToAppt / 100);
      const currentInboundSales = currentInboundAppts * (data.inboundApptToCloseRate / 100);
      const currentInboundRevenue = currentInboundSales * data.averageInboundValue;
      
      const currentEmployeeCost = data.employeesHandlingCalls * data.averageSalary;
      const currentAnsweringCost = data.hasAnsweringService === 'yes' ? data.answeringServiceCost : 0;
      const totalCurrentInboundCosts = currentEmployeeCost + currentAnsweringCost;
      
      const totalAiCalls = data.averageMonthlyInbound + data.missedCalls;
      const aiInboundAppointments = totalAiCalls * (data.aiInboundCallToAppt / 100);
      const aiInboundSales = aiInboundAppointments * (data.inboundApptToCloseRate / 100);
      const aiInboundRevenue = aiInboundSales * data.averageInboundValue;
      
      const missedCallRecovery = data.missedCalls * (data.aiInboundCallToAppt / 100) * (data.inboundApptToCloseRate / 100) * data.averageInboundValue;
      
      const inboundRevenueImprovement = aiInboundRevenue - currentInboundRevenue;
      const inboundCostSavings = totalCurrentInboundCosts - data.aiMonthlyCost;
      const totalInboundImprovement = inboundRevenueImprovement + inboundCostSavings;
      
      const totalMonthlyIncrease = outboundImprovement + totalInboundImprovement;
      const annualIncrease = totalMonthlyIncrease * 12;
      
      const totalInvestment = data.aiUpfrontCost + (data.aiMonthlyCost * 12);
      const netReturn = annualIncrease - totalInvestment;
      const roiPercent = totalInvestment > 0 ? (netReturn / totalInvestment) * 100 : 0;
      
      setResults({
        currentOutboundRevenue,
        aiOutboundRevenue,
        outboundImprovement,
        currentInboundRevenue,
        aiInboundRevenue,
        missedCallRecovery,
        inboundImprovement: totalInboundImprovement,
        currentEmployeeCost,
        currentAnsweringCost,
        totalMonthlyIncrease,
        annualIncrease,
        roiPercent,
      });
    } catch (error) {
      console.error('Calculation error:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(amount));
  };

  return (
    <div className="min-h-screen gradient-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="gradient-primary rounded-t-3xl p-8 text-center text-white shadow-neon">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white">AI Payback Estimator</h1>
          <p className="text-xl opacity-90 text-white">Calculate your return on AI automation investment</p>
        </div>
        
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-0 bg-card rounded-b-3xl shadow-neon overflow-hidden border border-card-border">
          {/* Inputs Section */}
          <div className="p-8 bg-secondary/20 border-r border-card-border overflow-y-auto max-h-[80vh]">
            
            {/* Outbound Section */}
            <Card className="p-6 mb-6 border-2 border-accent shadow-glow bg-card/80 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-center mb-6 pb-3 border-b-2 border-accent text-accent font-heading">
                📱 Outbound Leads (Webforms, FB/IG, Google Forms)
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="monthlyOutboundLeads">Monthly outbound leads</Label>
                  <Input
                    id="monthlyOutboundLeads"
                    type="number"
                    value={data.monthlyOutboundLeads}
                    onChange={(e) => updateData('monthlyOutboundLeads', e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">Total leads from ads, webforms, social media, etc.</p>
                </div>
                
                <div>
                  <Label htmlFor="outboundTicketSize">Average ticket size ($)</Label>
                  <Input
                    id="outboundTicketSize"
                    type="number"
                    value={data.outboundTicketSize}
                    onChange={(e) => updateData('outboundTicketSize', e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">Average revenue per outbound customer</p>
                </div>
                
                <div>
                  <Label htmlFor="currentOutboundRate">Current outbound lead to appointment rate (%)</Label>
                  <Input
                    id="currentOutboundRate"
                    type="number"
                    step="0.1"
                    value={data.currentOutboundRate}
                    onChange={(e) => updateData('currentOutboundRate', e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">What % of outbound leads currently book appointments</p>
                </div>
                
                <div>
                  <Label htmlFor="aiOutboundRate">AI lead to appointment rate outbound (%)</Label>
                  <Input
                    id="aiOutboundRate"
                    type="number"
                    step="0.1"
                    value={data.aiOutboundRate}
                    onChange={(e) => updateData('aiOutboundRate', e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">Expected % with AI instant response + follow-up</p>
                </div>
                
                <div>
                  <Label htmlFor="appointmentCloseRate">Appointment to close rate (%)</Label>
                  <Input
                    id="appointmentCloseRate"
                    type="number"
                    step="0.1"
                    value={data.appointmentCloseRate}
                    onChange={(e) => updateData('appointmentCloseRate', e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">% of appointments that become customers (stays same with AI)</p>
                </div>
              </div>
            </Card>
            
            {/* Inbound Section */}
            <Card className="p-6 mb-6 border-2 border-accent shadow-glow bg-card/80 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-center mb-6 pb-3 border-b-2 border-accent text-accent font-heading">
                📞 Inbound Calls
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="averageMonthlyInbound">Average monthly inbound calls</Label>
                  <Input
                    id="averageMonthlyInbound"
                    type="number"
                    value={data.averageMonthlyInbound}
                    onChange={(e) => updateData('averageMonthlyInbound', e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">People calling you directly</p>
                </div>
                
                <div>
                  <Label htmlFor="employeesHandlingCalls">Number of employees to handle those calls</Label>
                  <Input
                    id="employeesHandlingCalls"
                    type="number"
                    value={data.employeesHandlingCalls}
                    onChange={(e) => updateData('employeesHandlingCalls', e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">Full or part-time employees answering phones</p>
                </div>
                
                <div>
                  <Label htmlFor="averageSalary">Average salary of employees taking inbound calls (monthly)</Label>
                  <Input
                    id="averageSalary"
                    type="number"
                    value={data.averageSalary}
                    onChange={(e) => updateData('averageSalary', e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">Total monthly cost per employee (salary + benefits)</p>
                </div>
                
                <div>
                  <Label>Do you have an answering service?</Label>
                  <RadioGroup
                    value={data.hasAnsweringService}
                    onValueChange={(value: 'yes' | 'no') => updateData('hasAnsweringService', value)}
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="answering-yes" />
                      <Label htmlFor="answering-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="answering-no" />
                      <Label htmlFor="answering-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {data.hasAnsweringService === 'yes' && (
                  <div className="p-4 bg-accent/10 border-l-4 border-accent rounded">
                    <Label htmlFor="answeringServiceCost">Answering service cost (monthly)</Label>
                    <Input
                      id="answeringServiceCost"
                      type="number"
                      value={data.answeringServiceCost}
                      onChange={(e) => updateData('answeringServiceCost', e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">What you currently pay per month</p>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="missedCalls">Number of missed calls per month</Label>
                  <Input
                    id="missedCalls"
                    type="number"
                    value={data.missedCalls}
                    onChange={(e) => updateData('missedCalls', e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">Calls that go unanswered (after hours, busy, etc.)</p>
                </div>
                
                <div>
                  <Label htmlFor="averageInboundValue">Average value of inbound calls ($)</Label>
                  <Input
                    id="averageInboundValue"
                    type="number"
                    value={data.averageInboundValue}
                    onChange={(e) => updateData('averageInboundValue', e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">Average revenue per inbound customer</p>
                </div>
                
                <div>
                  <Label htmlFor="currentInboundCallToAppt">Current inbound call to appointment rate (%)</Label>
                  <Input
                    id="currentInboundCallToAppt"
                    type="number"
                    step="0.1"
                    value={data.currentInboundCallToAppt}
                    onChange={(e) => updateData('currentInboundCallToAppt', e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">What % of answered calls currently book appointments</p>
                </div>
                
                <div>
                  <Label htmlFor="aiInboundCallToAppt">AI inbound call to appointment rate (%)</Label>
                  <Input
                    id="aiInboundCallToAppt"
                    type="number"
                    step="0.1"
                    value={data.aiInboundCallToAppt}
                    onChange={(e) => updateData('aiInboundCallToAppt', e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">Expected % with AI 24/7 availability + qualification</p>
                </div>
                
                <div>
                  <Label htmlFor="inboundApptToCloseRate">Inbound appointment to close rate (%)</Label>
                  <Input
                    id="inboundApptToCloseRate"
                    type="number"
                    step="0.1"
                    value={data.inboundApptToCloseRate}
                    onChange={(e) => updateData('inboundApptToCloseRate', e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">% of inbound appointments that become customers (may differ from outbound)</p>
                </div>
              </div>
            </Card>
            
            {/* Pricing Section */}
            <Card className="p-6 border-2 border-accent shadow-glow bg-card/80 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-center mb-6 pb-3 border-b-2 border-accent text-accent font-heading">
                💰 AI Service Pricing
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="aiUpfrontCost">AI setup cost (upfront) ($)</Label>
                  <Input
                    id="aiUpfrontCost"
                    type="number"
                    value={data.aiUpfrontCost}
                    onChange={(e) => updateData('aiUpfrontCost', e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">One-time setup and development cost</p>
                </div>
                
                <div>
                  <Label htmlFor="aiMonthlyCost">AI monthly support cost ($)</Label>
                  <Input
                    id="aiMonthlyCost"
                    type="number"
                    value={data.aiMonthlyCost}
                    onChange={(e) => updateData('aiMonthlyCost', e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">Ongoing monthly support and maintenance</p>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Results Section */}
          <div className="p-8 overflow-y-auto max-h-[80vh] bg-card/50 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-6 text-primary font-heading">ROI Analysis</h3>
            
            {/* Key Metrics */}
            <div className="space-y-4 mb-8">
              <Card className="gradient-secondary text-white p-6 text-center shadow-neon border border-accent">
                <div className="text-3xl font-bold mb-2 font-heading text-white">{formatCurrency(results.totalMonthlyIncrease)}</div>
                <div className="text-lg opacity-90">Additional Monthly Revenue</div>
              </Card>
              
              <Card className="gradient-primary text-white p-6 text-center shadow-neon border border-primary">
                <div className="text-3xl font-bold mb-2 font-heading text-white">{formatCurrency(results.annualIncrease)}</div>
                <div className="text-lg opacity-90">Additional Yearly Revenue</div>
              </Card>
              
              <Card className="gradient-success text-white p-6 text-center shadow-neon border border-success">
                <div className="text-3xl font-bold mb-2 font-heading text-white">{Math.round(results.roiPercent)}%</div>
                <div className="text-lg opacity-90">12-Month ROI</div>
              </Card>
            </div>
            
            {/* Breakdown Cards */}
            <div className="space-y-6">
              {/* Outbound Performance */}
              <Card className="p-6 bg-card/80 backdrop-blur-sm border border-accent shadow-glow">
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-accent font-heading">
                  📱 Outbound Lead Performance
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Current Outbound Revenue:</span>
                    <span className="font-semibold">{formatCurrency(results.currentOutboundRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Outbound Revenue:</span>
                    <span className="font-semibold">{formatCurrency(results.aiOutboundRevenue)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t-2 border-accent font-bold">
                    <span>Outbound Improvement:</span>
                    <span className="text-success">+{formatCurrency(results.outboundImprovement)}</span>
                  </div>
                </div>
              </Card>
              
              {/* Inbound Performance */}
              <Card className="p-6 bg-card/80 backdrop-blur-sm border border-accent shadow-glow">
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-accent font-heading">
                  📞 Inbound Call Performance
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Current Inbound Revenue:</span>
                    <span className="font-semibold">{formatCurrency(results.currentInboundRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Inbound Revenue:</span>
                    <span className="font-semibold">{formatCurrency(results.aiInboundRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Missed Call Recovery:</span>
                    <span className="font-semibold">{formatCurrency(results.missedCallRecovery)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t-2 border-accent font-bold">
                    <span>Inbound Improvement:</span>
                    <span className="text-success">+{formatCurrency(results.inboundImprovement)}</span>
                  </div>
                </div>
              </Card>
              
              {/* Cost Analysis */}
              <Card className="p-6 bg-card/80 backdrop-blur-sm border border-accent shadow-glow">
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-accent font-heading">
                  💰 Cost Analysis
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Current Employee Cost:</span>
                    <span className="font-semibold">{formatCurrency(results.currentEmployeeCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Answering Service:</span>
                    <span className="font-semibold">{formatCurrency(results.currentAnsweringCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Setup Cost:</span>
                    <span className="font-semibold">{formatCurrency(data.aiUpfrontCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Monthly Support:</span>
                    <span className="font-semibold">{formatCurrency(data.aiMonthlyCost)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t-2 border-accent font-bold">
                    <span>Total Monthly Increase:</span>
                    <span className="text-success">+{formatCurrency(results.totalMonthlyIncrease)}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}