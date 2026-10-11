/**
 * Campaign Parameters Wizard - Main Orchestrator Page
 * Manages the complete campaign parameters wizard flow with step navigation
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessLayout from '../BusinessLayout';
import CampaignParametersStep, { type CampaignParametersData } from './CampaignParametersStep';
import PlatformSelectionStep, { type PlatformSelectionData } from './PlatformSelectionStep';
import ContentParametersStep, { type ContentParametersData } from './ContentParametersStep';
import CreatorParametersStep, { type CreatorParametersData } from './CreatorParametersStep';
import BudgetTimelineStep, { type BudgetTimelineData } from './BudgetTimelineStep';
import ReviewParametersStep from './ReviewParametersStep';

type WizardStep = 'basic' | 'platforms' | 'content' | 'creators' | 'budget' | 'review';

interface AllParametersData {
  basic?: CampaignParametersData;
  platforms?: PlatformSelectionData;
  content?: ContentParametersData;
  creators?: CreatorParametersData;
  budget?: BudgetTimelineData;
}

export default function CampaignParametersWizardPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<WizardStep>('basic');
  const [parametersData, setParametersData] = useState<AllParametersData>({});

  const stepOrder: WizardStep[] = ['basic', 'platforms', 'content', 'creators', 'budget', 'review'];
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

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < stepOrder.length) {
      setCurrentStep(stepOrder[stepIndex]);
    }
  };

  const handleBasicComplete = (data: CampaignParametersData) => {
    setParametersData(prev => ({ ...prev, basic: data }));
    handleNext();
  };

  const handlePlatformsComplete = (data: PlatformSelectionData) => {
    setParametersData(prev => ({ ...prev, platforms: data }));
    handleNext();
  };

  const handleContentComplete = (data: ContentParametersData) => {
    setParametersData(prev => ({ ...prev, content: data }));
    handleNext();
  };

  const handleCreatorsComplete = (data: CreatorParametersData) => {
    setParametersData(prev => ({ ...prev, creators: data }));
    handleNext();
  };

  const handleBudgetComplete = (data: BudgetTimelineData) => {
    setParametersData(prev => ({ ...prev, budget: data }));
    handleNext();
  };

  const handleConfirm = () => {
    // Save parameters to localStorage or backend
    localStorage.setItem('campaign_parameters', JSON.stringify(parametersData));
    
    // Navigate to creator selection or campaign dashboard
    navigate('/business/campaigns/creators');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <CampaignParametersStep
            onNext={handleBasicComplete}
            onBack={() => navigate('/business/campaigns/ai-strategy')}
            initialData={parametersData.basic}
          />
        );
      
      case 'platforms':
        return (
          <PlatformSelectionStep
            onNext={handlePlatformsComplete}
            onBack={handleBack}
            initialData={parametersData.platforms}
          />
        );
      
      case 'content':
        return (
          <ContentParametersStep
            onNext={handleContentComplete}
            onBack={handleBack}
            initialData={parametersData.content}
          />
        );
      
      case 'creators':
        return (
          <CreatorParametersStep
            onNext={handleCreatorsComplete}
            onBack={handleBack}
            initialData={parametersData.creators}
          />
        );
      
      case 'budget':
        return (
          <BudgetTimelineStep
            onNext={handleBudgetComplete}
            onBack={handleBack}
            initialData={parametersData.budget}
            totalBudget={parametersData.basic?.budget || 0}
          />
        );
      
      case 'review':
        return (
          <ReviewParametersStep
            parameters={parametersData}
            onConfirm={handleConfirm}
            onBack={handleBack}
            onEdit={goToStep}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <BusinessLayout breadcrumb="Campaign Parameters">
      <div className="campaign-parameters-wizard-page">
        {/* Progress Bar */}
        <div className="wizard-progress">
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="progress-steps">
            {stepOrder.map((step, index) => (
              <div 
                key={step}
                className={`progress-step ${index <= currentStepIndex ? 'progress-step--active' : ''}`}
              >
                <div className="progress-step-number">{index + 1}</div>
                <div className="progress-step-label">
                  {step === 'basic' && 'Basic'}
                  {step === 'platforms' && 'Platforms'}
                  {step === 'content' && 'Content'}
                  {step === 'creators' && 'Creators'}
                  {step === 'budget' && 'Budget'}
                  {step === 'review' && 'Review'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="wizard-content">
          {renderStep()}
        </div>
      </div>
    </BusinessLayout>
  );
}
