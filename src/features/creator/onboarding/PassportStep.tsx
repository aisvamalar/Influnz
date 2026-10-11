import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, ArrowLeft, ArrowRight, MapPin, Camera } from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { Card, Button } from '../ui';

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
    const city = parts.slice(0, parts.length - 1).join(', ');
    if (INDIA_LOCATIONS[state]) return { state, city };
  }
  return { state: '', city: '' };
}

function LocationDropdowns({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const parsed = parseLocation(value);
  const [selectedState, setSelectedState] = useState(parsed.state);
  const [selectedCity, setSelectedCity] = useState(parsed.city);
  const cities = selectedState ? INDIA_LOCATIONS[selectedState] ?? [] : [];

  const handleState = (state: string) => { setSelectedState(state); setSelectedCity(''); onChange(state); };
  const handleCity  = (city: string)  => { setSelectedCity(city); onChange(city && selectedState ? `${city}, ${selectedState}` : selectedState); };

  const sel: React.CSSProperties = {
    width: '100%', height: 48, padding: '0 36px 0 14px',
    border: '1.5px solid rgba(242,132,107,0.2)', borderRadius: 12, background: '#fafafa',
    fontSize: '0.9375rem', color: 'var(--in-charcoal)', fontFamily: 'inherit',
    outline: 'none', cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };
  const chevron = (
    <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--in-gray)' }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </span>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ position: 'relative' }}>
        <select value={selectedState} onChange={e => handleState(e.target.value)} style={sel} aria-label="State"
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--in-coral)'; e.currentTarget.style.background = 'white'; }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(242,132,107,0.2)'; e.currentTarget.style.background = '#fafafa'; }}>
          <option value="">Select state / UT</option>
          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>{chevron}
      </div>
      <div style={{ position: 'relative' }}>
        <select value={selectedCity} onChange={e => handleCity(e.target.value)} disabled={!selectedState}
          style={{ ...sel, opacity: selectedState ? 1 : 0.5, cursor: selectedState ? 'pointer' : 'not-allowed' }} aria-label="City"
          onFocus={e => { if (selectedState) { e.currentTarget.style.borderColor = 'var(--in-coral)'; e.currentTarget.style.background = 'white'; } }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(242,132,107,0.2)'; e.currentTarget.style.background = '#fafafa'; }}>
          <option value="">Select city</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>{chevron}
      </div>
    </div>
  );
}

// ── Profile picture uploader ──────────────────────────────────────────
function AvatarUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { if (ev.target?.result) onChange(ev.target.result as string); };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4 }}>
      {/* Avatar circle */}
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        aria-label="Upload profile picture"
        style={{
          width: 80, height: 80, borderRadius: '50%', flexShrink: 0,
          background: value ? 'transparent' : 'rgba(242,132,107,0.1)',
          border: '2px dashed var(--in-coral)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', overflow: 'hidden', padding: 0,
          transition: 'border-color 0.15s',
        }}
      >
        {value
          ? <img src={value} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <Camera size={28} style={{ color: 'var(--in-coral-text)' }} />}
      </button>

      <div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          style={{
            padding: '7px 16px', borderRadius: 10,
            border: '1.5px solid var(--in-coral)',
            background: 'rgba(242,132,107,0.07)',
            color: 'var(--in-coral-text)', fontWeight: 700,
            fontSize: '0.8125rem', cursor: 'pointer',
          }}
        >
          {value ? 'Change photo' : 'Upload photo'}
        </button>
        <p style={{ fontSize: '0.75rem', color: 'var(--in-gray)', margin: '5px 0 0' }}>
          Optional · JPG or PNG, up to 5 MB
        </p>
        {value && (
          <button type="button" onClick={() => onChange('')}
            style={{ fontSize: '0.75rem', color: 'var(--in-gray)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 2, textDecoration: 'underline' }}>
            Remove
          </button>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }} onChange={handleFile} />
    </div>
  );
}

export default function PassportStep() {
  const navigate = useNavigate();
  const { profile, updateProfile, completeOnboardingStep } = useCreator();

  const [avatarUrl, setAvatarUrl]     = useState(profile.avatarUrl ?? '');
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio]                 = useState(profile.bio);
  const [location, setLocation]       = useState(profile.location);

  // Only display name is required now — categories moved to Preferences
  const canContinue = useMemo(() => displayName.trim().length > 0, [displayName]);

  const handleContinue = () => {
    if (!canContinue) return;
    updateProfile({
      avatarUrl: avatarUrl || undefined,
      displayName: displayName.trim(),
      bio: bio.trim(),
      location: location.trim(),
    });
    completeOnboardingStep('passport');
    navigate('/creator/onboarding/preferences');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 className="cr-page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <UserCircle size={22} style={{ color: 'var(--in-coral-text)' }} /> Build your Creator Passport
        </h1>
        <p className="cr-page-sub">This is what brands see when they discover you.</p>
      </div>

      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Profile pic — optional */}
          <div className="cr-field">
            <span className="cr-field__label">Profile picture <span style={{ fontWeight: 400, color: 'var(--in-gray)' }}>(optional)</span></span>
            <AvatarUpload value={avatarUrl} onChange={setAvatarUrl} />
          </div>

          {/* Display name */}
          <label className="cr-field">
            <span className="cr-field__label">Display name</span>
            <input className="cr-input" value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Your creator name" />
            {displayName.trim().length === 0 && <span className="cr-field__err">Display name is required.</span>}
          </label>

          {/* Bio */}
          <label className="cr-field">
            <span className="cr-field__label">Bio <span style={{ fontWeight: 400, color: 'var(--in-gray)' }}>(optional)</span></span>
            <textarea className="cr-input cr-input--area" value={bio} maxLength={BIO_MAX} rows={3}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell brands what makes your content unique" />
            <span className="cr-field__hint">{bio.length}/{BIO_MAX}</span>
          </label>

          {/* Location */}
          <div className="cr-field">
            <span className="cr-field__label" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <MapPin size={13} style={{ color: 'var(--in-coral-text)' }} /> Location <span style={{ fontWeight: 400, color: 'var(--in-gray)' }}>(optional)</span>
            </span>
            <LocationDropdowns value={location} onChange={setLocation} />
            {location && <span className="cr-field__hint" style={{ marginTop: 4 }}>📍 {location}</span>}
          </div>

        </div>
      </Card>

      <div className="cr-onboarding__actions">
        <Button variant="ghost" onClick={() => navigate('/creator/onboarding/verify')}>
          <ArrowLeft size={16} /> Back
        </Button>
        <Button variant="ghost" onClick={() => { completeOnboardingStep('passport'); navigate('/creator/onboarding/preferences'); }}>
          Skip
        </Button>
        <Button onClick={handleContinue} disabled={!canContinue}>
          Continue <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
