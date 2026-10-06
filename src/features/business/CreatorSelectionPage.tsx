/**
 * Creator Selection Page
 * Exact replica of the reference image design
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessLayout from './BusinessLayout';

interface Creator {
  id: number;
  name: string;
  handle: string;
  tier: string;
  avatar: string;
  categories: string[];
  followers: string;
  followersGrowth: string;
  engagement: string;
  engagementGrowth: string;
  medianViews: string;
  viewsGrowth: string;
  rate: string;
  fitScore: number;
  contentImages: string[];
  selected: boolean;
}

const CREATORS: Creator[] = [
  {
    id: 1,
    name: 'Foodie Tamilian',
    handle: '@foodietamilan',
    tier: 'Nano',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    categories: ['Food', 'Lifestyle'],
    followers: '28K',
    followersGrowth: '↑ 12%',
    engagement: '12.5%',
    engagementGrowth: '↑ 3%',
    medianViews: '18K',
    viewsGrowth: '↑ 15%',
    rate: '₹10,000',
    fitScore: 93,
    contentImages: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=80&h=80&fit=crop',
      '+2'
    ],
    selected: false
  },
  {
    id: 2,
    name: 'Chennai Bites',
    handle: '@chennaibites',
    tier: 'Nano',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces',
    categories: ['Food', 'Travel'],
    followers: '31K',
    followersGrowth: '↑ 8%',
    engagement: '9.4%',
    engagementGrowth: '↑ 1%',
    medianViews: '21K',
    viewsGrowth: '↑ 10%',
    rate: '₹12,000',
    fitScore: 89,
    contentImages: [
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=80&h=80&fit=crop',
      '+1'
    ],
    selected: false
  },
  {
    id: 3,
    name: 'Local Food Guide',
    handle: '@localfoodguide',
    tier: 'Micro',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    categories: ['Food', 'City Guide', 'Lifestyle'],
    followers: '68K',
    followersGrowth: '↑ 15%',
    engagement: '7.9%',
    engagementGrowth: '↑ 2%',
    medianViews: '42K',
    viewsGrowth: '↑ 18%',
    rate: '₹18,000',
    fitScore: 86,
    contentImages: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=80&h=80&fit=crop',
      '+10'
    ],
    selected: false
  },
  {
    id: 4,
    name: 'Madras Food Trail',
    handle: '@madrasfoodtrail',
    tier: 'Nano',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
    categories: ['Food', 'Culture'],
    followers: '14K',
    followersGrowth: '↑ 6%',
    engagement: '16.1%',
    engagementGrowth: '↑ 4%',
    medianViews: '9K',
    viewsGrowth: '↑ 9%',
    rate: '₹6,200',
    fitScore: 84,
    contentImages: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1563379091339-03b87a36fe1d?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1559847844-5315695dadae?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1558030006-450675393462?w=80&h=80&fit=crop',
      '+8'
    ],
    selected: false
  },
  {
    id: 5,
    name: 'StyleHub Chennai',
    handle: '@stylehubchennai',
    tier: 'Micro',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    categories: ['Fashion', 'Lifestyle'],
    followers: '82K',
    followersGrowth: '↑ 22%',
    engagement: '6.2%',
    engagementGrowth: '↑ 1%',
    medianViews: '50K',
    viewsGrowth: '↑ 20%',
    rate: '₹19,500',
    fitScore: 78,
    contentImages: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=80&h=80&fit=crop',
      '+6'
    ],
    selected: false
  }
];

export default function CreatorSelectionPage() {
  const navigate = useNavigate();
  const [creators] = useState(CREATORS);
  const [selectedCreators, setSelectedCreators] = useState<number[]>([]);

  const toggleCreator = (id: number) => {
    setSelectedCreators(prev => 
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const removeFromSelection = (id: number) => {
    setSelectedCreators(prev => prev.filter(cid => cid !== id));
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 85) return '#22c55e';
    if (score >= 80) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <BusinessLayout breadcrumb="Creator Selection">
      <div style={{ maxWidth: 1600, margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 16,
          fontSize: 14,
          color: '#6b7280'
        }}>
          <span>Influnz</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Creators</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ color: '#1f2937', fontWeight: 500 }}>Creator Selection</span>
        </div>

        {/* Page Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 24
        }}>
          <div>
            <h1 style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#1f2937',
              margin: '0 0 4px 0'
            }}>
              Recommended Creators
            </h1>
            <p style={{
              fontSize: 14,
              color: '#6b7280',
              margin: 0
            }}>
              Based on Strategy A — Hyperlocal Reach. Select creators for your campaign.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={{
              padding: '8px 14px',
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              fontSize: 14,
              color: '#374151',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}>
              View shortlists
            </button>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              background: '#1f2937',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              color: 'white',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="2" y="2" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M5 7h4M7 5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Compare creators
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 24,
          padding: '16px 20px',
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: 10
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flex: 1
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="4.5" stroke="#9ca3af" strokeWidth="1.3"/>
              <path d="M11 11l3.5 3.5" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search creators by name, category..."
              style={{
                border: 'none',
                outline: 'none',
                flex: 1,
                fontSize: 14,
                background: 'transparent',
                fontFamily: 'inherit',
                color: '#1f2937'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {[
              { label: 'Category', icon: '▼' },
              { label: 'Location', icon: '▼' },
              { label: 'Followers', icon: '▼' },
              { label: 'Engagement', icon: '▼' }
            ].map((filter, idx) => (
              <button
                key={idx}
                style={{
                  padding: '6px 12px',
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: 6,
                  fontSize: 13,
                  color: '#374151',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                {filter.label} <span style={{ fontSize: 10 }}>{filter.icon}</span>
              </button>
            ))}
            
            <button style={{
              padding: '6px 10px',
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: 6,
              fontSize: 13,
              color: '#374151',
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 4h10M4 7h6M6 10h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              More filters
            </button>
          </div>

          <div style={{
            padding: '6px 12px',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            fontSize: 13,
            color: '#374151',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 4h10M2 7h8M2 10h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            Sort by
            <select style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}>
              <option>Relevance</option>
              <option>Followers</option>
              <option>Engagement</option>
              <option>Rate</option>
            </select>
          </div>
        </div>

        {/* Creators List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          {creators.map((creator) => (
            <div
              key={creator.id}
              style={{
                background: 'white',
                border: `1.5px solid ${selectedCreators.includes(creator.id) ? '#ef4444' : '#e5e7eb'}`,
                borderRadius: 12,
                padding: '16px 20px',
                transition: 'all 0.15s',
                overflow: 'visible',
                overflowX: 'auto'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                overflow: 'visible'
              }}>
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedCreators.includes(creator.id)}
                  onChange={() => toggleCreator(creator.id)}
                  style={{
                    width: 18,
                    height: 18,
                    cursor: 'pointer',
                    accentColor: '#ef4444',
                    flexShrink: 0
                  }}
                />

                {/* Creator Avatar with Content Preview */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 10,
                  width: 440,
                  flexShrink: 0
                }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: '#10b981',
                      border: '2px solid white'
                    }} />
                  </div>
                  
                  <div style={{ minWidth: 120 }}>
                    <div style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: '#1f2937',
                      marginBottom: 2,
                      whiteSpace: 'nowrap'
                    }}>
                      {creator.name}
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: '#9ca3af',
                      whiteSpace: 'nowrap'
                    }}>
                      {creator.handle}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: '#9ca3af',
                      marginTop: 2
                    }}>
                      {creator.tier}
                    </div>
                  </div>

                  {/* Category Tags */}
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    {creator.categories.slice(0, 2).map((cat, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: '3px 8px',
                          background: cat === 'Food' ? '#fef3c7' : 
                                     cat === 'Lifestyle' ? '#f3e8ff' :
                                     cat === 'Travel' ? '#dbeafe' :
                                     cat === 'Fashion' ? '#fce7f3' :
                                     cat === 'Culture' ? '#fee2e2' :
                                     cat === 'City Guide' ? '#e0e7ff' : '#f3f4f6',
                          color: cat === 'Food' ? '#92400e' : 
                                cat === 'Lifestyle' ? '#6b21a8' :
                                cat === 'Travel' ? '#1e40af' :
                                cat === 'Fashion' ? '#9f1239' :
                                cat === 'Culture' ? '#991b1b' :
                                cat === 'City Guide' ? '#3730a3' : '#374151',
                          borderRadius: 10,
                          fontSize: 10,
                          fontWeight: 600,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Content Thumbnails */}
                  <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                    {creator.contentImages.slice(0, 4).map((img, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 6,
                          overflow: 'hidden',
                          flexShrink: 0
                        }}
                      >
                        <img
                          src={img}
                          alt=""
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    ))}
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 6,
                      background: 'rgba(0,0,0,0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 11,
                      fontWeight: 700,
                      flexShrink: 0
                    }}>
                      {creator.contentImages[4]}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ 
                  display: 'flex', 
                  gap: 24,
                  flexShrink: 0
                }}>
                  {/* Followers */}
                  <div style={{ minWidth: 70 }}>
                    <div style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: '#1f2937',
                      marginBottom: 2
                    }}>
                      {creator.followers}
                    </div>
                    <div style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: 2
                    }}>
                      FOLLOWERS
                    </div>
                    <div style={{
                      fontSize: 10,
                      color: '#10b981',
                      fontWeight: 500
                    }}>
                      {creator.followersGrowth}
                    </div>
                  </div>

                  {/* Engagement */}
                  <div style={{ minWidth: 80 }}>
                    <div style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: '#1f2937',
                      marginBottom: 2
                    }}>
                      {creator.engagement}
                    </div>
                    <div style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: 2
                    }}>
                      ENGAGEMENT
                    </div>
                    <div style={{
                      fontSize: 10,
                      color: '#10b981',
                      fontWeight: 500
                    }}>
                      {creator.engagementGrowth}
                    </div>
                  </div>

                  {/* Median Views */}
                  <div style={{ minWidth: 70 }}>
                    <div style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: '#1f2937',
                      marginBottom: 2
                    }}>
                      {creator.medianViews}
                    </div>
                    <div style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: 2
                    }}>
                      MEDIAN VIEWS
                    </div>
                    <div style={{
                      fontSize: 10,
                      color: '#10b981',
                      fontWeight: 500
                    }}>
                      {creator.viewsGrowth}
                    </div>
                  </div>

                  {/* Rate */}
                  <div style={{ minWidth: 80 }}>
                    <div style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: '#1f2937',
                      marginBottom: 2
                    }}>
                      {creator.rate}
                    </div>
                    <div style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3
                    }}>
                      RATE
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                        <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="0.8" fill="none"/>
                        <path d="M5 3v2.5M5 7v.3" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* Right Actions */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  flexShrink: 0,
                  marginLeft: 'auto'
                }}>
                  {/* AI Score */}
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    border: `3px solid ${getScoreColor(creator.fitScore)}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fff',
                    flexShrink: 0
                  }}>
                    <span style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: getScoreColor(creator.fitScore)
                    }}>
                      {creator.fitScore}
                    </span>
                    <span style={{
                      fontSize: 8,
                      color: '#9ca3af',
                      textTransform: 'uppercase'
                    }}>
                      AI SCORE
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 6,
                    alignItems: 'flex-start'
                  }}>
                    <button style={{
                      padding: '2px 0',
                      background: 'none',
                      border: 'none',
                      fontSize: 13,
                      color: '#6b7280',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontWeight: 500
                    }}>
                      More
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2.5 4L5 6.5 7.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button style={{
                      padding: '8px 16px',
                      background: '#1f2937',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'white',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      whiteSpace: 'nowrap'
                    }}>
                      View profile →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selection Footer */}
        {selectedCreators.length > 0 && (
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 260,
            right: 0,
            background: '#fef3c7',
            border: '1px solid #fbbf24',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            zIndex: 100,
            boxShadow: '0 -4px 12px rgba(0,0,0,0.1)'
          }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              color: '#92400e',
              fontWeight: 500
            }}>
              <span style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: '#fbbf24',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700
              }}>
                {selectedCreators.length}
              </span>
              1 creator selected
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {selectedCreators.map(cid => {
                const creator = creators.find(c => c.id === cid);
                if (!creator) return null;
                return (
                  <div
                    key={cid}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 10px',
                      background: 'white',
                      borderRadius: 20,
                      fontSize: 13,
                      color: '#1f2937'
                    }}
                  >
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                    {creator.name}
                    <button
                      onClick={() => removeFromSelection(cid)}
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: '#ef4444',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: 0
                      }}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>

            <div style={{ flex: 1 }} />

            <button
              onClick={() => setSelectedCreators([])}
              style={{
                padding: '8px 16px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 14,
                color: '#374151',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              Cancel
            </button>

            <button
              onClick={() => navigate('/business/campaigns/guardrails')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 18px',
                background: '#1f2937',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                color: 'white',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              Add to campaign →
            </button>
          </div>
        )}
      </div>
    </BusinessLayout>
  );
}
