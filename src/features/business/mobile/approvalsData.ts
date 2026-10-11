/**
 * Pending approvals for the mobile screens, derived from the campaign workspace data:
 * content waiting for review and counter offers that need the business owner.
 * Decisions are kept in sessionStorage until approvals come from the API.
 */
import { INITIAL_CREATORS, type ContentDeliverable, type CreatorData } from '../campaignWorkspaceData';
import { splitType } from './workspaceUtils';

export type ApprovalKind = 'content' | 'offer';
export type Decision = 'approved' | 'revision' | 'accepted' | 'declined';

export interface PendingApproval {
  id: string;
  kind: ApprovalKind;
  creator: CreatorData;
  campaignName: string;
  title: string;
  detail: string;
  path: string;
  deliverable?: ContentDeliverable;
}

const DECISIONS_KEY = 'influnz.approvals.decisions';
const WORKSPACE_CAMPAIGN = { id: 1, name: 'Chennai Café Launch' };

function readDecisions(): Record<string, Decision> {
  try {
    return JSON.parse(sessionStorage.getItem(DECISIONS_KEY) ?? '{}') as Record<string, Decision>;
  } catch {
    return {};
  }
}

export const decisionFor = (id: string): Decision | undefined => readDecisions()[id];

export function setDecision(id: string, decision: Decision) {
  sessionStorage.setItem(DECISIONS_KEY, JSON.stringify({ ...readDecisions(), [id]: decision }));
}

export const contentApprovalId = (d: ContentDeliverable) => `content:${d.id}`;
export const offerApprovalId = (c: CreatorData) => `offer:${c.id}`;

/** Deliverable status including any decision made on mobile this session. */
export function deliverableStatus(d: ContentDeliverable): ContentDeliverable['status'] {
  const decision = decisionFor(contentApprovalId(d));
  if (decision === 'approved') return 'approved';
  if (decision === 'revision') return 'revision';
  return d.status;
}

export function getPendingApprovals(): PendingApproval[] {
  const base = `/business/campaigns/${WORKSPACE_CAMPAIGN.id}`;
  const list: PendingApproval[] = [];
  for (const c of INITIAL_CREATORS) {
    if (c.status === 'intervene' && !decisionFor(offerApprovalId(c))) {
      list.push({
        id: offerApprovalId(c),
        kind: 'offer',
        creator: c,
        campaignName: WORKSPACE_CAMPAIGN.name,
        title: 'Counter offer needs your call',
        detail: `Asked ${c.creatorAsk} • Your offer ${c.finalOffer}`,
        path: `${base}?creator=${c.id}&ctab=communication`,
      });
    }
    for (const d of c.contentDeliverables) {
      if (d.status !== 'in_review' || decisionFor(contentApprovalId(d))) continue;
      list.push({
        id: contentApprovalId(d),
        kind: 'content',
        creator: c,
        campaignName: WORKSPACE_CAMPAIGN.name,
        title: d.title,
        detail: `${splitType(d.type).name} • ${d.submittedDate.replace(/^Submitted on\s*/, '')}`,
        path: `${base}?creator=${c.id}&content=${d.id}`,
        deliverable: d,
      });
    }
  }
  return list;
}
