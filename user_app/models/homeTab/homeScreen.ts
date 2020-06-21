import {SortedTags} from '../../models/tag';
import {BaseAdvisor} from '../../models/advisor';

export interface AdvisorCardInterface extends BaseAdvisor {
  tags: SortedTags;
}
