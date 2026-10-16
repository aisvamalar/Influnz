# creator_mother

Standing spec for all future Influnz creator-side UI work. Read this before changing creator screens.

Business UI is finished. Do not edit business pages, business layout, business CSS, landing, or auth except where a creator-only screen must link out. If a task touches both sides, change only the creator side.

Source: `Creator_and_Customer_Complete_Product_Flow.docx`, sections 7, 8, 9, 10, 12, 14.2, 16 and 20.

## Product stance

The creator key moment is: “Here is a campaign that fits you.” The creator accepts, counters, or declines. They are not applying to a public job.

An invitation is not a hire. Hiring happens only after commercial terms are agreed and the contract step is complete. Expression of interest in Discovery does not reserve budget and does not create a commitment.

The creator AI agent may negotiate only inside the creator’s own rules: minimum rate, blocked categories, exclusivity cap, languages, locations, formats, usage-rights limits and availability. Those are constraints, not suggestions.

Campaign pay is separate from long-term rewards. Equity-linked rewards are never shown as guaranteed. Show eligibility only.

## Visual direction

Match the warmth and finish of the completed business UI, but keep the creator app its own surface.

- Light warm canvas, white cards, coral as the single action color, ink text, quiet gray support text.
- One clear primary action per screen. Accept is the positive action, Counter is secondary, Decline is quiet and never styled as the main button.
- Status is a small labeled chip, not a paragraph. Use the state names in this prompt.
- Money is always in rupees, with pending, processing, paid, failed and disputed kept visually distinct.
- Empty, loading and error states are part of the screen, not an afterthought.
- Mobile and desktop both exist. Change the layout that the viewport actually renders. Do not leave a desktop-only or mobile-only dead end.
- Do not add a public “apply and get hired” control. Discovery uses “Express interest”.

## Navigation

Creator shell routes that already exist. Enhance these screens. Do not invent a parallel creator app.

| Screen | Route | What the creator must see |
| --- | --- | --- |
| Verify | `/creator/onboarding/verify` | Contact, identity, connected social accounts, checklist |
| Creator Passport | `/creator/onboarding/passport` and `/creator/profile` | Name, verification, category, city, languages, platforms, followers, median views, engagement, audience, campaign history, brand rating, reliability |
| Preferences | `/creator/onboarding/preferences` and `/creator/preferences` | Min rate, accepted and blocked categories, languages, locations, platforms, exclusivity cap, formats, usage-rights limits, availability, AI negotiation permission |
| Dashboard | `/creator/dashboard` | New invitations, active campaigns, earnings, Creator Score, performance, pending actions, growth, referrals |
| Invitations | `/creator/invitations` | Private invitations only. Not a job board |
| Invitation detail | `/creator/invitations/:id` | Brand and trust, why selected, objective, deliverables, price, deadline, usage rights, exclusivity, payment protection, Accept / Counter / Decline |
| Negotiation | `/creator/negotiation/:id` | Creator minimum, flexibility, blocked rules, offer history. Agent cannot cross the creator’s floor |
| Deal room | `/creator/deal/:id` | The same deal version the business is approving: rate, deliverables, deadline, usage, exclusivity, revisions, disclosure, payment terms |
| Contract | `/creator/contract/:id` | Review, accept, lock the version. Later changes are amendments, not silent edits |
| Campaigns | `/creator/campaigns` | Active and past work |
| Campaign workspace | `/creator/campaigns/:id` | Brief, deliverables, timeline, assistant, submission requirements, compliance checklist, revision requests, payment status |
| Earnings | `/creator/earnings` | Total, pending, paid, upcoming (labeled expected), invoices, active campaigns |
| Reputation | `/creator/reputation` | Content quality, communication, timeliness, reliability |
| Growth | `/creator/growth` | Performance the brand has allowed the creator to see |
| Referrals | `/creator/referrals` | Business referrals and creator referrals, qualification status, no guaranteed equity |
| Rewards | `/creator/rewards` | Contribution progress toward Contributor or Creator Partner. Eligibility, not a promise of equity |

Back control: every creator screen except the first landing on the dashboard has a visible Back control that returns to the previous creator screen. Onboarding steps go back one step. Invitation detail goes back to invitations. Negotiation, deal and contract go back to the invitation or campaign they came from. Campaign workspace goes back to campaigns.

## Required behavior

Invitation states: Created → Sent → Viewed → Accepting / Countering / Declined → Accepted → Contract Pending → Confirmed → Expired / Cancelled.

Deliverable states: Not Started → In Progress → Submitted → AI Check → Business Review → Changes Requested → Resubmitted → Approved → Published.

Payment states: Pending, Processing, Paid, Failed, Disputed. Upcoming amounts are labeled expected, not earned.

Content checks before submit, when possible: product, brand, CTA, disclosure, format, deliverable count. Show the exact failed check. A requested change outside the contract is a scope change, not a normal revision.

Discovery, if shown, is a separate area. The action is Express interest, never Claim or Apply and hire. If sourcing is closed or the budget is exhausted, say so and do not take a new interest.

Notifications the creator must be able to understand: new invitation, counter sent, review contract, submission received, revision required, content approved, payment processing or paid, cancellation recorded, performance available, interest submitted.

## Do not invent

Do not invent a payment provider, escrow legal model, cancellation fee, dispute SLA, exact Creator Score formula, or equity grant. If the source does not define it, show the state and leave the unresolved rule unlabeled rather than fake a number or a legal outcome.

Do not show another creator’s fee, the brand’s total campaign budget, or other creators on the campaign.

## Working rule

When a creator UI task arrives, change only the creator screen named in the task, follow the route table above, and keep invitation-first behavior. Business files stay untouched.
