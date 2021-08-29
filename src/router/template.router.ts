import express from 'express';
import TemplateController from '../controllers/Template.controller';

const router = express.Router();

router.route('/').get(TemplateController.getTemplates).post(TemplateController.createTemplate);

router
  .route('/:templateId')
  .get(TemplateController.getTemplate)
  .patch(TemplateController.updateTemplate)
  .delete(TemplateController.deleteTemplate);

router.post('/:templateId/send', TemplateController.sendTemplate);

export default router;
