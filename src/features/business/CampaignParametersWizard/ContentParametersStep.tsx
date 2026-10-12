/**
 * Campaign Parameters Wizard - Step 3: Content Parameters
 * Define content requirements and deliverables
 */
import { useState } from 'react';
import UiIcon from '../../../components/UiIcon';

interface ContentParametersStepProps {
  onNext: (data: ContentParametersData) => void;
  onBack: () => void;
  initialData?: Partial<ContentParametersData>;
}

export interface ContentParametersData {
  contentTypes: string[];
  contentCount: Record<string, number>;
  contentGuidelines: string;
  hashtags: string[];
  mentions: string[];
  dosDonts: {
    dos: string[];
    donts: string[];
  };
}

const CONTENT_TYPES = [
  { id: 'post', name: 'Social Post', icon: 'camera', description: 'Single image/video post' },
  { id: 'story', name: 'Story', icon: 'phone', description: '24-hour story content' },
  { id: 'reel', name: 'Reel/Short', icon: 'clapperboard', description: 'Short-form video' },
  { id: 'video', name: 'Long Video', icon: 'play', description: 'YouTube-style video' },
  { id: 'carousel', name: 'Carousel', icon: 'images', description: 'Multi-image post' },
  { id: 'live', name: 'Live Stream', icon: 'live', description: 'Live broadcast' },
];

export default function ContentParametersStep({ onNext, onBack, initialData }: ContentParametersStepProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialData?.contentTypes || []);
  const [contentCount, setContentCount] = useState<Record<string, number>>(
    initialData?.contentCount || {}
  );
  const [guidelines, setGuidelines] = useState(initialData?.contentGuidelines || '');
  const [hashtags, setHashtags] = useState<string[]>(initialData?.hashtags || []);
  const [mentions, setMentions] = useState<string[]>(initialData?.mentions || []);
  const [hashtagInput, setHashtagInput] = useState('');
  const [mentionInput, setMentionInput] = useState('');
  const [dos, setDos] = useState<string[]>(initialData?.dosDonts?.dos || []);
  const [donts, setDonts] = useState<string[]>(initialData?.dosDonts?.donts || []);
  const [doInput, setDoInput] = useState('');
  const [dontInput, setDontInput] = useState('');

  const toggleContentType = (typeId: string) => {
    setSelectedTypes(prev => {
      if (prev.includes(typeId)) {
        const newCount = { ...contentCount };
        delete newCount[typeId];
        setContentCount(newCount);
        return prev.filter(id => id !== typeId);
      } else {
        setContentCount(prev => ({ ...prev, [typeId]: 1 }));
        return [...prev, typeId];
      }
    });
  };

  const updateCount = (typeId: string, count: number) => {
    setContentCount(prev => ({ ...prev, [typeId]: Math.max(1, count) }));
  };

  const addHashtag = () => {
    if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
      setHashtags(prev => [...prev, hashtagInput.trim()]);
      setHashtagInput('');
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(prev => prev.filter(t => t !== tag));
  };

  const addMention = () => {
    if (mentionInput.trim() && !mentions.includes(mentionInput.trim())) {
      setMentions(prev => [...prev, mentionInput.trim()]);
      setMentionInput('');
    }
  };

  const removeMention = (mention: string) => {
    setMentions(prev => prev.filter(m => m !== mention));
  };

  const addDo = () => {
    if (doInput.trim() && !dos.includes(doInput.trim())) {
      setDos(prev => [...prev, doInput.trim()]);
      setDoInput('');
    }
  };

  const removeDo = (item: string) => {
    setDos(prev => prev.filter(d => d !== item));
  };

  const addDont = () => {
    if (dontInput.trim() && !donts.includes(dontInput.trim())) {
      setDonts(prev => [...prev, dontInput.trim()]);
      setDontInput('');
    }
  };

  const removeDont = (item: string) => {
    setDonts(prev => prev.filter(d => d !== item));
  };

  const handleSubmit = () => {
    if (selectedTypes.length === 0) {
      alert('Please select at least one content type');
      return;
    }

    onNext({
      contentTypes: selectedTypes,
      contentCount,
      contentGuidelines: guidelines,
      hashtags,
      mentions,
      dosDonts: { dos, donts },
    });
  };

  return (
    <div className="content-parameters-step">
      {/* Header */}
      <div className="step-header">
        <h1 className="step-title">Content Parameters</h1>
        <p className="step-subtitle">
          Define what type of content creators should produce
        </p>
      </div>

      {/* Content Types */}
      <div className="form-section">
        <h3 className="section-title">Content Types & Deliverables</h3>
        <div className="content-type-grid">
          {CONTENT_TYPES.map((type) => {
            const isSelected = selectedTypes.includes(type.id);
            return (
              <div key={type.id} className="content-type-item">
                <button
                  type="button"
                  className={`content-type-card ${isSelected ? 'content-type-card--selected' : ''}`}
                  onClick={() => toggleContentType(type.id)}
                >
                  <div className="content-type-icon"><UiIcon name={type.icon} /></div>
                  <div className="content-type-name">{type.name}</div>
                  <div className="content-type-description">{type.description}</div>
                </button>
                {isSelected && (
                  <div className="content-count">
                    <label>Count per creator:</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={contentCount[type.id] || 1}
                      onChange={(e) => updateCount(type.id, parseInt(e.target.value) || 1)}
                      className="count-input"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Guidelines */}
      <div className="form-section">
        <h3 className="section-title">Content Guidelines</h3>
        <textarea
          className="form-textarea"
          rows={4}
          value={guidelines}
          onChange={(e) => setGuidelines(e.target.value)}
          placeholder="Provide detailed guidelines for creators: tone, style, key messages, brand values, etc."
        />
      </div>

      {/* Hashtags */}
      <div className="form-section">
        <h3 className="section-title">Required Hashtags</h3>
        <div className="tag-input-container">
          <input
            type="text"
            className="form-input"
            value={hashtagInput}
            onChange={(e) => setHashtagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
            placeholder="Enter hashtag and press Enter"
          />
          <button type="button" className="btn btn-secondary btn-sm" onClick={addHashtag}>
            Add
          </button>
        </div>
        <div className="tag-list">
          {hashtags.map((tag) => (
            <span key={tag} className="tag">
              #{tag}
              <button type="button" onClick={() => removeHashtag(tag)} className="tag-remove">
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Mentions */}
      <div className="form-section">
        <h3 className="section-title">Required Mentions</h3>
        <div className="tag-input-container">
          <input
            type="text"
            className="form-input"
            value={mentionInput}
            onChange={(e) => setMentionInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMention())}
            placeholder="Enter @handle and press Enter"
          />
          <button type="button" className="btn btn-secondary btn-sm" onClick={addMention}>
            Add
          </button>
        </div>
        <div className="tag-list">
          {mentions.map((mention) => (
            <span key={mention} className="tag">
              @{mention}
              <button type="button" onClick={() => removeMention(mention)} className="tag-remove">
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Do's and Don'ts */}
      <div className="form-section">
        <h3 className="section-title">Content Do's and Don'ts</h3>
        <div className="dos-donts-grid">
          <div className="dos-section">
            <h4><UiIcon name="check-circle" /> Do's</h4>
            <div className="tag-input-container">
              <input
                type="text"
                className="form-input"
                value={doInput}
                onChange={(e) => setDoInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDo())}
                placeholder="Add a Do"
              />
              <button type="button" className="btn btn-secondary btn-sm" onClick={addDo}>
                Add
              </button>
            </div>
            <ul className="dos-donts-list">
              {dos.map((item) => (
                <li key={item}>
                  {item}
                  <button type="button" onClick={() => removeDo(item)} className="list-remove">
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="donts-section">
            <h4><UiIcon name="x" /> Don'ts</h4>
            <div className="tag-input-container">
              <input
                type="text"
                className="form-input"
                value={dontInput}
                onChange={(e) => setDontInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDont())}
                placeholder="Add a Don't"
              />
              <button type="button" className="btn btn-secondary btn-sm" onClick={addDont}>
                Add
              </button>
            </div>
            <ul className="dos-donts-list">
              {donts.map((item) => (
                <li key={item}>
                  {item}
                  <button type="button" onClick={() => removeDont(item)} className="list-remove">
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="step-actions">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Continue to Creators →
        </button>
      </div>
    </div>
  );
}
