/**
 * AI Strategy Wizard - Main Orchestrator Page
 * Manages the complete AI strategy wizard flow with step navigation
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessLayout from '../BusinessLayout';
import StrategyHomeStep from './StrategyHomeStep';
import CampaignGoalStep from './CampaignGoalStep';
import ProductAudienceStep from './ProductAudienceStep';
import AIGenerationStep from './AIGenerationStep';
import GeneratedStrategyStep from './GeneratedStrategyStep';
import EditStrategyStep from './EditStrategyStep';
import ConfirmStrategyStep from './ConfirmStrategyStep';
import type { GeneratedStrategy } from './AIGenerationStep';

type WizardStep = 'home' | 'goal' | 'product-audience' | 'generation' | 'generated' | 'edit' | 'confirm';

interface CampaignData {
  goal?: string;
  description?: string;
  businessType?: string;
  productCategory?: string;
  targetAudience?: {
    ageRange: string;
    gender: string;
    interests: string[];
    location: string;
    language: string;
  };
  budget?: {
    amount: number;
    timeframe: string;
  };
}

export default function AIStrategyWizardPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<WizardStep>('home');
  const [campaignData, setCampaignData] = useState<CampaignData>({});
  const [generatedStrategy, setGeneratedStrategy] = useState<GeneratedStrategy | null>(null);

  const stepOrder: WizardStep[] = ['home', 'goal', 'product-audience', 'generation', 'generated', 'edit', 'confirm'];
  const currentStepIndex = stepOrder.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / stepOrder.length) * 100;

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < stepOrder.length) {
      setCurrentStep(stepOrder[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(stepOrder[prevIndex]);
    }
  };

  const handleGoalComplete = (data: { goal: string; description?: string }) => {
    setCampaignData(prev => ({ ...prev, ...data }));
    handleNext();
  };

  const handleProductAudienceComplete = (data: any) => {
    setCampaignData(prev => ({ ...prev, ...data }));
    handleNext();
  };

  const handleStrategyGenerated = (strategy: GeneratedStrategy) => {
    setGeneratedStrategy(strategy);
    handleNext();
  };

  const handleStrategyEdit = () => {
    setCurrentStep('edit');
  };

  const handleStrategySaved = (updatedStrategy: GeneratedStrategy) => {
    setGeneratedStrategy(updatedStrategy);
    setCurrentStep('confirm');
  };

  const handleConfirm = () => {
    // Save strategy to localStorage or backend
    if (generatedStrategy) {
      localStorage.setItem('ai_strategy', JSON.stringify(generatedStrategy));
      localStorage.setItem('campaign_data', JSON.stringify(campaignData));
    }
    
    // Navigate to Campaign Parameters Wizard
    navigate('/business/campaigns/parameters');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'home':
        return <StrategyHomeStep onNext={handleNext} />;
      
      case 'goal':
        return (
          <CampaignGoalStep
            onNext={handleGoalComplete}
            onBack={handleBack}
            initialData={campaignData.goal ? { goal: campaignData.goal, description: campaignData.description } : undefined}
          />
        );
      
      case 'product-audience':
        return (
          <ProductAudienceStep
            onNext={handleProductAudienceComplete}
            onBack={handleBack}
            initialData={campaignData.businessType && campaignData.productCategory ? {
              businessType: campaignData.businessType,
              productCategory: campaignData.productCategory,
              targetAudience: campaignData.targetAudience || {
                ageRange: '',
                gender: '',
                interests: [],
                location: '',
                language: ''
              },
              budget: campaignData.budget || { amount: 0, timeframe: '' }
            } : undefined}
          />
        );
      
      case 'generation':
        return (
          <AIGenerationStep
            onComplete={handleStrategyGenerated}
          />
        );
      
      case 'generated':
        return generatedStrategy ? (
          <GeneratedStrategyStep
            strategy={generatedStrategy}
            onNext={handleNext}
            onBack={handleBack}
            onEdit={handleStrategyEdit}
          />
        ) : null;
      
      case 'edit':
        return generatedStrategy ? (
          <EditStrategyStep
            strategy={generatedStrategy}
            onSave={handleStrategySaved}
            onBack={() => setCurrentStep('generated')}
          />
        ) : null;
      
      case 'confirm':
        return generatedStrategy ? (
          <ConfirmStrategyStep
            strategy={generatedStrategy}
            onConfirm={handleConfirm}
            onBack={handleStrategyEdit}
          />
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <BusinessLayout breadcrumb="AI Strategy Wizard">
      <div className="ai-strategy-wizard-page">
        {/* Progress Bar */}
        {currentStep !== 'home' && (
          <div className="wizard-progress">
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="progress-text">
              Step {currentStepIndex + 1} of {stepOrder.length}
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="wizard-content">
          {renderStep()}
        </div>
      </div>
    </BusinessLayout>
  );
}
