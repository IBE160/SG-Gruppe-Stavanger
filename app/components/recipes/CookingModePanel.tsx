'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface CookingModePanelProps {
  instructions: string;
  recipeTitle: string;
  onClose: () => void;
  onComplete?: () => void;
}

interface CookingStep {
  number: number;
  text: string;
}

/**
 * Parse instructions into individual steps
 */
function parseInstructions(instructions: string): CookingStep[] {
  if (!instructions) return [];

  // Remove HTML tags
  const cleanText = instructions.replace(/<[^>]*>/g, '');

  // Split by numbered steps or periods
  const steps = cleanText
    .split(/\d+\.\s+|\n+/)
    .filter((step) => step.trim().length > 0)
    .map((step, index) => ({
      number: index + 1,
      text: step.trim(),
    }));

  return steps.length > 0 ? steps : [{ number: 1, text: cleanText }];
}

export function CookingModePanel({
  instructions,
  recipeTitle,
  onClose,
  onComplete,
}: CookingModePanelProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const steps = parseInstructions(instructions);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const allStepsCompleted = completedSteps.size === steps.length;

  useEffect(() => {
    // Add keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && !isLastStep) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && !isFirstStep) {
        handlePrevious();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, isFirstStep, isLastStep, onClose]);

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStepComplete = () => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(currentStep);
    setCompletedSteps(newCompleted);

    // Auto-advance to next step if not last
    if (!isLastStep) {
      setTimeout(() => handleNext(), 300);
    } else if (onComplete) {
      // All steps completed
      onComplete();
    }
  };

  const handleStepUncomplete = () => {
    const newCompleted = new Set(completedSteps);
    newCompleted.delete(currentStep);
    setCompletedSteps(newCompleted);
  };

  const isCurrentStepCompleted = completedSteps.has(currentStep);

  if (steps.length === 0) {
    return (
      <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-white shadow-farmhouse">
          <CardHeader className="border-b border-sage-green/10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-charcoal">Cooking Mode</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Close cooking mode"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-center text-charcoal/70">
              No cooking instructions available for this recipe.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-white shadow-farmhouse max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="border-b border-sage-green/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex-grow pr-4">
              <CardTitle className="text-2xl text-charcoal">{recipeTitle}</CardTitle>
              <p className="text-sm text-sage-green mt-1">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close cooking mode"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-grow overflow-auto pt-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'h-2 flex-1 rounded-full transition-all',
                    completedSteps.has(index)
                      ? 'bg-sage-green'
                      : index === currentStep
                      ? 'bg-sage-green/50'
                      : 'bg-charcoal/10'
                  )}
                  aria-label={`Step ${index + 1} ${
                    completedSteps.has(index)
                      ? 'completed'
                      : index === currentStep
                      ? 'current'
                      : 'pending'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Current Step */}
          <div className="mb-6">
            <div className="bg-light-beige p-6 rounded-lg border-2 border-sage-green/20">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-sage-green text-white rounded-full flex items-center justify-center font-bold">
                  {currentStep + 1}
                </div>
                <div className="flex-grow">
                  <p className="text-lg text-charcoal leading-relaxed">
                    {steps[currentStep].text}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mark Complete Button */}
          <div className="flex justify-center mb-4">
            {isCurrentStepCompleted ? (
              <Button
                onClick={handleStepUncomplete}
                variant="outline"
                size="lg"
                className="text-sage-green border-sage-green/30"
              >
                <CheckCircle2 className="h-5 w-5 mr-2" aria-hidden="true" />
                Step Completed
              </Button>
            ) : (
              <Button
                onClick={handleStepComplete}
                size="lg"
                className="bg-sage-green hover:bg-sage-green/90 text-white"
              >
                Mark Step Complete
              </Button>
            )}
          </div>
        </CardContent>

        {/* Navigation */}
        <div className="border-t border-sage-green/10 p-4 flex items-center justify-between flex-shrink-0">
          <Button
            onClick={handlePrevious}
            disabled={isFirstStep}
            variant="outline"
            className="text-charcoal border-charcoal/20"
          >
            <ChevronLeft className="h-4 w-4 mr-1" aria-hidden="true" />
            Previous
          </Button>

          <div className="text-sm text-charcoal/70">
            {completedSteps.size} of {steps.length} steps completed
          </div>

          <Button
            onClick={handleNext}
            disabled={isLastStep}
            variant="outline"
            className="text-charcoal border-charcoal/20"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
          </Button>
        </div>

        {/* Completion Message */}
        {allStepsCompleted && (
          <div className="bg-sage-green/10 border-t-2 border-sage-green/30 p-4 flex-shrink-0">
            <div className="flex items-center justify-center gap-2 text-sage-green">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              <p className="font-semibold">All steps completed! Enjoy your meal!</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
