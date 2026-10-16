/**
 * Onboarding step 2 — Creator Passport.
 * Photo, display name, bio and location, with a live preview of how brands see the profile.
 */
import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BadgeCheck, Camera, ChevronDown, FileText, Hash, MapPin, Trash2, Upload, UserRound } from 'lucide-react';
import PlatformMark from '../../../components/mobile/PlatformMark';
import { useCreator } from '../CreatorContext';
import FormField from '../../auth/FormField';
import { PATTERNS } from '../../business/businessProfile';
import { Actions, Btn, ProgressRail, Section, StepHead } from './parts';

const BIO_MAX = 240;

// ── India states + cities ─────────────────────────────────────────────
const INDIA_LOCATIONS: Record<string, string[]> = {
  'Andhra Pradesh':         ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Kakinada', 'Nellore', 'Rajahmundry', 'Kurnool'],
  'Arunachal Pradesh':      ['Itanagar', 'Naharlagun', 'Tawang', 'Ziro'],
  'Assam':                  ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Tezpur', 'Nagaon'],
  'Bihar':                  ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia'],
  'Chhattisgarh':           ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Jagdalpur'],
  'Delhi':                  ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Dwarka', 'Noida (NCR)', 'Gurugram (NCR)'],
  'Goa':                    ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'North Goa', 'South Goa'],
  'Gujarat':                ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Anand'],
  'Haryana':                ['Gurugram', 'Faridabad', 'Ambala', 'Hisar', 'Karnal', 'Panipat', 'Rohtak', 'Sonipat'],
  'Himachal Pradesh':       ['Shimla', 'Manali', 'Dharamshala', 'Solan', 'Mandi', 'Kullu'],
  'Jharkhand':              ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Deoghar'],
  'Karnataka':              ['Bengaluru', 'Mysuru', 'Hubli-Dharwad', 'Mangaluru', 'Belagavi', 'Kalaburagi', 'Davanagere', 'Udupi', 'Shivamogga'],
  'Kerala':                 ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Malappuram', 'Alappuzha', 'Kannur'],
  'Madhya Pradesh':         ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna'],
  'Maharashtra':            ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Navi Mumbai', 'Amravati'],
  'Manipur':                ['Imphal', 'Thoubal', 'Churachandpur'],
  'Meghalaya':              ['Shillong', 'Tura', 'Nongpoh'],
  'Mizoram':                ['Aizawl', 'Lunglei', 'Serchhip'],
  'Nagaland':               ['Kohima', 'Dimapur', 'Mokokchung'],
  'Odisha':                 ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri'],
  'Punjab':                 ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Chandigarh'],
  'Rajasthan':              ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner', 'Alwar', 'Bharatpur'],
  'Sikkim':                 ['Gangtok', 'Namchi', 'Gyalshing'],
  'Tamil Nadu':             ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Thoothukudi', 'Puducherry', 'Tiruppur'],
  'Telangana':              ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Secunderabad', 'Ramagundam'],
  'Tripura':                ['Agartala', 'Udaipur', 'Dharmanagar'],
  'Uttar Pradesh':          ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj', 'Meerut', 'Ghaziabad', 'Noida', 'Mathura', 'Bareilly', 'Moradabad', 'Gorakhpur'],
  'Uttarakhand':            ['Dehradun', 'Haridwar', 'Rishikesh', 'Roorkee', 'Haldwani', 'Nainital', 'Mussoorie'],
  'West Bengal':            ['Kolkata', 'Asansol', 'Siliguri', 'Durgapur', 'Howrah', 'Bardhaman', 'Darjeeling', 'Malda'],
  'Andaman & Nicobar Islands': ['Port Blair'],
  'Chandigarh':             ['Chandigarh'],
  'Dadra & Nagar Haveli and Daman & Diu': ['Daman', 'Silvassa'],
  'Jammu & Kashmir':        ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Sopore'],
  'Ladakh':                 ['Leh', 'Kargil'],
  'Lakshadweep':            ['Kavaratti'],
  'Puducherry':             ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
};
const STATES = Object.keys(INDIA_LOCATIONS).sort();

function parseLocation(loc: string): { state: string; city: string } {
  const parts = loc.split(',').map(s => s.trim());
  if (parts.length >= 2) {
    const state = parts[parts.length - 1];
    const city = parts.slice(0, -1).join(', ');
    if (INDIA_LOCATIONS[state]) return { state, city };
  }
  return { state: '', city: '' };
}

function LocationFields({
  value, onChange, pinCode, onPinCodeChange, pinError, onPinBlur,
}: {
  value: string;
  onChange: (v: string) => void;
  pinCode: string;
  onPinCodeChange: (v: string) => void;
  pinError?: string;
  onPinBlur: () => void;
}) {
  const parsed = parseLocation(value);
  const [state, setState] = useState(parsed.state);
  const [city, setCity] = useState(parsed.city);
  const cities = state ? INDIA_LOCATIONS[state] ?? [] : [];

  const pickState = (s: string) => { setState(s); setCity(''); onChange(s); };
  const pickCity = (c: string) => { setCity(c); onChange(c && state ? `${c}, ${state}` : state); };

  return (
    <div className="aw-grid">
      <FormField id="pp-state" label="State / UT" optional>
        <div className="aw-control aw-control--select">
          <MapPin className="aw-control__icon" size={17} />
          <select id="pp-state" value={state} onChange={e => pickState(e.target.value)}>
            <option value="">Select state</option>
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="aw-control__chevron" size={16} />
        </div>
      </FormField>
      <FormField id="pp-city" label="City" optional>
        <div className="aw-control aw-control--select" style={{ opacity: state ? 1 : 0.6 }}>
          <MapPin className="aw-control__icon" size={17} />
          <select id="pp-city" value={city} disabled={!state} onChange={e => pickCity(e.target.value)}>
            <option value="">{state ? 'Select city' : 'Pick a state first'}</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown className="aw-control__chevron" size={16} />
        </div>
      </FormField>
      <FormField id="pp-pin" label="Pin code" optional error={pinError} help="6-digit PIN code of your area.">
        <div className={`aw-control${pinError ? ' is-invalid' : ''}`}>
          <Hash className="aw-control__icon" size={17} />
          <input
            id="pp-pin" type="text" inputMode="numeric" placeholder="e.g. 600001"
            autoComplete="postal-code" maxLength={6} value={pinCode}
            aria-invalid={Boolean(pinError)}
            onChange={e => onPinCodeChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
            onBlur={onPinBlur}
          />
        </div>
      </FormField>
    </div>
  );
}

function AvatarUpload({ value, name, onChange }: { value: string; name: string; onChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const initials = name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { if (ev.target?.result) onChange(ev.target.result as string); };
    reader.readAsDataURL(file);
  };

  return (
    <div className="cro-avatar">
      <button
        type="button"
        className={`cro-avatar__circle${value ? ' has-image' : ''}`}
        onClick={() => fileRef.current?.click()}
        aria-label="Upload profile picture"
      >
        {value ? <img src={value} alt="" /> : initials ? <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--cr-coral-ink)' }}>{initials}</span> : <Camera size={26} />}
      </button>
      <div className="cro-avatar__meta">
        <div className="cro-avatar__row">
          <Btn variant="ghost" small onClick={() => fileRef.current?.click()}>
            <Upload size={14} /> {value ? 'Change photo' : 'Upload photo'}
          </Btn>
          {value && (
            <Btn variant="link" small onClick={() => onChange('')}><Trash2 size={14} /> Remove</Btn>
          )}
        </div>
        <p className="cro-avatar__hint">JPG, PNG or WebP, up to 5 MB. A clear face photo gets more brand replies.</p>
      </div>
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  );
}

export default function PassportStep() {
  const navigate = useNavigate();
  const { profile, updateProfile, completeOnboardingStep } = useCreator();

  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? '');
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location);
  const [pinCode, setPinCode] = useState(profile.pinCode ?? '');
  const [touched, setTouched] = useState(false);
  const [pinTouched, setPinTouched] = useState(false);

  const nameOk = displayName.trim().length > 0;
  const pinOk = pinCode === '' || PATTERNS.pincode.test(pinCode);
  const pinError = pinTouched && !pinOk ? 'Enter a valid 6-digit PIN code' : undefined;
  const canContinue = useMemo(() => nameOk && pinOk, [nameOk, pinOk]);
  const connected = profile.platforms.filter(p => p.state === 'connected');

  const finish = (save: boolean) => {
    if (save) {
      updateProfile({ avatarUrl: avatarUrl || undefined, displayName: displayName.trim(), bio: bio.trim(), location: location.trim(), pinCode });
    }
    completeOnboardingStep('passport');
    navigate('/creator/onboarding/preferences');
  };

  return (
    <>
      <div className="cro-main">
        <StepHead
          eyebrow="Step 2 · Creator Passport"
          title={<>This is what brands see <em>first.</em></>}
          sub="A complete passport is the difference between being found and being skipped. Only your name is required; everything else can be added later."
        />

        <Section title="Profile" sub="Your photo and name appear on every invitation and in brand searches.">
          <AvatarUpload value={avatarUrl} name={displayName} onChange={setAvatarUrl} />

          <FormField
            id="pp-name" label="Display name" full
            error={touched && !nameOk ? 'Display name is required' : undefined}
            help="Use the name your audience knows you by."
          >
            <div className={`aw-control${touched && !nameOk ? ' is-invalid' : ''}`}>
              <UserRound className="aw-control__icon" size={17} />
              <input
                id="pp-name" type="text" placeholder="Your creator name" autoComplete="nickname"
                value={displayName} aria-invalid={touched && !nameOk}
                onChange={e => setDisplayName(e.target.value)}
                onBlur={() => setTouched(true)}
              />
            </div>
          </FormField>
        </Section>

        <Section title="About you" sub="A short bio and your base city help brands match you with local campaigns.">
          <FormField id="pp-bio" label="Bio" optional full>
            <div className="aw-control" style={{ height: 'auto', alignItems: 'flex-start' }}>
              <FileText className="aw-control__icon" size={17} style={{ marginTop: 14 }} />
              <textarea
                id="pp-bio" rows={4} maxLength={BIO_MAX} value={bio}
                placeholder="Tell brands what makes your content unique — your niche, your style, the audience you reach."
                onChange={e => setBio(e.target.value)}
                style={{ flex: 1, minWidth: 0, padding: '12px 14px 12px 10px', border: 0, outline: 0, background: 'transparent', font: 'inherit', fontSize: '0.9375rem', lineHeight: 1.55, color: 'var(--aw-ink)', resize: 'vertical' }}
              />
            </div>
            <span className="cro-counter">{bio.length}/{BIO_MAX}</span>
          </FormField>

          <LocationFields
            value={location} onChange={setLocation}
            pinCode={pinCode} onPinCodeChange={setPinCode}
            pinError={pinError} onPinBlur={() => setPinTouched(true)}
          />
        </Section>
      </div>

      <div className="cro-aside">
        <section className="cro-panel cro-preview" aria-label="Passport preview">
          <p className="cro-eyebrow" style={{ margin: 0 }}>How brands see you</p>
          <div className="cro-preview__who">
            <span className="cro-preview__avatar">
              {avatarUrl ? <img src={avatarUrl} alt="" /> : (displayName.trim()[0] ?? 'C').toUpperCase()}
            </span>
            <div>
              <p className="cro-preview__name">
                {displayName.trim() || 'Your name'}
                {profile.verified && <BadgeCheck size={16} />}
              </p>
              <p className="cro-preview__handle">@{profile.username}</p>
            </div>
          </div>
          <p className={`cro-preview__bio${bio.trim() ? '' : ' is-empty'}`}>
            {bio.trim() || 'Your bio will appear here.'}
          </p>
          <div className="cro-preview__meta">
            {(location || pinCode) && (
              <span className="cro-preview__tag"><MapPin size={12} /> {[location, pinCode].filter(Boolean).join(' · ')}</span>
            )}
            {connected.map(p => (
              <span key={p.platform} className="cro-preview__tag"><PlatformMark id={p.platform} size={12} /> {p.handle || p.platform}</span>
            ))}
          </div>
        </section>

        <ProgressRail
          title="Passport strength"
          items={[
            { label: 'Display name', done: nameOk },
            { label: 'Profile photo', done: Boolean(avatarUrl), meta: 'optional' },
            { label: 'Bio', done: bio.trim().length > 0, meta: 'optional' },
            { label: 'Location', done: location.trim().length > 0, meta: 'optional' },
            { label: 'Pin code', done: PATTERNS.pincode.test(pinCode), meta: 'optional' },
          ]}
          note={<>Passports with a photo and bio get <strong>2x more invitations</strong> than name-only profiles.</>}
        />
      </div>

      <Actions
        left={
          <>
            <Btn variant="ghost" onClick={() => navigate('/creator/onboarding/verify')}><ArrowLeft size={16} /> Back</Btn>
            <Btn variant="link" onClick={() => finish(false)}>Skip for now</Btn>
          </>
        }
      >
        <Btn onClick={() => finish(true)} disabled={!canContinue}>
          Continue to preferences <ArrowRight size={16} />
        </Btn>
      </Actions>
    </>
  );
}
