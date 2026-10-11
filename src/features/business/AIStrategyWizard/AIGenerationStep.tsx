/**
 * AI Strategy Wizard - Step 4: AI Generation
 * Mobile-first loading screen with progress indicators
 */
import { useState, useEffect } from 'react';
import UiIcon from '../../../components/UiIcon';

interface AIGenerationStepProps {
  onComplete: (strategy: GeneratedStrategy) => void;
}

export interface GeneratedStrategy {
  strategy: {
    name: string;
    type: 'reach' | 'performance' | 'community' | 'hybrid';
    description: string;
    rationale: string;
    confidence: number;
  };
  creators: {
    total: number;
    mix: string;
    estimated_reach: string;
    estimated_engagement: string;
  };
  budget: {
    total: number;
    breakdown: {
      creators: number;
      platform_fees: number;
      management: number;
    };
  };
  timeline: {
    setup: string;
    execution: string;
    total: string;
  };
  kpis: {
    primary: string;
    secondary: string[];
    benchmarks: Record<string, string>;
  };
}

const LOADING_STEPS = [
  { id: 'analyzing', label: 'Analyzing your business profile...', duration: 2000 },
  { id: 'matching', label: 'Finding the perfect creator match...', duration: 2500 },
  { id: 'optimizing', label: 'Optimizing budget allocation...', duration: 2000 },
  { id: 'generating', label: 'Generating strategy recommendations...', duration: 1500 },
  { id: 'finalizing', label: 'Finalizing your campaign strategy...', duration: 1000 }
];

export default function AIGenerationStep({ onComplete }: AIGenerationStepProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateStrategy();
  }, []);

  const generateStrategy = async () => {
    try {
      // Simulate step-by-step AI generation
      for (let i = 0; i < LOADING_STEPS.length; i++) {
        setCurrentStep(i);
        setProgress((i / LOADING_STEPS.length) * 100);
        
        await new Promise(resolve => setTimeout(resolve, LOADING_STEPS[i].duration));
      }

      // Final progress
      setProgress(100);
      
      // Wait a bit then call the API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would call your backend API
      const mockStrategy: GeneratedStrategy = {
        strategy: {
          name: 'Community-Driven Local Awareness',
          type: 'community',
          description: 'Focus on building local trust and driving foot traffic through hyperlocal creators with strong Chennai presence.',
          rationale: 'Based on your restaurant business in Chennai with a ₹1.5L budget targeting local food lovers, a community strategy will maximize local reach and trust.',
          confidence: 94
        },
        creators: {
          total: 4,
          mix: '2 Macro + 2 Nano creators',
          estimated_reach: '3.2 Lakh',
          estimated_engagement: '28.5K'
        },
        budget: {
          total: 150000,
          breakdown: {
            creators: 120000,
            platform_fees: 15000,
            management: 15000
          }
        },
        timeline: {
          setup: '3-5 days',
          execution: '15 days',
          total: '18-20 days'
        },
        kpis: {
          primary: 'Store visits and foot traffic',
          secondary: ['Social engagement', 'Brand awareness', 'Local reach'],
          benchmarks: {
            'Store Visits': '500-800 visits',
            'Engagement Rate': '8-12%',
            'Local Reach': '2.8-3.5 Lakh users'
          }
        }
      };

      onComplete(mockStrategy);
    } catch (err) {
      setError('Failed to generate strategy. Please try again.');
    }
  };

  const handleRetry = () => {
    setError(null);
    setCurrentStep(0);
    setProgress(0);
    generateStrategy();
  };

  if (error) {
    return (
      <div className="ai-generation-step">
        <div className="generation-error">
          <div className="error-icon"><UiIcon name="alert" /></div>
          <h2>Strategy Generation Failed</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={handleRetry}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-generation-step">
      {/* Header */}
      <div className="generation-header">
        <h1 className="generation-title">
          <UiIcon name="bot" /> AI is creating your strategy
        </h1>
        <p className="generation-subtitle">
          Please wait while we analyze your requirements and generate the perfect campaign strategy.
        </p>
      </div>

      {/* Progress */}
      <div className="generation-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="progress-text">
          {Math.round(progress)}% Complete
        </div>
      </div>

      {/* Current Step */}
      <div className="generation-steps">
        {LOADING_STEPS.map((step, index) => (
          <div 
            key={step.id}
            className={`generation-step ${
              index === currentStep ? 'generation-step--active' :
              index < currentStep ? 'generation-step--completed' : ''
            }`}
          >
            <div className="step-indicator">
              {index < currentStep ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="8" fill="#22c55e"/>
                  <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : index === currentStep ? (
                <div className="loading-spinner" />
              ) : (
                <div className="step-number">{index + 1}</div>
              )}
            </div>
            <div className="step-label">{step.label}</div>
          </div>
        ))}
      </div>

      {/* AI Insights */}
      <div className="generation-insights">
        <h3>What our AI is analyzing:</h3>
        <div className="insights-grid">
          <div className="insight-item">
            <span className="insight-icon"><UiIcon name="target" /></span>
            <span>Campaign objectives and KPIs</span>
          </div>
          <div className="insight-item">
            <span className="insight-icon"><UiIcon name="users" /></span>
            <span>Target audience preferences</span>
          </div>
          <div className="insight-item">
            <span className="insight-icon"><UiIcon name="pin" /></span>
            <span>Local market conditions</span>
          </div>
          <div className="insight-item">
            <span className="insight-icon"><UiIcon name="money" /></span>
            <span>Budget optimization opportunities</span>
          </div>
          <div className="insight-item">
            <span className="insight-icon"><UiIcon name="chart" /></span>
            <span>Creator performance data</span>
          </div>
          <div className="insight-item">
            <span className="insight-icon"><UiIcon name="timer" /></span>
            <span>Optimal timing and duration</span>
          </div>
        </div>
      </div>
    </div>
  );
}