#!/bin/bash

# CodeXONX Platform Deployment Script
# Bu script, CodeXONX platformunu belirlenen ortamlara deploy etmek için kullanılır

# Renkli log için fonksiyonlar
log() { echo -e "\033[0;32m[INFO]\033[0m $1"; }
error() { echo -e "\033[0;31m[ERROR]\033[0m $1"; }
warn() { echo -e "\033[0;33m[WARNING]\033[0m $1"; }

# Kullanım bilgisi
usage() {
  echo "Kullanım: ./deploy.sh [seçenekler]"
  echo ""
  echo "Seçenekler:"
  echo "  -e, --env ENV         Deployment ortamı (development, staging, production)"
  echo "  -p, --platform PLAT   Deployment platformu (vercel, netlify, docker, k8s)"
  echo "  -h, --help            Bu yardım mesajını gösterir"
  echo ""
  echo "Örnek:"
  echo "  ./deploy.sh -e production -p vercel"
}

# Varsayılan değerler
ENV="development"
PLATFORM="vercel"

# Parametreleri oku
while (( "$#" )); do
  case "$1" in
    -e|--env)
      ENV="$2"
      shift 2
      ;;
    -p|--platform)
      PLATFORM="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *) # Bilinmeyen seçenek
      error "Bilinmeyen seçenek: $1"
      usage
      exit 1
      ;;
  esac
done

# Ortam doğrulama
if [[ ! "$ENV" =~ ^(development|staging|production)$ ]]; then
  error "Geçersiz ortam: $ENV. Geçerli değerler: development, staging, production"
  exit 1
fi

# Platform doğrulama
if [[ ! "$PLATFORM" =~ ^(vercel|netlify|docker|k8s)$ ]]; then
  error "Geçersiz platform: $PLATFORM. Geçerli değerler: vercel, netlify, docker, k8s"
  exit 1
fi

# Değerleri ekrana yazdır
log "Deployment Bilgileri:"
log "- Ortam: $ENV"
log "- Platform: $PLATFORM"
echo ""

# Bağımlılıkları kontrol et
check_dependencies() {
  log "Bağımlılıklar kontrol ediliyor..."
  
  if [[ "$PLATFORM" == "vercel" ]]; then
    if ! command -v vercel &> /dev/null; then
      error "vercel CLI bulunamadı. Lütfen yükleyin: npm i -g vercel"
      exit 1
    fi
  elif [[ "$PLATFORM" == "netlify" ]]; then
    if ! command -v netlify &> /dev/null; then
      error "netlify CLI bulunamadı. Lütfen yükleyin: npm i -g netlify-cli"
      exit 1
    fi
  elif [[ "$PLATFORM" == "docker" ]]; then
    if ! command -v docker &> /dev/null; then
      error "docker bulunamadı. Lütfen yükleyin."
      exit 1
    fi
    if ! command -v docker-compose &> /dev/null; then
      error "docker-compose bulunamadı. Lütfen yükleyin."
      exit 1
    fi
  elif [[ "$PLATFORM" == "k8s" ]]; then
    if ! command -v kubectl &> /dev/null; then
      error "kubectl bulunamadı. Lütfen yükleyin."
      exit 1
    fi
  fi
  
  log "Tüm bağımlılıklar hazır."
}

# Ortam değişkenlerini ayarla
setup_env_vars() {
  log "Ortam değişkenleri ayarlanıyor..."
  
  if [[ "$ENV" == "development" ]]; then
    cp ./apps/web/.env.example ./apps/web/.env.local
    cp ./apps/server/.env.example ./apps/server/.env
    log "Geliştirme ortam değişkenleri ayarlandı."
  elif [[ "$ENV" == "staging" ]]; then
    cp ./apps/web/.env.staging ./apps/web/.env.local
    cp ./apps/server/.env.staging ./apps/server/.env
    log "Staging ortam değişkenleri ayarlandı."
  elif [[ "$ENV" == "production" ]]; then
    cp ./apps/web/.env.production ./apps/web/.env.local
    cp ./apps/server/.env.production ./apps/server/.env
    log "Üretim ortam değişkenleri ayarlandı."
  fi
}

# Uygulamayı build et
build_app() {
  log "Uygulama build ediliyor..."
  
  npm install
  npm run build
  
  if [ $? -ne 0 ]; then
    error "Build başarısız oldu!"
    exit 1
  fi
  
  log "Uygulama başarıyla build edildi."
}

# Vercel'e deploy et
deploy_to_vercel() {
  log "Vercel'e deploy ediliyor..."
  
  cd ./apps/web
  
  if [[ "$ENV" == "production" ]]; then
    vercel --prod
  else
    vercel
  fi
  
  if [ $? -ne 0 ]; then
    error "Vercel deployment başarısız oldu!"
    exit 1
  fi
  
  cd ../../
  log "Vercel deployment başarılı!"
}

# Netlify'a deploy et
deploy_to_netlify() {
  log "Netlify'a deploy ediliyor..."
  
  cd ./apps/web
  
  if [[ "$ENV" == "production" ]]; then
    netlify deploy --prod
  else
    netlify deploy
  fi
  
  if [ $? -ne 0 ]; then
    error "Netlify deployment başarısız oldu!"
    exit 1
  fi
  
  cd ../../
  log "Netlify deployment başarılı!"
}

# Docker ile deploy et
deploy_with_docker() {
  log "Docker ile deploy ediliyor..."
  
  docker-compose -f docker-compose.yml -f docker-compose.$ENV.yml build
  docker-compose -f docker-compose.yml -f docker-compose.$ENV.yml up -d
  
  if [ $? -ne 0 ]; then
    error "Docker deployment başarısız oldu!"
    exit 1
  fi
  
  log "Docker deployment başarılı!"
}

# Kubernetes ile deploy et
deploy_to_k8s() {
  log "Kubernetes'e deploy ediliyor..."
  
  kubectl apply -f k8s/$ENV/
  
  if [ $? -ne 0 ]; then
    error "Kubernetes deployment başarısız oldu!"
    exit 1
  fi
  
  log "Kubernetes deployment başarılı!"
}

# Veritabanı migrasyonlarını çalıştır
run_migrations() {
  log "Veritabanı migrasyonları çalıştırılıyor..."
  
  cd ./apps/server
  npx prisma migrate deploy
  
  if [ $? -ne 0 ]; then
    error "Veritabanı migrasyonları başarısız oldu!"
    exit 1
  fi
  
  cd ../../
  log "Veritabanı migrasyonları başarıyla tamamlandı."
}

# Ana işlem
main() {
  log "CodeXONX Platform deployment başlatılıyor..."
  
  check_dependencies
  setup_env_vars
  build_app
  
  if [[ "$PLATFORM" == "vercel" ]]; then
    deploy_to_vercel
  elif [[ "$PLATFORM" == "netlify" ]]; then
    deploy_to_netlify
  elif [[ "$PLATFORM" == "docker" ]]; then
    deploy_with_docker
    run_migrations
  elif [[ "$PLATFORM" == "k8s" ]]; then
    deploy_to_k8s
    run_migrations
  fi
  
  log "CodeXONX Platform deployment tamamlandı!"
}

# Scripti çalıştır
main
