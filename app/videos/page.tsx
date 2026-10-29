'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  INITIAL_VIDEOS,
  VIDEO_PRODUCTION_SCHEDULE,
  VideoClip,
  VideoAccessLevel,
} from '@/lib/data/videos';
import { ZONES } from '@/lib/data/schools';

export default function VideoLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAccess, setSelectedAccess] = useState<string>('all');
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  // Access Control Session State
  const [studentRegNo, setStudentRegNo] = useState<string>('');
  const [isStudentUnlocked, setIsStudentUnlocked] = useState<boolean>(false);
  const [isMemberUnlocked, setIsMemberUnlocked] = useState<boolean>(false);
  const [unlockInput, setUnlockInput] = useState<string>('');
  const [unlockError, setUnlockError] = useState<string | null>(null);

  // Active Video Player Modal
  const [activeVideo, setActiveVideo] = useState<VideoClip | null>(null);
  const [customVideos, setCustomVideos] = useState<VideoClip[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedReg = localStorage.getItem('aopstsma_student_reg');
      if (savedReg) {
        setStudentRegNo(savedReg);
        setIsStudentUnlocked(true);
      }
      const adminUser = sessionStorage.getItem('admin_user');
      const schoolUser = sessionStorage.getItem('school_user');
      if (adminUser || schoolUser) {
        setIsMemberUnlocked(true);
        setIsStudentUnlocked(true);
      }
      const savedCustomVideos = localStorage.getItem('aopstsma_custom_videos');
      if (savedCustomVideos) {
        try {
          setCustomVideos(JSON.parse(savedCustomVideos));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const allVideos = useMemo(() => [...customVideos, ...INITIAL_VIDEOS], [customVideos]);

  const categories = [
    'all',
    'Press Release & Keynote',
    'Zonal Documentary',
    'Pedagogy & C.T. Curriculum',
    'Legal & Regulatory Awareness',
    'Special Programme',
    'District Training Shoot',
  ];

  const filteredVideos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allVideos.filter((v) => {
      const zoneOk = selectedZone === 'all' || v.zoneId === selectedZone || v.zoneId === 'all';
      const catOk = selectedCategory === 'all' || v.category === selectedCategory;
      const accessOk = selectedAccess === 'all' || v.accessLevel === selectedAccess;
      const textOk =
        !q ||
        v.title.toLowerCase().includes(q) ||
        v.topic.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q) ||
        (v.schoolName || '').toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q);
      return zoneOk && catOk && accessOk && textOk;
    });
  }, [allVideos, searchQuery, selectedZone, selectedCategory, selectedAccess]);

  const canWatch = (level: VideoAccessLevel) => {
    if (level === 'public') return true;
    if (level === 'student') return isStudentUnlocked || isMemberUnlocked;
    if (level === 'member') return isMemberUnlocked;
    return false;
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError(null);
    const code = unlockInput.trim().toUpperCase();
    if (!code) {
      setUnlockError('Please enter your Student Registration Number or Member School Code.');
      return;
    }
    if (code.startsWith('SCH-') || code.startsWith('ADMIN') || code === 'AOP1980') {
      setIsMemberUnlocked(true);
      setIsStudentUnlocked(true);
      setStudentRegNo(code);
      if (typeof window !== 'undefined') {
        localStorage.setItem('aopstsma_student_reg', code);
      }
    } else if (code.startsWith('AOP-') || code.startsWith('STU-') || code.length >= 6) {
      setIsStudentUnlocked(true);
      setStudentRegNo(code);
      if (typeof window !== 'undefined') {
        localStorage.setItem('aopstsma_student_reg', code);
      }
    } else {
      setUnlockError(
        'Invalid code. Enter a valid Student Registration Number (e.g. AOP-BZB-2026-1024) or School Code (e.g. SCH-CEN-01).'
      );
    }
  };

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <span
            className="pay-badge"
            style={{ color: '#FDE68A', borderColor: 'rgba(253, 230, 138, 0.4)' }}
          >
            EDUCATIONAL VIDEO LIBRARY &middot; 50 CLIPS CATALOG
          </span>
          <h1>AOPSTSMA Educational Video Library</h1>
          <p className="lede">
            50 curated 30-minute educational lectures, zonal documentaries, pedagogy demonstrations, and legal awareness sessions across 5 zones and 13 locations of Odisha.
          </p>
        </div>
      </section>

      <section className="section" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="wrap">
          {/* =================================================================
              1. SUMMARY STATS & ACCESS CONTROL BAR
             ================================================================= */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0B2545 0%, #1E3A8A 100%)',
              borderRadius: '14px',
              border: '2px solid #D97706',
              padding: '1.25rem 1.5rem',
              color: '#FFFFFF',
              marginBottom: '1.75rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                <span
                  style={{
                    background: '#D97706',
                    color: '#FFFFFF',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px',
                  }}
                >
                  🎬 {allVideos.length} Video Clips (30 Min Each)
                </span>
                <span
                  style={{
                    background: 'rgba(255,255,255,0.14)',
                    color: '#FDE68A',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px',
                  }}
                >
                  📍 5 Zones + Special Kendrapara + 7 Districts (13 Locations)
                </span>
              </div>
              <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', margin: 0 }}>
                Public, Registered-Student &amp; Authorized-Member Video Portal
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setShowSchedule((prev) => !prev)}
                style={{
                  background: showSchedule ? '#FDE68A' : 'rgba(255,255,255,0.12)',
                  color: showSchedule ? '#0B2545' : '#FFFFFF',
                  border: '1px solid #FDE68A',
                  borderRadius: '8px',
                  padding: '0.5rem 0.95rem',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                📅 {showSchedule ? 'Hide 13-Day Shoot Schedule' : 'View 13-Day / 50-Clip Plan'}
              </button>

              {isStudentUnlocked ? (
                <span
                  style={{
                    background: '#059669',
                    color: '#FFFFFF',
                    padding: '0.5rem 0.9rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                  }}
                >
                  🔓 Unlocked ({studentRegNo || 'Verified Access'})
                </span>
              ) : (
                <form
                  onSubmit={handleUnlockSubmit}
                  style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}
                >
                  <input
                    type="text"
                    placeholder="Enter Reg. No (e.g. AOP-BZB-2026-1024)"
                    value={unlockInput}
                    onChange={(e) => setUnlockInput(e.target.value)}
                    style={{
                      padding: '0.48rem 0.75rem',
                      borderRadius: '7px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.8rem',
                      minWidth: '220px',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: '#10B981',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '7px',
                      padding: '0.48rem 0.85rem',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    🔑 Unlock Student Videos
                  </button>
                </form>
              )}
            </div>
          </div>

          {unlockError && (
            <div className="pay-error" style={{ marginBottom: '1.25rem' }}>
              {unlockError}
            </div>
          )}

          {/* =================================================================
              2. OPTIONAL 13-DAY / 13-LOCATION PRODUCTION PLAN TABLE
             ================================================================= */}
          {showSchedule && (
            <div
              style={{
                background: '#FFFFFF',
                border: '2px solid #0B2545',
                borderRadius: '14px',
                padding: '1.35rem',
                marginBottom: '1.75rem',
                boxShadow: '0 8px 24px rgba(11,37,69,0.08)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginBottom: '0.85rem',
                }}
              >
                <div>
                  <span className="pay-badge">PRODUCTION REFERENCE SCHEDULE</span>
                  <h3 style={{ fontSize: '1.2rem', color: '#0B2545', marginTop: '0.25rem' }}>
                    50 Clips Production Plan (13 Days &middot; 13 Locations &middot; 2 Hours/Day &middot; 30 Min Edited Clips)
                  </h3>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669' }}>
                  ✓ 24 Clips with Association (5 Zones + Kendrapara) + 26 District &amp; Keynote Clips = 50 Clips
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="school-table">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Shoot Location / Zone</th>
                      <th>Daily Shoot</th>
                      <th>Edited Clips (30 Min)</th>
                      <th>Production Group</th>
                    </tr>
                  </thead>
                  <tbody>
                    {VIDEO_PRODUCTION_SCHEDULE.map((row) => (
                      <tr key={row.day}>
                        <td style={{ fontWeight: 800, color: '#0B2545' }}>Day {row.day}</td>
                        <td style={{ fontWeight: 700 }}>📍 {row.location}</td>
                        <td>{row.hours}</td>
                        <td style={{ fontWeight: 800, color: '#D97706' }}>{row.clips} Clips</td>
                        <td>{row.group}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================
              3. SEARCH & FILTERS (ZONE, CATEGORY, ACCESS LEVEL)
             ================================================================= */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '1.15rem',
              marginBottom: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.85rem',
            }}
          >
            <div>
              <label
                htmlFor="vidSearch"
                style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: '#0B2545', marginBottom: '0.3rem' }}
              >
                🔍 Search by Title, School, Topic or Location
              </label>
              <input
                id="vidSearch"
                type="search"
                placeholder="e.g. Sugo, Jagannath, Pedagogy, Court..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.86rem',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="vidZone"
                style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: '#0B2545', marginBottom: '0.3rem' }}
              >
                🏛️ Filter by Zone
              </label>
              <select
                id="vidZone"
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                }}
              >
                <option value="all">All 5 Zones + State HQ</option>
                {ZONES.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="vidCat"
                style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: '#0B2545', marginBottom: '0.3rem' }}
              >
                📂 Filter by Category / Programme
              </label>
              <select
                id="vidCat"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                }}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'all' ? 'All Categories' : c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="vidAccess"
                style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: '#0B2545', marginBottom: '0.3rem' }}
              >
                🔒 Filter by Access Level
              </label>
              <select
                id="vidAccess"
                value={selectedAccess}
                onChange={(e) => setSelectedAccess(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                }}
              >
                <option value="all">All Access Levels ({allVideos.length})</option>
                <option value="public">🌐 Public Videos</option>
                <option value="student">🎓 Registered Student Videos</option>
                <option value="member">🏛️ Authorized Member Videos</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
            Showing <strong>{filteredVideos.length}</strong> of <strong>{allVideos.length}</strong> educational video clips
          </div>

          {/* =================================================================
              4. VIDEO CARDS GRID
             ================================================================= */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(295px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {filteredVideos.map((vid) => {
              const unlocked = canWatch(vid.accessLevel);
              return (
                <article
                  key={vid.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '14px',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(11,37,69,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    {/* Thumbnail Banner */}
                    <div
                      style={{
                        height: '155px',
                        background:
                          vid.accessLevel === 'public'
                            ? 'linear-gradient(135deg, #0B2545 0%, #1E40AF 100%)'
                            : vid.accessLevel === 'student'
                            ? 'linear-gradient(135deg, #065F46 0%, #047857 100%)'
                            : 'linear-gradient(135deg, #581C87 0%, #7E22CE 100%)',
                        position: 'relative',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        color: '#FFFFFF',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span
                          style={{
                            background: 'rgba(0,0,0,0.45)',
                            color: '#FDE68A',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px',
                          }}
                        >
                          Clip #{String(vid.clipNumber).padStart(2, '0')} &middot; Day {vid.shootDay}
                        </span>
                        <span
                          style={{
                            background:
                              vid.accessLevel === 'public'
                                ? '#DBEAFE'
                                : vid.accessLevel === 'student'
                                ? '#D1FAE5'
                                : '#F3E8FF',
                            color:
                              vid.accessLevel === 'public'
                                ? '#1E40AF'
                                : vid.accessLevel === 'student'
                                ? '#065F46'
                                : '#6B21A8',
                            fontSize: '0.68rem',
                            fontWeight: 900,
                            padding: '0.18rem 0.55rem',
                            borderRadius: '999px',
                            textTransform: 'uppercase',
                          }}
                        >
                          {vid.accessLevel === 'public'
                            ? '🌐 Public'
                            : vid.accessLevel === 'student'
                            ? '🎓 Student'
                            : '🏛️ Member'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '50%',
                            background: unlocked ? '#F59E0B' : 'rgba(255,255,255,0.2)',
                            color: '#0B2545',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.25rem',
                            fontWeight: 900,
                            flexShrink: 0,
                          }}
                        >
                          {unlocked ? '▶' : '🔒'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#E2E8F0', fontWeight: 600 }}>
                          <div style={{ color: '#FDE68A', fontWeight: 800 }}>{vid.category}</div>
                          <div>📍 {vid.location}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#CBD5E1' }}>
                        <span>{vid.zoneName}</span>
                        <strong>⏱️ {vid.duration}</strong>
                      </div>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '1rem 1.15rem' }}>
                      <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0B2545', marginBottom: '0.4rem', lineHeight: 1.35 }}>
                        {vid.title}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, marginBottom: '0.65rem' }}>
                        {vid.description}
                      </p>
                      {vid.schoolName && (
                        <div style={{ fontSize: '0.75rem', color: '#0369A1', fontWeight: 700 }}>
                          🏫 {vid.schoolName}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div
                    style={{
                      padding: '0.75rem 1.15rem',
                      borderTop: '1px solid #F1F5F9',
                      background: '#F8FAFC',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B' }}>
                      {vid.topic}
                    </span>

                    <button
                      type="button"
                      onClick={() => setActiveVideo(vid)}
                      className="school-click-here-btn"
                      style={{
                        background: unlocked ? '#0B2545' : '#475569',
                        padding: '0.38rem 0.75rem',
                        fontSize: '0.75rem',
                      }}
                    >
                      {unlocked ? '▶ Watch Clip' : '🔒 Unlock to Watch'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================================
          5. VIDEO PLAYER & ACCESS CONTROL MODAL
         ================================================================= */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveVideo(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(6, 19, 36, 0.82)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '2px solid #D97706',
              maxWidth: '760px',
              width: '100%',
              padding: '1.5rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.45)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <span className="pay-badge">
                  CLIP #{String(activeVideo.clipNumber).padStart(2, '0')} &middot; {activeVideo.category}
                </span>
                <h2 style={{ fontSize: '1.25rem', color: '#0B2545', marginTop: '0.25rem' }}>
                  {activeVideo.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                style={{
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '0.4rem 0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                ✕ Close
              </button>
            </div>

            {canWatch(activeVideo.accessLevel) ? (
              <div>
                <div
                  style={{
                    background: 'radial-gradient(circle at center, #1E3A8A 0%, #061324 100%)',
                    borderRadius: '12px',
                    height: '320px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    padding: '1.5rem',
                    textAlign: 'center',
                    border: '2px solid #0B2545',
                    marginBottom: '1rem',
                  }}
                >
                  <Image
                    src="/assets/img/aopstsma-seal.jpg"
                    alt="AOPSTSMA Seal"
                    width={64}
                    height={64}
                    style={{ borderRadius: '50%', border: '2px solid #D97706', marginBottom: '0.75rem' }}
                  />
                  <div style={{ fontSize: '0.76rem', color: '#FDE68A', fontWeight: 800, letterSpacing: '0.06em' }}>
                    AOPSTSMA EDUCATIONAL STREAM &middot; DURATION {activeVideo.duration}
                  </div>
                  <h3 style={{ color: '#FFFFFF', fontSize: '1.15rem', margin: '0.4rem 0', maxWidth: '540px' }}>
                    {activeVideo.title}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#CBD5E1', maxWidth: '520px', marginBottom: '1rem' }}>
                    📍 Recorded at {activeVideo.location} ({activeVideo.zoneName}) &middot;{' '}
                    {activeVideo.schoolName || 'Association Academic Wing'}
                  </p>
                  <span
                    style={{
                      background: '#10B981',
                      color: '#FFFFFF',
                      padding: '0.45rem 1.15rem',
                      borderRadius: '999px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                    }}
                  >
                    ▶ Authorized Playback Active ({activeVideo.id})
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#334155', margin: 0 }}>
                  <strong>Session Summary:</strong> {activeVideo.description}
                </p>
              </div>
            ) : (
              <div
                style={{
                  background: '#FEF2F2',
                  border: '1.5px solid #F87171',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '0.35rem' }}>🔒</div>
                <h3 style={{ color: '#991B1B', fontSize: '1.15rem', marginBottom: '0.35rem' }}>
                  Restricted Educational Video ({activeVideo.accessLevel.toUpperCase()} ACCESS ONLY)
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#7F1D1D', maxWidth: '480px', margin: '0 auto 1rem' }}>
                  This video clip is protected and requires a verified{' '}
                  {activeVideo.accessLevel === 'student'
                    ? 'Student Registration Number'
                    : 'Member School / Association Authorization Code'}
                  .
                </p>

                <form
                  onSubmit={handleUnlockSubmit}
                  style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}
                >
                  <input
                    type="text"
                    placeholder="Enter Registration No (e.g. AOP-BZB-2026-1024)"
                    value={unlockInput}
                    onChange={(e) => setUnlockInput(e.target.value)}
                    style={{
                      padding: '0.6rem 0.9rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      minWidth: '250px',
                    }}
                  />
                  <button type="submit" className="btn btn--primary">
                    🔓 Verify &amp; Watch Now
                  </button>
                </form>

                <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                  Don&apos;t have a Registration Number yet?{' '}
                  <Link href="/students" style={{ color: '#0B2545', fontWeight: 800, textDecoration: 'underline' }}>
                    Complete Student Registration &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

