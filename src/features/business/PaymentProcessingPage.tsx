import { useNavigate, useParams } from 'react-router-dom';
import BusinessLayout from './BusinessLayout';

export default function PaymentProcessingPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <BusinessLayout breadcrumb="Campaigns / Payment">
      <div style={{ 
        padding: '32px', 
        maxWidth: '900px', 
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: '#111827',
            marginBottom: '8px'
          }}>
            Payment Processing
          </h1>
          <p style={{ 
            fontSize: '15px', 
            color: '#6b7280' 
          }}>
            Review and release payment to the creator
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          marginBottom: '40px',
          padding: '20px',
          background: '#f9fafb',
          borderRadius: '12px'
        }}>
          {[
            { num: 1, label: 'Deal Confirmed', done: true },
            { num: 2, label: 'Setup', done: true },
            { num: 3, label: 'Content', done: true },
            { num: 4, label: 'Review', done: true },
            { num: 5, label: 'Payment', done: false },
            { num: 6, label: 'Analytics', done: false }
          ].map((step, idx) => (
            <div key={step.num} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                opacity: step.done ? 1 : 0.4
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: step.done ? '#10b981' : '#e5e7eb',
                  color: step.done ? 'white' : '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {step.done ? '✓' : step.num}
                </div>
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: '500',
                  color: step.done ? '#111827' : '#9ca3af'
                }}>
                  {step.label}
                </span>
              </div>
              {idx < 5 && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.3 }}>
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* Main Content Card */}
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          {/* Payment Summary Section */}
          <div style={{ padding: '32px', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#111827',
              marginBottom: '24px'
            }}>
              Payment Summary
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Creator Info */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                padding: '16px',
                background: '#f9fafb',
                borderRadius: '12px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'white'
                }}>
                  AP
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '15px', 
                    fontWeight: '600', 
                    color: '#111827',
                    marginBottom: '2px'
                  }}>
                    Asha Patel
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>
                    @ashapatel • Instagram
                  </div>
                </div>
              </div>

              {/* Payment Details Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginTop: '8px'
              }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                    Base Fee
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                    ₹25,000
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                    Performance Bonus
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#10b981' }}>
                    +₹5,000
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                    Platform Fee (5%)
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                    ₹1,500
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                    GST (18%)
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                    ₹5,490
                  </div>
                </div>
              </div>

              {/* Total Amount */}
              <div style={{ 
                marginTop: '16px',
                paddingTop: '20px',
                borderTop: '2px solid #e5e7eb'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                    Total Payment
                  </span>
                  <span style={{ fontSize: '28px', fontWeight: '700', color: '#111827' }}>
                    ₹36,990
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div style={{ padding: '32px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#111827',
              marginBottom: '16px'
            }}>
              Payment Method
            </h3>
            
            <div style={{ 
              padding: '16px',
              background: '#f9fafb',
              borderRadius: '12px',
              border: '2px solid #10b981'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'white',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  🏦
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                    Bank Transfer
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>
                    •••• •••• •••• 4532
                  </div>
                </div>
                <div style={{
                  padding: '4px 12px',
                  background: '#10b981',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Verified
                </div>
              </div>
            </div>
          </div>

          {/* Bank Details Section */}
          <div style={{ padding: '32px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#111827',
              marginBottom: '16px'
            }}>
              Recipient Bank Details
            </h3>

            <div style={{ 
              display: 'grid', 
              gap: '12px',
              padding: '16px',
              background: '#f9fafb',
              borderRadius: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Account Name</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>Asha Patel</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Account Number</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>12345678901234</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>IFSC Code</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>HDFC0001234</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Bank Name</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>HDFC Bank</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          marginTop: '32px',
          display: 'flex',
          gap: '16px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={() => navigate(`/business/campaigns/${id}/review-approval`)}
            style={{
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: '600',
              color: '#6b7280',
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#9ca3af';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            Back
          </button>
          <button
            onClick={() => navigate(`/business/campaigns/${id}/campaign-analytics`)}
            style={{
              padding: '14px 32px',
              fontSize: '15px',
              fontWeight: '600',
              color: 'white',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
            }}
          >
            Release Payment →
          </button>
        </div>
      </div>
    </BusinessLayout>
  );
}
