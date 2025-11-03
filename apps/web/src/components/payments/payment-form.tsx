"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { useI18n } from "@/contexts/i18n-context";

// Kart tip tanımı
interface CardDetails {
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
}

// Ödeme formu özellikleri
interface PaymentFormProps {
  planId: string;
  planName: string;
  amount: number;
  interval: "month" | "year";
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function PaymentForm({
  planId,
  planName,
  amount,
  interval,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const router = useRouter();
  const { t } = useI18n();
  
  // Form durumları
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: "",
    cardholderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
  });
  const [errors, setErrors] = useState<Partial<CardDetails>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "error">("idle");
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Form değişikliği işleyicisi
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Kart numarası için boşluk ekleme
    if (name === "cardNumber") {
      // Sadece rakamları al
      const digitsOnly = value.replace(/\D/g, "");
      // 4'lük gruplar halinde boşluk ekle
      const formatted = digitsOnly.replace(/(\d{4})/g, "$1 ").trim();
      setCardDetails({ ...cardDetails, [name]: formatted });
    } 
    // Ay ve yıl için sayısal değer kontrolü
    else if (name === "expiryMonth" || name === "expiryYear") {
      const digitsOnly = value.replace(/\D/g, "");
      setCardDetails({ ...cardDetails, [name]: digitsOnly });
    }
    // CVC için sayısal değer kontrolü
    else if (name === "cvc") {
      const digitsOnly = value.replace(/\D/g, "").substring(0, 4);
      setCardDetails({ ...cardDetails, [name]: digitsOnly });
    }
    // Diğer alanlar
    else {
      setCardDetails({ ...cardDetails, [name]: value });
    }
    
    // Hata varsa temizle
    if (errors[name as keyof CardDetails]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  // Form doğrulama
  const validateForm = (): boolean => {
    const newErrors: Partial<CardDetails> = {};
    let isValid = true;
    
    // Kart numarası
    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, "").length < 16) {
      newErrors.cardNumber = "Geçerli bir kart numarası giriniz";
      isValid = false;
    }
    
    // Kart sahibi
    if (!cardDetails.cardholderName || cardDetails.cardholderName.length < 3) {
      newErrors.cardholderName = "Kart sahibinin adını giriniz";
      isValid = false;
    }
    
    // Son kullanma ay
    if (!cardDetails.expiryMonth || parseInt(cardDetails.expiryMonth) < 1 || parseInt(cardDetails.expiryMonth) > 12) {
      newErrors.expiryMonth = "1-12 arası ay giriniz";
      isValid = false;
    }
    
    // Son kullanma yıl
    const currentYear = new Date().getFullYear() % 100;
    if (!cardDetails.expiryYear || parseInt(cardDetails.expiryYear) < currentYear) {
      newErrors.expiryYear = "Geçerli bir yıl giriniz";
      isValid = false;
    }
    
    // CVC
    if (!cardDetails.cvc || cardDetails.cvc.length < 3) {
      newErrors.cvc = "Geçerli bir CVC giriniz";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Form gönderimi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    setPaymentStatus("idle");
    setPaymentError(null);
    
    // Simule edilmiş ödeme işlemi (gerçek uygulamada bir API çağrısı olacak)
    try {
      // Ödeme API çağrısı simülasyonu
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Başarılı ödeme simülasyonu (%80 olasılık)
      const isSuccess = Math.random() > 0.2;
      
      if (isSuccess) {
        setPaymentStatus("success");
        
        // Başarılı ödeme sonrası callback
        if (onSuccess) {
          onSuccess();
        }
        
        // Kullanıcıyı başarılı sayfasına yönlendirme
        setTimeout(() => {
          router.push(`/payment/success?planId=${planId}`);
        }, 1500);
      } else {
        // Hata simülasyonu
        throw new Error("Ödeme işlemi reddedildi. Lütfen kart bilgilerinizi kontrol edin.");
      }
    } catch (error: any) {
      setPaymentStatus("error");
      setPaymentError(error.message || "Ödeme işlemi sırasında bir hata oluştu.");
      
      if (onError) {
        onError(error.message || "Ödeme işlemi sırasında bir hata oluştu.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Para formatı
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(value);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Ödeme Bilgileri
        </CardTitle>
        <CardDescription>
          {planName} planı için {formatCurrency(amount)}{" "}
          {interval === "month" ? "aylık" : "yıllık"} ödeme
        </CardDescription>
      </CardHeader>
      
      {paymentStatus === "success" ? (
        <CardContent className="text-center py-6">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">Ödeme Başarılı!</h3>
          <p className="text-muted-foreground">
            Ödemeniz alındı. Yönlendiriliyorsunuz...
          </p>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Kart sahibi */}
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Kart Sahibi</Label>
              <Input
                id="cardholderName"
                name="cardholderName"
                placeholder="Kart üzerindeki isim"
                value={cardDetails.cardholderName}
                onChange={handleChange}
                className={errors.cardholderName ? "border-red-500" : ""}
                disabled={isProcessing}
              />
              {errors.cardholderName && (
                <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>
              )}
            </div>
            
            {/* Kart numarası */}
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Kart Numarası</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.cardNumber}
                onChange={handleChange}
                maxLength={19} // 16 rakam + 3 boşluk
                className={errors.cardNumber ? "border-red-500" : ""}
                disabled={isProcessing}
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
              )}
            </div>
            
            {/* Son kullanma tarihi ve CVC */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryMonth">Ay</Label>
                <Input
                  id="expiryMonth"
                  name="expiryMonth"
                  placeholder="MM"
                  value={cardDetails.expiryMonth}
                  onChange={handleChange}
                  maxLength={2}
                  className={errors.expiryMonth ? "border-red-500" : ""}
                  disabled={isProcessing}
                />
                {errors.expiryMonth && (
                  <p className="text-red-500 text-xs mt-1">{errors.expiryMonth}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiryYear">Yıl</Label>
                <Input
                  id="expiryYear"
                  name="expiryYear"
                  placeholder="YY"
                  value={cardDetails.expiryYear}
                  onChange={handleChange}
                  maxLength={2}
                  className={errors.expiryYear ? "border-red-500" : ""}
                  disabled={isProcessing}
                />
                {errors.expiryYear && (
                  <p className="text-red-500 text-xs mt-1">{errors.expiryYear}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  name="cvc"
                  placeholder="123"
                  value={cardDetails.cvc}
                  onChange={handleChange}
                  maxLength={4}
                  className={errors.cvc ? "border-red-500" : ""}
                  disabled={isProcessing}
                />
                {errors.cvc && (
                  <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>
                )}
              </div>
            </div>
            
            {/* Ödeme hatası */}
            {paymentStatus === "error" && paymentError && (
              <div className="bg-red-50 p-3 rounded flex items-start">
                <AlertCircle className="text-red-500 h-5 w-5 mt-0.5 mr-2" />
                <p className="text-red-700 text-sm">{paymentError}</p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  İşleniyor...
                </div>
              ) : (
                `${formatCurrency(amount)} Öde`
              )}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              Ödeme yaparak <a href="/terms" className="underline">hizmet şartlarını</a> ve{" "}
              <a href="/privacy" className="underline">gizlilik politikasını</a> kabul etmiş olursunuz.
            </p>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}
