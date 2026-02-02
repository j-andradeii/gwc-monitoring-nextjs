/**
 * Sermon Data
 *
 * Shared sermon data used across the application
 */

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  speakerRole?: string;
  speakerImage?: string;
  date: string;
  duration: string;
  series: string;
  seriesDescription?: string;
  excerpt: string;
  description?: string;
  tags: string[];
  image: string;
  videoUrl?: string;
  audioUrl?: string;
  scriptures: {
    verse: string;
    text: string;
  }[];
  downloadUrl?: string;
  isFeatured?: boolean;
  keyPoints?: string[];
  relatedSermons?: string[];
}

export const sermons: Sermon[] = [
  {
    id: '1',
    title: 'The Power of Faith',
    speaker: 'Pastor Vlad Savchuk',
    speakerRole: 'Senior Pastor',
    speakerImage: 'https://yt3.googleusercontent.com/ytc/AIdro_kgM8k5Jb_8xG8wMT3UvKl8W-5SxsS8_5L2yJ8=s176-c-k-c0x00ffffff-no-rj',
    date: '2024-12-08',
    duration: '45 min',
    series: 'Faith Foundations',
    seriesDescription: 'A deep dive into the fundamentals of Christian faith and how to apply them in our daily lives.',
    excerpt: 'Exploring what it means to walk by faith and not by sight in our daily lives. Discover how trusting God transforms our perspective and empowers us to overcome challenges.',
    description: `In this powerful message, Pastor Vlad takes us on a journey through Hebrews 11, often called the "Hall of Faith." We explore what it truly means to walk by faith and not by sight in our daily lives.

Faith is not just believing that God exists—it's trusting Him completely with every area of our lives. When we choose to walk by faith, we experience a transformation in how we see our circumstances, our challenges, and our future.

This sermon will challenge you to:
- Examine the quality of your faith
- Understand the difference between belief and trust
- Learn practical ways to strengthen your faith daily
- Discover how faith changes your perspective on trials`,
    tags: ['Faith', 'Trust', 'Christian Living', 'Hebrews'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    // No video - image only sermon
    scriptures: [
      {
        verse: 'Hebrews 11:1-6',
        text: 'Now faith is confidence in what we hope for and assurance about what we do not see. This is what the ancients were commended for. By faith we understand that the universe was formed at God\'s command, so that what is seen was not made out of what was visible.'
      }
    ],
    isFeatured: true,
    keyPoints: [
      'Faith is the foundation of our relationship with God',
      'Walking by faith means trusting God even when we cannot see the outcome',
      'Our faith grows stronger through trials and challenges',
      'Faith without action is incomplete'
    ],
    relatedSermons: ['2', '4'],
  },
  {
    id: '2',
    title: 'Living in Community',
    speaker: 'Pastor Jane Doe',
    speakerRole: 'Associate Pastor',
    speakerImage: 'https://placehold.co/100x100/1e3a5f/ffffff?text=JD',
    date: '2024-12-01',
    duration: '38 min',
    series: 'Better Together',
    seriesDescription: 'Exploring the importance of Christian community and how we grow together as the body of Christ.',
    excerpt: 'The importance of fellowship and how we grow together as the body of Christ. Learn practical ways to build meaningful connections.',
    description: `The Christian life was never meant to be lived alone. In this message, Pastor Jane explores the beautiful picture of community we see in the early church in Acts 2.

We were created for connection. God designed us to need each other, to encourage one another, and to grow together. When we isolate ourselves, we miss out on the fullness of what God has for us.

This sermon covers:
- The biblical model for Christian community
- Why isolation is dangerous for our spiritual health
- How to build authentic relationships in the church
- Practical steps to deepen your connections`,
    tags: ['Community', 'Fellowship', 'Church', 'Relationships'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    // No video - image only sermon
    scriptures: [
      {
        verse: 'Acts 2:42-47',
        text: 'They devoted themselves to the apostles\' teaching and to fellowship, to the breaking of bread and to prayer. Everyone was filled with awe at the many wonders and signs performed by the apostles.'
      }
    ],
    keyPoints: [
      'We were created for community, not isolation',
      'The early church devoted themselves to fellowship',
      'Authentic community requires vulnerability',
      'We grow faster and stronger together'
    ],
    relatedSermons: ['6', '1'],
  },
  {
    id: '3',
    title: 'Finding Your Purpose',
    speaker: 'Pastor Vlad Savchuk',
    speakerRole: 'Senior Pastor',
    speakerImage: 'https://yt3.googleusercontent.com/ytc/AIdro_kgM8k5Jb_8xG8wMT3UvKl8W-5SxsS8_5L2yJ8=s176-c-k-c0x00ffffff-no-rj',
    date: '2024-11-24',
    duration: '42 min',
    series: 'Destiny',
    seriesDescription: 'Discovering and walking in God\'s unique calling for your life.',
    excerpt: "Discovering God's unique calling and purpose for your life. Understanding how your gifts and passions align with His plan.",
    description: `Have you ever wondered, "Why am I here?" or "What is my purpose?" In this inspiring message, Pastor Vlad helps us discover that God has a unique plan and purpose for each of our lives.

Your purpose isn't something you have to create—it's something you discover. God has already placed within you the gifts, passions, and experiences that point toward your calling.

In this sermon, you'll learn:
- How to identify your God-given gifts
- The connection between your passions and your purpose
- Why your past experiences matter for your future calling
- Steps to begin walking in your purpose today`,
    tags: ['Purpose', 'Calling', 'Destiny', 'Identity'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    // No video - image only sermon
    scriptures: [
      {
        verse: 'Jeremiah 29:11-13',
        text: '"For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future."'
      }
    ],
    keyPoints: [
      'God has a unique purpose for your life',
      'Your gifts and passions are clues to your calling',
      'Purpose is discovered, not created',
      'Walking in purpose brings fulfillment and impact'
    ],
    relatedSermons: ['1', '5'],
  },
  {
    id: '4',
    title: 'Overcoming Fear',
    speaker: 'Pastor Vlad Savchuk',
    speakerRole: 'Senior Pastor',
    speakerImage: 'https://yt3.googleusercontent.com/ytc/AIdro_kgM8k5Jb_8xG8wMT3UvKl8W-5SxsS8_5L2yJ8=s176-c-k-c0x00ffffff-no-rj',
    date: '2024-11-17',
    duration: '40 min',
    series: 'Faith Foundations',
    seriesDescription: 'A deep dive into the fundamentals of Christian faith and how to apply them in our daily lives.',
    excerpt: 'How to overcome fear and anxiety through the promises of God. Practical steps to finding peace in uncertain times.',
    description: `Fear and anxiety are two of the greatest challenges we face in our modern world. But God's Word is clear: we don't have to live in fear. In this powerful message, Pastor Vlad shares practical, biblical strategies for overcoming fear.

"Fear not" appears over 365 times in the Bible—one for every day of the year. God knew we would struggle with fear, and He provided the antidote: His presence, His promises, and His peace.

This sermon will help you:
- Understand the root causes of fear
- Apply God's promises to anxious thoughts
- Develop practical habits for peace
- Experience freedom from the grip of fear`,
    tags: ['Fear', 'Anxiety', 'Peace', 'Trust'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    // No video - image only sermon
    scriptures: [
      {
        verse: 'Isaiah 41:10',
        text: 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.'
      }
    ],
    keyPoints: [
      'Fear is not from God—He gives us power, love, and a sound mind',
      'God\'s presence is the antidote to fear',
      'We overcome fear by meditating on God\'s promises',
      'Faith and fear cannot coexist in the same heart'
    ],
    relatedSermons: ['1', '2'],
  },
  {
    id: '5',
    title: 'The Joy of Giving',
    speaker: 'Guest Speaker',
    speakerRole: 'Visiting Minister',
    speakerImage: 'https://placehold.co/100x100/1e3a5f/ffffff?text=GS',
    date: '2024-11-10',
    duration: '35 min',
    series: 'Generosity',
    seriesDescription: 'Understanding biblical principles of stewardship and generosity.',
    excerpt: 'Understanding the biblical principles of generosity and its blessings. How giving transforms both the giver and receiver.',
    description: `Generosity is at the heart of the gospel. God gave His only Son, and we are called to live with open hands and open hearts. In this message, our guest speaker explores the transformative power of giving.

When we give, something happens in our hearts. Generosity breaks the grip of materialism and positions us to receive God's abundant blessings—not just financially, but in every area of life.

You'll discover:
- The biblical principles of sowing and reaping
- Why giving is an act of worship
- How generosity transforms your heart
- Practical ways to grow in generosity`,
    tags: ['Giving', 'Generosity', 'Blessings', 'Stewardship'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    // No video - image only sermon
    scriptures: [
      {
        verse: '2 Corinthians 9:6-8',
        text: 'Remember this: Whoever sows sparingly will also reap sparingly, and whoever sows generously will also reap generously. Each of you should give what you have decided in your heart to give.'
      },
      {
        verse: 'Malachi 3:10',
        text: ' Bring the whole tithe into the storehouse, that there may be food in my house. Test me in this,” says the Lord Almighty, “and see if I will not throw open the floodgates of heaven and pour out so much blessing that there will not be room enough to store it'
      }
    ],
    keyPoints: [
      'God loves a cheerful giver',
      'Generosity breaks the grip of materialism',
      'We cannot out-give God',
      'Giving is an act of worship and trust'
    ],
    relatedSermons: ['3', '6'],
  },
  {
    id: '6',
    title: 'Walking in Love',
    speaker: 'Pastor Vlad Savchuk',
    speakerRole: 'Senior Pastor',
    speakerImage: 'https://yt3.googleusercontent.com/ytc/AIdro_kgM8k5Jb_8xG8wMT3UvKl8W-5SxsS8_5L2yJ8=s176-c-k-c0x00ffffff-no-rj',
    date: '2024-11-03',
    duration: '43 min',
    series: 'Better Together',
    seriesDescription: 'Exploring the importance of Christian community and how we grow together as the body of Christ.',
    excerpt: 'Practical ways to demonstrate Christ-like love in our relationships. Building bridges and healing hearts through unconditional love.',
    description: `Love is the identifying mark of a Christian. Jesus said, "By this everyone will know that you are my disciples, if you love one another." In this message, Pastor Vlad unpacks the beautiful description of love in 1 Corinthians 13.

Love is not just an emotion—it's a decision and an action. True love is patient, kind, and selfless. It's the kind of love that transforms relationships, heals wounds, and changes communities.

This sermon explores:
- The characteristics of Christ-like love
- How to love difficult people
- Practical ways to grow in love
- The power of unconditional love`,
    tags: ['Love', 'Relationships', 'Grace', 'Forgiveness'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    // No video - image only sermon
    scriptures: [
      {
        verse: '1 Corinthians 13:4-7',
        text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs.'
      }
    ],
    keyPoints: [
      'Love is the greatest commandment',
      'True love is an action, not just an emotion',
      'We love because God first loved us',
      'Love covers a multitude of sins'
    ],
    relatedSermons: ['2', '4'],
  },
];

export const getSermonById = (id: string): Sermon | undefined => {
  return sermons.find(sermon => sermon.id === id);
};

export const getRelatedSermons = (sermonId: string): Sermon[] => {
  const sermon = getSermonById(sermonId);
  if (!sermon?.relatedSermons) return [];
  return sermon.relatedSermons
    .map(id => getSermonById(id))
    .filter((s): s is Sermon => s !== undefined);
};

export const getFeaturedSermon = (): Sermon | undefined => {
  return sermons.find(sermon => sermon.isFeatured);
};

export const getSermonsBySeries = (series: string): Sermon[] => {
  return sermons.filter(sermon => sermon.series === series);
};

export const getAllSeries = (): string[] => {
  return [...new Set(sermons.map(sermon => sermon.series))];
};
