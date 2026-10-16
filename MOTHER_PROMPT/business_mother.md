# business_mother

Standing spec for the Influnz business side. The business UI is finished. Do not change business screens, business routes, business layout, or business styling unless the user explicitly reopens business work.

Source: `Creator_and_Customer_Complete_Product_Flow.docx`, sections 6, 14.1, 15 and 20.

## Product stance

Influnz is an AI-operated creator commerce system, not a public job board. The business tells the AI the outcome and the budget. The AI turns that into a brief, a strategy, a creator set and a negotiation, and the business approves every commitment.

Normal path: private invitations to creators the business or its AI selected. Creator Discovery is an optional supply channel, not the default.

AI recommends. Humans authorize. Estimates are recommendations, not guaranteed results. Every agent action stays inside explicit guardrails and stays auditable.

## Locked flow

Sign up → business verification → profile → campaign brief → structured brief → strategy → creator intelligence → creator selection → guardrails → private invitations → negotiation → contract → campaign workspace → content check → approval → payment → performance → optimization.

Campaign states: Draft → Brief Confirmed → Strategy Generated → Strategy Approved → Creator Sourcing → Invitations Sent → Negotiating → Contracts Pending → Active → Content Review → Approved → Completed. Exceptions: Paused, Cancelled, Disputed, Failed, Awaiting Replacement.

Budget states must stay distinct: campaign budget, reserved, committed, paid, pending, available, returned.

## Screens already built

Do not redesign these. They are the finished business UI.

| Screen | Route |
| --- | --- |
| Dashboard | `/business` |
| Campaign list | `/business/campaigns` |
| New campaign (AI assistant + manual setup) | `/business/campaigns/new` |
| AI strategy wizard | `/business/campaigns/ai-strategy` |
| Campaign parameters | `/business/campaigns/parameters` |
| Strategy comparison | `/business/campaigns/strategy` |
| Creator selection for a campaign | `/business/campaigns/creators` |
| Negotiation guardrails | `/business/campaigns/guardrails` |
| Negotiation / campaign workspace | `/business/campaigns/negotiate` and `/business/campaigns/:id` |
| Invitations | `/business/campaigns/invitations` |
| Content review | `/business/campaigns/:id/content` |
| Analytics | `/business/analytics` |
| Payments | `/business/payments` |
| Notifications | `/business/notifications` |
| Settings | `/business/settings` |

Sidebar: Dashboard, New Campaign, Campaigns, Payments, Analytics, Settings. The standalone Creators browse page was removed. Creator selection stays inside the campaign flow at `/business/campaigns/creators`.

Header: a Back control on every business screen except the first landing on the dashboard. Back returns to the previous screen.

## Rules that stay true

- Conversational brief and manual setup are both available.
- Show what the AI understood before generating a strategy. Do not silently assume a critical constraint.
- Strategy is a portfolio (reach, performance, community, hybrid), not a raw creator dump. Show mix, count, spend, expected reach, expected actions, trade-offs, confidence and reasoning.
- Separate total campaign budget from committed creator spend.
- Creator fit includes a reason, not only a score.
- Guardrails: total budget, max per creator, minimum score, minimum audience match, allowed categories, approval threshold, max creator count. The agent stops at the boundary.
- A deal is not active until terms are agreed and the contract step is complete.
- Content checks (product, brand, CTA, disclosure, format) are warnings for review, not a legal verdict.
- Payment status is separate from campaign status.
- If a creator declines or drops out, offer a replacement without restarting the campaign.
- Missing performance data is labeled incomplete. Never invent metrics.
