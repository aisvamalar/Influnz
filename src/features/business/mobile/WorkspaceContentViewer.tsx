/**
 * Mobile content viewer: full-bleed preview with player controls, the creator's
 * other deliverables, details/compliance tabs and download / open actions.
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Bookmark,
  Check,
  CircleCheck,
  Clock,
  Download,
  EllipsisVertical,
  Heart,
  Link2,
  Maximize,
  MessageCircle,
  Pause,
  Pencil,
  Play,
  Plus,
  Send,
  Share2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { ContentDeliverable, CreatorData } from '../campaignWorkspaceData';
import { ActionSheet, CreatorAvatar, RequestSheet, StatusPill } from './WorkspaceParts';
import { contentApprovalId, deliverableStatus, setDecision } from './approvalsData';
import {
  DELIVERABLE_LABEL,
  clock,
  contentPhotoId,
  downloadUrl,
  durationSeconds,
  instagramUrl,
  photoUrl,
  splitType,
} from './workspaceUtils';

const CHECK_LABELS: Record<keyof ContentDeliverable['checks'], string> = {
  brandTag: 'Brand tagged',
  paidDisclosure: 'Paid disclosure (#ad)',
  productShown: 'Product shown',
  audioClear: 'Audio clarity',
  noMisleading: 'No misleading claims',
  formatDuration: 'Format & duration',
};

const STATUS_TONE: Record<ContentDeliverable['status'], 'green' | 'amber' | 'coral' | 'grey'> = {
  approved: 'green',
  in_review: 'amber',
  revision: 'coral',
  pending: 'grey',
};

export interface ContentViewerProps {
  creator: CreatorData;
  deliverable: ContentDeliverable;
  notify: (message: string) => void;
  onBack: () => void;
  onSelect: (deliverableId: string) => void;
}

export default function ContentViewer({ creator, deliverable: d, notify, onBack, onSelect }: ContentViewerProps) {
  const playerRef = useRef<HTMLElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [tab, setTab] = useState<'details' | 'compliance'>('details');
  const [sheet, setSheet] = useState<'request' | 'revise' | 'actions' | null>(null);
  const [status, setStatus] = useState(() => deliverableStatus(d));
  const inReview = status === 'in_review';

  const approve = () => {
    setDecision(contentApprovalId(d), 'approved');
    setStatus('approved');
    notify(`Approved “${d.title}”`);
  };

  const onRequestSent = (message: string) => {
    if (sheet === 'revise' && inReview) {
      setDecision(contentApprovalId(d), 'revision');
      setStatus('revision');
    }
    notify(message);
  };

  const index = Math.max(0, creator.contentDeliverables.indexOf(d));
  const photo = contentPhotoId(d, index);
  const duration = durationSeconds(d);
  const ended = time >= duration;
  const isPlaying = playing && !ended;
  const { name: typeName, detail } = splitType(d.type);
  const subtitle = [typeName, detail || d.duration].filter(Boolean).join(' • ');
  const posted = d.postedOn === 'Draft Review' ? 'Draft — not posted yet' : `Posted on ${d.postedOn}`;

  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => setTime((t) => Math.min(duration, t + 0.25)), 250);
    return () => window.clearInterval(id);
  }, [isPlaying, duration]);

  const togglePlay = () => {
    if (isPlaying) {
      setPlaying(false);
      return;
    }
    if (ended) setTime(0);
    setPlaying(true);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      playerRef.current?.requestFullscreen?.().catch(() => notify('Fullscreen is not available here'));
    }
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: d.title, text: `${d.title} by ${creator.name}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        notify('Link copied');
      }
    } catch {
      /* share sheet dismissed */
    }
  };

  const showComments = () => {
    setTab('details');
    detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <section className={`mws-player${isPlaying ? ' is-playing' : ''}`} ref={playerRef} aria-label="Content preview">
        <img
          className="mws-player__img"
          src={photoUrl(photo, 860, 1100, 'entropy')}
          alt={`${d.title} by ${creator.name}`}
          style={{ transform: `scale(${1 + 0.06 * (time / duration)})` }}
        />
        <span className="mws-player__shade" aria-hidden="true" />

        <div className="mws-player__top">
          <button type="button" className="mws-glass" aria-label="Back" onClick={onBack}>
            <ArrowLeft size={20} strokeWidth={2} />
          </button>
          <div className="mws-player__heading">
            <h1 className="mws-player__title">{d.title}</h1>
            <p className="mws-player__sub">{subtitle}</p>
          </div>
          <StatusPill tone={STATUS_TONE[status]}>{DELIVERABLE_LABEL[status]}</StatusPill>
          <button type="button" className="mws-glass" aria-label="More options" onClick={() => setSheet('actions')}>
            <EllipsisVertical size={20} strokeWidth={2} />
          </button>
        </div>

        <button type="button" className="mws-player__tap" aria-label={isPlaying ? 'Pause' : 'Play'} onClick={togglePlay}>
          {!isPlaying && (
            <span className="mws-player__big-play" aria-hidden="true">
              <Play size={26} strokeWidth={2} fill="currentColor" />
            </span>
          )}
        </button>

        <div className="mws-player__side">
          <button
            type="button"
            className={`mws-player__act${liked ? ' is-liked' : ''}`}
            aria-pressed={liked}
            onClick={() => setLiked((v) => !v)}
          >
            <Heart size={24} strokeWidth={2} fill={liked ? 'currentColor' : 'none'} aria-hidden="true" />
            <span>{d.likes}</span>
            <span className="mws-sr">likes</span>
          </button>
          <button type="button" className="mws-player__act" onClick={showComments}>
            <MessageCircle size={24} strokeWidth={2} aria-hidden="true" />
            <span>{d.comments}</span>
            <span className="mws-sr">comments</span>
          </button>
          <button type="button" className="mws-player__act" onClick={share}>
            <Send size={23} strokeWidth={2} aria-hidden="true" />
            <span>{d.shares}</span>
            <span className="mws-sr">shares, share this content</span>
          </button>
        </div>

        <div className="mws-player__controls">
          <button type="button" className="mws-player__ctl" aria-label={isPlaying ? 'Pause' : 'Play'} onClick={togglePlay}>
            {isPlaying ? <Pause size={18} strokeWidth={2.2} fill="currentColor" /> : <Play size={18} strokeWidth={2.2} fill="currentColor" />}
          </button>
          <span className="mws-player__time">
            {clock(time)} / {clock(duration)}
          </span>
          <input
            type="range"
            className="mws-player__seek"
            min={0}
            max={duration}
            step={0.25}
            value={time}
            aria-label="Seek"
            aria-valuetext={`${clock(time)} of ${clock(duration)}`}
            style={{ '--mws-fill': `${(time / duration) * 100}%` } as CSSProperties}
            onChange={(e) => setTime(Number(e.target.value))}
          />
          <button type="button" className="mws-player__ctl" aria-label={muted ? 'Unmute' : 'Mute'} onClick={() => setMuted((v) => !v)}>
            {muted ? <VolumeX size={18} strokeWidth={2.2} /> : <Volume2 size={18} strokeWidth={2.2} />}
          </button>
          <button type="button" className="mws-player__ctl" aria-label="Fullscreen" onClick={toggleFullscreen}>
            <Maximize size={17} strokeWidth={2.2} />
          </button>
        </div>
      </section>

      <main className="mws-viewer">
        <div className="mws-strip" aria-label={`${creator.name}'s content`}>
          {creator.contentDeliverables.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className={`mws-strip__item${item.id === d.id ? ' is-active' : ''}`}
              aria-current={item.id === d.id ? 'true' : undefined}
              onClick={() => onSelect(item.id)}
            >
              <img src={photoUrl(contentPhotoId(item, i), 112, 144, 'entropy')} alt="" loading="lazy" />
              <span className="mws-strip__dur">{item.duration}</span>
              <span className="mws-sr">{item.title}</span>
            </button>
          ))}
          <button type="button" className="mws-strip__item mws-strip__item--add" aria-label="Request more content" onClick={() => setSheet('request')}>
            <Plus size={20} strokeWidth={2.2} />
          </button>
        </div>

        <div className="mws-utabs mws-utabs--two" role="tablist" aria-label="Content information">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'details'}
            className={`mws-utabs__item${tab === 'details' ? ' is-active' : ''}`}
            onClick={() => setTab('details')}
          >
            Details
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'compliance'}
            className={`mws-utabs__item${tab === 'compliance' ? ' is-active' : ''}`}
            onClick={() => setTab('compliance')}
          >
            Compliance
          </button>
        </div>

        <div role="tabpanel" ref={detailsRef} aria-label={tab === 'details' ? 'Details' : 'Compliance'}>
          {tab === 'details' ? (
            <>
              <div className="mws-by">
                <CreatorAvatar creator={creator} size={42} />
                <span className="mws-by__info">
                  <span className="mws-by__name">
                    {creator.name}
                    {creator.verified && (
                      <>
                        <BadgeCheck className="mws-verified" size={15} strokeWidth={2.2} aria-hidden="true" />
                        <span className="mws-sr">Verified</span>
                      </>
                    )}
                  </span>
                  <span className="mws-by__handle">{creator.handle}</span>
                </span>
                <a className="mws-link" href={instagramUrl(creator.handle)} target="_blank" rel="noreferrer">
                  View Profile
                  <ArrowUpRight size={14} strokeWidth={2.2} aria-hidden="true" />
                </a>
              </div>

              <div className="mws-field">
                <h2 className="mws-field__label">Caption</h2>
                <p className="mws-field__text">{d.caption}</p>
              </div>

              <div className="mws-field">
                <h2 className="mws-field__label">Tags</h2>
                <ul className="mws-tags">
                  {d.hashtags.map((tag) => (
                    <li key={tag} className="mws-tags__item">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mws-posted">
                <Clock size={14} strokeWidth={2} aria-hidden="true" />
                {posted}
              </p>

              <div className="mws-field">
                <h2 className="mws-field__label">Engagement</h2>
                <dl className="mws-engage">
                  <div className="mws-engage__item">
                    <dt>
                      <Heart size={16} strokeWidth={2} aria-hidden="true" />
                      <span className="mws-sr">Likes</span>
                    </dt>
                    <dd>{d.likes}</dd>
                  </div>
                  <div className="mws-engage__item">
                    <dt>
                      <MessageCircle size={16} strokeWidth={2} aria-hidden="true" />
                      <span className="mws-sr">Comments</span>
                    </dt>
                    <dd>{d.comments}</dd>
                  </div>
                  <div className="mws-engage__item">
                    <dt>
                      <Share2 size={16} strokeWidth={2} aria-hidden="true" />
                      <span className="mws-sr">Shares</span>
                    </dt>
                    <dd>{d.shares}</dd>
                  </div>
                  <div className="mws-engage__item">
                    <dt>
                      <Bookmark size={16} strokeWidth={2} aria-hidden="true" />
                      <span className="mws-sr">Saves</span>
                    </dt>
                    <dd>{d.saves}</dd>
                  </div>
                </dl>
              </div>
            </>
          ) : (
            <>
              <div className="mws-progress-head">
                <h2 className="mws-section__title">Compliance score</h2>
                <span className="mws-progress-head__pct mws-ok">{d.complianceScore}%</span>
              </div>
              <div
                className="mws-bar mws-bar--green"
                role="progressbar"
                aria-label="Compliance score"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={d.complianceScore}
                style={{ '--mws-fill': `${d.complianceScore}%` } as CSSProperties}
              />
              <ul className="mws-checks">
                {(Object.keys(CHECK_LABELS) as (keyof ContentDeliverable['checks'])[]).map((key) => (
                  <li key={key} className="mws-checks__item">
                    <CircleCheck className="mws-ok" size={18} strokeWidth={2.2} aria-hidden="true" />
                    <span className="mws-checks__label">{CHECK_LABELS[key]}</span>
                    <span className="mws-checks__value">{d.checks[key]}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {inReview ? (
          <div className="mws-viewer__actions">
            <button type="button" className="mws-btn mws-btn--outline" onClick={() => setSheet('revise')}>
              <Pencil size={16} strokeWidth={2} aria-hidden="true" />
              Request changes
            </button>
            <button type="button" className="mws-btn mws-btn--primary" onClick={approve}>
              <Check size={16} strokeWidth={2.4} aria-hidden="true" />
              Approve content
            </button>
          </div>
        ) : (
          <div className="mws-viewer__actions">
            <a className="mws-btn mws-btn--outline" href={downloadUrl(photo)} target="_blank" rel="noreferrer">
              <Download size={16} strokeWidth={2} aria-hidden="true" />
              Download
            </a>
            <a className="mws-btn mws-btn--primary" href={instagramUrl(creator.handle)} target="_blank" rel="noreferrer">
              View on Instagram
              <ArrowUpRight size={16} strokeWidth={2.2} aria-hidden="true" />
            </a>
          </div>
        )}
      </main>

      {(sheet === 'request' || sheet === 'revise') && (
        <RequestSheet
          creator={creator}
          initialId={sheet === 'revise' ? d.id : undefined}
          onClose={() => setSheet(null)}
          onSent={onRequestSent}
        />
      )}
      {sheet === 'actions' && (
        <ActionSheet
          title={d.title}
          onClose={() => setSheet(null)}
          actions={[
            {
              label: 'Request revision',
              icon: <Pencil size={16} strokeWidth={2} />,
              onSelect: () => setSheet('revise'),
            },
            {
              label: 'Copy link',
              icon: <Link2 size={16} strokeWidth={2} />,
              onSelect: () => {
                navigator.clipboard
                  .writeText(window.location.href)
                  .then(() => notify('Link copied'))
                  .catch(() => notify('Could not copy the link'));
              },
            },
          ]}
        />
      )}
    </>
  );
}
