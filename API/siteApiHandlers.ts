import { SiteTag, SiteTagsResponse, SiteEmbededTag } from '../types';
import { tryParse } from '../utils/tryParse';
import {
  setConfig,
  addTagEmbeds,
  updateConsentCategories,
} from '../modules/stateCache';
import { error } from '../utils/logger';
import { applySiteEmbeds } from '../modules/siteEmbedder';

export function siteEmbedsHandler(
  response: string,
  shouldInitConsentPolicyManager = false,
) {
  const embedsData: SiteTagsResponse = tryParse(response);
  if (embedsData.errors && embedsData.errors.length > 0) {
    error(JSON.stringify(embedsData.errors));
  }
  if (embedsData.config) {
    updateConsentCategories(embedsData.config.consentPolicy);
    if (shouldInitConsentPolicyManager && window.consentPolicyManager) {
      window.consentPolicyManager.init({
        consentPolicy: embedsData.config.consentPolicy,
      });
    }
    setConfig(embedsData.config);
  }
  if (embedsData.tags) {
    addTagEmbeds(embedsData.tags);
    applySiteEmbeds();
  }
}
