'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, X } from 'lucide-react';

export function FloatingFeedback() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    
    setSubmitting(true);
    
    // Simple placeholder - in production, send to actual API
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Feedback submitted:', feedback);
      
      setSubmitted(true);
      setFeedback('');
      
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <>
      <Button 
        size="sm" 
        variant="outline"
        className="fixed bottom-4 right-4 z-50 rounded-full h-10 w-10 p-0"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="h-5 w-5" />
        <span className="sr-only">Geri Bildirim</span>
      </Button>
      
      {isOpen && (
        <div className="fixed bottom-16 right-4 z-50 w-80 bg-background border rounded-md shadow-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Geri Bildirim</h3>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {submitted ? (
            <div className="py-4 text-center">
              <p className="text-sm text-green-600">Geri bildiriminiz için teşekkürler!</p>
            </div>
          ) : (
            <>
              <Textarea
                placeholder="Deneyiminizi nasıl iyileştirebileceğimizi bize söyleyin..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                className="mb-2"
              />
              <Button 
                onClick={handleSubmit}
                disabled={!feedback.trim() || submitting}
                className="w-full"
                size="sm"
              >
                {submitting ? "Gönderiliyor..." : "Gönder"}
              </Button>
            </>
          )}
        </div>
      )}
    </>
  );
}
