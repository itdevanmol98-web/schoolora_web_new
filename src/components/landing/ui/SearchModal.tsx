import React, { useState } from 'react';
import { Modal } from './Modal';
import { Search } from 'lucide-react';

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFeature?: (featureName: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectFeature,
}) => {
  const [query, setQuery] = useState('');

  const quickItems = [
    'Attendance Management & Biometric',
    'Fee Collection, Invoicing & Receipts',
    'Online Admission & Registration',
    'Parent Mobile App & Notifications',
    'AI Analytics & Examination Reports',
    'Transport & School Bus GPS Tracking',
    'Teacher Timetable & Lesson Planning',
    'Student Performance & Report Cards',
  ];

  const filteredItems = query.trim()
    ? quickItems.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      )
    : quickItems;

  const handleItemClick = (item: string) => {
    if (onSelectFeature) {
      onSelectFeature(item);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Search AXIONEXA ERP">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search modules, features, guides..."
            style={{
              width: '100%',
              padding: '12px 16px 12px 42px',
              borderRadius: '12px',
              border: '1.5px solid #BFDBFE',
              fontSize: '15px',
              outline: 'none',
              color: '#0F172A',
              backgroundColor: '#FFFFFF',
            }}
          />
          <Search
            size={18}
            color="#64748B"
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#94A3B8',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '2px',
            }}
          >
            {query.trim() ? 'Matching Modules' : 'Popular Modules'}
          </span>
          {filteredItems.map((s) => (
            <button
              key={s}
              onClick={() => handleItemClick(s)}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                textAlign: 'left',
                color: '#334155',
                fontSize: '14px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #F1F5F9',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#EFF6FF';
                e.currentTarget.style.borderColor = '#BFDBFE';
                e.currentTarget.style.color = '#2563EB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.borderColor = '#F1F5F9';
                e.currentTarget.style.color = '#334155';
              }}
            >
              <span>{s}</span>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>Jump to module &rarr;</span>
            </button>
          ))}
          {filteredItems.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#64748B', fontSize: '14px' }}>
              No modules found matching &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SearchModal;
