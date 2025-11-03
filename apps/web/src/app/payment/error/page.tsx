"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

export default function PaymentErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("Ödeme işlemi sırasında bir hata oluştu.");
  
  useEffect(() => {
    const code = searchParams.get("code");
    const message = searchParams.get("message");
    
    setErrorCode(code);
    
    if (message) {
      setErrorMessage(message);
    } else if (code === "card_declined") {
      setErrorMessage("Kartınız reddedildi. Lütfen farklı bir kart deneyiniz.");
    } else if (code === "insufficient_funds") {
      setErrorMessage("Kartta yeterli bakiye bulunmuyor.");
    } else if (code === "expired_card") {
      setErrorMessage("Kartınızın süresi dolmuş.");
    } else if (code === "processing_error") {
      setErrorMessage("Ödeme işlenirken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.");
    }
  }, [searchParams]);

  const handleTryAgain = () => {
    // Son URL'yi kaydet ve ödeme sayfasına yönlendir
    router.back();
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="bg-red-100 dark:bg-red-900 p-6 rounded-full mb-6">
          <AlertTriangle className="h-16 w-16 text-red-600 dark:text-red-300" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Ödeme Başarısız
        </h1>
        
        <p className="text-xl text-muted-foreground mb-2">
          {errorMessage}
        </p>
        
        {errorCode && (
          <div className="bg-muted p-2 rounded-md my-4 text-sm">
            Hata Kodu: {errorCode}
          </div>
        )}
      </div>
      
      <div className="space-y-6 max-w-lg mx-auto">
        <h2 className="text-xl font-semibold">Olası Çözümler</h2>
        
        <div className="space-y-4">
          <div className="flex items-start p-4 bg-card rounded-md border">
            <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
              <RefreshCw className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="font-medium">Tekrar deneyin</h3>
              <p className="text-sm text-muted-foreground">
                Geçici bir sorun olabilir. Birkaç dakika sonra tekrar deneyebilirsiniz.
              </p>
            </div>
          </div>
          
          <div className="flex items-start p-4 bg-card rounded-md border">
            <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
              <RefreshCw className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="font-medium">Başka bir ödeme yöntemi kullanın</h3>
              <p className="text-sm text-muted-foreground">
                Farklı bir kart veya ödeme yöntemi ile tekrar deneyebilirsiniz.
              </p>
            </div>
          </div>
          
          <div className="flex items-start p-4 bg-card rounded-md border">
            <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
              <RefreshCw className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="font-medium">Bankanız ile iletişime geçin</h3>
              <p className="text-sm text-muted-foreground">
                Bankanız çevrimiçi ödemeleri engelliyor olabilir.
              </p>
            </div>
          </div>
        </div>
        
        <div className="pt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <Button className="w-full" onClick={handleTryAgain}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Tekrar Dene
          </Button>
          
          <Button variant="outline" className="w-full" asChild>
            <Link href="/plans">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Planlara Geri Dön
            </Link>
          </Button>
        </div>
        
        <div className="pt-6">
          <p className="text-sm text-center text-muted-foreground">
            Sorun devam ederse lütfen <a href="/contact" className="text-primary underline">destek ekibimizle iletişime geçin</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
