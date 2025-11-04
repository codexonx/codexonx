/**
 * AI Kod API Rotaları
 * Yapay zeka kod yazma API'si için rotaları tanımlar
 */

import express from 'express';
import { authenticate, restrictTo } from '../middlewares/auth';
import { queryAI, chat, completeCode, improveCode, getUsageStats } from '../controllers/ai-code';

const router = express.Router();

// Tüm rotalar için kimlik doğrulama gerekli
router.use(authenticate);

/**
 * @route   POST /api/ai/query
 * @desc    AI'ya direkt sorgu gönder
 * @access  Private
 */
router.post('/query', queryAI);

/**
 * @route   POST /api/ai/chat
 * @desc    Sohbet tabanlı AI yanıtı
 * @access  Private
 */
router.post('/chat', chat);

/**
 * @route   POST /api/ai/code/complete
 * @desc    Kod tamamlama
 * @access  Private
 */
router.post('/code/complete', completeCode);

/**
 * @route   POST /api/ai/code/improve
 * @desc    Kod iyileştirme ve optimizasyon
 * @access  Private
 */
router.post('/code/improve', improveCode);

/**
 * @route   GET /api/ai/usage/:userId
 * @desc    Kullanıcı AI kullanım istatistikleri
 * @access  Private
 */
router.get('/usage/:userId', getUsageStats);

/**
 * @route   GET /api/ai/usage/all
 * @desc    Tüm kullanıcıların AI kullanım istatistikleri
 * @access  Admin
 */
router.get('/usage/all', restrictTo('ADMIN'), async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Bu endpoint henüz tamamlanmadı',
  });
});

export default router;
