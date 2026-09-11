'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface GalleryItem {
  id: string;
  title: string;
  category: 'assembly' | 'legal' | 'zonal' | 'award';
  categoryLabel: string;
  date: string;
  location: string;
  image: string;
  description: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Statewide Annual General Body Convention 2026',
    category: 'assembly',
    categoryLabel: 'State General Body',
    date: '15 January 2026',
    location: 'Ambedkar International Hall, Bhubaneswar',
    image: '/assets/img/gallery-1.jpg',
    description:
      'State executive committee assembly attended by representatives of all 90 member private training institutions across Odisha.',
  },
  {
    id: 'g-2',
    title: 'High Court of Orissa Landmark Precedent Victory Commemoration',
    category: 'legal',
    categoryLabel: 'Judicial Milestone',
    date: '22 November 2025',
    location: 'High Court Jurisdiction Complex, Cuttack',
    image: '/assets/img/gallery-1.jpg',
    description:
      'Legal assembly marking the protection of recognized status for 90 secondary training institutions under Orissa High Court order.',
  },
  {
    id: 'g-3',
    title: 'Bhubaneswar & Central Zone Executive Secretariat Meeting',
    category: 'zonal',
    categoryLabel: 'Zonal Secretariat',
    date: '08 October 2025',
    location: 'State Secretariat HQ, Bhubaneswar',
    image: '/assets/img/gallery-1.jpg',
    description:
      'Coordination assembly of 39 recognized member schools from Khordha, Cuttack, Kendrapara, and Jajpur districts.',
  },
  {
    id: 'g-4',
    title: '46th Association Foundation Day & Excellence Awards',
    category: 'award',
    categoryLabel: 'Foundation Day',
    date: '12 August 2025',
    location: 'Town Hall Auditorium, Cuttack',
    image: '/assets/img/gallery-1.jpg',
    description:
      'Honoring 45 years of institutional governance, statutory compliance, and secondary teacher education excellence since 1980.',
  },
  {
    id: 'g-5',
    title: 'Western & North Coastal Zonal Leadership Summit',
    category: 'zonal',
    categoryLabel: 'Zonal Secretariat',
    date: '04 May 2025',
    location: 'Baleswar & Sambalpur Regional Office',
    image: '/assets/img/gallery-1.jpg',
    description:
      'Regional summit uniting 49 member institutions from Mayurbhanj, Keonjhar, Balasore, Bhadrak, and Sambalpur.',
  },
  {
    id: 'g-6',
    title: 'Berhampur & Southern Range Management Assembly',
    category: 'zonal',
    categoryLabel: 'Zonal Secretariat',
    date: '18 February 2025',
    location: 'Berhampur Regional Registry, Ganjam',
    image: '/assets/img/gallery-1.jpg',
    description:
      'Regional convention of Southern Odisha member institutions discussing NCTE compliance and state government liaison.',
  },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredItems = filter === 'all' ? GALLERY_ITEMS : GALLERY_ITEMS.filter((item) => item.category === filter);

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <span className="pay-badge">OFFICIAL ARCHIVES & MEDIA</span>
          <h1 style={{ marginTop: '0.4rem' }}>Photo Gallery & Events</h1>
          <p className="lede">
            Photographic records of general body conventions, High Court legal victories, zonal assemblies, and annual excellence summits since 1980.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {/* CATEGORY FILTERS */}
          <div className="filters" style={{ marginBottom: '2rem' }}>
            <button
              className="chip"
              aria-pressed={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              All Events ({GALLERY_ITEMS.length})
            </button>
            <button
              className="chip"
              aria-pressed={filter === 'assembly'}
              onClick={() => setFilter('assembly')}
            >
              State Conventions
            </button>
            <button
              className="chip"
              aria-pressed={filter === 'legal'}
              onClick={() => setFilter('legal')}
            >
              High Court Milestones
            </button>
            <button
              className="chip"
              aria-pressed={filter === 'zonal'}
              onClick={() => setFilter('zonal')}
            >
              Zonal Assemblies
            </button>
            <button
              className="chip"
              aria-pressed={filter === 'award'}
              onClick={() => setFilter('award')}
            >
              Excellence Awards
            </button>
          </div>

          {/* GALLERY GRID */}
          <div className="quick-portal-grid" style={{ marginTop: 0 }}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="quick-card"
                style={{ padding: 0, cursor: 'pointer' }}
                onClick={() => setSelectedItem(item)}
              >
                <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden' }}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: '#0B2545',
                      color: '#FDE68A',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      border: '1px solid #D97706',
                    }}
                  >
                    {item.categoryLabel}
                  </span>
                </div>

                <div style={{ padding: '1.5rem 1.4rem' }}>
                  <div style={{ fontSize: '0.78rem', color: '#D97706', fontWeight: 700, marginBottom: '0.4rem' }}>
                    📍 {item.location} &middot; {item.date}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: '#0F172A', lineHeight: 1.35, marginBottom: '0.6rem' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: '#64748B', margin: 0, lineClamp: 2 }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* LIGHTBOX MODAL */}
          {selectedItem && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                background: 'rgba(2, 6, 23, 0.85)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
              }}
              onClick={() => setSelectedItem(null)}
            >
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  maxWidth: '750px',
                  width: '100%',
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                  border: '2px solid #D97706',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ position: 'relative', height: '360px', width: '100%' }}>
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: '#0F172A',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div style={{ padding: '1.75rem' }}>
                  <span className="pay-badge">{selectedItem.categoryLabel}</span>
                  <h3 style={{ fontSize: '1.4rem', color: '#0F172A', marginTop: '0.3rem', marginBottom: '0.5rem' }}>
                    {selectedItem.title}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: '#D97706', fontWeight: 700, marginBottom: '0.85rem' }}>
                    📍 {selectedItem.location} &middot; {selectedItem.date}
                  </div>
                  <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                    {selectedItem.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
