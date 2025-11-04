'use client';

import { useState } from 'react';
import type { ChangeEvent } from 'react';
import {
  FileCode,
  Terminal,
  Users,
  Code,
  ArrowRight,
  Star,
  MessageSquare,
  Cpu,
  Database,
  Zap as ZapIcon,
  Plus,
  Search as SearchIcon,
} from 'lucide-react';
import { CodexonxButton } from '@/components/custom/CodexonxButton';
import { CodexonxCard } from '@/components/custom/CodexonxCard';
import {
  Box,
  Text,
  Heading,
  Flex,
  Badge,
  InputGroup,
  Input as ChakraInput,
  InputLeftElement,
  HStack,
  BoxProps,
} from '@chakra-ui/react';

// Özellikler
const features = [
  {
    icon: <Cpu size={24} />,
    title: 'Güçlü AI Desteği',
    description: 'Yapay zeka destekli kod önerileri ve tamamlama',
    color: 'orange.500',
  },
  {
    icon: <Database size={24} />,
    title: 'Akıllı Kod Depolama',
    description: 'Projelerinizi güvenle saklayın ve yönetin',
    color: 'blue.500',
  },
  {
    icon: <Users size={24} />,
    title: 'İşbirliği',
    description: 'Ekip arkadaşlarınızla gerçek zamanlı çalışın',
    color: 'green.500',
  },
  {
    icon: <ZapIcon size={24} />,
    title: 'Hızlı ve Verimli',
    description: 'Yüksek performanslı kod yazma deneyimi',
    color: 'purple.500',
  },
];

// Örnek proje verileri
const recentProjects = [
  {
    id: 1,
    name: 'Web Uygulaması',
    description: 'React ve Next.js ile geliştirilmiş web uygulaması',
    language: 'typescript',
    lastUpdated: '2 saat önce',
    color: 'blue.500',
  },
  {
    id: 2,
    name: 'API Servisi',
    description: 'Node.js ve Express ile REST API',
    language: 'javascript',
    lastUpdated: '1 gün önce',
    color: 'yellow.500',
  },
  {
    id: 3,
    name: 'ML Algoritması',
    description: 'Python ile makine öğrenimi modeli',
    language: 'python',
    lastUpdated: '3 gün önce',
    color: 'green.500',
  },
];

const templates = [
  {
    id: 1,
    name: 'Next.js Web Uygulaması',
    description: 'TypeScript, React ve Next.js ile hazır web şablonu',
    stars: 235,
    language: 'typescript',
  },
  {
    id: 2,
    name: 'REST API',
    description: 'Node.js ve Express ile RESTful API şablonu',
    stars: 189,
    language: 'javascript',
  },
  {
    id: 3,
    name: 'Veri Analizi',
    description: 'Python ile veri analizi ve görselleştirme şablonu',
    stars: 156,
    language: 'python',
  },
];

// Dil renkleri
const languageColors: Record<string, string> = {
  typescript: 'bg-blue-500',
  javascript: 'bg-yellow-400',
  python: 'bg-green-500',
  java: 'bg-brown-500',
  csharp: 'bg-purple-600',
  go: 'bg-blue-400',
};

const LanguageBadge = ({ language }: { language: string }) => {
  const colors = {
    typescript: 'blue',
    javascript: 'yellow',
    python: 'green',
    default: 'gray',
  };

  return (
    <Badge
      colorScheme={colors[language as keyof typeof colors] || colors.default}
      px={2}
      py={1}
      borderRadius="md"
    >
      {language.charAt(0).toUpperCase() + language.slice(1)}
    </Badge>
  );
};

// Custom Stack component
const CustomStack = ({
  children,
  spacing = 0,
  align = 'stretch',
  ...props
}: BoxProps & { spacing?: number; align?: string }) => (
  <Box
    display="flex"
    flexDirection="column"
    gap={`${spacing * 0.25}rem`}
    alignItems={align as any}
    {...props}
  >
    {children}
  </Box>
);

// Custom SimpleGrid component
const CustomSimpleGrid = ({
  children,
  columns,
  spacing = 6,
  ...props
}: BoxProps & {
  columns: { base?: number; md?: number; lg?: number };
  spacing?: number;
}) => {
  const gridTemplateColumns = {
    base: `repeat(${columns.base || 1}, 1fr)`,
    md: `repeat(${columns.md || columns.base || 1}, 1fr)`,
    lg: `repeat(${columns.lg || columns.md || columns.base || 1}, 1fr)`,
  };

  return (
    <Box
      className="flex-1"
      display="grid"
      gap={`${spacing * 0.25}rem`}
      gridTemplateColumns={gridTemplateColumns as any}
      {...props}
    >
      {children}
    </Box>
  );
};

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Box p={6} bg="gray.900" minH="100vh">
      {/* Üst Kısım - Hoş Geldiniz ve Arama */}
      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Heading size="lg" color="white" mb={1}>
            Merhaba, Kullanıcı 👋
          </Heading>
          <Text color="gray.400">Bugün nasıl yardımcı olabilirim?</Text>
        </Box>
        <CodexonxButton
          leftIcon={<Plus size={18} />}
          size="lg"
          bg="brand.500"
          _hover={{ bg: 'brand.600' }}
        >
          Yeni Proje
        </CodexonxButton>
      </Flex>

      {/* Arama Çubuğu */}
      <InputGroup maxW="2xl" mb={8}>
        <InputLeftElement pointerEvents="none">
          <Box as="span" color="gray.500">
            <SearchIcon size={20} />
          </Box>
        </InputLeftElement>
        <ChakraInput
          placeholder="Proje, şablon veya komut ara..."
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          bg="gray.800"
          borderColor="gray.700"
          _hover={{ borderColor: 'gray.600' }}
          _focus={{
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          }}
          color="white"
          _placeholder={{ color: 'gray.500' }}
        />
      </InputGroup>

      {/* Özellikler */}
      <CustomSimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        {features.map((feature, index) => (
          <CodexonxCard
            key={index}
            p={6}
            _hover={{
              transform: 'translateY(-4px)',
              borderColor: feature.color,
              boxShadow: 'xl',
            }}
          >
            <Box color={feature.color} mb={4}>
              {feature.icon}
            </Box>
            <Heading size="md" mb={2} color="white">
              {feature.title}
            </Heading>
            <Text color="gray.400">{feature.description}</Text>
          </CodexonxCard>
        ))}
      </CustomSimpleGrid>

      {/* İstatistikler */}
      <CustomSimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        {[
          { title: 'Toplam Proje', value: '12', change: '+2', icon: <FileCode size={20} /> },
          { title: 'Aktif Kullanıcı', value: '573', change: '+201', icon: <Users size={20} /> },
          { title: 'Kod Satırı', value: '12,234', change: '+1,234', icon: <Code size={20} /> },
          { title: 'API İsteği', value: '12,234', change: '+19%', icon: <Terminal size={20} /> },
        ].map((stat, index) => (
          <CodexonxCard key={index} p={6}>
            <Flex justify="space-between" align="center">
              <Box>
                <Text color="gray.400" mb={1}>
                  {stat.title}
                </Text>
                <Flex align="baseline">
                  <Heading size="lg" color="white" mr={2}>
                    {stat.value}
                  </Heading>
                  <Text color="green.400" fontSize="sm">
                    {stat.change}
                  </Text>
                </Flex>
              </Box>
              <Box p={2} bg="rgba(255, 107, 53, 0.1)" borderRadius="lg">
                {stat.icon}
              </Box>
            </Flex>
          </CodexonxCard>
        ))}
      </CustomSimpleGrid>

      {/* Son Projeler ve Şablonlar */}
      <CustomSimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
        {/* Son Projeler */}
        <CodexonxCard>
          <Box p={6}>
            <Flex justify="space-between" align="center" mb={6}>
              <Heading size="md" color="white">
                Son Projeler
              </Heading>
              <CodexonxButton variant="ghost" size="sm">
                Tümünü Gör
              </CodexonxButton>
            </Flex>
            <CustomStack spacing={4} align="stretch">
              {recentProjects.map(project => (
                <Box
                  key={project.id}
                  p={4}
                  borderRadius="md"
                  bg="gray.800"
                  _hover={{
                    bg: 'gray.750',
                    transform: 'translateX(4px)',
                  }}
                  transition="all 0.2s"
                >
                  <Flex justify="space-between" align="flex-start">
                    <Box>
                      <Flex align="center" mb={1}>
                        <Box w="8px" h="8px" bg={project.color} borderRadius="full" mr={2} />
                        <Text fontWeight="medium" color="white">
                          {project.name}
                        </Text>
                      </Flex>
                      <Text color="gray.400" fontSize="sm" mb={2}>
                        {project.description}
                      </Text>
                      <HStack spacing={2}>
                        <LanguageBadge language={project.language} />
                        <Text color="gray.500" fontSize="xs">
                          {project.lastUpdated}
                        </Text>
                      </HStack>
                    </Box>
                    <Box as="button" aria-label="Projeyi aç">
                      <ArrowRight size={16} />
                    </Box>
                  </Flex>
                </Box>
              ))}
            </CustomStack>
          </Box>
        </CodexonxCard>

        {/* Şablonlar */}
        <CodexonxCard>
          <Box p={6}>
            <Flex justify="space-between" align="center" mb={6}>
              <Heading size="md" color="white">
                Popüler Şablonlar
              </Heading>
              <CodexonxButton variant="ghost" size="sm">
                Tüm Şablonlar
              </CodexonxButton>
            </Flex>
            <CustomStack spacing={4} align="stretch">
              {templates.map(template => (
                <Box
                  key={template.id}
                  p={4}
                  borderRadius="md"
                  bg="gray.800"
                  _hover={{
                    bg: 'gray.750',
                    transform: 'translateX(4px)',
                  }}
                  transition="all 0.2s"
                >
                  <Flex justify="space-between" align="flex-start">
                    <Box>
                      <Text fontWeight="medium" color="white" mb={1}>
                        {template.name}
                      </Text>
                      <Text color="gray.400" fontSize="sm" mb={2}>
                        {template.description}
                      </Text>
                      <Flex align="center">
                        <Star
                          size={14}
                          style={{ color: '#fbbf24', fill: '#fbbf24' }}
                          className="mr-1"
                        />
                        <Text color="gray.500" fontSize="sm">
                          {template.stars}
                        </Text>
                      </Flex>
                    </Box>
                    <CodexonxButton size="sm" variant="outline">
                      Kullan
                    </CodexonxButton>
                  </Flex>
                </Box>
              ))}
            </CustomStack>
          </Box>
        </CodexonxCard>
      </CustomSimpleGrid>

      {/* Destek Sohbeti */}
      <Box position="fixed" bottom={6} right={6} zIndex={1000}>
        <CodexonxButton
          leftIcon={<MessageSquare size={18} />}
          bg="brand.500"
          _hover={{ bg: 'brand.600' }}
          size="lg"
          boxShadow="lg"
        >
          Yardıma mı ihtiyacınız var?
        </CodexonxButton>
      </Box>
    </Box>
  );
}
