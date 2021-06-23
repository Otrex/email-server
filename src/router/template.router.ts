import express from 'express';
import TemplateController from '../controllers/Template.controller';

const router = express.Router();

router.get('/', TemplateController.getTemplates);
router.post('/', TemplateController.createTemplate);
router.get('/:templateId', TemplateController.getTemplate);
router.patch('/:templateId', TemplateController.updateTemplate);
router.post('/:templateId/send', TemplateController.sendTemplate);

export default router;
