'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronRight, ChevronLeft, Code, Terminal, Settings } from 'lucide-react';

const steps = [
  {
    title: "CodeXONX'e Hoş Geldiniz!",
    description:
      'Yazılım geliştirme süreçlerinizi kolaylaştırmak için tasarlanmış güçlü platformumuza hoş geldiniz. Başlamak için hızlı bir tur atalım.',
    icon: <Code className="h-12 w-12 text-primary" />,
  },
  {
    title: 'Kod Editörü',
    description:
      'Modern kod editörümüzle hızlıca kod yazın, düzenleyin ve paylaşın. Syntax vurgulama, otomatik tamamlama ve AI desteği ile kodlama deneyiminizi geliştirin.',
    icon: <Terminal className="h-12 w-12 text-primary" />,
  },
  {
    title: 'Projeler',
    description:
      'Projelerinizi oluşturun, yönetin ve ekip arkadaşlarınızla paylaşın. Şablonlarla çalışmaya hızlı başlayın veya sıfırdan kendi projenizi oluşturun.',
    icon: <Settings className="h-12 w-12 text-primary" />,
  },
];

export function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Kullanıcı daha önce bu modalı gördü mü kontrol et
    const hasSeenWelcomeModal = localStorage.getItem('hasSeenWelcomeModal');

    if (!hasSeenWelcomeModal) {
      // Sayfa yüklendiğinde 1 saniye sonra göster
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    // Modalı bir daha gösterme
    localStorage.setItem('hasSeenWelcomeModal', 'true');
    setOpen(false);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto p-4 mb-4">{steps[currentStep].icon}</div>
          <DialogTitle className="text-2xl text-center">{steps[currentStep].title}</DialogTitle>
          <DialogDescription className="text-center pt-2">
            {steps[currentStep].description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center mt-4 space-x-1">
          {steps.map((_, index) => (
            <span
              key={index}
              className={`block h-2 w-2 rounded-full ${currentStep === index ? 'bg-primary' : 'bg-muted'}`}
            />
          ))}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2 pt-4">
          <div className="flex justify-between w-full">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className={currentStep === 0 ? 'opacity-0' : ''}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Önceki
            </Button>
            <Button type="button" onClick={nextStep}>
              {isLastStep ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Başla
                </>
              ) : (
                <>
                  Sonraki
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
          {!isLastStep && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-3 sm:mt-0"
              onClick={handleClose}
            >
              Atla
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
