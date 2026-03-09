'use client';

import React, { useState } from 'react';
import { ShareModal } from '@/components/landing';

const SHARE_TITLE = 'Upcoming Events | Gateway Church';
const SHARE_EXCERPT =
  'Check out upcoming events at Gateway Church — connect, grow, and celebrate with our community.';

export function EventsShareButton() {
  const [showShareModal, setShowShareModal] = useState(false);

  const handleShareClick = async () => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile && typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: SHARE_TITLE,
          text: SHARE_EXCERPT,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      setShowShareModal(true);
    }
  };

  return (
    <>
      <button
        className="landing-btn landing-btn-outline"
        onClick={handleShareClick}
        style={{ gap: '8px' }}
      >
        <i className="pi pi-share-alt" />
        Share Events
      </button>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={SHARE_TITLE}
        excerpt={SHARE_EXCERPT}
        modalTitle="Share Events"
      />
    </>
  );
}
