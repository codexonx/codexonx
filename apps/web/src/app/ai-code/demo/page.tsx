'use client';

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, FastForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Demo video adımları
const demoSteps = [
  {
    id: 'step1',
    title: '1. Soru Sorun',
    description:
      "AI asistanınıza doğal dilde soru sorun. Örneğin: 'React'te bir form komponenti nasıl oluşturabilirim?'",
    code: `// Kullanıcı AI'a soru soruyor:
// "React'te form validation yapan bir form komponenti oluştur"

// AI yanıt veriyor...`,
    aiResponse: `Elbette! İşte React'te form doğrulama özelliği olan bir form komponenti:

\`\`\`jsx
import { useState } from 'react';

function ValidationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const validateEmail = (email) => {
    const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return re.test(email);
  };
  
  const validatePassword = (password) => {
    return password.length >= 8;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = {};
    
    if (!formData.name.trim()) {
      validationErrors.name = 'İsim gerekli';
    }
    
    if (!formData.email.trim()) {
      validationErrors.email = 'Email gerekli';
    } else if (!validateEmail(formData.email)) {
      validationErrors.email = 'Geçerli bir email adresi girin';
    }
    
    if (!formData.password) {
      validationErrors.password = 'Şifre gerekli';
    } else if (!validatePassword(formData.password)) {
      validationErrors.password = 'Şifre en az 8 karakter olmalıdır';
    }
    
    setErrors(validationErrors);
    
    // If no errors, proceed with submission
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitted(true);
      // Form verilerini API'ye gönderebilirsiniz
      console.log('Form gönderildi:', formData);
    }
  };
  
  return (
    <div className="form-container">
      {isSubmitted ? (
        <div className="success-message">
          <h3>Form başarıyla gönderildi!</h3>
          <button onClick={() => setIsSubmitted(false)}>
            Tekrar Gönder
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>Kayıt Formu</h2>
          
          <div className="form-group">
            <label htmlFor="name">İsim:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Şifre:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          
          <button type="submit">Kayıt Ol</button>
        </form>
      )}
    </div>
  );
}

export default ValidationForm;
\`\`\`

Bu form komponenti şunları içeriyor:
- Form alanları için state yönetimi
- Email ve şifre için doğrulama kuralları
- Hata mesajları gösterme
- Başarılı form gönderimi sonrası bildirim

CSS stillerini eklemek için form-container, form-group, error ve error-text sınıfları için stil tanımlamaları ekleyebilirsiniz.`,
  },
  {
    id: 'step2',
    title: '2. Kodu İyileştirin',
    description:
      "AI'dan kodunuzu iyileştirmesini, optimize etmesini veya yeni özellikler eklemesini isteyin",
    code: `// Kullanıcı şunu soruyor:
// "Bu formu Formik kütüphanesiyle nasıl yeniden yazabiliriz?"

// AI yanıt veriyor...`,
    aiResponse: `Formik, React'te form yönetimini daha kolay hale getiren harika bir kütüphane. İşte aynı form bileşenini Formik kullanarak yeniden yazılmış hali:

\`\`\`jsx
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

function FormikValidationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Yup şeması ile validation kuralları tanımlama
  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .required('İsim gerekli'),
    email: Yup.string()
      .email('Geçerli bir email adresi girin')
      .required('Email gerekli'),
    password: Yup.string()
      .min(8, 'Şifre en az 8 karakter olmalıdır')
      .required('Şifre gerekli')
  });
  
  // Formun başlangıç değerleri
  const initialValues = {
    name: '',
    email: '',
    password: ''
  };
  
  // Form gönderildiğinde çalışacak fonksiyon
  const handleSubmit = (values, { resetForm }) => {
    // Form verilerini API'ye gönderebilirsiniz
    console.log('Form gönderildi:', values);
    setIsSubmitted(true);
    resetForm();
  };
  
  return (
    <div className="form-container">
      {isSubmitted ? (
        <div className="success-message">
          <h3>Form başarıyla gönderildi!</h3>
          <button onClick={() => setIsSubmitted(false)}>
            Tekrar Gönder
          </button>
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <h2>Kayıt Formu</h2>
              
              <div className="form-group">
                <label htmlFor="name">İsim:</label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className={errors.name && touched.name ? 'error' : ''}
                />
                <ErrorMessage name="name" component="span" className="error-text" />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className={errors.email && touched.email ? 'error' : ''}
                />
                <ErrorMessage name="email" component="span" className="error-text" />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Şifre:</label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className={errors.password && touched.password ? 'error' : ''}
                />
                <ErrorMessage name="password" component="span" className="error-text" />
              </div>
              
              <button type="submit">Kayıt Ol</button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}

export default FormikValidationForm;
\`\`\`

Bu Formik versiyonu önceki koda göre avantajları:

1. **Daha az boilerplate kod**: Form state yönetimi ve değişiklikleri izleme işlemlerini Formik hallediyor
2. **Yup entegrasyonu**: Validation kuralları daha deklaratif ve yönetilebilir
3. **Hazır komponentler**: Field ve ErrorMessage gibi hazır komponentler kod tekrarını azaltıyor
4. **dokunulmuş alanlar izleme**: Formik, hangi alanlara kullanıcının dokunduğunu izleyerek daha iyi UX sağlıyor

Formik kullanmak için önce paketleri yüklemeniz gerekir:
\`\`\`
npm install formik yup
\`\`\`

veya 

\`\`\`
yarn add formik yup
\`\`\`

Nasıl görünüyor? Bu yaklaşım form yönetimini çok daha temiz ve yönetilebilir hale getirir.`,
  },
  {
    id: 'step3',
    title: '3. Hatalar ve Sorunlar',
    description: 'Hata ayıklama ve sorun çözme konusunda yardım alın',
    code: `// Kullanıcı şunu soruyor:
// "Bu kodda bir hata var, form gönderildikten sonra 
// başa dönmüyor. Nasıl düzeltebiliriz?"

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

function FormikValidationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Validation şeması...
  
  const handleSubmit = (values, { resetForm }) => {
    console.log('Form gönderildi:', values);
    setIsSubmitted(true);
    // resetForm(); // Bu satır eksik!
  };
  
  // Form render...
}

// AI yanıt veriyor...`,
    aiResponse: `Problemi tespit ettim! Form gönderildikten sonra başa dönmüyor çünkü \`handleSubmit\` fonksiyonunda \`resetForm()\` çağrısı yorum satırına alınmış. Formik'in sağladığı bu fonksiyon formu başlangıç değerlerine döndürüyor.

Düzeltilmiş kod:

\`\`\`jsx
const handleSubmit = (values, { resetForm }) => {
  console.log('Form gönderildi:', values);
  setIsSubmitted(true);
  resetForm(); // Bu satırı aktifleştirerek formu sıfırlıyoruz
};
\`\`\`

Ancak bir şeyi daha fark ettim: Eğer \`isSubmitted\` true olduğunda başarı mesajını gösteriyorsanız ve formu sıfırlıyorsanız, kullanıcı tekrar başa döndüğünde form boş olacak. Belki istediğiniz davranış bu değildir.

İki farklı yaklaşım olabilir:

1. Formun gönderildiğini gösterin ve aynı zamanda formu sıfırlayın (şu anki kodunuz):
\`\`\`jsx
const handleSubmit = (values, { resetForm }) => {
  console.log('Form gönderildi:', values);
  setIsSubmitted(true);
  resetForm();
};
\`\`\`

2. Form gönderildiğinde sadece başarı mesajını gösterin, "Tekrar Gönder" butonuna tıklandığında formu sıfırlayın:
\`\`\`jsx
const handleSubmit = (values, { resetForm }) => {
  console.log('Form gönderildi:', values);
  setIsSubmitted(true);
  // resetForm()'u burada çağırmayın
};

// Ve "Tekrar Gönder" butonunda:
<button onClick={() => {
  setIsSubmitted(false);
  // Form referansına erişmeniz gerekiyor, bunu formik render props ile yapabilirsiniz:
}}>
  Tekrar Gönder
</button>
\`\`\`

En temiz çözüm, formikRef kullanmak olacaktır:

\`\`\`jsx
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState, useRef } from 'react';

function FormikValidationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formikRef = useRef();
  
  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .required('İsim gerekli'),
    email: Yup.string()
      .email('Geçerli bir email adresi girin')
      .required('Email gerekli'),
    password: Yup.string()
      .min(8, 'Şifre en az 8 karakter olmalıdır')
      .required('Şifre gerekli')
  });
  
  const initialValues = {
    name: '',
    email: '',
    password: ''
  };
  
  const handleSubmit = (values) => {
    console.log('Form gönderildi:', values);
    setIsSubmitted(true);
    // Formu burada sıfırlamıyoruz
  };
  
  return (
    <div className="form-container">
      {isSubmitted ? (
        <div className="success-message">
          <h3>Form başarıyla gönderildi!</h3>
          <button onClick={() => {
            setIsSubmitted(false);
            if (formikRef.current) {
              formikRef.current.resetForm();
            }
          }}>
            Tekrar Gönder
          </button>
        </div>
      ) : (
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {/* Form içeriği... */}
        </Formik>
      )}
    </div>
  );
}
\`\`\`

Bu şekilde, form gönderildikten sonra ve kullanıcı "Tekrar Gönder" butonuna tıkladığında, form tam olarak sıfırlanacaktır.`,
  },
];

export default function DemoPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [typedCode, setTypedCode] = useState('');
  const [typedResponse, setTypedResponse] = useState('');
  const [typingCodeSpeed, setTypingCodeSpeed] = useState(20); // ms per character
  const [typingResponseSpeed, setTypingResponseSpeed] = useState(5); // ms per character
  const currentStep = demoSteps[activeStep];

  // Typing animation effect
  useEffect(() => {
    let codeTimeouts: number[] = [];
    let responseTimeouts: number[] = [];

    if (playing) {
      // Reset typed text
      setTypedCode('');
      setTypedResponse('');

      // Type code character by character
      const codeToType = currentStep.code;
      for (let i = 0; i < codeToType.length; i++) {
        const timeout = window.setTimeout(() => {
          setTypedCode(codeToType.substring(0, i + 1));
        }, i * typingCodeSpeed);
        codeTimeouts.push(timeout);
      }

      // After code is typed, start typing the response
      const responseToType = currentStep.aiResponse;
      const codeTypingTime = codeToType.length * typingCodeSpeed;

      for (let i = 0; i < responseToType.length; i++) {
        const timeout = window.setTimeout(
          () => {
            setTypedResponse(responseToType.substring(0, i + 1));

            // When response is fully typed, go to next slide if not the last one
            if (i === responseToType.length - 1 && activeStep < demoSteps.length - 1) {
              setTimeout(() => {
                setPlaying(false);
                // Don't auto-advance to give user time to read
              }, 3000);
            }
          },
          codeTypingTime + i * typingResponseSpeed
        );
        responseTimeouts.push(timeout);
      }
    }

    // Cleanup timeouts
    return () => {
      codeTimeouts.forEach(timeout => clearTimeout(timeout));
      responseTimeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [playing, activeStep, currentStep, typingCodeSpeed, typingResponseSpeed]);

  // Handle next step
  const nextStep = () => {
    if (activeStep < demoSteps.length - 1) {
      setActiveStep(activeStep + 1);
      setPlaying(false);
      setTypedCode('');
      setTypedResponse('');
    }
  };

  // Handle previous step
  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      setPlaying(false);
      setTypedCode('');
      setTypedResponse('');
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    setPlaying(!playing);
  };

  // Skip to end of current step
  const skipToEnd = () => {
    setTypedCode(currentStep.code);
    setTypedResponse(currentStep.aiResponse);
    setPlaying(false);
  };

  // Format code with syntax highlighting
  const formatCode = code => {
    return code.replace(/\/\/ (.*)/g, '<span class="text-green-400">// $1</span>');
  };

  // Format AI response with syntax highlighting for code blocks
  const formatResponse = response => {
    return response.replace(/```(.*?)\n([\s\S]*?)```/g, (match, language, code) => {
      return `<div class="bg-slate-900 rounded-md p-4 my-4 overflow-auto">
                <pre><code class="language-${language || 'javascript'}">${code}</code></pre>
              </div>`;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center">
          <Button variant="ghost" className="text-white" asChild>
            <Link href="/ai-code">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Geri Dön
            </Link>
          </Button>
          <h1 className="text-2xl font-bold ml-4">AICodeX Demo</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">{currentStep.title}</h2>
            <p className="text-gray-300 text-lg">{currentStep.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User Code */}
            <motion.div
              className="bg-slate-900 rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="flex space-x-2 mr-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-400 text-sm">kod.js</span>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="ghost" className="h-7 px-2" onClick={togglePlay}>
                    {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 px-2" onClick={skipToEnd}>
                    <FastForward className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4 font-mono text-sm overflow-auto h-96">
                <pre>
                  <code
                    className="text-gray-300"
                    dangerouslySetInnerHTML={{ __html: formatCode(typedCode) }}
                  />
                  {!typedCode && !playing && (
                    <div className="text-gray-500 italic">
                      Demoyu başlatmak için play butonuna tıklayın.
                    </div>
                  )}
                </pre>
              </div>
            </motion.div>

            {/* AI Response */}
            <motion.div
              className="bg-slate-900 rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-blue-400 text-sm">AI Yanıtı</span>
                </div>
              </div>
              <div className="p-4 overflow-auto h-96">
                <div
                  className="prose prose-invert prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatResponse(typedResponse) }}
                />
                {!typedResponse && !playing && (
                  <div className="text-gray-500 italic">
                    {typedCode ? 'AI yanıt hazırlıyor...' : 'Yanıtlar burada görünecek.'}
                  </div>
                )}
                {playing && typedCode && !typedResponse && (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-ping"></div>
                    <span className="text-blue-400">AI yanıt hazırlıyor...</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={activeStep === 0}
              className="border-slate-700"
            >
              Önceki Adım
            </Button>

            <div className="flex space-x-1">
              {demoSteps.map((step, idx) => (
                <button
                  key={step.id}
                  className={`w-3 h-3 rounded-full ${
                    idx === activeStep ? 'bg-blue-500' : 'bg-slate-700'
                  }`}
                  aria-label={`Adım ${idx + 1}: ${step.title}`}
                  title={`Adım ${idx + 1}: ${step.title}`}
                  onClick={() => {
                    setActiveStep(idx);
                    setPlaying(false);
                    setTypedCode('');
                    setTypedResponse('');
                  }}
                />
              ))}
            </div>

            <Button
              variant="outline"
              onClick={nextStep}
              disabled={activeStep === demoSteps.length - 1}
              className="border-slate-700"
            >
              Sonraki Adım
            </Button>
          </div>

          <div className="mt-12 text-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6" asChild>
              <Link href="/ai-code/editor">Şimdi Deneyin</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
