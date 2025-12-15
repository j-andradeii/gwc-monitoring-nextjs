'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

const galleryImages: GalleryImage[] = [
  { id: 1, src: 'https://scontent.fceb9-1.fna.fbcdn.net/v/t51.82787-15/600971167_18552055939027499_7364704594498459974_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeH3eGwESCYqWS60Dxy6L2SXRv8T0LZUBtxG_xPQtlQG3OT4VywcetHGmsi-abxF7pk&_nc_ohc=yXFVI5n1-SwQ7kNvwHsy4bL&_nc_oc=AdnaQylIf2h5ZLauk7R3RkSzySFdqtB_m_-QLiK_8NXzZRHkhwrnC6kjdi5MGLkRJqY&_nc_zt=23&_nc_ht=scontent.fceb9-1.fna&_nc_gid=9wef2lPo1v15nqj0BDoY0Q&oh=00_Afk0v1LzU000OyCIiRCAn1CiJwFHtq3wRqolzh4H-4TbAw&oe=6945C6AB', alt: 'Sunday Worship' },
  { id: 2, src: 'https://scontent.fceb3-1.fna.fbcdn.net/v/t51.82787-15/598699385_18552055996027499_6762018156878918771_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGZRjtFt-7HIvc-J8l0DYaazsUCqRPwjc7OxQKpE_CNzqmuMNpbZu-gZBI0aZeQ-NA&_nc_ohc=vOFKimMYMJgQ7kNvwGGCds3&_nc_oc=AdlwgLamroWMqf06fGJoFD9yU-DOA9MfJ2Kjj-fHAKIlW_oJ-EmTxQd5sVVqwzs1dhI&_nc_zt=23&_nc_ht=scontent.fceb3-1.fna&_nc_gid=K7gLkKVj02AaChmvFFmWjg&oh=00_AfmJzAZeD173aVmq3cdGIZcLFEuerw6U0nEbhSX_DYDc1A&oe=6945D140', alt: 'Fellowship Lunch' },
  { id: 3, src: 'https://scontent.fceb9-1.fna.fbcdn.net/v/t39.30808-6/598721854_122181101078766700_9143129039121658822_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeFh9oH0UDqIoMjDmIkg7Al51oDoL-ujR9DWgOgv66NH0M5YW2fLXIF391A3xQIMzAU&_nc_ohc=Vufm1a4g5O0Q7kNvwHsUcne&_nc_oc=AdlJNnpHSyeeMjTrIRXkxZ_zjzQUvwgRX5M9_Jhy3bt7DpzumtGGu1THAJimKWKmYJ8&_nc_zt=23&_nc_ht=scontent.fceb9-1.fna&_nc_gid=P9xr5nb1ZQqpl7uXTqbr8A&oh=00_AfnOBEQ7qp0DsjD_Z2o5ipQGoAFn5m9x9lRSs1gF0hfv9A&oe=6945BD99', alt: 'Youth Night' },
  { id: 4, src: 'https://scontent.fceb9-1.fna.fbcdn.net/v/t39.30808-6/600298253_122181101144766700_3891688888582137604_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeEJZ-MpbZVEDQ35iKbjBO1FQJEBzrEVY5ZAkQHOsRVjluXZavBBmoFPG02TkqL8GI0&_nc_ohc=XSctucEDYYQQ7kNvwHO6dLW&_nc_oc=AdnVrxYS_IOsKtehPyPPl3RVyDN0-uyxFgm9H8Q7vo3xlCm55u7FQuqUUbi2eAkdGZQ&_nc_zt=23&_nc_ht=scontent.fceb9-1.fna&_nc_gid=kxT9pzYYDDE56UpCT0GACg&oh=00_AflYxXG8x9wPlfUQR4piPStMn3GB5x8Jjpaxf7i-hBSR_g&oe=6945C701', alt: 'Community Outreach' },
  { id: 5, src: 'https://scontent.fceb9-1.fna.fbcdn.net/v/t39.30808-6/597992661_122181102518766700_6759379141760359149_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeHsj_cNjsC-okqbl2FgXGyPyCWH71u6YwzIJYfvW7pjDJ2f741ddVAfqXpbKr8Aob0&_nc_ohc=VkBh73CVghIQ7kNvwGDL5Zv&_nc_oc=AdlDilNPp0kZX1FKe2nzCuBjYPYnPgwkJYdMSHu6Rnn0BR8NBOdQauUvmr1ruFUt2Fs&_nc_zt=23&_nc_ht=scontent.fceb9-1.fna&_nc_gid=DfvWJ2beHWLv4zb3jH0liA&oh=00_Afngci09kbxlBSCe8GO8kHFireIQMRge3iVYNkd9mfrooA&oe=6945F2CD', alt: 'Kids Ministry' },
  { id: 6, src: 'https://scontent.fceb3-1.fna.fbcdn.net/v/t39.30808-6/600246917_122181101246766700_5544020493032707358_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeEI1HLnQZOtQ6HjxFlq_MvCXTbUob2H7S5dNtShvYftLm4-jfZN89cgMKA1TkCRMDM&_nc_ohc=Ubp6nz6ORdoQ7kNvwHS7A_A&_nc_oc=AdnzIS5eLjXBmRf0X8U6noE7UDvUX4pv9-Hl35-y-0vk9s8HYrYR9tm1ZAm4xxhCotE&_nc_zt=23&_nc_ht=scontent.fceb3-1.fna&_nc_gid=mwpI8MYIkTF_sLqMVEvKVw&oh=00_AflG2nVk3LS3v3apMWhLu5PlEKG4OTQYk9hdvHq_QhVl3g&oe=6945CB7D', alt: 'Volunteer Team' },
  { id: 7, src: 'https://scontent.fceb9-1.fna.fbcdn.net/v/t39.30808-6/598354889_122181101306766700_7166132187056166846_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeEgIGF8p2DO9ns8uRNSRhD84Fpw7RCA0wDgWnDtEIDTAJrS-l-RakhdT7OoxT2F8L8&_nc_ohc=0xg0DWBSclwQ7kNvwEdqIwb&_nc_oc=AdkeeMYF9u_-gLOMpi8y2GKMPTdB0K1q6YHfuHrXhVtpCMeZI4PWM03PlIjah8HiFUQ&_nc_zt=23&_nc_ht=scontent.fceb9-1.fna&_nc_gid=cryoRjJBdvpNuuiewfeNbw&oh=00_Afmoe49zPq_7HcN9hJ-EM6zgpomHR5jcHA6KHVF1W2gLbQ&oe=6945E5F3', alt: 'Prayer Meeting' },
  { id: 8, src: 'https://scontent.fceb9-1.fna.fbcdn.net/v/t39.30808-6/600267226_122181102296766700_4095360869145085288_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeGzXzuySbCuRnsZloenNaGIVNVcyRmc5vFU1VzJGZzm8ZfRPP_j_jFKsyDyD8IWEjQ&_nc_ohc=aFJ-vH1A-h0Q7kNvwFwvXoV&_nc_oc=AdkLPi1NrT_0iqs4IK2NymQoRJ4CkJl57-Vf8klOBooILpyRJ0yZH5EDb-t313x1ztI&_nc_zt=23&_nc_ht=scontent.fceb9-1.fna&_nc_gid=hHR7aaza3NWO6Z4co_HXkQ&oh=00_AfnLM83StEkNG-j2i5nKYOzZfilfXGkvBgGMhR1KLmoVDA&oe=6945F3A0', alt: 'Baptism Service' },
  { id: 9, src: 'https://scontent.fceb3-1.fna.fbcdn.net/v/t39.30808-6/598714870_122181102446766700_1099840975765605389_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeFoxn-ozgyxS5_2f8iZXF5puAwv2S4TbXu4DC_ZLhNte4-ZCCHoE4nUDZuofBSn3vM&_nc_ohc=Dg26fE8SNZQQ7kNvwF7ssEb&_nc_oc=Adkh0auyXQPV620pZE43zDWtteucfZfQNOEOcOJjEcsK2HKj0qsPUbwDnWfKUV-u7Es&_nc_zt=23&_nc_ht=scontent.fceb3-1.fna&_nc_gid=zMwMejQebGpeLa1fdn3I-A&oh=00_Aflm3HjsrH8WS-jAKfpJWq4BDyY1plk56ibg14tklcjOkQ&oe=6945C13E', alt: 'Small Groups' },
];

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const CommunityGallerySection: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [images, setImages] = useState<GalleryImage[]>(galleryImages);
  const [layoutOrder, setLayoutOrder] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  // Shuffle images and layout only on client after hydration to avoid mismatch
  useEffect(() => {
    setImages(shuffleArray(galleryImages));
    setLayoutOrder(shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]));
  }, []);

  return (
    <section className="community-gallery-section" id="community">
      <div className="landing-container">
        <div className="section-header-center">
          <span className="section-label">Our Community</span>
          <h2>Life Together</h2>
          <p>Real moments from our vibrant church family</p>
        </div>

        <div className="collage-grid">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`collage-item collage-item-${layoutOrder[index]} ${hoveredId === image.id ? 'active' : ''} ${hoveredId && hoveredId !== image.id ? 'dimmed' : ''}`}
              onMouseEnter={() => setHoveredId(image.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="collage-image-wrapper">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="collage-image"
                  unoptimized
                />
              </div>
            </div>
          ))}
        </div>

        <div className="gallery-cta">
          <a href="#contact" className="landing-btn landing-btn-primary">
            <i className="pi pi-users"></i>
            Join Our Family
          </a>
        </div>
      </div>
    </section>
  );
};

export default CommunityGallerySection;
