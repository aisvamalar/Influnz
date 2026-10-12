/**
 * Mobile Approvals: content waiting for review and counter offers that need a decision.
 * Each item opens its mobile screen (content viewer or the creator's communication tab).
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, CircleCheck, Handshake, Play } from 'lucide-react';
import MobileAppHeader from '../../../components/mobile/MobileAppHeader';
import MobileBottomNav from '../../../components/mobile/MobileBottomNav';
import type { CreatorData } from '../campaignWorkspaceData';
import { getPendingApprovals, type ApprovalKind, type PendingApproval } from './approvalsData';
import { avatarUrl, contentPhotoId, creatorInitials, photoUrl } from './workspaceUtils';
import './approvals-mobile.css';

type Filter = 'all' | ApprovalKind;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'content', label: 'Content' },
  { key: 'offer', label: 'Offers' },
];

function Avatar({ creator, size }: { creator: CreatorData; size: number }) {
  const [failed, setFailed] = useState(false);
  const src = avatarUrl(creator, size * 2);
  if (!src || failed) {
    return (
      <span className="map-avatar map-avatar--initials" style={{ width: size, height: size }} aria-hidden="true">
        {creatorInitials(creator.name)}
      </span>
    );
  }
  return (
    <img
      className="map-avatar"
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function ApprovalRow({ item, onOpen }: { item: PendingApproval; onOpen: () => void }) {
  const d = item.deliverable;
  return (
    <li>
      <button type="button" className="map-item" onClick={onOpen}>
        {d ? (
          <span className="map-item__thumb">
            <img
              src={photoUrl(contentPhotoId(d, item.creator.contentDeliverables.indexOf(d)), 144, 184, 'entropy')}
              alt=""
              loading="lazy"
            />
            <span className="map-item__play" aria-hidden="true">
              <Play size={12} strokeWidth={2.4} fill="currentColor" />
            </span>
            <span className="map-item__dur">{d.duration}</span>
          </span>
        ) : (
          <span className="map-item__offer-face">
            <Avatar creator={item.creator} size={56} />
            <span className="map-item__offer-badge" aria-hidden="true">
              <Handshake size={13} strokeWidth={2.2} />
            </span>
          </span>
        )}

        <span className="map-item__body">
          <span className={`map-tag map-tag--${item.kind}`}>{item.kind === 'content' ? 'Content review' : 'Counter offer'}</span>
          <span className="map-item__title">{item.title}</span>
          <span className="map-item__who">
            {d && <Avatar creator={item.creator} size={20} />}
            <span className="map-item__name">{item.creator.name}</span>
          </span>
          <span className="map-item__detail">{item.detail}</span>
        </span>

        <ChevronRight className="map-item__chev" size={18} strokeWidth={2} aria-hidden="true" />
      </button>
    </li>
  );
}

export default function ApprovalsPageMobile() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('all');
  const approvals = getPendingApprovals();
  const visible = filter === 'all' ? approvals : approvals.filter((a) => a.kind === filter);
  const count = (f: Filter) => (f === 'all' ? approvals.length : approvals.filter((a) => a.kind === f).length);

  return (
    <div className="map">
      <MobileAppHeader showChevron />

      <main id="main-content" aria-label="Approvals">
        <div className="map-head">
          <button type="button" className="map-back" aria-label="Back to dashboard" onClick={() => navigate('/business')}>
            <ArrowLeft size={20} strokeWidth={2} />
          </button>
          <div>
            <h1 className="map-head__title">Approvals</h1>
            <p className="map-head__sub">
              {approvals.length === 0
                ? 'Nothing is waiting on you.'
                : `${approvals.length} ${approvals.length === 1 ? 'item needs' : 'items need'} your review`}
            </p>
          </div>
        </div>

        {approvals.length === 0 ? (
          <section className="map-done" aria-label="All caught up">
            <span className="map-done__icon" aria-hidden="true">
              <CircleCheck size={30} strokeWidth={2} />
            </span>
            <h2 className="map-done__title">You're all caught up</h2>
            <p className="map-done__text">New content and creator counter offers will show up here.</p>
            <button type="button" className="map-btn" onClick={() => navigate('/business/campaigns/1')}>
              Open campaign workspace
            </button>
          </section>
        ) : (
          <>
            <div className="map-chips" role="radiogroup" aria-label="Filter approvals">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  role="radio"
                  aria-checked={filter === f.key}
                  className={`map-chip${filter === f.key ? ' is-active' : ''}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                  <span className="map-chip__count">{count(f.key)}</span>
                </button>
              ))}
            </div>

            {visible.length === 0 ? (
              <p className="map-empty">Nothing pending in this category.</p>
            ) : (
              <ul className="map-list">
                {visible.map((item) => (
                  <ApprovalRow key={item.id} item={item} onOpen={() => navigate(item.path, { state: { pushed: true } })} />
                ))}
              </ul>
            )}
          </>
        )}
      </main>

      <MobileBottomNav />
    </div>
  );
}
