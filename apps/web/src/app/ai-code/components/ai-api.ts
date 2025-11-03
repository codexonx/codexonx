/**
 * AICode platformu için API entegrasyonu
 * Bu dosya, OpenAI API'sı veya benzeri bir API'ye bağlantıyı yönetir.
 *
 * Gerçek bir API yerine şu anda simüle edilmiş yanıtlar kullanılmaktadır.
 */

// API istekleri için temel arayüz
interface AIRequestOptions {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  context?: any; // Ek bağlam bilgisi (örneğin aktif dosya)
}

// API yanıtı için arayüz
interface AIResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  }
}

/**
 * AI API'sine istek gönderen fonksiyon
 * Not: Bu şu anda OpenAI API'sine gerçek bir istek göndermez, 
 * bunun yerine bir yanıtı simüle eder.
 */
export async function sendAIRequest(options: AIRequestOptions): Promise<AIResponse> {
  const { prompt, temperature = 0.7, maxTokens = 2048, model = "gpt-4o", context } = options;
  
  // NOT: Gerçek uygulamada, burada bir API çağrısı yapılacaktır
  // Şu anda sadece bir yanıtı simüle ediyoruz
  
  console.log(`Sending request to AI API with prompt: ${prompt.substring(0, 50)}...`);
  
  // AI yanıtını simüle et
  return new Promise((resolve) => {
    // Gerçek bir API çağrısını simüle etmek için kısa bir gecikme ekleyelim
    setTimeout(() => {
      // Basit bir prompt kontrolü ile farklı yanıtlar döndürelim
      let responseText = '';
      
      if (prompt.toLowerCase().includes('merhaba') || prompt.toLowerCase().includes('selam')) {
        responseText = "Merhaba! Size nasıl yardımcı olabilirim? Kod yazma, hata ayıklama veya geliştirme konularında yardım edebilirim.";
      } else if (prompt.toLowerCase().includes('javascript') || prompt.toLowerCase().includes('js')) {
        responseText = `\`\`\`javascript\n// JavaScript ile istediğiniz işlevi yapan bir örnek:\nfunction processData(data) {\n  return data\n    .filter(item => item.value > 10)\n    .map(item => ({\n      ...item,\n      processed: true,\n      timestamp: new Date().toISOString()\n    }));\n}\n\`\`\`\n\nBu fonksiyon, bir veri dizisini filtreleyip işler. 10'dan büyük değere sahip öğeleri filtreler ve her birine işlendiğini belirten bir bayrak ile zaman damgası ekler.`;
      } else if (prompt.toLowerCase().includes('react')) {
        responseText = `\`\`\`jsx\nimport React, { useState, useEffect } from 'react';\n\nfunction DataFetcher({ url, renderItem }) {\n  const [data, setData] = useState([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    async function fetchData() {\n      try {\n        setLoading(true);\n        const response = await fetch(url);\n        const result = await response.json();\n        setData(result);\n      } catch (err) {\n        setError(err.message);\n      } finally {\n        setLoading(false);\n      }\n    }\n\n    fetchData();\n  }, [url]);\n\n  if (loading) return <div>Loading...</div>;\n  if (error) return <div>Error: {error}</div>;\n\n  return (\n    <div className="data-container">\n      {data.map((item, index) => renderItem(item, index))}\n    </div>\n  );\n}\n\`\`\`\n\nBu React bileşeni, verilen URL'den veri çeker ve renderItem prop'unu kullanarak her öğeyi işler. Loading ve error durumlarını da yönetir.`;
      } else if (prompt.toLowerCase().includes('python')) {
        responseText = `\`\`\`python\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\ndef analyze_data(csv_file):\n    # Veriyi oku\n    df = pd.read_csv(csv_file)\n    \n    # Temel istatistikler\n    print(df.describe())\n    \n    # Eksik değerleri kontrol et\n    missing = df.isnull().sum()\n    print(f"\\nEksik değerler:\\n{missing}")\n    \n    # Basit görselleştirme\n    for column in df.select_dtypes(include=['number']).columns[:3]:\n        plt.figure(figsize=(8, 4))\n        plt.hist(df[column], bins=20)\n        plt.title(f"{column} dağılımı")\n        plt.xlabel(column)\n        plt.ylabel("Frekans")\n        plt.show()\n        \n    return df\n\`\`\`\n\nBu Python fonksiyonu, bir CSV dosyasını okur, temel istatistikleri gösterir, eksik değerleri kontrol eder ve sayısal sütunlar için histogram çizer.`;
      } else if (prompt.toLowerCase().includes('sql')) {
        responseText = `\`\`\`sql\n-- Müşteri ve sipariş verilerini birleştiren sorgu\nSELECT \n    c.customer_id,\n    c.first_name,\n    c.last_name,\n    c.email,\n    COUNT(o.order_id) AS total_orders,\n    SUM(o.amount) AS total_spent,\n    AVG(o.amount) AS average_order,\n    MAX(o.order_date) AS last_order_date\nFROM \n    customers c\nLEFT JOIN \n    orders o ON c.customer_id = o.customer_id\nGROUP BY \n    c.customer_id, c.first_name, c.last_name, c.email\nHAVING \n    COUNT(o.order_id) > 0\nORDER BY \n    total_spent DESC\nLIMIT 100;\n\`\`\`\n\nBu SQL sorgusu, müşteriler ve siparişler tablolarını birleştirir ve her müşteri için toplam sipariş sayısı, toplam harcama, ortalama sipariş tutarı ve son sipariş tarihini hesaplar. Sonuçlar, toplam harcamaya göre azalan sırada listelenir ve yalnızca en az bir siparişi olan müşteriler dahil edilir.`;
      } else if (prompt.toLowerCase().includes('error') || prompt.toLowerCase().includes('hata')) {
        responseText = "Bahsettiğiniz hata genellikle şu nedenlerden kaynaklanabilir:\n\n1. **Tip Uyumsuzluğu**: Beklenen veri tipi ile gelen veri tipi uyuşmuyor olabilir.\n2. **Eksik Değerler**: Fonksiyon null veya undefined değerlerle başa çıkamıyor olabilir.\n3. **Asenkron İşlemler**: Promise'lerin doğru şekilde işlenmemesi veya async/await kullanımında hatalar olabilir.\n\nKodu daha detaylı incelemem için hatanın tam mesajını ve ilgili kod bloğunu paylaşabilir misiniz?";
      } else {
        responseText = "İlginç bir soru! Size daha iyi yardımcı olabilmem için ne tür bir kod veya programlama dili ile çalıştığınızı belirtebilir misiniz?";
      }
      
      resolve({
        text: responseText,
        usage: {
          promptTokens: prompt.length / 4, // Yaklaşık token sayısı
          completionTokens: responseText.length / 4,
          totalTokens: (prompt.length + responseText.length) / 4
        }
      });
    }, 1500); // 1.5 saniyelik gecikme
  });
}

// ChatGPT benzeri bir sohbet API'si için fonksiyon
export async function sendChatMessage(
  messages: Array<{role: 'user' | 'system' | 'assistant', content: string}>,
  options?: {temperature?: number, model?: string, context?: any}
): Promise<{message: string, usage: {totalTokens: number}}> {
  const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
  
  // AI API'sine istek gönder
  const response = await sendAIRequest({
    prompt: lastUserMessage,
    temperature: options?.temperature || 0.7,
    model: options?.model || 'gpt-4o',
    context: options?.context
  });
  
  return {
    message: response.text,
    usage: {
      totalTokens: response.usage?.totalTokens || 0
    }
  };
}

/**
 * Editör bileşeni için özel AI yanıt simulasyonu
 * 
 * @param input Kullanıcı girdisi
 * @param activeFile Aktif dosya bilgisi
 * @returns Simüle edilmiş AI yanıtı
 */
export async function simulateAIResponse(input: string, activeFile?: any): Promise<string> {
  // Gerçek bir API çağrısını simüle etmek için kısa bir gecikme
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Dosya uzantısı ve içeriğe göre daha özel yanıtlar verelim
  let responseText = '';
  const inputLower = input.toLowerCase();
  
  // Dosya türüne göre özel yanıtlar
  if (activeFile?.name) {
    const fileExt = activeFile.name.split('.').pop().toLowerCase();
    
    // Dosya içeriği ve kullanıcı sorusuna bağlı özel yanıtlar
    if (inputLower.includes('bug') || inputLower.includes('hata') || inputLower.includes('fix')) {
      if (fileExt === 'js' || fileExt === 'jsx') {
        return `Kod incelemeniz için teşekkürler! Dosyanızda (\`${activeFile.name}\`) birkaç potansiyel sorun buldum:

1. **Olası Bug**: \`${getRandomFunctionName()}\` fonksiyonunda, parametreler doğrulanmadan kullanılıyor. Bu, beklenmeyen girdilerle çağrıldığında hatalara neden olabilir.

2. **Öneri**: Aşağıdaki gibi parametre doğrulaması ekleyin:

\`\`\`javascript
function ${getRandomFunctionName()}(data) {
  // Parametre kontrolü ekleyin
  if (!data || typeof data !== 'object') {
    throw new Error('Geçersiz veri formatı');
  }
  
  // İşleme devam edin
  return data.map(item => /* işlem */);
}
\`\`\`

3. **Performans İyileştirmesi**: Eğer veri büyükse, \`.reduce()\` yerine for döngüsü kullanmak daha performanslı olabilir.

Başka sorularınız varsa yardımcı olmaktan mutluluk duyarım!`;
      } else if (fileExt === 'html') {
        return `HTML dosyanız (\`${activeFile.name}\`) için bazı iyileştirme önerileri:

1. **Erişilebilirlik**: Tüm \`<img>\` etiketlerine \`alt\` özniteliği eklemenizi öneririm.

2. **SEO Optimizasyonu**: \`<meta>\` etiketlerinin tam olduğundan emin olun:

\`\`\`html
<meta name="description" content="Sitenizin açıklaması">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
\`\`\`

3. **Performans**: JavaScript dosyalarını \`<body>\` sonuna taşımayı veya \`defer\` özniteliği eklemeyi düşünün.

Başka sorularınız varsa bana sorabilirsiniz!`;
      } else if (fileExt === 'css') {
        return `CSS dosyanız (\`${activeFile.name}\`) için öneriler:

1. **Mobil Uyumluluk**: Media query'ler ekleyerek farklı ekran boyutlarına uyumlu hale getirin:

\`\`\`css
@media (max-width: 768px) {
  /* Tablet için stiller */
}

@media (max-width: 480px) {
  /* Mobil için stiller */
}
\`\`\`

2. **CSS Değişkenleri**: Renk paletinizi ve tekrar eden değerleri CSS değişkenleriyle tanımlayın:

\`\`\`css
:root {
  --primary-color: #3498db;
  --secondary-color: #2c3e50;
  --spacing-unit: 8px;
}
\`\`\`

Bu değişiklikleri yapmak projenizin bakımını kolaylaştıracaktır.`;
      }
    } else if (inputLower.includes('improve') || inputLower.includes('geliştir') || inputLower.includes('optimiz')) {
      if (fileExt === 'js' || fileExt === 'jsx') {
        return `JavaScript kodunuzu geliştirmek için öneriler:

1. **Async/Await**: Callback veya Promise zinciri yerine async/await kullanın:

\`\`\`javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Veri alınamadı:', error);
  }
}
\`\`\`

2. **Destructuring**: Obje ve dizilerde destructuring kullanarak daha temiz kod yazın.

3. **Modüler Yapı**: Kodunuzu küçük, yeniden kullanılabilir fonksiyonlara bölün.

Bu öneriler kodunuzun okunabilirliğini ve bakımını kolaylaştıracaktır.`;
      }
    } else if (inputLower.includes('explain') || inputLower.includes('açıkla')) {
      return `Bu kod şu işlevleri gerçekleştiriyor:

1. **Veri İşleme**: ${getRandomFunctionName()} fonksiyonu, API'den gelen verileri işliyor ve görüntülenmeye hazır hale getiriyor.

2. **UI Güncellemesi**: İşlenen veriler, kullanıcı arayüzünü güncellemek için kullanılıyor.

3. **Hata Yönetimi**: Try-catch blokları ile olası API hataları yakalanıp kullanıcıya gösteriliyor.

Bu yapı, modern web uygulamalarında yaygın olarak kullanılan bir veri akışı modelidir.`;
    } else if (inputLower.includes('test') || inputLower.includes('unit test')) {
      if (fileExt === 'js' || fileExt === 'jsx') {
        return `\`${activeFile.name}\` dosyasını test etmek için Jest kullanabilirsiniz:

\`\`\`javascript
import { ${getRandomFunctionName()} } from './${activeFile.name.replace('.js', '')}';

describe('${getRandomFunctionName()} fonksiyonu', () => {
  test('geçerli girdiyle doğru sonuç döndürmeli', () => {
    // Test verisi
    const testInput = { /* test verileri */ };
    
    // Fonksiyonu çağır
    const result = ${getRandomFunctionName()}(testInput);
    
    // Sonucu doğrula
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('id');
  });
  
  test('geçersiz girdiyle hata fırlatmalı', () => {
    // Geçersiz veri ile fonksiyonu çağır
    expect(() => {
      ${getRandomFunctionName()}(null);
    }).toThrow();
  });
});
\`\`\`

Bu testleri çalıştırmak için:

1. Jest kurulumu: \`npm install --save-dev jest\`
2. Test komutu: \`npx jest\``;
      }
    }
  }
  
  // Genel yanıtlar (özel yanıt bulunamazsa)
  if (!responseText) {
    if (inputLower.includes('merhaba') || inputLower.includes('selam')) {
      responseText = "Merhaba! Size nasıl yardımcı olabilirim? Kod yazma, hata ayıklama veya geliştirme konularında yardım edebilirim.";
    } else if (inputLower.includes('javascript') || inputLower.includes('js')) {
      responseText = `JavaScript için modern pratikler:

\`\`\`javascript
// Modern JavaScript best practice örneği

// 1. Let ve Const kullanımı
let counter = 0;
const API_URL = 'https://api.example.com';

// 2. Arrow fonksiyonlar
const processItems = (items) => {
  return items
    .filter(item => item.active)
    .map(item => ({
      ...item,
      processed: true,
      timestamp: new Date().toISOString()
    }));
};

// 3. Async/Await
async function fetchData() {
  try {
    const response = await fetch(API_URL);
    return await response.json();
  } catch (error) {
    console.error('Veri çekme hatası:', error);
    return [];
  }
}

// 4. Optional chaining ve nullish coalescing
const getUserName = (user) => {
  return user?.profile?.name ?? 'İsimsiz Kullanıcı';
};
\`\`\`

Bu pratikler, kodunuzu daha okunabilir ve bakımı daha kolay hale getirecektir.`;
    } else if (inputLower.includes('react')) {
      responseText = `Modern React geliştirme için best practice'ler:

\`\`\`jsx
import { useState, useEffect, useMemo } from 'react';

// 1. Fonksiyonel bileşenler ve hooks
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. useEffect ile veri çekme
  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const response = await fetch(\`/api/users/\${userId}\`);
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchUser();
    }
    
    // Cleanup function
    return () => {
      // Cancel any pending requests
    };
  }, [userId]);

  // 3. useMemo ile hesaplama optimizasyonu
  const userStats = useMemo(() => {
    if (!user) return null;
    
    return {
      totalPosts: user.posts?.length || 0,
      joinedDate: new Date(user.joinDate).toLocaleDateString(),
      isVerified: Boolean(user.verification?.date)
    };
  }, [user]);

  // 4. Yükleme ve hata durumlarını yönetme
  if (loading) return <div className="loading-spinner" aria-label="Loading" />;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!user) return <div>No user found</div>;

  // 5. JSX'in bölünmesi ve düzenlenmesi
  return (
    <div className="user-profile">
      <header>
        <h1>{user.name}</h1>
        <p className="user-bio">{user.bio}</p>
      </header>
      
      <section className="user-stats">
        <h2>Stats</h2>
        <p>Posts: {userStats.totalPosts}</p>
        <p>Joined: {userStats.joinedDate}</p>
        {userStats.isVerified && <p className="verified-badge">Verified</p>}
      </section>
    </div>
  );
}
\`\`\`

Bu örnek, modern React uygulamalarında kullanılan hooks, veri yönetimi, optimizasyon ve component yapısını göstermektedir.`;
    } else {
      responseText = "Sorunuzu aldım. Size daha iyi yardımcı olabilmem için projenizdeki spesifik bir problemden veya geliştirmek istediğiniz bir konudan bahsedebilir misiniz?";
    }
  }
  
  return responseText;
}

// Rastgele fonksiyon ismi üret (AI yanıtlarını daha gerçekçi yapmak için)
function getRandomFunctionName(): string {
  const functionNames = [
    'processData', 'fetchUserData', 'calculateTotal', 'validateInput', 
    'transformItems', 'initializeConfig', 'renderComponent', 'updateUserState',
    'filterResults', 'sortItems', 'formatOutput', 'parseResponse'
  ];
  
  return functionNames[Math.floor(Math.random() * functionNames.length)];
}
