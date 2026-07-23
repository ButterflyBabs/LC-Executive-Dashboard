// Health Calculator - Automatically calculate dimension scores based on real data

export interface HealthMetrics {
  revenue: {
    actual: number;
    target: number;
    lastMonth: number;
  };
  tasks: {
    total: number;
    completed: number;
    overdue: number;
  };
  leads: {
    new: number;
    converted: number;
    target: number;
  };
  customers: {
    total: number;
    churned: number;
    satisfaction: number; // 0-100
  };
  team: {
    members: number;
    openPositions: number;
    satisfaction: number; // 0-100
  };
  expenses: {
    actual: number;
    budget: number;
  };
}

// Calculate Marketing health based on lead generation and conversion
export function calculateMarketingHealth(metrics: HealthMetrics): number {
  if (!metrics.leads) return 70;
  
  const conversionRate = metrics.leads.target > 0 
    ? (metrics.leads.converted / metrics.leads.target) * 100 
    : 0;
  
  const leadVolume = metrics.leads.target > 0
    ? Math.min((metrics.leads.new / metrics.leads.target) * 100, 100)
    : 0;
  
  return Math.round((conversionRate * 0.6) + (leadVolume * 0.4));
}

// Calculate Sales health based on revenue and conversion
export function calculateSalesHealth(metrics: HealthMetrics): number {
  if (!metrics.revenue) return 70;
  
  const revenueAchievement = metrics.revenue.target > 0
    ? (metrics.revenue.actual / metrics.revenue.target) * 100
    : 0;
  
  const growthRate = metrics.revenue.lastMonth > 0
    ? ((metrics.revenue.actual - metrics.revenue.lastMonth) / metrics.revenue.lastMonth) * 100
    : 0;
  
  const growthScore = Math.max(0, Math.min(100, 50 + growthRate));
  
  return Math.round((revenueAchievement * 0.7) + (growthScore * 0.3));
}

// Calculate Operations health based on task completion and efficiency
export function calculateOperationsHealth(metrics: HealthMetrics): number {
  if (!metrics.tasks) return 70;
  
  const completionRate = metrics.tasks.total > 0
    ? (metrics.tasks.completed / metrics.tasks.total) * 100
    : 0;
  
  const overduePenalty = metrics.tasks.total > 0
    ? (metrics.tasks.overdue / metrics.tasks.total) * 20
    : 0;
  
  return Math.round(Math.max(0, completionRate - overduePenalty));
}

// Calculate Finance health based on revenue vs budget and cash flow
export function calculateFinanceHealth(metrics: HealthMetrics): number {
  if (!metrics.revenue || !metrics.expenses) return 70;
  
  const revenueAchievement = metrics.revenue.target > 0
    ? (metrics.revenue.actual / metrics.revenue.target) * 100
    : 0;
  
  const budgetAdherence = metrics.expenses.budget > 0
    ? Math.min(100, (metrics.expenses.budget / Math.max(metrics.expenses.actual, 1)) * 100)
    : 100;
  
  const profitMargin = metrics.revenue.actual > 0
    ? ((metrics.revenue.actual - metrics.expenses.actual) / metrics.revenue.actual) * 100
    : 0;
  
  const profitScore = Math.max(0, Math.min(100, profitMargin * 2));
  
  return Math.round((revenueAchievement * 0.4) + (budgetAdherence * 0.3) + (profitScore * 0.3));
}

// Calculate Team health based on satisfaction and staffing
export function calculateTeamHealth(metrics: HealthMetrics): number {
  if (!metrics.team) return 70;
  
  const staffingLevel = metrics.team.members > 0
    ? Math.min(100, (metrics.team.members / (metrics.team.members + metrics.team.openPositions)) * 100)
    : 0;
  
  return Math.round((metrics.team.satisfaction * 0.7) + (staffingLevel * 0.3));
}

// Calculate Systems health based on automation and efficiency
export function calculateSystemsHealth(metrics: HealthMetrics): number {
  // Systems health is often subjective, but we can infer from operations
  if (!metrics.tasks) return 70;
  
  const efficiency = metrics.tasks.total > 0
    ? (metrics.tasks.completed / metrics.tasks.total) * 100
    : 70;
  
  return Math.round(efficiency);
}

// Calculate Leadership health (mostly manual/subjective)
export function calculateLeadershipHealth(metrics: HealthMetrics, manualScore?: number): number {
  return manualScore || 70;
}

// Calculate Vision health (mostly manual/subjective)
export function calculateVisionHealth(metrics: HealthMetrics, manualScore?: number): number {
  return manualScore || 70;
}

// Calculate Product health based on customer satisfaction
export function calculateProductHealth(metrics: HealthMetrics): number {
  if (!metrics.customers) return 70;
  
  return Math.round(metrics.customers.satisfaction);
}

// Calculate Customer Experience health
export function calculateCustomerExperienceHealth(metrics: HealthMetrics): number {
  if (!metrics.customers) return 70;
  
  const satisfaction = metrics.customers.satisfaction;
  
  const retentionRate = metrics.customers.total > 0
    ? ((metrics.customers.total - metrics.customers.churned) / metrics.customers.total) * 100
    : 100;
  
  return Math.round((satisfaction * 0.6) + (retentionRate * 0.4));
}

// Calculate Legal health (mostly manual/compliance-based)
export function calculateLegalHealth(metrics: HealthMetrics, manualScore?: number): number {
  return manualScore || 80; // Default to good unless issues reported
}

// Calculate Sustainability health
export function calculateSustainabilityHealth(metrics: HealthMetrics): number {
  if (!metrics.revenue || !metrics.expenses) return 70;
  
  const profitMargin = metrics.revenue.actual > 0
    ? ((metrics.revenue.actual - metrics.expenses.actual) / metrics.revenue.actual) * 100
    : 0;
  
  const growthTrend = metrics.revenue.lastMonth > 0
    ? ((metrics.revenue.actual - metrics.revenue.lastMonth) / metrics.revenue.lastMonth) * 100
    : 0;
  
  return Math.round(Math.min(100, Math.max(0, 50 + profitMargin + growthTrend)));
}

// Calculate all 12 dimensions
export function calculateAllDimensions(metrics: HealthMetrics, manualScores?: Partial<Record<string, number>>): Record<string, number> {
  return {
    marketing: calculateMarketingHealth(metrics),
    sales: calculateSalesHealth(metrics),
    operations: calculateOperationsHealth(metrics),
    finance: calculateFinanceHealth(metrics),
    team: calculateTeamHealth(metrics),
    systems: calculateSystemsHealth(metrics),
    leadership: calculateLeadershipHealth(metrics, manualScores?.leadership),
    vision: calculateVisionHealth(metrics, manualScores?.vision),
    product: calculateProductHealth(metrics),
    customer_experience: calculateCustomerExperienceHealth(metrics),
    legal: calculateLegalHealth(metrics, manualScores?.legal),
    sustainability: calculateSustainabilityHealth(metrics),
  };
}

// Get overall health score
export function getOverallHealth(dimensionScores: Record<string, number>): number {
  const scores = Object.values(dimensionScores);
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

// Get health status
export function getHealthStatus(score: number): 'healthy' | 'attention' | 'at_risk' {
  if (score >= 80) return 'healthy';
  if (score >= 60) return 'attention';
  return 'at_risk';
}
