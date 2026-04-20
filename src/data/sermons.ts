/**
 * Sermon Data
 *
 * Shared sermon data used across the application
 */

export interface Sermon {
  id: string;
  slug: string;
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

  // NEW — optional progressive-enhancement fields for the redesigned layout.
  // Existing sermons that lack these fields fall back to parsing `description` markdown.
  seriesNumber?: number;
  subtitle?: {
    prefix: string;
    italic: string;
    suffix?: string;
  };
  keyVerse?: string;
  sections?: Array<{
    id?: string;
    kicker?: string;
    title: string;
    paragraphs: string[];
    callout?: string;
    unnumbered?: boolean;
    subItems?: Array<{
      title: string;
      ref?: string;
      text: string;
    }>;
  }>;
  blessings?: Array<{
    title: string;
    ref: string;
    text: string;
  }>;
  keyTakeaways?: string[];
  scriptureGroups?: Array<{
    kicker?: string;
    verse: string;
    text: string;
  }>;
}

export const sermons: Sermon[] = [
  {
    id: '1',
    slug: 'traps-for-ministers',
    title: 'TRAPS FOR MINISTERS',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2026-01-25',
    duration: '45 min',
    series: 'Faith Foundation',
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'A call to vigilance, focus, and holy passion. This is a season that demands watchfulness.',
    description: `**a. Burnout disguised as faithfulness**
- Enduring, not enjoying, not bearing fruits
- Enjoy the ministry, not endure the ministry
- Humans are not meant to depend upon human strength
- When God created us, He created us in a way that we should be power assisted

**b. Compromise justified as strategy**
They do not announce themselves as sin. They often appear as opportunities, responsibilities, sympathetic actions, growth, relevance, or even blessings. Yet they slowly pull the called away from prayer, consecration, holiness, and divine focus.

**(1)** We must sensitively desist from any questionable conduct that dilutes or harms our Christian witness to unbelievers (1 Cor. 10:27-33).

**(2)** All association with or appearance of idolatry must be decisively avoided (1 Cor. 8:10; 10:7, 12, 14, 18-20).

**(3)** The law of love will cause us to limit voluntarily our Christian freedom in order not to lead by example another believer into compromising their convictions, defiling their conscience and thereby going down a path to spiritual ruin (1 Cor. 8:9-13; 10:24; cf. Rom. 14:1-15:3).

Those who have not prepared their minds and hearts to stay true to God and his Word will find it difficult to resist sin and to avoid conforming to the world's ungodly ideas and lifestyles.

**c. Isolation masked as independence**
Daniel 10:4-20 - the spirit prince of the kingdoms... Angels on assignment...

The devil's strategy is Isolation but God's antidote is connection.

"Whoever isolates himself seeks his own desire; he breaks out against all sound judgment." (Proverbs 18:1)

This reveals the motivation and consequence for willful isolation. We isolate ourselves primarily because of selfish desires for comfort, protection, and self-rule.

**d. Pride camouflaged as confidence**
Daniel 4:20-33

"Pride goes before destruction, and haughtiness before a fall." (Proverbs 16:18)

"Live in harmony with one another. Do not be proud, but be willing to associate with people of low position. Do not be conceited." (Romans 12:16)

**e. Moral looseness excused as grace**
"King Nebuchadnezzar, please accept my advice. Stop sinning and do what is right. Break from your wicked past and be merciful to the poor. Perhaps then you will continue to prosper." (Daniel 4:27)

"Well then, should we keep on sinning so that God can show us more and more of his wonderful grace? Of course not! Since we have died to sin, how can we continue to live in it? Or have you forgotten that when we were joined with Christ Jesus in baptism, we joined him in his death? For we died and were buried with Christ by baptism. And just as Christ was raised from the dead by the glorious power of the Father, now we also may live new lives." (Romans 6:1-4)

These traps are designed not just to destroy ministers—but to wound the flocks committed to their care.

"Smite the shepherd, and the sheep shall be scattered." (Zechariah 13:7, KJV)

---

**CONCLUSION/APPLICATION:** A Call to Vigilance, Focus, and Holy Passion

This is a season that demands watchfulness.

"Be on guard. Stand firm in the faith. Be courageous. Be strong. And do everything with love." (1 Corinthians 16:13-14, NLT)

To every Gate-keeper:
**a.** Guard your prayer life fiercely
**b.** Protect your private consecration
**c.** Discipline your time and attention
**d.** Refuse every distraction that steals spiritual depth
**e.** Reignite your first love

The end-time ministry will not be carried by the gifted alone—but by the faithful, focused, and fiery!`,
    tags: ['Ministry', 'Leadership', 'Burnout', 'Compromise', 'Pride', 'Vigilance', 'Holiness'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    scriptures: [
      {
        verse: '1 Corinthians 10:27-33',
        text: 'If any of those who do not believe invites you to dinner, and you desire to go, eat whatever is set before you, asking no question for conscience’ sake. But if anyone says to you, "This was offered to idols," do not eat it for the sake of the one who told you, and for conscience’ sake; for "the earth is the Lord’s, and all its fullness." "Conscience," I say, not your own, but that of the other. For why is my liberty judged by another man’s conscience? But if I partake with thanks, why am I evil spoken of for the food over which I give thanks? Therefore, whether you eat or drink, or whatever you do, do all to the glory of God. Give no offense, either to the Jews or to the Greeks or to the church of God, just as I also please all men in all things, not seeking my own profit, but the profit of many, that they may be saved.'
      },
      {
        verse: '1 Corinthians 8:9-13',
        text: 'But beware lest somehow this liberty of yours become a stumbling block to those who are weak. For if anyone sees you who have knowledge eating in an idol’s temple, will not the conscience of him who is weak be emboldened to eat those things offered to idols? And because of your knowledge shall the weak brother perish, for whom Christ died? But when you thus sin against the brethren, and wound their weak conscience, you sin against Christ. Therefore, if food makes my brother stumble, I will never again eat meat, lest I make my brother stumble.'
      },
      {
        verse: 'Proverbs 18:1',
        text: 'A man who isolates himself seeks his own desire; He rages against all wise judgment.'
      },
      {
        verse: 'Proverbs 16:18',
        text: 'Pride goes before destruction, And a haughty spirit before a fall.'
      },
      {
        verse: 'Romans 12:16',
        text: 'Be of the same mind toward one another. Do not set your mind on high things, but associate with the humble. Do not be wise in your own opinion.'
      },
      {
        verse: 'Romans 6:1-4',
        text: 'What shall we say then? Shall we continue in sin that grace may abound? Certainly not! How shall we who died to sin live any longer in it? Or do you not know that as many of us as were baptized into Christ Jesus were baptized into His death? Therefore we were buried with Him through baptism into death, that just as Christ was raised from the dead by the glory of the Father, even so we also should walk in newness of life.'
      },
      {
        verse: 'Zechariah 13:7',
        text: '"Awake, O sword, against My Shepherd, Against the Man who is My Companion," Says the Lord of hosts. "Strike the Shepherd, And the sheep will be scattered; Then I will turn My hand against the little ones."'
      },
      {
        verse: '1 Corinthians 16:13-14',
        text: 'Watch, stand fast in the faith, be brave, be strong. Let all that you do be done with love.'
      }
    ],
    keyPoints: [
      'Burnout disguised as faithfulness - enduring, not enjoying, not bearing fruits',
      'Compromise justified as strategy - they do not announce themselves as sin',
      'Isolation masked as independence - the devil\'s strategy is isolation but God\'s antidote is connection',
      'Pride camouflaged as confidence',
      'Moral looseness excused as grace',
      'Guard your prayer life fiercely',
      'Protect your private consecration',
      'Discipline your time and attention',
      'Refuse every distraction that steals spiritual depth',
      'Reignite your first love'
    ],
    keyTakeaways: [
      'Burnout disguised as faithfulness - enduring, not enjoying, not bearing fruits',
      'Compromise justified as strategy - they do not announce themselves as sin',
      'Isolation masked as independence - the devil\'s strategy is isolation but God\'s antidote is connection',
      'Pride camouflaged as confidence',
      'Moral looseness excused as grace',
      'Guard your prayer life fiercely',
      'Protect your private consecration',
      'Discipline your time and attention',
      'Refuse every distraction that steals spiritual depth',
      'Reignite your first love',
    ],
    sections: [
      {
        id: 'burnout-disguised-as-faithfulness',
        title: 'a. Burnout disguised as faithfulness',
        paragraphs: [
          '- Enduring, not enjoying, not bearing fruits',
          '- Enjoy the ministry, not endure the ministry',
          '- Humans are not meant to depend upon human strength',
          '- When God created us, He created us in a way that we should be power assisted',
        ],
      },
      {
        id: 'compromise-justified-as-strategy',
        title: 'b. Compromise justified as strategy',
        paragraphs: [
          'They do not announce themselves as sin. They often appear as opportunities, responsibilities, sympathetic actions, growth, relevance, or even blessings. Yet they slowly pull the called away from prayer, consecration, holiness, and divine focus.',
          '**(1)** We must sensitively desist from any questionable conduct that dilutes or harms our Christian witness to unbelievers (1 Cor. 10:27-33).',
          '**(2)** All association with or appearance of idolatry must be decisively avoided (1 Cor. 8:10; 10:7, 12, 14, 18-20).',
          '**(3)** The law of love will cause us to limit voluntarily our Christian freedom in order not to lead by example another believer into compromising their convictions, defiling their conscience and thereby going down a path to spiritual ruin (1 Cor. 8:9-13; 10:24; cf. Rom. 14:1-15:3).',
          'Those who have not prepared their minds and hearts to stay true to God and his Word will find it difficult to resist sin and to avoid conforming to the world\'s ungodly ideas and lifestyles.',
        ],
      },
      {
        id: 'isolation-masked-as-independence',
        title: 'c. Isolation masked as independence',
        paragraphs: [
          'Daniel 10:4-20 - the spirit prince of the kingdoms... Angels on assignment...',
          'The devil\'s strategy is Isolation but God\'s antidote is connection.',
          '"Whoever isolates himself seeks his own desire; he breaks out against all sound judgment." (Proverbs 18:1)',
          'This reveals the motivation and consequence for willful isolation. We isolate ourselves primarily because of selfish desires for comfort, protection, and self-rule.',
        ],
      },
      {
        id: 'pride-camouflaged-as-confidence',
        title: 'd. Pride camouflaged as confidence',
        paragraphs: [
          'Daniel 4:20-33',
          '"Pride goes before destruction, and haughtiness before a fall." (Proverbs 16:18)',
          '"Live in harmony with one another. Do not be proud, but be willing to associate with people of low position. Do not be conceited." (Romans 12:16)',
        ],
      },
      {
        id: 'moral-looseness-excused-as-grace',
        title: 'e. Moral looseness excused as grace',
        paragraphs: [
          '"King Nebuchadnezzar, please accept my advice. Stop sinning and do what is right. Break from your wicked past and be merciful to the poor. Perhaps then you will continue to prosper." (Daniel 4:27)',
          '"Well then, should we keep on sinning so that God can show us more and more of his wonderful grace? Of course not! Since we have died to sin, how can we continue to live in it? Or have you forgotten that when we were joined with Christ Jesus in baptism, we joined him in his death? For we died and were buried with Christ by baptism. And just as Christ was raised from the dead by the glorious power of the Father, now we also may live new lives." (Romans 6:1-4)',
          'These traps are designed not just to destroy ministers—but to wound the flocks committed to their care.',
          '"Smite the shepherd, and the sheep shall be scattered." (Zechariah 13:7, KJV)',
        ],
      },
      {
        id: 'conclusion-application',
        kicker: 'Conclusion',
        title: 'A Call to Vigilance, Focus, and Holy Passion',
        paragraphs: [
          'This is a season that demands watchfulness.',
          '"Be on guard. Stand firm in the faith. Be courageous. Be strong. And do everything with love." (1 Corinthians 16:13-14, NLT)',
          'To every Gate-keeper:',
          '**a.** Guard your prayer life fiercely',
          '**b.** Protect your private consecration',
          '**c.** Discipline your time and attention',
          '**d.** Refuse every distraction that steals spiritual depth',
          '**e.** Reignite your first love',
          'The end-time ministry will not be carried by the gifted alone—but by the faithful, focused, and fiery!',
        ],
      },
    ],
    relatedSermons: ['5', '8'],
  },
  {
    id: '2',
    slug: 'consecration-of-the-first-born',
    title: 'Consecration of the First Born',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2025-03-23',
    duration: '45 min',
    series: 'Faith Foundation',
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'Redemption Consecration of the Firstborn - The Lord said to Moses, "Consecrate to me every firstborn male. The first offspring of every womb among the Israelites belongs to me."',
    description: `**REDEMPTION: CONSECRATION OF THE FIRSTBORN**

EXODUS 13 - Consecration of the Firstborn

The Lord said to Moses, "Consecrate to me every firstborn male. The first offspring of every womb among the Israelites belongs to me, whether human or animal."

"After the Lord brings you into the land of the Canaanites and gives it to you, as he promised on oath to you and your ancestors, you are to give over to the Lord the first offspring of every womb. All the firstborn males of your livestock belong to the Lord. Redeem with a lamb every firstborn donkey, but if you do not redeem it, break its neck. Redeem every firstborn among your sons."

"In days to come, when your son asks you, 'What does this mean?' say to him, 'With a mighty hand the Lord brought us out of Egypt, out of the land of slavery. When Pharaoh stubbornly refused to let us go, the Lord killed the firstborn of both people and animals in Egypt. This is why I sacrifice to the Lord the first male offspring of every womb and redeem each of my firstborn sons.' And it will be like a sign on your hand and a symbol on your forehead that the Lord brought us out of Egypt with his mighty hand."

---

**UNDERSTANDING CONSECRATION**

Consecrate - emphatic in the Hebrew language: "It belongs to me (emphatic). It is my property. It is mine. The first born is mine."

In verse 12: "You are to give over to the Lord the first offspring of every womb. All the firstborn males of your livestock belong to the Lord." Again, this shall be the property of the Lord - it belongs to Him.

But every firstborn of a donkey you shall redeem with a lamb, and if you will not redeem it, you shall break its neck. In other words, you're going to lose it anyway if you don't dedicate it to God.

---

**VERY IMPORTANT PRINCIPLE**

**1. The first born must be sacrificed or redeemed**

How do you know what you should sacrifice or redeem? God gives two classifications of animals:
- Clean animals (e.g., lambs)
- Unclean animals (e.g., donkeys)

If the firstborn is a clean animal, it has to be sacrificed. If it's an unclean animal, it has to be redeemed or purchased back from God because God owns it.

Redeemed means to buy back - not just to buy, but to buy back. It has to be redeemed with the sacrifice of a clean animal.

---

**APPLICATION FOR TODAY**

This was written about 4,000 years ago, so what does this have to do with us today?

You and I were born spiritually speaking, in our spiritual state before God, we were born unclean. You don't have to teach your children to be bad - it comes naturally (lying, stealing, selfishness). You don't have to teach them to be bad; it comes naturally. You have to teach them to be good.

"So let's not get tired of doing what is good. At just the right time we will reap a harvest of blessing if we don't give up. Therefore, whenever we have the opportunity, we should do good to everyone—especially to those in the family of faith." (Galatians 6:9-10)

So we were all born unclean. Was Jesus born unclean or clean? Jesus had to be sacrificed so that the unclean could be redeemed.

Through the blood of Jesus, we also have redemption (Ephesians 1:7). The word redemption means "freedom that is bought through the payment of a ransom." Jesus redeemed us by paying His blood; He freed us from sin.

---

**FOUR TRUTHS ABOUT OUR REDEMPTION**

**1. Our redemption price was paid to God**
Some have taught that Jesus paid the ransom to Satan, but we have never been indebted to Satan. Our debt is to the holiness and justice of God. Whereas God's holiness demanded a payment for sin, His love and grace paid the debt for us through the blood of Jesus.

**2. Redemption sets us free from the consequences of sin**
Paul wrote, "There is now no condemnation for those who are in Christ Jesus" (Romans 8:1).

The Holy Spirit brings freedom from sin. The Greek word used for "No" is a special negative, stronger than the ordinary no - very emphatic, double emphasis. Condemnation is already out of question.

"Has set you free" - not "will set you free." The Greek verb (Eliotherosem) indicates it already happened in the past - you have been set free.

Why did God set us free?
- V4: Live according to the Spirit
- V6: Mind controlled by the Spirit

Condemnation means "judgment or penalty." We could paraphrase this: "Now there is no punishment for sin for those who are in Christ Jesus."

Paul restated this truth: "For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord." (Romans 6:23)

**3. Redemption frees us from the power of sin**
Suppose a cocaine addict is arrested for drug possession and then is freed on a technicality. While he momentarily escapes the consequences of his sin, he is not freed from the power of the addiction that controls him. Within weeks, he is arrested again for the same crime.

In contrast, our redemption is complete. God frees us not only from the punishment for sin but also from sin's controlling power in our lives.

"For he has rescued us from the dominion of darkness and brought us into the kingdom of the Son he loves, in whom we have redemption, the forgiveness of sins." (Colossians 1:13-14)

When we were controlled by our sinful nature, we could not please God. Now, however, we are controlled by the Spirit if the Spirit lives in us (Romans 8:8-9).

**4. Redemption sets us free from an empty life**
God redeemed us "from the empty way of life handed down" from our forefathers (1 Peter 1:18).

Jesus himself said, "I have come that they may have life, and have it to the full" (John 10:10).

Through redemption, we find true meaning and purpose for our lives.

---

**EXPLORE:** 1 PETER 1:17-21

"And remember that the heavenly Father to whom you pray has no favorites. He will judge or reward you according to what you do. So you must live in reverent fear of him during your time here as 'temporary residents.' For you know that God paid a ransom to save you from the empty life you inherited from your ancestors. And it was not paid with mere gold or silver, which lose their value. It was the precious blood of Christ, the sinless, spotless Lamb of God. God chose him as your ransom long before the world began, but now in these last days he has been revealed for your sake. Through Christ you have come to trust in God. And you have placed your faith and hope in God because he raised Christ from the dead and gave him great glory."

---

**CROSSING THE SEA** (Exodus 13:17-22)

When Pharaoh let the people go, God did not lead them on the road through the Philistine country, though that was shorter. For God said, "If they face war, they might change their minds and return to Egypt."

So God led the people around by the desert road toward the Red Sea. The Israelites went up out of Egypt ready for battle. Moses took the bones of Joseph with him because Joseph had made the Israelites swear an oath: "God will surely come to your aid, and then you must carry my bones up with you from this place."

After leaving Sukkoth they camped at Etham on the edge of the desert. By day the Lord went ahead of them in a pillar of cloud to guide them on their way and by night in a pillar of fire to give them light, so that they could travel by day or night. Neither the pillar of cloud by day nor the pillar of fire by night left its place in front of the people.

---

**GO**

You have access to a pillar of fire or cloud (the Holy Spirit). What steps can you take to seek out God's presence this week? Where has God been trying to move or lead you in recent days, weeks, or months?`,
    tags: ['Redemption', 'Consecration', 'Sacrifice', 'Exodus', 'Freedom', 'Holy Spirit'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    scriptures: [
      {
        verse: 'Exodus 13:2, 11-16',
        text: '"Consecrate to Me all the firstborn, whatever opens the womb among the children of Israel, both of man and beast; it is Mine." ... "And it shall be, when the Lord brings you into the land of the Canaanites, as He swore to you and your fathers, and gives it to you, that you shall set apart to the Lord all that open the womb, that is, every firstborn that comes from an animal which you have; the males shall be the Lord’s. But every firstborn of a donkey you shall redeem with a lamb; and if you will not redeem it, then you shall break its neck. And all the firstborn of man among your sons you shall redeem. So it shall be, when your son asks you in time to come, saying, ‘What is this?’ that you shall say to him, ‘By strength of hand the Lord brought us out of Egypt, out of the house of bondage. And it came to pass, when Pharaoh was stubborn about letting us go, that the Lord killed all the firstborn in the land of Egypt, both the firstborn of man and the firstborn of beast. Therefore I sacrifice to the Lord all males that open the womb, but all the firstborn of my sons I redeem.’ It shall be as a sign on your hand and as frontlets between your eyes, for by strength of hand the Lord brought us out of Egypt."'
      },
      {
        verse: 'Galatians 6:9-10',
        text: 'And let us not grow weary while doing good, for in due season we shall reap if we do not lose heart. Therefore, as we have opportunity, let us do good to all, especially to those who are of the household of faith.'
      },
      {
        verse: 'Ephesians 1:7',
        text: 'In Him we have redemption through His blood, the forgiveness of sins, according to the riches of His grace.'
      },
      {
        verse: 'Romans 8:1-2',
        text: 'There is therefore now no condemnation to those who are in Christ Jesus, who do not walk according to the flesh, but according to the Spirit. For the law of the Spirit of life in Christ Jesus has made me free from the law of sin and death.'
      },
      {
        verse: 'Romans 6:23',
        text: 'For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord.'
      },
      {
        verse: 'Colossians 1:13-14',
        text: 'He has delivered us from the power of darkness and conveyed us into the kingdom of the Son of His love, in whom we have redemption through His blood, the forgiveness of sins.'
      },
      {
        verse: '1 Peter 1:17-21',
        text: 'And if you call on the Father, who without partiality judges according to each one’s work, conduct yourselves throughout the time of your stay here in fear; knowing that you were not redeemed with corruptible things, like silver or gold, from your aimless conduct received by tradition from your fathers, but with the precious blood of Christ, as of a lamb without blemish and without spot. He indeed was foreordained before the foundation of the world, but was manifest in these last times for you who through Him believe in God, who raised Him from the dead and gave Him glory, so that your faith and hope are in God.'
      },
      {
        verse: 'John 10:10',
        text: 'The thief does not come except to steal, and to kill, and to destroy. I have come that they may have life, and that they may have it more abundantly.'
      }
    ],
    keyPoints: [
      'The first born must be sacrificed or redeemed',
      'Our redemption price was paid to God through Jesus\' blood',
      'Redemption sets us free from the consequences of sin',
      'Redemption frees us from the power of sin',
      'Redemption sets us free from an empty life',
      'You have access to a pillar of fire or cloud (the Holy Spirit)'
    ],
    keyTakeaways: [
      'The first born must be sacrificed or redeemed',
      'Our redemption price was paid to God through Jesus\' blood',
      'Redemption sets us free from the consequences of sin',
      'Redemption frees us from the power of sin',
      'Redemption sets us free from an empty life',
      'You have access to a pillar of fire or cloud (the Holy Spirit)',
    ],
    sections: [
      {
        id: 'redemption-consecration-of-the-firstborn',
        title: 'REDEMPTION: CONSECRATION OF THE FIRSTBORN',
        paragraphs: [
          'EXODUS 13 - Consecration of the Firstborn',
          'The Lord said to Moses, "Consecrate to me every firstborn male. The first offspring of every womb among the Israelites belongs to me, whether human or animal."',
          '"After the Lord brings you into the land of the Canaanites and gives it to you, as he promised on oath to you and your ancestors, you are to give over to the Lord the first offspring of every womb. All the firstborn males of your livestock belong to the Lord. Redeem with a lamb every firstborn donkey, but if you do not redeem it, break its neck. Redeem every firstborn among your sons."',
          '"In days to come, when your son asks you, \'What does this mean?\' say to him, \'With a mighty hand the Lord brought us out of Egypt, out of the land of slavery. When Pharaoh stubbornly refused to let us go, the Lord killed the firstborn of both people and animals in Egypt. This is why I sacrifice to the Lord the first male offspring of every womb and redeem each of my firstborn sons.\' And it will be like a sign on your hand and a symbol on your forehead that the Lord brought us out of Egypt with his mighty hand."',
        ],
      },
      {
        id: 'understanding-consecration',
        title: 'UNDERSTANDING CONSECRATION',
        paragraphs: [
          'Consecrate - emphatic in the Hebrew language: "It belongs to me (emphatic). It is my property. It is mine. The first born is mine."',
          'In verse 12: "You are to give over to the Lord the first offspring of every womb. All the firstborn males of your livestock belong to the Lord." Again, this shall be the property of the Lord - it belongs to Him.',
          'But every firstborn of a donkey you shall redeem with a lamb, and if you will not redeem it, you shall break its neck. In other words, you\'re going to lose it anyway if you don\'t dedicate it to God.',
        ],
      },
      {
        id: 'very-important-principle',
        title: 'VERY IMPORTANT PRINCIPLE',
        paragraphs: [
          '**1. The first born must be sacrificed or redeemed**',
          'How do you know what you should sacrifice or redeem? God gives two classifications of animals:',
          '- Clean animals (e.g., lambs)',
          '- Unclean animals (e.g., donkeys)',
          'If the firstborn is a clean animal, it has to be sacrificed. If it\'s an unclean animal, it has to be redeemed or purchased back from God because God owns it.',
          'Redeemed means to buy back - not just to buy, but to buy back. It has to be redeemed with the sacrifice of a clean animal.',
        ],
      },
      {
        id: 'application-for-today',
        title: 'APPLICATION FOR TODAY',
        paragraphs: [
          'This was written about 4,000 years ago, so what does this have to do with us today?',
          'You and I were born spiritually speaking, in our spiritual state before God, we were born unclean. You don\'t have to teach your children to be bad - it comes naturally (lying, stealing, selfishness). You don\'t have to teach them to be bad; it comes naturally. You have to teach them to be good.',
          '"So let\'s not get tired of doing what is good. At just the right time we will reap a harvest of blessing if we don\'t give up. Therefore, whenever we have the opportunity, we should do good to everyone—especially to those in the family of faith." (Galatians 6:9-10)',
          'So we were all born unclean. Was Jesus born unclean or clean? Jesus had to be sacrificed so that the unclean could be redeemed.',
          'Through the blood of Jesus, we also have redemption (Ephesians 1:7). The word redemption means "freedom that is bought through the payment of a ransom." Jesus redeemed us by paying His blood; He freed us from sin.',
        ],
      },
      {
        id: 'four-truths-about-our-redemption',
        title: 'FOUR TRUTHS ABOUT OUR REDEMPTION',
        paragraphs: [
          '**1. Our redemption price was paid to God**',
          'Some have taught that Jesus paid the ransom to Satan, but we have never been indebted to Satan. Our debt is to the holiness and justice of God. Whereas God\'s holiness demanded a payment for sin, His love and grace paid the debt for us through the blood of Jesus.',
          '**2. Redemption sets us free from the consequences of sin**',
          'Paul wrote, "There is now no condemnation for those who are in Christ Jesus" (Romans 8:1).',
          'The Holy Spirit brings freedom from sin. The Greek word used for "No" is a special negative, stronger than the ordinary no - very emphatic, double emphasis. Condemnation is already out of question.',
          '"Has set you free" - not "will set you free." The Greek verb (Eliotherosem) indicates it already happened in the past - you have been set free.',
          'Why did God set us free?',
          '- V4: Live according to the Spirit',
          '- V6: Mind controlled by the Spirit',
          'Condemnation means "judgment or penalty." We could paraphrase this: "Now there is no punishment for sin for those who are in Christ Jesus."',
          'Paul restated this truth: "For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord." (Romans 6:23)',
          '**3. Redemption frees us from the power of sin**',
          'Suppose a cocaine addict is arrested for drug possession and then is freed on a technicality. While he momentarily escapes the consequences of his sin, he is not freed from the power of the addiction that controls him. Within weeks, he is arrested again for the same crime.',
          'In contrast, our redemption is complete. God frees us not only from the punishment for sin but also from sin\'s controlling power in our lives.',
          '"For he has rescued us from the dominion of darkness and brought us into the kingdom of the Son he loves, in whom we have redemption, the forgiveness of sins." (Colossians 1:13-14)',
          'When we were controlled by our sinful nature, we could not please God. Now, however, we are controlled by the Spirit if the Spirit lives in us (Romans 8:8-9).',
          '**4. Redemption sets us free from an empty life**',
          'God redeemed us "from the empty way of life handed down" from our forefathers (1 Peter 1:18).',
          'Jesus himself said, "I have come that they may have life, and have it to the full" (John 10:10).',
          'Through redemption, we find true meaning and purpose for our lives.',
        ],
      },
      {
        id: 'explore-1-peter-1-17-21',
        kicker: 'Explore',
        title: '1 PETER 1:17-21',
        paragraphs: [
          '"And remember that the heavenly Father to whom you pray has no favorites. He will judge or reward you according to what you do. So you must live in reverent fear of him during your time here as \'temporary residents.\' For you know that God paid a ransom to save you from the empty life you inherited from your ancestors. And it was not paid with mere gold or silver, which lose their value. It was the precious blood of Christ, the sinless, spotless Lamb of God. God chose him as your ransom long before the world began, but now in these last days he has been revealed for your sake. Through Christ you have come to trust in God. And you have placed your faith and hope in God because he raised Christ from the dead and gave him great glory."',
        ],
      },
      {
        id: 'crossing-the-sea',
        title: 'CROSSING THE SEA',
        paragraphs: [
          '(Exodus 13:17-22)',
          'When Pharaoh let the people go, God did not lead them on the road through the Philistine country, though that was shorter. For God said, "If they face war, they might change their minds and return to Egypt."',
          'So God led the people around by the desert road toward the Red Sea. The Israelites went up out of Egypt ready for battle. Moses took the bones of Joseph with him because Joseph had made the Israelites swear an oath: "God will surely come to your aid, and then you must carry my bones up with you from this place."',
          'After leaving Sukkoth they camped at Etham on the edge of the desert. By day the Lord went ahead of them in a pillar of cloud to guide them on their way and by night in a pillar of fire to give them light, so that they could travel by day or night. Neither the pillar of cloud by day nor the pillar of fire by night left its place in front of the people.',
        ],
      },
      {
        id: 'go',
        title: 'GO',
        paragraphs: [
          'You have access to a pillar of fire or cloud (the Holy Spirit). What steps can you take to seek out God\'s presence this week? Where has God been trying to move or lead you in recent days, weeks, or months?',
        ],
      },
    ],
    relatedSermons: ['4', '7'],
  },
  {
    id: '3',
    slug: 'the-great-commission',
    title: 'The Great Commission',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2025-04-06',
    duration: '45 min',
    series: 'Faith Foundation',
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'All authority. Jesus promises that his followers—now his representatives on earth—would have his authority and power to proclaim and spread his message throughout the world.',
    description: `**THE GREAT COMMISSION**

**MATTHEW 28:18 - All Authority**

Jesus promises that his followers—now his representatives on earth—would have his authority and power to proclaim and spread his message throughout the world (vv. 19-20).

But first they must obey Jesus' command to wait for the Father to fulfill his promise and send the Holy Spirit to empower them (this promise was fulfilled at Pentecost). We cannot expect the power described in Acts 1:8 to accompany our efforts to take Christ's message to the nations without first following the pattern of Acts 1:4.

"But you will receive power when the Holy Spirit comes upon you. And you will be my witnesses, telling people about me everywhere—in Jerusalem, throughout Judea, in Samaria, and to the ends of the earth." (Acts 1:8)

"Do not leave Jerusalem until the Father sends you the gift he promised, as I told you before. John baptized with water, but in just a few days you will be baptized with the Holy Spirit." (Acts 1:4-5)

---

**MATTHEW 28:19 - Go... Make Disciples... Baptizing**

These words are referred to as Christ's Great Commission—his primary command, instruction and task, along with the authority to carry it out. This command applies to all his followers of every generation.

In his final instructions, Christ states the goal and responsibility of his church. They are to take his message to people of all nations and cultures.

---

**SIX KEY ASPECTS OF THE COMMISSION**

**(1) GO INTO ALL THE WORLD**
The church is to go into all the world and spread the message of Christ as revealed in his own teaching and through the teaching of his apostles. This task includes the responsibility of sending missionaries into every nation (Acts 13:1-4).

**(2) PREACH THE GOSPEL**
The preaching of the gospel is centered on:
- "Repentance and forgiveness of sins" (Luke 24:47)
- The promise of receiving "the gift of the Holy Spirit" (Acts 2:38)
- The challenge to live in a way that is uniquely different from the spiritually corrupt world (Acts 2:40)
- We must also preach with an expectancy of Jesus' return for his church (Acts 3:19-20; 1 Thess. 1:10)

**(3) MAKE DISCIPLES, NOT JUST CONVERTS**
The primary purpose of Christ's commission was to make disciples (Gk. matheteusate)—disciplined "learners" and followers of Jesus who live by his commands and are continually growing in their relationship with him.

To make disciples is the only direct command in this passage (the word "go" could be translated "as you are going").

Many people talk about the Great Commission as a call to evangelism. But Christ's words here are really a commission to the deeper aspect of discipleship—which goes beyond evangelism and on to solid teaching and continual spiritual nurturing that produces growth and progress.

Effective evangelism cannot be separated from true discipleship. Christ does not intend for his followers to simply make converts to Christianity; he wants them to train and mentor other people who will faithfully follow Christ and lead others to him as well.

If individuals who accept Christ do not grow beyond that starting point, they will almost certainly abandon their faith and likely become spiritually hardened toward God.

A church's spiritual energies and efforts must not be focused merely on enlarging church membership, but in making true disciples—life-long followers of Christ who avoid evil, follow Christ's commands and pursue his purposes with all their heart, mind and will.

**(4) SEPARATE FROM THE WORLD**
Christ commands us to concentrate on reaching spiritually lost men and women with his message of hope, but this does not mean that believers are called to Christianize society or to expect that all of the world will become Christians.

While we must strive to make a positive difference in the world, we also must understand that the world system will remain defiant toward God until he returns. Until then, God's people must separate themselves from the corrupt beliefs, behaviors and lifestyles that surround them.

Believers should devote themselves wholeheartedly to God and his purposes (Rom. 13:12; 2 Cor. 6:14). Devotion to Christ includes not hesitating to expose the evil and shame in the world so as to encourage others to avoid it (Eph. 5:11-12).

**(5) BAPTIZE BELIEVERS**
Those who believe in Christ, who accept his message by faith and actively yield their lives to him—are to be "baptized" with water. (The word translated "baptized" literally speaks of being immersed, or put completely under the water.)

This act of obedience serves as a public statement of faith in Christ—a sign that a person is identifying with Jesus in:
- His death
- His burial (going under the water; see Col. 2:12)
- His resurrection (coming up out of the water)

It represents a person's spiritual pledge to turn away from sin and immorality, to die to one's own sinful nature and, with God's help, to be raised up to live a new life (see Rom. 6:4). In this new life, the believer is completely committed to Christ and his purposes.

**(6) EMPOWERED BY THE HOLY SPIRIT**
Christ will be with his obedient followers through the presence and power of the Holy Spirit. They will be able to fulfill their task to take Christ's message wherever they go, even to all people and all nations, only after they are "clothed with power from on high" (Luke 24:49).

---

**MATTHEW 28:20 - "I Am With You"**

This promise is Christ's assurance to his followers who are actively involved in reaching and "winning" those who are spiritually lost and teaching them to obey his standards of truth.

Jesus has risen from the dead and is now alive and active in his followers' lives. God is personally interested in each one of his children and has promised to be with them in the person of the Holy Spirit (John 14:16, 26).

God is also with us through his Word (John 14:23).

No matter what your status or condition—rich, poor, weak, humble, famous or relatively unknown—he cares for you and watches every detail of your life with loving care. He knows and understands your difficulties and struggles, and he will give you the strength to endure anything with his help (see 2 Cor. 12:9).

In fact, God's presence can fill every believer with joy in any circumstances (Ps. 16:11; 21:6). It is both challenging and comforting to know that we cannot escape God's presence (Ps. 139:7).

Jesus' promise to be "with you" is the Christian's answer to every fear, every doubt, every trouble, every heartache and every discouragement.`,
    tags: ['Great Commission', 'Discipleship', 'Holy Spirit', 'Evangelism', 'Baptism', 'Authority'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    scriptures: [
      {
        verse: 'Matthew 28:18-20',
        text: 'And Jesus came and spoke to them, saying, "All authority has been given to Me in heaven and on earth. Go therefore and make disciples of all the nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all things that I have commanded you; and lo, I am with you always, even to the end of the age." Amen.'
      },
      {
        verse: 'Acts 1:8',
        text: 'But you shall receive power when the Holy Spirit has come upon you; and you shall be witnesses to Me in Jerusalem, and in all Judea and Samaria, and to the end of the earth.'
      },
      {
        verse: 'Acts 1:4-5',
        text: 'And being assembled together with them, He commanded them not to depart from Jerusalem, but to wait for the Promise of the Father, "which," He said, "you have heard from Me; for John truly baptized with water, but you shall be baptized with the Holy Spirit not many days from now."'
      },
      {
        verse: 'Luke 24:47-49',
        text: 'And that repentance and remission of sins should be preached in His name to all nations, beginning at Jerusalem. And you are witnesses of these things. Behold, I send the Promise of My Father upon you; but tarry in the city of Jerusalem until you are endued with power from on high.'
      },
      {
        verse: 'Acts 2:38, 40',
        text: 'Then Peter said to them, "Repent, and let every one of you be baptized in the name of Jesus Christ for the remission of sins; and you shall receive the gift of the Holy Spirit." ... And with many other words he testified and exhorted them, saying, "Be saved from this perverse generation."'
      },
      {
        verse: 'John 14:16, 23, 26',
        text: 'And I will pray the Father, and He will give you another Helper, that He may abide with you forever... Jesus answered and said to him, "If anyone loves Me, he will keep My word; and My Father will love him, and We will come to him and make Our home with him." ... "But the Helper, the Holy Spirit, whom the Father will send in My name, He will teach you all things, and bring to your remembrance all things that I said to you."'
      },
      {
        verse: 'Psalm 139:7',
        text: 'Where can I go from Your Spirit? Or where can I flee from Your presence?'
      }
    ],
    keyPoints: [
      'Jesus\' authority empowers believers to spread His message',
      'The Holy Spirit empowers us for the commission',
      'Make disciples, not just converts',
      'Discipleship goes beyond evangelism to teaching and nurturing',
      'Baptism is a public statement of faith',
      'Christ promises to be with his obedient followers',
      'Jesus\' promise to be with you is the Christian\'s answer to every fear, doubt, trouble, heartache and discouragement'
    ],
    keyTakeaways: [
      'Jesus\' authority empowers believers to spread His message',
      'The Holy Spirit empowers us for the commission',
      'Make disciples, not just converts',
      'Discipleship goes beyond evangelism to teaching and nurturing',
      'Baptism is a public statement of faith',
      'Christ promises to be with his obedient followers',
      'Jesus\' promise to be with you is the Christian\'s answer to every fear, doubt, trouble, heartache and discouragement',
    ],
    sections: [
      {
        id: 'the-great-commission',
        title: 'THE GREAT COMMISSION',
        paragraphs: [
          '**MATTHEW 28:18 - All Authority**',
          'Jesus promises that his followers—now his representatives on earth—would have his authority and power to proclaim and spread his message throughout the world (vv. 19-20).',
          'But first they must obey Jesus\' command to wait for the Father to fulfill his promise and send the Holy Spirit to empower them (this promise was fulfilled at Pentecost). We cannot expect the power described in Acts 1:8 to accompany our efforts to take Christ\'s message to the nations without first following the pattern of Acts 1:4.',
          '"But you will receive power when the Holy Spirit comes upon you. And you will be my witnesses, telling people about me everywhere—in Jerusalem, throughout Judea, in Samaria, and to the ends of the earth." (Acts 1:8)',
          '"Do not leave Jerusalem until the Father sends you the gift he promised, as I told you before. John baptized with water, but in just a few days you will be baptized with the Holy Spirit." (Acts 1:4-5)',
        ],
      },
      {
        id: 'matthew-28-19-go-make-disciples-baptizing',
        title: 'MATTHEW 28:19 - Go... Make Disciples... Baptizing',
        paragraphs: [
          'These words are referred to as Christ\'s Great Commission—his primary command, instruction and task, along with the authority to carry it out. This command applies to all his followers of every generation.',
          'In his final instructions, Christ states the goal and responsibility of his church. They are to take his message to people of all nations and cultures.',
        ],
      },
      {
        id: 'six-key-aspects-of-the-commission',
        title: 'SIX KEY ASPECTS OF THE COMMISSION',
        paragraphs: [
          '**(1) GO INTO ALL THE WORLD**',
          'The church is to go into all the world and spread the message of Christ as revealed in his own teaching and through the teaching of his apostles. This task includes the responsibility of sending missionaries into every nation (Acts 13:1-4).',
          '**(2) PREACH THE GOSPEL**',
          'The preaching of the gospel is centered on:',
          '- "Repentance and forgiveness of sins" (Luke 24:47)',
          '- The promise of receiving "the gift of the Holy Spirit" (Acts 2:38)',
          '- The challenge to live in a way that is uniquely different from the spiritually corrupt world (Acts 2:40)',
          '- We must also preach with an expectancy of Jesus\' return for his church (Acts 3:19-20; 1 Thess. 1:10)',
          '**(3) MAKE DISCIPLES, NOT JUST CONVERTS**',
          'The primary purpose of Christ\'s commission was to make disciples (Gk. matheteusate)—disciplined "learners" and followers of Jesus who live by his commands and are continually growing in their relationship with him.',
          'To make disciples is the only direct command in this passage (the word "go" could be translated "as you are going").',
          'Many people talk about the Great Commission as a call to evangelism. But Christ\'s words here are really a commission to the deeper aspect of discipleship—which goes beyond evangelism and on to solid teaching and continual spiritual nurturing that produces growth and progress.',
          'Effective evangelism cannot be separated from true discipleship. Christ does not intend for his followers to simply make converts to Christianity; he wants them to train and mentor other people who will faithfully follow Christ and lead others to him as well.',
          'If individuals who accept Christ do not grow beyond that starting point, they will almost certainly abandon their faith and likely become spiritually hardened toward God.',
          'A church\'s spiritual energies and efforts must not be focused merely on enlarging church membership, but in making true disciples—life-long followers of Christ who avoid evil, follow Christ\'s commands and pursue his purposes with all their heart, mind and will.',
          '**(4) SEPARATE FROM THE WORLD**',
          'Christ commands us to concentrate on reaching spiritually lost men and women with his message of hope, but this does not mean that believers are called to Christianize society or to expect that all of the world will become Christians.',
          'While we must strive to make a positive difference in the world, we also must understand that the world system will remain defiant toward God until he returns. Until then, God\'s people must separate themselves from the corrupt beliefs, behaviors and lifestyles that surround them.',
          'Believers should devote themselves wholeheartedly to God and his purposes (Rom. 13:12; 2 Cor. 6:14). Devotion to Christ includes not hesitating to expose the evil and shame in the world so as to encourage others to avoid it (Eph. 5:11-12).',
          '**(5) BAPTIZE BELIEVERS**',
          'Those who believe in Christ, who accept his message by faith and actively yield their lives to him—are to be "baptized" with water. (The word translated "baptized" literally speaks of being immersed, or put completely under the water.)',
          'This act of obedience serves as a public statement of faith in Christ—a sign that a person is identifying with Jesus in:',
          '- His death',
          '- His burial (going under the water; see Col. 2:12)',
          '- His resurrection (coming up out of the water)',
          'It represents a person\'s spiritual pledge to turn away from sin and immorality, to die to one\'s own sinful nature and, with God\'s help, to be raised up to live a new life (see Rom. 6:4). In this new life, the believer is completely committed to Christ and his purposes.',
          '**(6) EMPOWERED BY THE HOLY SPIRIT**',
          'Christ will be with his obedient followers through the presence and power of the Holy Spirit. They will be able to fulfill their task to take Christ\'s message wherever they go, even to all people and all nations, only after they are "clothed with power from on high" (Luke 24:49).',
        ],
      },
      {
        id: 'matthew-28-20-i-am-with-you',
        title: 'MATTHEW 28:20 - "I Am With You"',
        paragraphs: [
          'This promise is Christ\'s assurance to his followers who are actively involved in reaching and "winning" those who are spiritually lost and teaching them to obey his standards of truth.',
          'Jesus has risen from the dead and is now alive and active in his followers\' lives. God is personally interested in each one of his children and has promised to be with them in the person of the Holy Spirit (John 14:16, 26).',
          'God is also with us through his Word (John 14:23).',
          'No matter what your status or condition—rich, poor, weak, humble, famous or relatively unknown—he cares for you and watches every detail of your life with loving care. He knows and understands your difficulties and struggles, and he will give you the strength to endure anything with his help (see 2 Cor. 12:9).',
          'In fact, God\'s presence can fill every believer with joy in any circumstances (Ps. 16:11; 21:6). It is both challenging and comforting to know that we cannot escape God\'s presence (Ps. 139:7).',
          'Jesus\' promise to be "with you" is the Christian\'s answer to every fear, every doubt, every trouble, every heartache and every discouragement.',
        ],
      },
    ],
    relatedSermons: ['7', '8'],
  },
  {
    id: '4',
    slug: 'elisha-and-the-widows-oil',
    title: 'Sunday Service',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2025-04-13',
    duration: '45 min',
    series: 'Faith Foundation',
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'Elisha and the Widow\'s Oil - A certain woman of the wives of the sons of the prophets cried out to Elisha, saying, "Your servant my husband is dead, and you know that your servant feared the Lord."',
    description: `**ELISHA AND THE WIDOW'S OIL** (2 Kings 4:1-7, NKJV)

A certain woman of the wives of the sons of the prophets cried out to Elisha, saying, "Your servant my husband is dead, and you know that your servant feared the Lord. And the creditor is coming to take my two sons to be his slaves."

So Elisha said to her, "What shall I do for you? Tell me, what do you have in the house?"

And she said, "Your maidservant has nothing in the house but a jar of oil."

Then he said, "Go, borrow vessels from everywhere, from all your neighbors—empty vessels; do not gather just a few. And when you have come in, you shall shut the door behind you and your sons; then pour it into all those vessels, and set aside the full ones."

So she went from him and shut the door behind her and her sons, who brought the vessels to her; and she poured it out.

Now it came to pass, when the vessels were full, that she said to her son, "Bring me another vessel."

And he said to her, "There is not another vessel." So the oil ceased.

Then she came and told the man of God. And he said, "Go, sell the oil and pay your debt; and you and your sons live on the rest."

---

**ANANIAS BAPTIZES SAUL** (Acts 9:10-19, NLT)

Now there was a believer in Damascus named Ananias. The Lord spoke to him in a vision, calling, "Ananias!"

"Yes, Lord!" he replied.

The Lord said, "Go over to Straight Street, to the house of Judas. When you get there, ask for a man from Tarsus named Saul. He is praying to me right now. I have shown him a vision of a man named Ananias coming in and laying hands on him so he can see again."

"But Lord," exclaimed Ananias, "I've heard many people talk about the terrible things this man has done to the believers in Jerusalem! And he is authorized by the leading priests to arrest everyone who calls upon your name."

But the Lord said, "Go, for Saul is my chosen instrument to take my message to the Gentiles and to kings, as well as to the people of Israel. And I will show him how much he must suffer for my name's sake."

So Ananias went and found Saul. He laid his hands on him and said, "Brother Saul, the Lord Jesus, who appeared to you on the road, has sent me so that you might regain your sight and be filled with the Holy Spirit."

Instantly something like scales fell from Saul's eyes, and he regained his sight. Then he got up and was baptized. Afterward he ate some food and regained his strength.

---

**ANANIAS BAPTIZES SAUL** (Acts 9:10-19, NKJV)

Now there was a certain disciple at Damascus named Ananias; and to him the Lord said in a vision, "Ananias."

And he said, "Here I am, Lord."

So the Lord said to him, "Arise and go to the street called Straight, and inquire at the house of Judas for one called Saul of Tarsus, for behold, he is praying. And in a vision he has seen a man named Ananias coming in and putting his hand on him, so that he might receive his sight."

Then Ananias answered, "Lord, I have heard from many about this man, how much harm he has done to Your saints in Jerusalem. And here he has authority from the chief priests to bind all who call on Your name."

But the Lord said to him, "Go, for he is a chosen vessel of Mine to bear My name before Gentiles, kings, and the children of Israel. For I will show him how many things he must suffer for My name's sake."

And Ananias went his way and entered the house; and laying his hands on him he said, "Brother Saul, the Lord Jesus, who appeared to you on the road as you came, has sent me that you may receive your sight and be filled with the Holy Spirit."

Immediately there fell from his eyes something like scales, and he received his sight at once; and he arose and was baptized.

So when he had received food, he was strengthened. Then Saul spent some days with the disciples at Damascus.`,
    tags: ['Faith', 'Obedience', 'Provision', 'Miracles', 'Holy Spirit'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    scriptures: [
      {
        verse: '2 Kings 4:1-7',
        text: 'A certain woman of the wives of the sons of the prophets cried out to Elisha, saying, "Your servant my husband is dead, and you know that your servant feared the Lord. And the creditor is coming to take my two sons to be his slaves." So Elisha said to her, "What shall I do for you? Tell me, what do you have in the house?" And she said, "Your maidservant has nothing in the house but a jar of oil." Then he said, "Go, borrow vessels from everywhere, from all your neighbors—empty vessels; do not gather just a few. And when you have come in, you shall shut the door behind you and your sons; then pour it into all those vessels, and set aside the full ones." So she went from him and shut the door behind her and her sons, who brought the vessels to her; and she poured it out. Now it came to pass, when the vessels were full, that she said to her son, "Bring me another vessel." And he said to her, "There is not another vessel." So the oil ceased. Then she came and told the man of God. And he said, "Go, sell the oil and pay your debt; and you and your sons live on the rest."'
      },
      {
        verse: 'Acts 9:10-19',
        text: 'Now there was a certain disciple at Damascus named Ananias; and to him the Lord said in a vision, "Ananias." And he said, "Here I am, Lord." ... And Ananias went his way and entered the house; and laying his hands on him he said, "Brother Saul, the Lord Jesus, who appeared to you on the road as you came, has sent me that you may receive your sight and be filled with the Holy Spirit." Immediately there fell from his eyes something like scales, and he received his sight at once; and he arose and was baptized.'
      }
    ],
    keyPoints: [
      'God provides through faith and obedience',
      'Obey God\'s specific instructions',
      'God uses ordinary people for extraordinary purposes',
      'Trust God even when the task seems impossible',
      'Go, for he is a chosen vessel of Mine'
    ],
    keyTakeaways: [
      'God provides through faith and obedience',
      'Obey God\'s specific instructions',
      'God uses ordinary people for extraordinary purposes',
      'Trust God even when the task seems impossible',
      'Go, for he is a chosen vessel of Mine',
    ],
    sections: [
      {
        id: 'elisha-and-the-widows-oil',
        title: 'ELISHA AND THE WIDOW\'S OIL',
        paragraphs: [
          '(2 Kings 4:1-7, NKJV)',
          'A certain woman of the wives of the sons of the prophets cried out to Elisha, saying, "Your servant my husband is dead, and you know that your servant feared the Lord. And the creditor is coming to take my two sons to be his slaves."',
          'So Elisha said to her, "What shall I do for you? Tell me, what do you have in the house?"',
          'And she said, "Your maidservant has nothing in the house but a jar of oil."',
          'Then he said, "Go, borrow vessels from everywhere, from all your neighbors—empty vessels; do not gather just a few. And when you have come in, you shall shut the door behind you and your sons; then pour it into all those vessels, and set aside the full ones."',
          'So she went from him and shut the door behind her and her sons, who brought the vessels to her; and she poured it out.',
          'Now it came to pass, when the vessels were full, that she said to her son, "Bring me another vessel."',
          'And he said to her, "There is not another vessel." So the oil ceased.',
          'Then she came and told the man of God. And he said, "Go, sell the oil and pay your debt; and you and your sons live on the rest."',
        ],
      },
      {
        id: 'ananias-baptizes-saul-nlt',
        title: 'ANANIAS BAPTIZES SAUL (Acts 9:10-19, NLT)',
        paragraphs: [
          'Now there was a believer in Damascus named Ananias. The Lord spoke to him in a vision, calling, "Ananias!"',
          '"Yes, Lord!" he replied.',
          'The Lord said, "Go over to Straight Street, to the house of Judas. When you get there, ask for a man from Tarsus named Saul. He is praying to me right now. I have shown him a vision of a man named Ananias coming in and laying hands on him so he can see again."',
          '"But Lord," exclaimed Ananias, "I\'ve heard many people talk about the terrible things this man has done to the believers in Jerusalem! And he is authorized by the leading priests to arrest everyone who calls upon your name."',
          'But the Lord said, "Go, for Saul is my chosen instrument to take my message to the Gentiles and to kings, as well as to the people of Israel. And I will show him how much he must suffer for my name\'s sake."',
          'So Ananias went and found Saul. He laid his hands on him and said, "Brother Saul, the Lord Jesus, who appeared to you on the road, has sent me so that you might regain your sight and be filled with the Holy Spirit."',
          'Instantly something like scales fell from Saul\'s eyes, and he regained his sight. Then he got up and was baptized. Afterward he ate some food and regained his strength.',
        ],
      },
      {
        id: 'ananias-baptizes-saul-nkjv',
        title: 'ANANIAS BAPTIZES SAUL (Acts 9:10-19, NKJV)',
        paragraphs: [
          'Now there was a certain disciple at Damascus named Ananias; and to him the Lord said in a vision, "Ananias."',
          'And he said, "Here I am, Lord."',
          'So the Lord said to him, "Arise and go to the street called Straight, and inquire at the house of Judas for one called Saul of Tarsus, for behold, he is praying. And in a vision he has seen a man named Ananias coming in and putting his hand on him, so that he might receive his sight."',
          'Then Ananias answered, "Lord, I have heard from many about this man, how much harm he has done to Your saints in Jerusalem. And here he has authority from the chief priests to bind all who call on Your name."',
          'But the Lord said to him, "Go, for he is a chosen vessel of Mine to bear My name before Gentiles, kings, and the children of Israel. For I will show him how many things he must suffer for My name\'s sake."',
          'And Ananias went his way and entered the house; and laying his hands on him he said, "Brother Saul, the Lord Jesus, who appeared to you on the road as you came, has sent me that you may receive your sight and be filled with the Holy Spirit."',
          'Immediately there fell from his eyes something like scales, and he received his sight at once; and he arose and was baptized.',
          'So when he had received food, he was strengthened. Then Saul spent some days with the disciples at Damascus.',
        ],
      },
    ],
    relatedSermons: ['2', '7'],
  },
  {
    id: '5',
    slug: 'the-renewed-heart',
    title: 'The Renewed Heart',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2025-05-18',
    duration: '45 min',
    series: 'Faith Foundation',
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'God\'s answer to the sinfulness of the human heart is regeneration, which happens in individuals who truly repent, turn to God by faith and accept Jesus as the Forgiver of their sins and Leader of their lives.',
    description: `**THE RENEWED HEART**

God's answer to the sinfulness of the human heart is regeneration, which happens in individuals who truly repent, turn to God by faith and accept Jesus as the Forgiver of their sins and Leader of their lives.

Regeneration refers to a heart that has been spiritually reborn, renewed, revitalized, reformed and redeveloped (all being necessary processes of the newness) to where it is right with God.

---

**UNDERSTANDING REGENERATION**

**1. BORN AGAIN** (John 3:3)
Regeneration refers to the heart being "born again." Those who repent from their heart of all sin and confess in their heart that Jesus is Lord (Rom. 10:9) are "born again" spiritually and receive a new spiritual heart from God (cf. Ps. 51:10; Ezek. 11:19).

**2. A NEW DESIRE TO LOVE AND OBEY**
For those who experience this spiritual birth, God creates within them a desire to love him and to obey him.

Repeatedly God makes it clear to his people the necessity of expressing a love that comes from the heart (see Deut. 4:29; 6:6). This type of true love for God and devotion to him cannot be separated from obedience to his Word (cf. Ps. 119:34, 69, 112).

True love for God and faithful obedience to God are like two sides of the same coin (John 14:15, 23; 1 John 2:5; 5:3).

Jesus said the way to fulfill all the law of God is to love God wholeheartedly and love others unselfishly (Matt. 22:37-40).

**3. LOVE FROM THE HEART IS NECESSARY**
Love from the heart is the necessary part of obedience to God. But it is often the part that is lacking.

Too often God's people try to substitute a practice of religious rituals and regulations (such as sacred feast days, offerings and sacrifices) for a genuine love from the heart (see Isa. 1:10-17; Amos 5:21-26; Mic. 6:6-8).

Outward activity without an inner desire to serve God is not true love and devotion. In fact, it is being boastful and false, and it is greatly condemned by Jesus (see Matt. 23:13-28; Luke 21:1-4).

**4. SPIRITUAL ACTIVITIES OF THE TRANSFORMED HEART**
Many other spiritual activities take place in the hearts of those who are spiritually transformed:

- Praise God with all their heart (Ps. 9:1)
- Meditate on God's Word in their heart (Ps. 19:14)
- Cry out to God from the heart (Ps. 84:2)
- Seek God with all their heart (Ps. 119:2, 10)
- Hide God's Word in their heart (Ps. 119:11)
- Trust in the Lord with all their heart (Prov. 3:5)
- Forgive others from their heart (Matt. 18:35)
- Experience God's love poured into their heart (Rom. 5:5)
- Give to God from their heart (2 Cor. 9:7)
- Sing to God in their heart (Eph. 5:19; Col. 3:16)
- Love other Christians from their heart (1 Pet. 1:22)

Above all, they live from a heart that has been transformed by God.`,
    tags: ['Regeneration', 'Heart', 'Born Again', 'Love', 'Obedience', 'Transformation'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    scriptures: [
      {
        verse: 'John 3:3',
        text: 'Jesus answered and said to him, "Most assuredly, I say to you, unless one is born again, he cannot see the kingdom of God."'
      },
      {
        verse: 'Romans 10:9',
        text: 'That if you confess with your mouth the Lord Jesus and believe in your heart that God has raised Him from the dead, you will be saved.'
      },
      {
        verse: 'Psalm 51:10',
        text: 'Create in me a clean heart, O God, And renew a steadfast spirit within me.'
      },
      {
        verse: 'Ezekiel 11:19',
        text: 'Then I will give them one heart, and I will put a new spirit within them, and take the stony heart out of their flesh, and give them a heart of flesh.'
      },
      {
        verse: 'John 14:15, 23',
        text: '"If you love Me, keep My commandments." ... Jesus answered and said to him, "If anyone loves Me, he will keep My word; and My Father will love him, and We will come to him and make Our home with him."'
      },
      {
        verse: '1 John 2:5; 5:3',
        text: 'But whoever keeps His word, truly the love of God is perfected in him. By this we know that we are in Him. ... For this is the love of God, that we keep His commandments. And His commandments are not burdensome.'
      },
      {
        verse: 'Matthew 22:37-40',
        text: 'Jesus said to him, "‘You shall love the Lord your God with all your heart, with all your soul, and with all your mind.’ This is the first and great commandment. And the second is like it: ‘You shall love your neighbor as yourself.’ On these two commandments hang all the Law and the Prophets."'
      },
      {
        verse: 'Proverbs 3:5',
        text: 'Trust in the Lord with all your heart, And lean not on your own understanding.'
      },
      {
        verse: 'Romans 5:5',
        text: 'Now hope does not disappoint, because the love of God has been poured out in our hearts by the Holy Spirit who was given to us.'
      },
      {
        verse: '1 Peter 1:22',
        text: 'Since you have purified your souls in obeying the truth through the Spirit in sincere love of the brethren, love one another fervently with a pure heart.'
      }
    ],
    keyPoints: [
      'Regeneration is being born again spiritually',
      'God creates desire to love and obey Him',
      'Love from the heart is necessary for obedience',
      'True love cannot be separated from obedience',
      'Spiritual activities flow from a transformed heart',
      'Outward activity without inner desire is not true love and devotion'
    ],
    keyTakeaways: [
      'Regeneration is being born again spiritually',
      'God creates desire to love and obey Him',
      'Love from the heart is necessary for obedience',
      'True love cannot be separated from obedience',
      'Spiritual activities flow from a transformed heart',
      'Outward activity without inner desire is not true love and devotion',
    ],
    sections: [
      {
        id: 'the-renewed-heart',
        title: 'THE RENEWED HEART',
        paragraphs: [
          'God\'s answer to the sinfulness of the human heart is regeneration, which happens in individuals who truly repent, turn to God by faith and accept Jesus as the Forgiver of their sins and Leader of their lives.',
          'Regeneration refers to a heart that has been spiritually reborn, renewed, revitalized, reformed and redeveloped (all being necessary processes of the newness) to where it is right with God.',
        ],
      },
      {
        id: 'understanding-regeneration',
        title: 'UNDERSTANDING REGENERATION',
        paragraphs: [
          '**1. BORN AGAIN** (John 3:3)',
          'Regeneration refers to the heart being "born again." Those who repent from their heart of all sin and confess in their heart that Jesus is Lord (Rom. 10:9) are "born again" spiritually and receive a new spiritual heart from God (cf. Ps. 51:10; Ezek. 11:19).',
          '**2. A NEW DESIRE TO LOVE AND OBEY**',
          'For those who experience this spiritual birth, God creates within them a desire to love him and to obey him.',
          'Repeatedly God makes it clear to his people the necessity of expressing a love that comes from the heart (see Deut. 4:29; 6:6). This type of true love for God and devotion to him cannot be separated from obedience to his Word (cf. Ps. 119:34, 69, 112).',
          'True love for God and faithful obedience to God are like two sides of the same coin (John 14:15, 23; 1 John 2:5; 5:3).',
          'Jesus said the way to fulfill all the law of God is to love God wholeheartedly and love others unselfishly (Matt. 22:37-40).',
          '**3. LOVE FROM THE HEART IS NECESSARY**',
          'Love from the heart is the necessary part of obedience to God. But it is often the part that is lacking.',
          'Too often God\'s people try to substitute a practice of religious rituals and regulations (such as sacred feast days, offerings and sacrifices) for a genuine love from the heart (see Isa. 1:10-17; Amos 5:21-26; Mic. 6:6-8).',
          'Outward activity without an inner desire to serve God is not true love and devotion. In fact, it is being boastful and false, and it is greatly condemned by Jesus (see Matt. 23:13-28; Luke 21:1-4).',
          '**4. SPIRITUAL ACTIVITIES OF THE TRANSFORMED HEART**',
          'Many other spiritual activities take place in the hearts of those who are spiritually transformed:',
          '- Praise God with all their heart (Ps. 9:1)',
          '- Meditate on God\'s Word in their heart (Ps. 19:14)',
          '- Cry out to God from the heart (Ps. 84:2)',
          '- Seek God with all their heart (Ps. 119:2, 10)',
          '- Hide God\'s Word in their heart (Ps. 119:11)',
          '- Trust in the Lord with all their heart (Prov. 3:5)',
          '- Forgive others from their heart (Matt. 18:35)',
          '- Experience God\'s love poured into their heart (Rom. 5:5)',
          '- Give to God from their heart (2 Cor. 9:7)',
          '- Sing to God in their heart (Eph. 5:19; Col. 3:16)',
          '- Love other Christians from their heart (1 Pet. 1:22)',
          'Above all, they live from a heart that has been transformed by God.',
        ],
      },
    ],
    relatedSermons: ['2', '6'],
  },
  {
    id: '6',
    slug: 'exposed',
    title: 'Exposed',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2025-05-25',
    duration: '45 min',
    series: 'Faith Foundation',
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'Before restoration and healing, comes revelation and exposing of sins and crimes of God\'s people. Whenever I would restore the fortunes of my people, the sins of Ephraim are exposed.',
    description: `**EXPOSED!**

HOSEA 6:11-7:1

Before restoration and healing, comes revelation and exposing of sins and crimes of God's people.

"Also for you, Judah, a harvest is appointed. Whenever I would restore the fortunes of my people, whenever I would heal Israel, the sins of Ephraim are exposed and the crimes of Samaria revealed. They practice deceit, thieves break into houses, bandits rob in the streets."

---

**THE PARALYSIS OF SIN** (Hosea 6:11b-7:16)

Hosea moves on to a devastating indictment of Israel, giving details of the wrongs and injustices perpetrated by the nation's leaders. It makes sad reading.

**DECEIT AND INTRIGUES** (6:11b-7:7)

The Lord longs to help Israel, but he recognizes that the nation has become incapable of repentance and change: "Whenever I would restore the fortunes of my people… the sins of Ephraim are exposed" (6:11-7:1a).

Nothing can be done for a nation that will not admit its sin.

The people in general are engaged in deceit, theft and banditry (7:1b). They think that they can get away with it, but they are mistaken, for the Lord remembers all their evil deeds and will judge them (7:2).

God's memory is not a vague recollection of past events; it is vivid and a spur to action, for their sins are always before me.

The people, however, are simply following the example their leaders set at the royal court, which is a hotbed of wickedness, lies and adultery (7:3-4a). The emphasis is not simply on what these leaders are doing, but on the intrigues, scheming, plotting and planning that takes place night and day (7:4b-6).

Leaders like this are not passionate about justice but about injustice. Their unbridled and wicked ambition is captured in the image of a burning oven (7:6).

---

**1 SAMUEL 13:13 - NOT KEPT THE COMMAND OF THE LORD**

God had told Saul exactly what to do: wait in Gilgal for the arrival of Samuel, who would offer sacrifices and give further instructions (10:8).

God tested Saul's obedience by delaying Samuel beyond the seven days. Acting out of a feeling of hopelessness, misguided assumption and with a degree of arrogance, Saul overstepped his God-given role and offered a sacrifice contrary to God's word.

Because Saul failed to follow God's instructions, Samuel told him that God would take the kingdom away from him (vv. 13-14). Though Saul remained king for the rest of his life, his son, Jonathan, would not follow him to the throne.

---

**1 SAMUEL 13:14 - A MAN AFTER HIS OWN HEART**

David is this man. He was one who was always seeking a deep relationship with God and a knowledge of his purposes in the following ways:

**(a)** He had great boldness because he had great faith in God from his youth (17:34-37).

**(b)** He was a man of deep spiritual hunger and passion for God. From a life of prayer and a deep relationship with God came his many psalms.

**(c)** In contrast to Saul, he desired to please God rather than to appear great in the eyes of the people.

**(d)** He had an unshakable confidence in God's faithfulness and purpose for his life.

**(e)** He was humble though he had great success (18:12-18).

**(f)** He stubbornly searched for and relied on God's presence and counsel (23:2, 4; 30:8; 2 Sam. 2:1; 5:19, 23).

**(g)** He worshiped God with his whole heart and life and directed all of Israel to do the same (1 Chr. 15-16).

**(h)** He was a man of character, courage (16:18) and loyalty and inspired these traits in others (20:2; 2 Sam. 9; 1 Chr. 11).

**(i)** He humbly recognized that God was the real King of Israel and that he was only God's representative (2 Sam. 5:12).

**(j)** In his public conduct, he sought to obey the Lord and carry out his plans (cf. Acts 13:22).

David's heart should be an example for all of Christ's followers today.

---

**DAVID WAS NOT PERFECT**

This does not mean that David was perfect and flawless. Later in his life, David caused God grief on several occasions:

- He defied God's commands by committing the sins of adultery and murder (2 Sam. 11)
- He took a census of Israel without God's authorization (1 Chr. 21:1-17)

In these ways, he certainly was not behaving like a man after God's own heart, and he suffered some horrible experiences as a result (cf. 2 Sam. 12:10-15).

Yet even during this time in his life, David continued to show the true presence of a humble and teachable spirit. This allowed him to accept God's judgment and receive correction (2 Sam. 12:7-13; 1 Chr. 21:8-17).`,
    tags: ['Repentance', 'Sin', 'Restoration', 'David', 'Humility', 'Judgment'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    scriptures: [
      {
        verse: 'Hosea 6:11-7:1',
        text: 'Also, O Judah, a harvest is appointed for you, When I return the captives of My people. When I would have healed Israel, Then the iniquity of Ephraim was uncovered, And the wickedness of Samaria. For they have committed fraud; A thief comes in; A band of robbers takes spoil outside.'
      },
      {
        verse: '1 Samuel 13:13-14',
        text: 'And Samuel said to Saul, "You have done foolishly. You have not kept the commandment of the Lord your God, which He commanded you. For now the Lord would have established your kingdom over Israel forever. But now your kingdom shall not continue..."'
      },
      {
        verse: 'Acts 13:22',
        text: 'And when He had removed him, He raised up for them David as king, to whom also He gave testimony and said, "I have found David the son of Jesse, a man after My own heart, who will do all My will."'
      },
      {
        verse: '2 Samuel 12:7-13',
        text: 'Then Nathan said to David, "You are the man! ... Why have you despised the commandment of the Lord, to do evil in His sight? ... So David said to Nathan, "I have sinned against the Lord." And Nathan said to David, "The Lord also has put away your sin; you shall not die."'
      },
      {
        verse: '1 Chronicles 21:1-17',
        text: 'Now Satan stood up against Israel, and moved David to number Israel. ... And God was displeased with this thing; therefore He struck Israel. So David said to God, "I have sinned greatly, because I have done this thing; but now, I pray, take away the iniquity of Your servant, for I have done very foolishly." ... Then David said to God, "Was it not I who commanded the people to be numbered? I am the one who has sinned and done evil indeed; but these sheep, what have they done? Let Your hand, I pray, O Lord my God, be against me and my father’s house, but not against Your people that they should be plagued."'
      }
    ],
    keyPoints: [
      'Before restoration comes revelation of sins',
      'Nothing can be done for a nation that will not admit its sin',
      'God remembers all deeds and will judge',
      'David was a man after God\'s own heart',
      'Humble and teachable spirit allows for correction',
      'David had great boldness because he had great faith in God',
      'He desired to please God rather than to appear great in the eyes of the people'
    ],
    keyTakeaways: [
      'Before restoration comes revelation of sins',
      'Nothing can be done for a nation that will not admit its sin',
      'God remembers all deeds and will judge',
      'David was a man after God\'s own heart',
      'Humble and teachable spirit allows for correction',
      'David had great boldness because he had great faith in God',
      'He desired to please God rather than to appear great in the eyes of the people',
    ],
    sections: [
      {
        id: 'exposed',
        title: 'EXPOSED!',
        paragraphs: [
          'HOSEA 6:11-7:1',
          'Before restoration and healing, comes revelation and exposing of sins and crimes of God\'s people.',
          '"Also for you, Judah, a harvest is appointed. Whenever I would restore the fortunes of my people, whenever I would heal Israel, the sins of Ephraim are exposed and the crimes of Samaria revealed. They practice deceit, thieves break into houses, bandits rob in the streets."',
        ],
      },
      {
        id: 'the-paralysis-of-sin',
        title: 'THE PARALYSIS OF SIN (Hosea 6:11b-7:16)',
        paragraphs: [
          'Hosea moves on to a devastating indictment of Israel, giving details of the wrongs and injustices perpetrated by the nation\'s leaders. It makes sad reading.',
          '**DECEIT AND INTRIGUES** (6:11b-7:7)',
          'The Lord longs to help Israel, but he recognizes that the nation has become incapable of repentance and change: "Whenever I would restore the fortunes of my people… the sins of Ephraim are exposed" (6:11-7:1a).',
          'Nothing can be done for a nation that will not admit its sin.',
          'The people in general are engaged in deceit, theft and banditry (7:1b). They think that they can get away with it, but they are mistaken, for the Lord remembers all their evil deeds and will judge them (7:2).',
          'God\'s memory is not a vague recollection of past events; it is vivid and a spur to action, for their sins are always before me.',
          'The people, however, are simply following the example their leaders set at the royal court, which is a hotbed of wickedness, lies and adultery (7:3-4a). The emphasis is not simply on what these leaders are doing, but on the intrigues, scheming, plotting and planning that takes place night and day (7:4b-6).',
          'Leaders like this are not passionate about justice but about injustice. Their unbridled and wicked ambition is captured in the image of a burning oven (7:6).',
        ],
      },
      {
        id: '1-samuel-13-13-not-kept-the-command-of-the-lord',
        title: '1 SAMUEL 13:13 - NOT KEPT THE COMMAND OF THE LORD',
        paragraphs: [
          'God had told Saul exactly what to do: wait in Gilgal for the arrival of Samuel, who would offer sacrifices and give further instructions (10:8).',
          'God tested Saul\'s obedience by delaying Samuel beyond the seven days. Acting out of a feeling of hopelessness, misguided assumption and with a degree of arrogance, Saul overstepped his God-given role and offered a sacrifice contrary to God\'s word.',
          'Because Saul failed to follow God\'s instructions, Samuel told him that God would take the kingdom away from him (vv. 13-14). Though Saul remained king for the rest of his life, his son, Jonathan, would not follow him to the throne.',
        ],
      },
      {
        id: '1-samuel-13-14-a-man-after-his-own-heart',
        title: '1 SAMUEL 13:14 - A MAN AFTER HIS OWN HEART',
        paragraphs: [
          'David is this man. He was one who was always seeking a deep relationship with God and a knowledge of his purposes in the following ways:',
          '**(a)** He had great boldness because he had great faith in God from his youth (17:34-37).',
          '**(b)** He was a man of deep spiritual hunger and passion for God. From a life of prayer and a deep relationship with God came his many psalms.',
          '**(c)** In contrast to Saul, he desired to please God rather than to appear great in the eyes of the people.',
          '**(d)** He had an unshakable confidence in God\'s faithfulness and purpose for his life.',
          '**(e)** He was humble though he had great success (18:12-18).',
          '**(f)** He stubbornly searched for and relied on God\'s presence and counsel (23:2, 4; 30:8; 2 Sam. 2:1; 5:19, 23).',
          '**(g)** He worshiped God with his whole heart and life and directed all of Israel to do the same (1 Chr. 15-16).',
          '**(h)** He was a man of character, courage (16:18) and loyalty and inspired these traits in others (20:2; 2 Sam. 9; 1 Chr. 11).',
          '**(i)** He humbly recognized that God was the real King of Israel and that he was only God\'s representative (2 Sam. 5:12).',
          '**(j)** In his public conduct, he sought to obey the Lord and carry out his plans (cf. Acts 13:22).',
          'David\'s heart should be an example for all of Christ\'s followers today.',
        ],
      },
      {
        id: 'david-was-not-perfect',
        title: 'DAVID WAS NOT PERFECT',
        paragraphs: [
          'This does not mean that David was perfect and flawless. Later in his life, David caused God grief on several occasions:',
          '- He defied God\'s commands by committing the sins of adultery and murder (2 Sam. 11)',
          '- He took a census of Israel without God\'s authorization (1 Chr. 21:1-17)',
          'In these ways, he certainly was not behaving like a man after God\'s own heart, and he suffered some horrible experiences as a result (cf. 2 Sam. 12:10-15).',
          'Yet even during this time in his life, David continued to show the true presence of a humble and teachable spirit. This allowed him to accept God\'s judgment and receive correction (2 Sam. 12:7-13; 1 Chr. 21:8-17).',
        ],
      },
    ],
    relatedSermons: ['5', '1'],
  },
  {
    id: '7',
    slug: 'cross-the-finish-line-with-joy',
    title: 'Cross the Finish Line With Joy',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2025-07-20',
    duration: '45 min',
    series: 'Faith Foundation',
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'Joy in your spirit, peace in your soul, and refreshment along the way. The power of ministry is THE HOLY SPIRIT. Your course is your life in God and your calling in God.',
    description: `**CROSS THE FINISH LINE WITH JOY!**

Acts 20:24 (17-25) NKJV

---

**KEY PRINCIPLES**

- Joy in your spirit, peace in your soul, and refreshment along the way (v24)
- The power of ministry is THE HOLY SPIRIT (v22-23)
- Your course is your life in God and your calling in God (v24)
- God has made it His responsibility to provide for all your needs (v20:33, Matt. 6:33)
- Course First, then Ministry (v24)
- No Comparison (2 Cor. 10:12)
- Distance, Direction, and Duration (e.g., The life of Paul, the disciples and Jesus)

---

**STEPS TO STAY ON COURSE** (Proverbs 4:20-27, NKJV)

Contained within verses 20 through 27 are specific rules for successfully staying on our course. We are given the following guidelines:

- Our ears: Listen to God's Word (v20)
- Our eyes: Give attention to what God is saying (v20, 21, 25)
- Our mouth: Read God's Word (v24)
- Our entire man: Hold on to God's Word in your heart, Seek the God-kind of life (v21, 23)

---

**JUST LIKE PAUL**

We found our lives by losing it and love our lives by not counting it dear (Matt. 16:24-25; Phil. 1:21-24; 3:7-12).

Paul had learned to love God's will over everything else, and he realized that obeying his Savior yielded the greatest joy and fulfillment.

The Lord wants us to be like the apostle Paul, being so devoted in our love and service that nothing could ever keep us from obeying Him wholeheartedly.

Paul no longer desired to hold on to his life. He sought only the furtherance of God's kingdom and the honor of Christ, no matter what the earthly cost was.

"None of these things move me, neither count I my life dear unto myself."

Paul would rather die because he had done God's will than live for many more years outside of His will.

"We run to add life to your days, rather than adding days to your life."

Living for Jesus makes life more meaningful!

---

**ACTS 20:24 - I DO NOT ACCOUNT MY LIFE OF ANY VALUE**

Paul's main concern was not preserving his own life; what counted most was that he might finish the work to which God had called him.

Wherever and however it ended, even if it cost him his life, he would finish his course with joy. On his lips and in his life would be the prayer that "Christ will be honored in my body, whether by life or by death" (Phil. 1:20).

For Paul, life and service for Christ are represented as a race that must be run with absolute perseverance, endurance and faithfulness to the Lord.

---

**ACTS 13:24-25** (NKJV)

"After John had first preached, before His coming, the baptism of repentance to all the people of Israel. And as John was finishing his course, he said, 'Who do you think I am? I am not He. But behold, there comes One after me, the sandals of whose feet I am not worthy to loose.'"

---

**STRIVING FOR A CROWN** (1 Corinthians 9:24-27, NKJV)

"Do you not know that those who run in a race all run, but one receives the prize? Run in such a way that you may obtain it. And everyone who competes for the prize is temperate in all things. Now they do it to obtain a perishable crown, but we for an imperishable crown.

Therefore I run thus: not with uncertainty. Thus I fight: not as one who beats the air. But I discipline my body and bring it into subjection, lest, when I have preached to others, I myself should become disqualified."

---

**PAUL'S VALEDICTORY** (2 Timothy 4:6-8, NKJV)

"For I am already being poured out as a drink offering, and the time of my departure is at hand. I have fought the good fight, I have finished the race, I have kept the faith. Finally, there is laid up for me the crown of righteousness, which the Lord, the righteous Judge, will give to me on that Day, and not to me only but also to all who have loved His appearing."

---

**THE RACE OF FAITH** (Hebrews 12:1-3, NIV)

"Therefore, since we are surrounded by such a great cloud of witnesses, let us throw off everything that hinders and the sin that so easily entangles. And let us run with perseverance the race marked out for us, fixing our eyes on Jesus, the pioneer and perfecter of faith.

For the joy set before him he endured the cross, scorning its shame, and sat down at the right hand of the throne of God. Consider him who endured such opposition from sinners, so that you will not grow weary and lose heart."`,
    tags: ['Perseverance', 'Joy', 'Ministry', 'Holy Spirit', 'Race', 'Calling'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    scriptures: [
      {
        verse: 'Acts 20:24',
        text: 'But none of these things move me; nor do I count my life dear to myself, so that I may finish my race with joy, and the ministry which I received from the Lord Jesus, to testify to the gospel of the grace of God.'
      },
      {
        verse: 'Matthew 6:33',
        text: 'But seek first the kingdom of God and His righteousness, and all these things shall be added to you.'
      },
      {
        verse: '2 Corinthians 10:12',
        text: 'For we dare not class ourselves or compare ourselves with those who commend themselves. But they, measuring themselves by themselves, and comparing themselves among themselves, are not wise.'
      },
      {
        verse: 'Proverbs 4:20-27',
        text: 'My son, give attention to my words; Incline your ear to my sayings. ... Keep your heart with all diligence, For out of it spring the issues of life. ... Ponder the path of your feet, And let all your ways be established. Do not turn to the right or the left; Remove your foot from evil.'
      },
      {
        verse: 'Philippians 1:20-24; 3:7-12',
        text: 'According to my earnest expectation and hope that in nothing I shall be ashamed, but with all boldness, as always, so now also Christ will be magnified in my body, whether by life or by death. ... But what things were gain to me, these I have counted loss for Christ. ... Not that I have already attained, or am already perfected; but I press on, that I may lay hold of that for which Christ Jesus has also laid hold of me.'
      },
      {
        verse: '1 Corinthians 9:24-27',
        text: 'Do you not know that those who run in a race all run, but one receives the prize? Run in such a way that you may obtain it. ... But I discipline my body and bring it into subjection, lest, when I have preached to others, I myself should become disqualified.'
      },
      {
        verse: '2 Timothy 4:6-8',
        text: 'For I am already being poured out as a drink offering, and the time of my departure is at hand. I have fought the good fight, I have finished the race, I have kept the faith. Finally, there is laid up for me the crown of righteousness...'
      },
      {
        verse: 'Hebrews 12:1-3',
        text: 'Therefore we also, since we are surrounded by so great a cloud of witnesses, let us lay aside every weight, and the sin which so easily ensnares us, and let us run with endurance the race that is set before us, looking unto Jesus, the author and finisher of our faith...'
      }
    ],
    keyPoints: [
      'Joy in your spirit, peace in your soul',
      'The power of ministry is the Holy Spirit',
      'Your course is your life and calling in God',
      'God provides for all your needs',
      'Course first, then ministry',
      'No comparison with others',
      'Living for Jesus makes life meaningful',
      'We run to add life to your days, rather than adding days to your life'
    ],
    keyTakeaways: [
      'Joy in your spirit, peace in your soul',
      'The power of ministry is the Holy Spirit',
      'Your course is your life and calling in God',
      'God provides for all your needs',
      'Course first, then ministry',
      'No comparison with others',
      'Living for Jesus makes life meaningful',
      'We run to add life to your days, rather than adding days to your life',
    ],
    sections: [
      {
        id: 'cross-the-finish-line-with-joy',
        title: 'CROSS THE FINISH LINE WITH JOY!',
        paragraphs: [
          'Acts 20:24 (17-25) NKJV',
        ],
      },
      {
        id: 'key-principles',
        title: 'KEY PRINCIPLES',
        paragraphs: [
          '- Joy in your spirit, peace in your soul, and refreshment along the way (v24)',
          '- The power of ministry is THE HOLY SPIRIT (v22-23)',
          '- Your course is your life in God and your calling in God (v24)',
          '- God has made it His responsibility to provide for all your needs (v20:33, Matt. 6:33)',
          '- Course First, then Ministry (v24)',
          '- No Comparison (2 Cor. 10:12)',
          '- Distance, Direction, and Duration (e.g., The life of Paul, the disciples and Jesus)',
        ],
      },
      {
        id: 'steps-to-stay-on-course',
        title: 'STEPS TO STAY ON COURSE (Proverbs 4:20-27, NKJV)',
        paragraphs: [
          'Contained within verses 20 through 27 are specific rules for successfully staying on our course. We are given the following guidelines:',
          '- Our ears: Listen to God\'s Word (v20)',
          '- Our eyes: Give attention to what God is saying (v20, 21, 25)',
          '- Our mouth: Read God\'s Word (v24)',
          '- Our entire man: Hold on to God\'s Word in your heart, Seek the God-kind of life (v21, 23)',
        ],
      },
      {
        id: 'just-like-paul',
        title: 'JUST LIKE PAUL',
        paragraphs: [
          'We found our lives by losing it and love our lives by not counting it dear (Matt. 16:24-25; Phil. 1:21-24; 3:7-12).',
          'Paul had learned to love God\'s will over everything else, and he realized that obeying his Savior yielded the greatest joy and fulfillment.',
          'The Lord wants us to be like the apostle Paul, being so devoted in our love and service that nothing could ever keep us from obeying Him wholeheartedly.',
          'Paul no longer desired to hold on to his life. He sought only the furtherance of God\'s kingdom and the honor of Christ, no matter what the earthly cost was.',
          '"None of these things move me, neither count I my life dear unto myself."',
          'Paul would rather die because he had done God\'s will than live for many more years outside of His will.',
          '"We run to add life to your days, rather than adding days to your life."',
          'Living for Jesus makes life more meaningful!',
        ],
      },
      {
        id: 'acts-20-24-i-do-not-account-my-life-of-any-value',
        title: 'ACTS 20:24 - I DO NOT ACCOUNT MY LIFE OF ANY VALUE',
        paragraphs: [
          'Paul\'s main concern was not preserving his own life; what counted most was that he might finish the work to which God had called him.',
          'Wherever and however it ended, even if it cost him his life, he would finish his course with joy. On his lips and in his life would be the prayer that "Christ will be honored in my body, whether by life or by death" (Phil. 1:20).',
          'For Paul, life and service for Christ are represented as a race that must be run with absolute perseverance, endurance and faithfulness to the Lord.',
        ],
      },
      {
        id: 'acts-13-24-25',
        title: 'ACTS 13:24-25 (NKJV)',
        paragraphs: [
          '"After John had first preached, before His coming, the baptism of repentance to all the people of Israel. And as John was finishing his course, he said, \'Who do you think I am? I am not He. But behold, there comes One after me, the sandals of whose feet I am not worthy to loose.\'"',
        ],
      },
      {
        id: 'striving-for-a-crown',
        title: 'STRIVING FOR A CROWN (1 Corinthians 9:24-27, NKJV)',
        paragraphs: [
          '"Do you not know that those who run in a race all run, but one receives the prize? Run in such a way that you may obtain it. And everyone who competes for the prize is temperate in all things. Now they do it to obtain a perishable crown, but we for an imperishable crown.',
          'Therefore I run thus: not with uncertainty. Thus I fight: not as one who beats the air. But I discipline my body and bring it into subjection, lest, when I have preached to others, I myself should become disqualified."',
        ],
      },
      {
        id: 'pauls-valedictory',
        title: 'PAUL\'S VALEDICTORY (2 Timothy 4:6-8, NKJV)',
        paragraphs: [
          '"For I am already being poured out as a drink offering, and the time of my departure is at hand. I have fought the good fight, I have finished the race, I have kept the faith. Finally, there is laid up for me the crown of righteousness, which the Lord, the righteous Judge, will give to me on that Day, and not to me only but also to all who have loved His appearing."',
        ],
      },
      {
        id: 'the-race-of-faith',
        title: 'THE RACE OF FAITH (Hebrews 12:1-3, NIV)',
        paragraphs: [
          '"Therefore, since we are surrounded by such a great cloud of witnesses, let us throw off everything that hinders and the sin that so easily entangles. And let us run with perseverance the race marked out for us, fixing our eyes on Jesus, the pioneer and perfecter of faith.',
          'For the joy set before him he endured the cross, scorning its shame, and sat down at the right hand of the throne of God. Consider him who endured such opposition from sinners, so that you will not grow weary and lose heart."',
        ],
      },
    ],
    relatedSermons: ['3', '8'],
  },
  {
    id: '8',
    slug: 'lost',
    title: 'Lost',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2025-07-27',
    duration: '45 min',
    series: 'Faith Foundation',
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'God\'s Priorities should be our priorities too. Rejoice with the heavens when even one person admits their helpless condition, accepts Christ\'s forgiveness, turns from their own way and begins to follow him.',
    description: `**LOST**

Luke 15

---

**1. GOD'S PRIORITIES SHOULD BE OUR PRIORITIES TOO**

---

**2. REJOICE WITH THE HEAVENS!**

Even when one person admits their helpless condition, accepts Christ's forgiveness, turns from their own way and begins to follow him. (v17-21)

"The Lord is not slow to fulfill his promise as some count slowness, but is patient toward you, not wishing that any should perish, but that all should reach repentance." (2 Peter 3:9, ESV)

---

**3. A DEEP DESIRE TO REACH OUT TO PEOPLE**

Luke 15:8 - "Seek diligently until she finds."

We should pray that the Holy Spirit will fill us with a deep desire to reach out to people with the message and compassion of Jesus so we can help them find spiritual salvation through a personal relationship with him.

---

**4. A LIFE OF SIN AND SELFISHNESS REJECTS GOD'S LOVE, COMPANIONSHIP AND AUTHORITY**

Luke 15:13 - "Journey into a far country."

In this parable, Jesus teaches that a life of sin (i.e., going our own way and rebelling against God and his standards) and selfishness rejects God's love, companionship and authority.

---

**5. RECOGNIZE OUR TRUE CONDITION**

Luke 15:17 - "He came to himself."

Before those who are spiritually lost can come to God, they must recognize their true condition of slavery to sin and separation from God (vv. 14-17).

They must humbly return to the Father, admit their sin and be willing to do whatever the Father requires (vv. 17-19).

Though God's people can help lead and influence people to turn (or return) to Christ, it is, in reality, the Holy Spirit's work to bring sinners to this realization (John 16:7-11).

---

**6. KEEP PRAYING FOR OUR SPIRITUALLY LOST**

Luke 15:20 - "While he was still a long way off."

Every Christian father and mother must understand that God loves their spiritually wayward child and desires his or her spiritual salvation even more than the parents do.

We must keep praying for our spiritually lost loved ones, trusting God to pursue them until each one returns to the heavenly Father.

---

**7. HAVE THE FATHER'S HEARTBEAT FOR THE LOST**

Luke 15:20 - "His father saw him and felt compassion."

Jesus' description of the father's response to the son's return shows us the heart of our Heavenly Father for the lost.`,
    tags: ['Lost', 'Salvation', 'Prodigal Son', 'Evangelism', 'Prayer', 'Compassion'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    scriptures: [
      {
        verse: 'Luke 15',
        text: 'Then all the tax collectors and the sinners drew near to Him to hear Him. And the Pharisees and scribes complained, saying, "This Man receives sinners and eats with them." So He spoke this parable to them...'
      },
      {
        verse: '2 Peter 3:9',
        text: 'The Lord is not slack concerning His promise, as some count slackness, but is longsuffering toward us, not willing that any should perish but that all should come to repentance.'
      },
      {
        verse: 'Luke 15:8',
        text: 'Or what woman, having ten silver coins, if she loses one coin, does not light a lamp, sweep the house, and search carefully until she finds it?'
      },
      {
        verse: 'Luke 15:13',
        text: 'And not many days after, the younger son gathered all together, journeyed to a far country, and there wasted his possessions with prodigal living.'
      },
      {
        verse: 'Luke 15:17-21',
        text: 'But when he came to himself, he said, "How many of my father’s hired servants have bread enough and to spare, and I perish with hunger! I will arise and go to my father..." And he arose and came to his father. But when he was still a great way off, his father saw him and had compassion...'
      },
      {
        verse: 'John 16:7-11',
        text: 'Nevertheless I tell you the truth. It is to your advantage that I go away; for if I do not go away, the Helper will not come to you; but if I depart, I will send Him to you. And when He has come, He will convict the world of sin, and of righteousness, and of judgment...'
      },
      {
        verse: 'Luke 15:20',
        text: 'And he arose and came to his father. But when he was still a great way off, his father saw him and had compassion, and ran and fell on his neck and kissed him.'
      }
    ],
    keyPoints: [
      'God\'s priorities should be our priorities',
      'Rejoice when one person turns to Christ',
      'Have a deep desire to reach out to people',
      'A life of sin rejects God\'s love and authority',
      'We must recognize our true condition',
      'Keep praying for spiritually lost loved ones',
      'Have the Father\'s heartbeat for the lost'
    ],
    keyTakeaways: [
      'God\'s priorities should be our priorities',
      'Rejoice when one person turns to Christ',
      'Have a deep desire to reach out to people',
      'A life of sin rejects God\'s love and authority',
      'We must recognize our true condition',
      'Keep praying for spiritually lost loved ones',
      'Have the Father\'s heartbeat for the lost',
    ],
    sections: [
      {
        id: 'lost',
        title: 'LOST',
        paragraphs: [
          'Luke 15',
        ],
      },
      {
        id: 'gods-priorities-should-be-our-priorities-too',
        title: '1. GOD\'S PRIORITIES SHOULD BE OUR PRIORITIES TOO',
        paragraphs: [],
      },
      {
        id: 'rejoice-with-the-heavens',
        title: '2. REJOICE WITH THE HEAVENS!',
        paragraphs: [
          'Even when one person admits their helpless condition, accepts Christ\'s forgiveness, turns from their own way and begins to follow him. (v17-21)',
          '"The Lord is not slow to fulfill his promise as some count slowness, but is patient toward you, not wishing that any should perish, but that all should reach repentance." (2 Peter 3:9, ESV)',
        ],
      },
      {
        id: 'a-deep-desire-to-reach-out-to-people',
        title: '3. A DEEP DESIRE TO REACH OUT TO PEOPLE',
        paragraphs: [
          'Luke 15:8 - "Seek diligently until she finds."',
          'We should pray that the Holy Spirit will fill us with a deep desire to reach out to people with the message and compassion of Jesus so we can help them find spiritual salvation through a personal relationship with him.',
        ],
      },
      {
        id: 'a-life-of-sin-and-selfishness-rejects-gods-love-companionship-and-authority',
        title: '4. A LIFE OF SIN AND SELFISHNESS REJECTS GOD\'S LOVE, COMPANIONSHIP AND AUTHORITY',
        paragraphs: [
          'Luke 15:13 - "Journey into a far country."',
          'In this parable, Jesus teaches that a life of sin (i.e., going our own way and rebelling against God and his standards) and selfishness rejects God\'s love, companionship and authority.',
        ],
      },
      {
        id: 'recognize-our-true-condition',
        title: '5. RECOGNIZE OUR TRUE CONDITION',
        paragraphs: [
          'Luke 15:17 - "He came to himself."',
          'Before those who are spiritually lost can come to God, they must recognize their true condition of slavery to sin and separation from God (vv. 14-17).',
          'They must humbly return to the Father, admit their sin and be willing to do whatever the Father requires (vv. 17-19).',
          'Though God\'s people can help lead and influence people to turn (or return) to Christ, it is, in reality, the Holy Spirit\'s work to bring sinners to this realization (John 16:7-11).',
        ],
      },
      {
        id: 'keep-praying-for-our-spiritually-lost',
        title: '6. KEEP PRAYING FOR OUR SPIRITUALLY LOST',
        paragraphs: [
          'Luke 15:20 - "While he was still a long way off."',
          'Every Christian father and mother must understand that God loves their spiritually wayward child and desires his or her spiritual salvation even more than the parents do.',
          'We must keep praying for our spiritually lost loved ones, trusting God to pursue them until each one returns to the heavenly Father.',
        ],
      },
      {
        id: 'have-the-fathers-heartbeat-for-the-lost',
        title: '7. HAVE THE FATHER\'S HEARTBEAT FOR THE LOST',
        paragraphs: [
          'Luke 15:20 - "His father saw him and felt compassion."',
          'Jesus\' description of the father\'s response to the son\'s return shows us the heart of our Heavenly Father for the lost.',
        ],
      },
    ],
    relatedSermons: ['3', '2'],
  },
  {
    id: '9',
    slug: 'enthusiastic-determination',
    title: 'Enthusiastic Determination',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2025-11-23',
    duration: '45 min',
    series: 'Faith Foundation',
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'Enthusiastic determination grows out of being delivered by the Lord. When we come to an impasse in life, we should recall the way God has delivered us from these things in the past.',
    description: `**ENTHUSIASTIC DETERMINATION**

---

**FIRST:** GROWS OUT OF BEING DELIVERED BY THE LORD (2 Cor. 4:13)

When we come to an impasse in life—a situation where no progress can be made, especially because of a disagreement or deadlock—in which we feel weighed down by the burdens or bogged down by the difficulties, we should recall the way God has delivered us from these things in the past.

---

**SECOND:** GROWS WHEN WE FOCUS ON OUR FUTURE RESURRECTION (2 Cor. 4:14)

As Bible-believing Christians, we anticipate that day when we will all be changed in a moment, in the twinkling of an eye (1 Cor. 15:52).

---

**THIRD:** GROWS WHEN WE INVEST IN THE LIVES OF OTHERS (2 Cor. 4:15)

When we take seriously the temporary nature of our present life and the glories of our future resurrection life, it should motivate us to "die" to ourselves and "live" for others.

When this happens:
- Teachers are resurrected in the lives of their students
- Parents are resurrected in the lives of their children
- Pastors are resurrected in the lives of their congregations`,
    tags: ['Determination', 'Resurrection', 'Investment', 'Sacrifice', 'Faith'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    scriptures: [
      {
        verse: '2 Corinthians 4:13',
        text: 'And since we have the same spirit of faith, according to what is written, "I believed and therefore I spoke," we also believe and therefore speak.'
      },
      {
        verse: '2 Corinthians 4:14',
        text: 'Knowing that He who raised up the Lord Jesus will also raise us up with Jesus, and will present us with you.'
      },
      {
        verse: '1 Corinthians 15:52',
        text: 'In a moment, in the twinkling of an eye, at the last trumpet. For the trumpet will sound, and the dead will be raised incorruptible, and we shall be changed.'
      },
      {
        verse: '2 Corinthians 4:15',
        text: 'For all things are for your sakes, that grace, having spread through the many, may cause thanksgiving to abound to the glory of God.'
      }
    ],
    keyPoints: [
      'Enthusiastic determination grows from being delivered by the Lord',
      'Focus on future resurrection',
      'Invest in the lives of others',
      'Die to self and live for others',
      'Teachers are resurrected in the lives of their students, parents in the lives of their children, pastors in the lives of their congregations'
    ],
    keyTakeaways: [
      'Enthusiastic determination grows from being delivered by the Lord',
      'Focus on future resurrection',
      'Invest in the lives of others',
      'Die to self and live for others',
      'Teachers are resurrected in the lives of their students, parents in the lives of their children, pastors in the lives of their congregations',
    ],
    sections: [
      {
        id: 'enthusiastic-determination',
        title: 'ENTHUSIASTIC DETERMINATION',
        paragraphs: [],
      },
      {
        id: 'first-grows-out-of-being-delivered-by-the-lord',
        title: 'FIRST: GROWS OUT OF BEING DELIVERED BY THE LORD (2 Cor. 4:13)',
        paragraphs: [
          'When we come to an impasse in life—a situation where no progress can be made, especially because of a disagreement or deadlock—in which we feel weighed down by the burdens or bogged down by the difficulties, we should recall the way God has delivered us from these things in the past.',
        ],
      },
      {
        id: 'second-grows-when-we-focus-on-our-future-resurrection',
        title: 'SECOND: GROWS WHEN WE FOCUS ON OUR FUTURE RESURRECTION (2 Cor. 4:14)',
        paragraphs: [
          'As Bible-believing Christians, we anticipate that day when we will all be changed in a moment, in the twinkling of an eye (1 Cor. 15:52).',
        ],
      },
      {
        id: 'third-grows-when-we-invest-in-the-lives-of-others',
        title: 'THIRD: GROWS WHEN WE INVEST IN THE LIVES OF OTHERS (2 Cor. 4:15)',
        paragraphs: [
          'When we take seriously the temporary nature of our present life and the glories of our future resurrection life, it should motivate us to "die" to ourselves and "live" for others.',
          'When this happens:',
          '- Teachers are resurrected in the lives of their students',
          '- Parents are resurrected in the lives of their children',
          '- Pastors are resurrected in the lives of their congregations',
        ],
      },
    ],
    relatedSermons: ['7', '10'],
  },
  {
    id: '10',
    slug: 'vision-sunday',
    title: 'Vision Sunday',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2025-12-07',
    duration: '45 min',
    series: 'Faith Foundation',
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'Be in your best position to hear and receive. The watchman and watchtower are pictures of Habakkuk\'s attitude of patient waiting and watching for God\'s response.',
    description: `**VISION SUNDAY**

Habakkuk 1:14, Habakkuk 2:2-3

---

**BE IN YOUR BEST POSITION TO HEAR AND RECEIVE** (Hab 2:1)

The watchman and watchtower, often used by the prophets to show an attitude of expectation (Isa 21:8, 11; Jer 6:17; Ezek 3:17), are pictures of Habakkuk's attitude of patient waiting and watching for God's response.

Habakkuk wanted to be in the best position to receive God's message.

---

**TRUST GOD** (Hab 2:3)

Evil and injustice seem to have the upper hand in the world. Like Habakkuk, Christians often feel angry and discouraged as they see what goes on. Habakkuk complained vigorously to God about the situation.

God's answer to Habakkuk is the same answer he would give us: "If it seems slow in coming, wait patiently, for it will surely take place."

It isn't easy to be patient, but it helps to remember that God hates sin even more than we do. Punishment of sin will certainly come.

As God told Habakkuk, "Wait patiently."

We must trust God even when we don't understand why events occur as they do.

---

**LIVE BY FAITH** (Hab 2:4)

"The righteous shall live by his faith."

In light of God's revelation about how (and when) he is working, his people are to be patient and live by faith.

**(1)** It is "the righteous"—those who entrust their lives to God and do what is right according to his standards—who will come through victorious in the end.

**(2)** The righteous are contrasted with the proud and the ungodly, whose life choices and direction oppose God. The hearts of the righteous are devoted to God; they want to be his children, to have close fellowship with him and to obey his plans and desires.

**(3)** The righteous must rely on God to accomplish his purposes for them in this world. This kind of "faith" implies an active and lasting trust in God. It is evidence of a personal loyalty to him as Savior and Lord (i.e., the Leader and authority over their lives) and a moral commitment to follow his plans.

**(4)** This phrase, "the righteous shall live by his faith," or a form of it, is used throughout the NT to support the teaching that people are saved by grace (i.e., God's undeserved favor) through faith in Christ (cf. Eph. 2:8). Paul develops the theme in Rom. 1:17 and Gal. 3:11, and the writer to the Hebrews emphasizes that God's people must continue to live by faith in order to please God (see Heb. 10:38; 11:6).`,
    tags: ['Vision', 'Faith', 'Patience', 'Trust', 'Watchfulness'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    scriptures: [
      {
        verse: 'Habakkuk 2:1',
        text: 'I will stand my watch And set myself on the rampart, And watch to see what He will say to me, And what I will answer when I am corrected.'
      },
      {
        verse: 'Habakkuk 2:2-3',
        text: 'Then the Lord answered me and said: "Write the vision And make it plain on tablets, That he may run who reads it. For the vision is yet for an appointed time; But at the end it will speak, and it will not lie. Though it tarries, wait for it; Because it will surely come, It will not tarry."'
      },
      {
        verse: 'Habakkuk 2:4',
        text: 'Behold the proud, His soul is not upright in him; But the just shall live by his faith.'
      },
      {
        verse: 'Isaiah 21:8, 11',
        text: 'Then he cried, "A lion, my Lord! I stand continually on the watchtower in the daytime, And I have sat at my post every night." ... The burden against Dumah. He calls to me out of Seir, "Watchman, what of the night? Watchman, what of the night?"'
      },
      {
        verse: 'Romans 1:17',
        text: 'For in it the righteousness of God is revealed from faith to faith; as it is written, "The just shall live by faith."'
      },
      {
        verse: 'Galatians 3:11',
        text: 'But that no one is justified by the law in the sight of God is evident, for "the just shall live by faith."'
      },
      {
        verse: 'Ephesians 2:8',
        text: 'For by grace you have been saved through faith, and that not of yourselves; it is the gift of God.'
      },
      {
        verse: 'Hebrews 10:38; 11:6',
        text: 'Now the just shall live by faith; But if anyone draws back, My soul has no pleasure in him. ... But without faith it is impossible to please Him, for he who comes to God must believe that He is, and that He is a rewarder of those who diligently seek Him.'
      }
    ],
    keyPoints: [
      'Be in your best position to hear and receive',
      'Trust God even when it seems slow',
      'Wait patiently for God\'s promises',
      'The righteous shall live by faith',
      'Faith implies active and lasting trust in God',
      'We must trust God even when we don\'t understand why events occur as they do'
    ],
    keyTakeaways: [
      'Be in your best position to hear and receive',
      'Trust God even when it seems slow',
      'Wait patiently for God\'s promises',
      'The righteous shall live by faith',
      'Faith implies active and lasting trust in God',
      'We must trust God even when we don\'t understand why events occur as they do',
    ],
    sections: [
      {
        id: 'vision-sunday',
        title: 'VISION SUNDAY',
        paragraphs: [
          'Habakkuk 1:14, Habakkuk 2:2-3',
        ],
      },
      {
        id: 'be-in-your-best-position-to-hear-and-receive',
        title: 'BE IN YOUR BEST POSITION TO HEAR AND RECEIVE (Hab 2:1)',
        paragraphs: [
          'The watchman and watchtower, often used by the prophets to show an attitude of expectation (Isa 21:8, 11; Jer 6:17; Ezek 3:17), are pictures of Habakkuk\'s attitude of patient waiting and watching for God\'s response.',
          'Habakkuk wanted to be in the best position to receive God\'s message.',
        ],
      },
      {
        id: 'trust-god',
        title: 'TRUST GOD (Hab 2:3)',
        paragraphs: [
          'Evil and injustice seem to have the upper hand in the world. Like Habakkuk, Christians often feel angry and discouraged as they see what goes on. Habakkuk complained vigorously to God about the situation.',
          'God\'s answer to Habakkuk is the same answer he would give us: "If it seems slow in coming, wait patiently, for it will surely take place."',
          'It isn\'t easy to be patient, but it helps to remember that God hates sin even more than we do. Punishment of sin will certainly come.',
          'As God told Habakkuk, "Wait patiently."',
          'We must trust God even when we don\'t understand why events occur as they do.',
        ],
      },
      {
        id: 'live-by-faith',
        title: 'LIVE BY FAITH (Hab 2:4)',
        paragraphs: [
          '"The righteous shall live by his faith."',
          'In light of God\'s revelation about how (and when) he is working, his people are to be patient and live by faith.',
          '**(1)** It is "the righteous"—those who entrust their lives to God and do what is right according to his standards—who will come through victorious in the end.',
          '**(2)** The righteous are contrasted with the proud and the ungodly, whose life choices and direction oppose God. The hearts of the righteous are devoted to God; they want to be his children, to have close fellowship with him and to obey his plans and desires.',
          '**(3)** The righteous must rely on God to accomplish his purposes for them in this world. This kind of "faith" implies an active and lasting trust in God. It is evidence of a personal loyalty to him as Savior and Lord (i.e., the Leader and authority over their lives) and a moral commitment to follow his plans.',
          '**(4)** This phrase, "the righteous shall live by his faith," or a form of it, is used throughout the NT to support the teaching that people are saved by grace (i.e., God\'s undeserved favor) through faith in Christ (cf. Eph. 2:8). Paul develops the theme in Rom. 1:17 and Gal. 3:11, and the writer to the Hebrews emphasizes that God\'s people must continue to live by faith in order to please God (see Heb. 10:38; 11:6).',
        ],
      },
    ],
    relatedSermons: ['9', '11'],
  },
  {
    id: '11',
    slug: 'twelve-tips-to-conquer-the-new-year',
    title: 'Twelve Tips to Conquer the New Year',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2025-12-28',
    duration: '45 min',
    series: 'Faith Foundation',
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'Twelve practical tips from the book of Proverbs to help you conquer the new year with wisdom, discipline, and dependence on God.',
    description: `**TWELVE TIPS TO CONQUER THE NEW YEAR**

Proverbs 1:1-5

---

**THE TWELVE TIPS**

**1. BE A PERSON WITH FIRM DETERMINATIONS** (Proverbs 1:10)

**2. ASK FOR INTELLIGENCE** (Proverbs 2:3-5)

**3. DEPEND COMPLETELY ON GOD** (Proverbs 3:5)

**4. BE GENEROUS WITH GOD** (Proverbs 3:9-10)

**5. GUARD YOUR MIND** (Proverbs 4:23)

**6. PROTECT YOUR MARRIAGE** (Proverbs 5:18-19)

**7. GUARD YOUR WORDS** (Proverbs 6:2)

**8. MEMORIZE THE WORD** (Proverbs 7:2-3)

**9. TRAIN YOURSELF IN THE WORD** (Proverbs 8:10)

**10. CAST OUT THAT WHICH DOES NOT EDIFY** (Proverbs 9:6)

**11. REPRODUCE LIFE** (Proverbs 10:16)

**12. ENJOY GOD'S BLESSING** (Proverbs 10:22)

---

**APPLICATION**

**1.** Pray the Lord will give you new and creative ideas as well as the grace to put them into action.

**2.** Come up with a plan that will cause you to completely depend on God.

**3.** Purpose in your heart to be generous in your giving to God.

**4.** Discipline yourself in daily reading of the Word with the purpose of keeping your mind pure, protecting every area of your life, and memorizing scripture.

**5.** Write up a list of all of the unedifying things you do daily and work towards eradicating them from your life.`,
    tags: ['New Year', 'Proverbs', 'Wisdom', 'Discipline', 'Generosity', 'Marriage'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    scriptures: [
      {
        verse: 'Proverbs 1:1-5, 10',
        text: 'The proverbs of Solomon the son of David, king of Israel: To know wisdom and instruction... My son, if sinners entice you, Do not consent.'
      },
      {
        verse: 'Proverbs 2:3-5',
        text: 'Yes, if you cry out for discernment, And lift up your voice for understanding, If you seek her as silver, And search for her as for hidden treasures; Then you will understand the fear of the Lord, And find the knowledge of God.'
      },
      {
        verse: 'Proverbs 3:5',
        text: 'Trust in the Lord with all your heart, And lean not on your own understanding.'
      },
      {
        verse: 'Proverbs 3:9-10',
        text: 'Honor the Lord with your possessions, And with the firstfruits of all your increase; So your barns will be filled with plenty, And your vats will overflow with new wine.'
      },
      {
        verse: 'Proverbs 4:23',
        text: 'Keep your heart with all diligence, For out of it spring the issues of life.'
      },
      {
        verse: 'Proverbs 5:18-19',
        text: 'Let your fountain be blessed, And rejoice with the wife of your youth. As a loving deer and a graceful doe, Let her breasts satisfy you at all times; And always be enraptured with her love.'
      },
      {
        verse: 'Proverbs 6:2',
        text: 'You are snared by the words of your mouth; You are taken by the words of your mouth.'
      },
      {
        verse: 'Proverbs 7:2-3',
        text: 'Keep my commands and live, And my law as the apple of your eye. Bind them on your fingers; Write them on the tablet of your heart.'
      },
      {
        verse: 'Proverbs 8:10',
        text: 'Receive my instruction, and not silver, And knowledge rather than choice gold.'
      },
      {
        verse: 'Proverbs 9:6',
        text: 'Forsake foolishness and live, And go in the way of understanding.'
      },
      {
        verse: 'Proverbs 10:16',
        text: 'The labor of the righteous leads to life, The wages of the wicked to sin.'
      },
      {
        verse: 'Proverbs 10:22',
        text: 'The blessing of the Lord makes one rich, And He adds no sorrow with it.'
      }
    ],
    keyPoints: [
      'Be a person with firm determinations',
      'Ask for intelligence',
      'Depend completely on God',
      'Be generous with God',
      'Guard your mind',
      'Protect your marriage',
      'Guard your words',
      'Memorize the Word',
      'Train yourself in the Word',
      'Cast out that which does not edify',
      'Reproduce life',
      'Enjoy God\'s blessing'
    ],
    keyTakeaways: [
      'Be a person with firm determinations',
      'Ask for intelligence',
      'Depend completely on God',
      'Be generous with God',
      'Guard your mind',
      'Protect your marriage',
      'Guard your words',
      'Memorize the Word',
      'Train yourself in the Word',
      'Cast out that which does not edify',
      'Reproduce life',
      'Enjoy God\'s blessing',
    ],
    sections: [
      {
        id: 'twelve-tips-to-conquer-the-new-year',
        title: 'TWELVE TIPS TO CONQUER THE NEW YEAR',
        paragraphs: [
          'Proverbs 1:1-5',
        ],
      },
      {
        id: 'the-twelve-tips',
        title: 'THE TWELVE TIPS',
        paragraphs: [
          '**1. BE A PERSON WITH FIRM DETERMINATIONS** (Proverbs 1:10)',
          '**2. ASK FOR INTELLIGENCE** (Proverbs 2:3-5)',
          '**3. DEPEND COMPLETELY ON GOD** (Proverbs 3:5)',
          '**4. BE GENEROUS WITH GOD** (Proverbs 3:9-10)',
          '**5. GUARD YOUR MIND** (Proverbs 4:23)',
          '**6. PROTECT YOUR MARRIAGE** (Proverbs 5:18-19)',
          '**7. GUARD YOUR WORDS** (Proverbs 6:2)',
          '**8. MEMORIZE THE WORD** (Proverbs 7:2-3)',
          '**9. TRAIN YOURSELF IN THE WORD** (Proverbs 8:10)',
          '**10. CAST OUT THAT WHICH DOES NOT EDIFY** (Proverbs 9:6)',
          '**11. REPRODUCE LIFE** (Proverbs 10:16)',
          '**12. ENJOY GOD\'S BLESSING** (Proverbs 10:22)',
        ],
      },
      {
        id: 'application',
        kicker: 'Application',
        title: 'APPLICATION',
        paragraphs: [
          '**1.** Pray the Lord will give you new and creative ideas as well as the grace to put them into action.',
          '**2.** Come up with a plan that will cause you to completely depend on God.',
          '**3.** Purpose in your heart to be generous in your giving to God.',
          '**4.** Discipline yourself in daily reading of the Word with the purpose of keeping your mind pure, protecting every area of your life, and memorizing scripture.',
          '**5.** Write up a list of all of the unedifying things you do daily and work towards eradicating them from your life.',
        ],
      },
    ],
    relatedSermons: ['10', '9'],
  },
  {
    id: '12',
    slug: 'god-of-covenant',
    title: 'God of Covenant',
    speaker: 'Ptr. Rodel Umapas',
    speakerRole: 'guest pastor',
    date: '2026-02-01',
    duration: '45 min',
    series: 'Covenant',
    seriesDescription: 'Understanding the covenant relationship between God and His people.',
    excerpt: 'When God enters covenant with a person, He calls them, covers them, and consecrates them for divine purpose. Covenant is not about who Abram is—it’s about who God is.',
    description: `**God of Covenant**
(Genesis 12:1-9)

When God enters covenant with a person, He calls them, covers them, and consecrates them for divine purpose. Covenant is not about who Abram is—it's about who God is.

**1. Called for Greatness** (Genesis 12:1-3)
GOD's call is: separational, directional and promissory.
* God never calls you to stay where you are— He calls you to become who he designed you to be.
* You cannot experience covenant greatness while clinging to familiar places.
* Obedience precedes clarity. Step out even when the destination is not fully revealed

**2. Covered by God** (Genesis 12: 4-9)
**A.** Covered by God's Presence ("When you walk in covenant obedience, you never walk alone." )
**B.** Covered by God's Protection (God personally defends covenant people. Abram doesn't fight his battles—God does.) When God is your defender, every enemy must get permission first. Stop fighting battles God promised to handle. Trust God's justice instead of personal revenge.
**C.** Covered by God's Provision (Covenant provision, follows obedience) " Where God guides, God provides " Just like manna in the wilderness, provision shows up daily—not stored in advance. Don't fear lack, when God is leading, obedience unlocks provision

**3. Consecrated for God's Purpose** (Genesis 12: 8-9)
* Consecration means living set apart for God's mission God does not call us just to be blessed but to become a blessing.
* A vessel in the temple was not for common use-it was set apart.
* Covenant people are not ordinary vessels. Live with purpose not comfort.
* Let your life point others to God. Ask daily "how does my life bless others?
* Separation always precedes elevation (Genesis 13:14). What God is about to reveal next requires Abram to be fully consecrated—no divided loyalty.
* When god removes what's holding you back He's making room for what's coming next.`,
    tags: ['Covenant', 'Greatness', 'Protection', 'Provision', 'Consecration', 'Obedience', 'Calling'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptr-rodel.jpg',
    scriptures: [
      {
        verse: 'Genesis 12:1-3',
        text: 'Now the Lord had said to Abram: "Get out of your country, From your family And from your father’s house, To a land that I will show you. I will make you a great nation; I will bless you And make your name great; And you shall be a blessing. I will bless those who bless you, And I will curse him who curses you; And in you all the families of the earth shall be blessed."'
      },
      {
        verse: 'Genesis 12:4-9',
        text: 'So Abram departed as the Lord had spoken to him, and Lot went with him. And Abram was seventy-five years old when he departed from Haran. Then Abram took Sarai his wife and Lot his brother’s son, and all their possessions that they had gathered, and the people whom they had acquired in Haran, and they departed to go to the land of Canaan. So they came to the land of Canaan. Abram passed through the land to the place of Shechem, as far as the terebinth tree of Moreh. And the Canaanites were then in the land. Then the Lord appeared to Abram and said, "To your descendants I will give this land." And there he built an altar to the Lord, who had appeared to him. And he moved from there to the mountain east of Bethel, and he pitched his tent with Bethel on the west and Ai on the east; there he built an altar to the Lord and called on the name of the Lord. So Abram journeyed, going on still toward the South.'
      },
      {
        verse: 'Genesis 13:14',
        text: 'And the Lord said to Abram, after Lot had separated from him: "Lift your eyes now and look from the place where you are—northward, southward, eastward, and westward;"'
      }
    ],

    keyPoints: [
      'Covenant is about who God is, not who we are',
      'God never calls you to stay where you are',
      'Obedience precedes clarity',
      'When you walk in covenant obedience, you never walk alone',
      'Stop fighting battles God promised to handle',
      'Where God guides, God provides',
      'God does not call us just to be blessed but to become a blessing',
      'Separation always precedes elevation',
      'When God removes what\'s holding you back, He\'s making room for what\'s coming next'
    ],
    keyTakeaways: [
      'Covenant is about who God is, not who we are',
      'God never calls you to stay where you are',
      'Obedience precedes clarity',
      'When you walk in covenant obedience, you never walk alone',
      'Stop fighting battles God promised to handle',
      'Where God guides, God provides',
      'God does not call us just to be blessed but to become a blessing',
      'Separation always precedes elevation',
      'When God removes what\'s holding you back, He\'s making room for what\'s coming next',
    ],
    sections: [
      {
        id: 'god-of-covenant',
        title: 'God of Covenant',
        paragraphs: [
          '(Genesis 12:1-9)',
          'When God enters covenant with a person, He calls them, covers them, and consecrates them for divine purpose. Covenant is not about who Abram is—it\'s about who God is.',
        ],
      },
      {
        id: 'called-for-greatness',
        title: '1. Called for Greatness (Genesis 12:1-3)',
        paragraphs: [
          'GOD\'s call is: separational, directional and promissory.',
          '- God never calls you to stay where you are— He calls you to become who he designed you to be.',
          '- You cannot experience covenant greatness while clinging to familiar places.',
          '- Obedience precedes clarity. Step out even when the destination is not fully revealed',
        ],
      },
      {
        id: 'covered-by-god',
        title: '2. Covered by God (Genesis 12: 4-9)',
        paragraphs: [
          '**A.** Covered by God\'s Presence ("When you walk in covenant obedience, you never walk alone." )',
          '**B.** Covered by God\'s Protection (God personally defends covenant people. Abram doesn\'t fight his battles—God does.) When God is your defender, every enemy must get permission first. Stop fighting battles God promised to handle. Trust God\'s justice instead of personal revenge.',
          '**C.** Covered by God\'s Provision (Covenant provision, follows obedience) " Where God guides, God provides " Just like manna in the wilderness, provision shows up daily—not stored in advance. Don\'t fear lack, when God is leading, obedience unlocks provision',
        ],
      },
      {
        id: 'consecrated-for-gods-purpose',
        title: '3. Consecrated for God\'s Purpose (Genesis 12: 8-9)',
        paragraphs: [
          '- Consecration means living set apart for God\'s mission God does not call us just to be blessed but to become a blessing.',
          '- A vessel in the temple was not for common use-it was set apart.',
          '- Covenant people are not ordinary vessels. Live with purpose not comfort.',
          '- Let your life point others to God. Ask daily "how does my life bless others?',
          '- Separation always precedes elevation (Genesis 13:14). What God is about to reveal next requires Abram to be fully consecrated—no divided loyalty.',
          '- When god removes what\'s holding you back He\'s making room for what\'s coming next.',
        ],
      },
    ],
    relatedSermons: ['2', '3'],
  },
  {
    id: '13',
    slug: 'persevering-love',
    title: 'Persevering Love',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2026-02-08',
    duration: '45 min',
    series: 'Faith Foundation',
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'The greatest representation of love in history was when our Heavenly Father sent his only-begotten son to redeem the world.',
    description: `**PERSEVERING LOVE**

Hebrews 10:5–7

The love of God is not temporary, conditional, or based on our performance. It is a persevering love—a love that endured suffering, sacrifice, and the Cross in order to redeem mankind.

In Hebrews 10:5–7, we are reminded that Jesus willingly came to fulfill the will of the Father. He did not come reluctantly, but with complete surrender and obedience. His life was a divine mission of love—love that endured all things so that we could be saved.

---

**THE “ALTHOUGH” LOVE OF CHRIST**

The sacrifice of Jesus reveals a love so deep and powerful that it cannot be measured. Over and over again, Scripture shows how Christ laid aside everything for our redemption:

**1. Although He was God, He became a Man**
Jesus, fully God, humbled Himself and came in human form, choosing the path of a servant and submitting to death on the Cross. (Philippians 2:5–8)

**2. Although He was Rich, He became Poor**
Jesus gave up heavenly riches so that through His sacrifice, we could receive spiritual riches, provision, and eternal life. (2 Corinthians 8:9)

**3. Although He was Holy, He became Accursed**
Christ redeemed us from the curse of the law by becoming a curse for us, taking what we deserved upon Himself. (Galatians 3:13)

**4. Although He was Righteous, He became Sin**
Jesus died for us while we were still sinners. His righteousness was exchanged for our sin so that we could be reconciled to God. (Romans 5:8)

**5. Although He was Healthy, He bore our Sickness**
Jesus carried our infirmities, pains, and sorrows. Through His suffering, healing was made available to us. (Isaiah 53:4–5)

**6. Although He was Just, He died with the Unjust**
Though innocent and without deceit, Jesus was treated as wicked and placed among sinners, fulfilling prophecy and taking our punishment. (Isaiah 53:9)

**7. Although He was Perfect, He was Broken for Us**
It was the will of the Lord to crush Him as an offering for sin, so that God’s purpose of salvation could be fulfilled through His suffering. (Isaiah 53:10)

---

**CONCLUSION**

The greatest representation of love in history was when our Heavenly Father sent His only-begotten Son to redeem the world. Jesus was sacrificed for our sins on the Cross of Calvary, breaking every chain and making us free from all oppression of the enemy.

The Cross is not just a reminder of suffering—it is the ultimate proof of God’s enduring love and the victory of Jesus Christ.

---

**APPLICATION: LIVING IN THE POWER OF PERSEVERING LOVE**

**1. Choose to be a New Creature in Christ**
Make a decision to walk in your new identity. Let go of what has kept you bound to your past and embrace the new life God has prepared for you.

**2. Develop a Heart of Gratitude**
Live with thanksgiving for all God has done through the Cross—healing, prosperity, restoration, forgiveness of sins, and the love that saved you.

**3. Stand in Victory Through Spiritual Warfare**
Make a list of the things Satan has tried to steal from you. Then, through prayer and spiritual warfare, remind the enemy that he has already been defeated at the Cross of Calvary.`,
    tags: ['Love', 'Redemption', 'Sacrifice', 'Christ', 'Atonement', 'Perseverance'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptr-jim.jpg',
    scriptures: [
      {
        verse: 'Hebrews 10:1-10',
        text: `For the law, having a shadow of the good things to come, and not the very image of the things, can never with these same sacrifices, which they offer continually year by year, make those who approach perfect. For then would they not have ceased to be offered? For the worshipers, once purified, would have had no more consciousness of sins. But in those sacrifices there is a reminder of sins every year. For it is not possible that the blood of bulls and goats could take away sins. Therefore, when He came into the world, He said: “Sacrifice and offering You did not desire, But a body You have prepared for Me. In burnt offerings and sacrifices for sin You had no pleasure. Then I said, ‘Behold, I have come— In the volume of the book it is written of Me— To do Your will, O God.’ ” Previously saying, “Sacrifice and offering, burnt offerings, and offerings for sin You did not desire, nor had pleasure in them” (which are offered according to the law), then He said, “Behold, I have come to do Your will, O God.” He takes away the first that He may establish the second. By that will we have been sanctified through the offering of the body of Jesus Christ once for all.`
      },
      {
        verse: 'Philippians 2:5-8',
        text: 'Let this mind be in you which was also in Christ Jesus, who, being in the form of God, did not consider it robbery to be equal with God, but made Himself of no reputation, taking the form of a bondservant, and coming in the likeness of men. And being found in appearance as a man, He humbled Himself and became obedient to the point of death, even the death of the cross.'
      },
      {
        verse: '2 Corinthians 8:9',
        text: 'For you know the grace of our Lord Jesus Christ, that though He was rich, yet for your sakes He became poor, that you through His poverty might become rich.'
      },
      {
        verse: 'Galatians 3:13',
        text: 'Christ has redeemed us from the curse of the law, having become a curse for us (for it is written, "Cursed is everyone who hangs on a tree").'
      },
      {
        verse: 'Romans 5:8',
        text: 'But God demonstrates His own love toward us, in that while we were still sinners, Christ died for us.'
      },
      {
        verse: 'Isaiah 53:4-5',
        text: 'Surely He has borne our griefs And carried our sorrows; Yet we esteemed Him stricken, Smitten by God, and afflicted. But He was wounded for our transgressions, He was bruised for our iniquities; The chastisement for our peace was upon Him, And by His stripes we are healed.'
      },
      {
        verse: 'Isaiah 53:9',
        text: 'And they made His grave with the wicked—But with the rich at His death, Because He had done no violence, Nor was any deceit in His mouth.'
      },
      {
        verse: 'Isaiah 53:10',
        text: 'Yet it pleased the Lord to bruise Him; He has put Him to grief. When You make His soul an offering for sin, He shall see His seed, He shall prolong His days, And the pleasure of the Lord shall prosper in His hand.'
      }
    ],

    keyPoints: [
      'Although He was God, He became a man',
      'Although He was rich, He became poor',
      'Although He was holy, He was accursed',
      'Although He was righteous, He became sin',
      'Although He was healthy, He bore our sickness and infirmities',
      'Although He was just, He died with the unjust',
      'Although He was perfect, He was broken for us'
    ],
    keyTakeaways: [
      'Although He was God, He became a man',
      'Although He was rich, He became poor',
      'Although He was holy, He was accursed',
      'Although He was righteous, He became sin',
      'Although He was healthy, He bore our sickness and infirmities',
      'Although He was just, He died with the unjust',
      'Although He was perfect, He was broken for us',
    ],
    sections: [
      {
        id: 'persevering-love',
        title: 'PERSEVERING LOVE',
        paragraphs: [
          'Hebrews 10:5–7',
          'The love of God is not temporary, conditional, or based on our performance. It is a persevering love—a love that endured suffering, sacrifice, and the Cross in order to redeem mankind.',
          'In Hebrews 10:5–7, we are reminded that Jesus willingly came to fulfill the will of the Father. He did not come reluctantly, but with complete surrender and obedience. His life was a divine mission of love—love that endured all things so that we could be saved.',
        ],
      },
      {
        id: 'the-although-love-of-christ',
        title: 'THE "ALTHOUGH" LOVE OF CHRIST',
        paragraphs: [
          'The sacrifice of Jesus reveals a love so deep and powerful that it cannot be measured. Over and over again, Scripture shows how Christ laid aside everything for our redemption:',
          '**1. Although He was God, He became a Man**',
          'Jesus, fully God, humbled Himself and came in human form, choosing the path of a servant and submitting to death on the Cross. (Philippians 2:5–8)',
          '**2. Although He was Rich, He became Poor**',
          'Jesus gave up heavenly riches so that through His sacrifice, we could receive spiritual riches, provision, and eternal life. (2 Corinthians 8:9)',
          '**3. Although He was Holy, He became Accursed**',
          'Christ redeemed us from the curse of the law by becoming a curse for us, taking what we deserved upon Himself. (Galatians 3:13)',
          '**4. Although He was Righteous, He became Sin**',
          'Jesus died for us while we were still sinners. His righteousness was exchanged for our sin so that we could be reconciled to God. (Romans 5:8)',
          '**5. Although He was Healthy, He bore our Sickness**',
          'Jesus carried our infirmities, pains, and sorrows. Through His suffering, healing was made available to us. (Isaiah 53:4–5)',
          '**6. Although He was Just, He died with the Unjust**',
          'Though innocent and without deceit, Jesus was treated as wicked and placed among sinners, fulfilling prophecy and taking our punishment. (Isaiah 53:9)',
          '**7. Although He was Perfect, He was Broken for Us**',
          'It was the will of the Lord to crush Him as an offering for sin, so that God\'s purpose of salvation could be fulfilled through His suffering. (Isaiah 53:10)',
        ],
      },
      {
        id: 'conclusion',
        kicker: 'Conclusion',
        title: 'CONCLUSION',
        paragraphs: [
          'The greatest representation of love in history was when our Heavenly Father sent His only-begotten Son to redeem the world. Jesus was sacrificed for our sins on the Cross of Calvary, breaking every chain and making us free from all oppression of the enemy.',
          'The Cross is not just a reminder of suffering—it is the ultimate proof of God\'s enduring love and the victory of Jesus Christ.',
        ],
      },
      {
        id: 'application-living-in-the-power-of-persevering-love',
        kicker: 'Application',
        title: 'LIVING IN THE POWER OF PERSEVERING LOVE',
        paragraphs: [
          '**1. Choose to be a New Creature in Christ**',
          'Make a decision to walk in your new identity. Let go of what has kept you bound to your past and embrace the new life God has prepared for you.',
          '**2. Develop a Heart of Gratitude**',
          'Live with thanksgiving for all God has done through the Cross—healing, prosperity, restoration, forgiveness of sins, and the love that saved you.',
          '**3. Stand in Victory Through Spiritual Warfare**',
          'Make a list of the things Satan has tried to steal from you. Then, through prayer and spiritual warfare, remind the enemy that he has already been defeated at the Cross of Calvary.',
        ],
      },
    ],
    relatedSermons: ['12', '2'],
  },
  {
    id: '14',
    slug: 'first-love-should-never-die',
    title: 'First Love Should Never Die',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2026-02-15',
    duration: '45 min',
    series: 'Covenant',
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'In Revelation 2:1–7, Jesus speaks to the church in Ephesus—a church known for its hard work, perseverance, and commitment to truth. Yet despite their faithful service, the Lord confronted them with a serious issue: they had left their first love.',
    description: `**FIRST LOVE SHOULD NEVER DIE**

Revelation 2:1–7

In Revelation 2:1–7, Jesus speaks to the church in Ephesus—a church known for its hard work, perseverance, and commitment to truth. Yet despite their faithful service, the Lord confronted them with a serious issue: they had left their first love.
This passage reminds us that it is possible to be active in ministry while slowly drifting away in intimacy with Christ. Jesus does not only desire our service—He desires our hearts.

---

**KEY MESSAGE: FIRST LOVE SHOULD NEVER DIE**

When a person is truly in love, time, sacrifice, distance, and effort do not become burdens. Love naturally expresses itself through devotion and priority.
In the same way, our love for Jesus must remain sincere, personal, and passionate.

---

**1. GIVING THEIR SERVICE BUT NOT THEMSELVES**
The church in Ephesus was faithful in deeds and endurance, but they had lost the love they once had for Jesus. They continued serving, but their hearts were no longer fully devoted.

"I know your deeds, your hard work and your perseverance… Yet I hold this against you: You have forsaken the love you had at first." (Revelation 2:2, 4)

---

**2. A DEEP AND SINCERE LOVE FOR HIM PERSONALLY**
Christianity is not only about doing what is right—it is about loving Jesus personally. God desires a relationship with His people that is genuine and wholehearted.

---

**3. SINCERE LOVE FOR JESUS SHOULD BE EVIDENT IN OUR PERSONAL PRIORITIES**
Our love for Christ is reflected in what we prioritize. If Jesus is truly first, it will be evident in our choices, schedules, and desire to seek Him.

---

**4. FALLEN SPIRITUALLY**
Spiritual decline often begins quietly. Jesus warned the Ephesian church that they had “fallen” because their passion and devotion had weakened.

"Consider how far you have fallen! Repent and do the things you did at first." (Revelation 2:5)

---

**5. TAKING TIME TO BE WITH HIM**
The solution is not simply to do more—it is to return to Jesus. Our first love is restored when we intentionally spend time with Him and allow our relationship with Him to be renewed.

---

**CONCLUSION**

How can churches avoid spiritual decline and the resulting judgment of Christ? The letters in Revelation provide clear instruction for every believer and every church.

**First, churches must be willing to hear what the Spirit says**
—listening carefully and responding with obedience to God’s direct message. The Word of Jesus Christ must remain the church’s foundation and guide, and it is through His Word that believers are continually renewed. (Revelation 2:5–7)

**Second, churches must continually examine their spiritual condition according to God’s standards**. 
Where compromise is found, there must be correction—especially when worldly thinking or immoral practices are tolerated among God’s people. (Revelation 2:14–15)

**Finally, spiritual decline can only be stopped and corrected through sincere repentance and a wholehearted return to the original love, truth, purity, and power of Jesus Christ and His Word**. 
(Revelation 2:5–7, Matthew 3:2)

**May we not only serve God faithfully, but also love Him deeply—because first love should never die.**

---

** Serving God is not the same as loving God. We can be active in ministry yet still lose intimacy with Jesus. (Revelation 2:2, 4)
** First love must remain alive. Jesus desires not only our works, but our wholehearted devotion.

** True love for Christ is personal. God wants a deep and sincere relationship, not mere religious routine.
** Our priorities reveal our love. If Jesus is first, it will be evident in how we spend our time, energy, and attention.

** Spiritual decline begins when passion fades. Losing our hunger for God leads to falling spiritually. (Revelation 2:5)
** The solution is to return. Restoration happens when we repent and return to the things we did at first.

** Churches must hear and obey the Spirit. Spiritual renewal begins when we listen to God’s Word and respond in obedience. (Revelation 2:7)
** Repentance restores purity and power. Decline is reversed through sincere repentance and a return to Christ-centered living. (Matthew 3:2)`,
    tags: ['First Love', 'Intimacy', 'Repentance', 'Restoration', 'Priorities', 'Ministry'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptr-jim.jpg',
    scriptures: [
      {
        verse: 'Revelation 2:1-7',
        text: 'To the angel of the church of Ephesus write, ‘These things says He who holds the seven stars in His right hand, who walks in the midst of the seven golden lampstands: "I know your works, your labor, your patience, and that you cannot bear those who are evil. And you have tested those who say they are apostles and are not, and have found them liars; and you have persevered and have patience, and have labored for My name’s sake and have not become weary. Nevertheless I have this against you, that you have left your first love. Remember therefore from where you have fallen; repent and do the first works, or else I will come to you quickly and remove your lampstand from its place—unless you repent. But this you have, that you hate the deeds of the Nicolaitans, which I also hate. He who has an ear, let him hear what the Spirit says to the churches. To him who overcomes I will give to eat from the tree of life, which is in the midst of the Paradise of God."’'
      },
      {
        verse: 'Revelation 2:16-17',
        text: 'Repent, or else I will come to you quickly and will fight against them with the sword of My mouth. He who has an ear, let him hear what the Spirit says to the churches. To him who overcomes I will give some of the hidden manna to eat. And I will give him a white stone, and on the stone a new name written which no one knows except him who receives it.'
      },
      {
        verse: 'Matthew 3:2',
        text: 'and saying, "Repent, for the kingdom of heaven is at hand!"'
      }
    ],
    keyPoints: [
      'Serving God is not the same as loving God',
      'First love must remain alive',
      'True love for Christ is personal',
      'Our priorities reveal our love',
      'Spiritual decline begins when passion fades',
      'The solution is to return',
      'Churches must hear and obey the Spirit',
      'Repentance restores purity and power'
    ],
    keyTakeaways: [
      'Serving God is not the same as loving God',
      'First love must remain alive',
      'True love for Christ is personal',
      'Our priorities reveal our love',
      'Spiritual decline begins when passion fades',
      'The solution is to return',
      'Churches must hear and obey the Spirit',
      'Repentance restores purity and power',
    ],
    sections: [
      {
        id: 'first-love-should-never-die',
        title: 'FIRST LOVE SHOULD NEVER DIE',
        paragraphs: [
          'Revelation 2:1–7',
          'In Revelation 2:1–7, Jesus speaks to the church in Ephesus—a church known for its hard work, perseverance, and commitment to truth. Yet despite their faithful service, the Lord confronted them with a serious issue: they had left their first love.',
          'This passage reminds us that it is possible to be active in ministry while slowly drifting away in intimacy with Christ. Jesus does not only desire our service—He desires our hearts.',
        ],
      },
      {
        id: 'key-message-first-love-should-never-die',
        title: 'KEY MESSAGE: FIRST LOVE SHOULD NEVER DIE',
        paragraphs: [
          'When a person is truly in love, time, sacrifice, distance, and effort do not become burdens. Love naturally expresses itself through devotion and priority.',
          'In the same way, our love for Jesus must remain sincere, personal, and passionate.',
        ],
      },
      {
        id: 'giving-their-service-but-not-themselves',
        title: '1. GIVING THEIR SERVICE BUT NOT THEMSELVES',
        paragraphs: [
          'The church in Ephesus was faithful in deeds and endurance, but they had lost the love they once had for Jesus. They continued serving, but their hearts were no longer fully devoted.',
          '"I know your deeds, your hard work and your perseverance… Yet I hold this against you: You have forsaken the love you had at first." (Revelation 2:2, 4)',
        ],
      },
      {
        id: 'a-deep-and-sincere-love-for-him-personally',
        title: '2. A DEEP AND SINCERE LOVE FOR HIM PERSONALLY',
        paragraphs: [
          'Christianity is not only about doing what is right—it is about loving Jesus personally. God desires a relationship with His people that is genuine and wholehearted.',
        ],
      },
      {
        id: 'sincere-love-for-jesus-should-be-evident-in-our-personal-priorities',
        title: '3. SINCERE LOVE FOR JESUS SHOULD BE EVIDENT IN OUR PERSONAL PRIORITIES',
        paragraphs: [
          'Our love for Christ is reflected in what we prioritize. If Jesus is truly first, it will be evident in our choices, schedules, and desire to seek Him.',
        ],
      },
      {
        id: 'fallen-spiritually',
        title: '4. FALLEN SPIRITUALLY',
        paragraphs: [
          'Spiritual decline often begins quietly. Jesus warned the Ephesian church that they had "fallen" because their passion and devotion had weakened.',
          '"Consider how far you have fallen! Repent and do the things you did at first." (Revelation 2:5)',
        ],
      },
      {
        id: 'taking-time-to-be-with-him',
        title: '5. TAKING TIME TO BE WITH HIM',
        paragraphs: [
          'The solution is not simply to do more—it is to return to Jesus. Our first love is restored when we intentionally spend time with Him and allow our relationship with Him to be renewed.',
        ],
      },
      {
        id: 'conclusion',
        kicker: 'Conclusion',
        title: 'CONCLUSION',
        paragraphs: [
          'How can churches avoid spiritual decline and the resulting judgment of Christ? The letters in Revelation provide clear instruction for every believer and every church.',
          '**First, churches must be willing to hear what the Spirit says**',
          '—listening carefully and responding with obedience to God\'s direct message. The Word of Jesus Christ must remain the church\'s foundation and guide, and it is through His Word that believers are continually renewed. (Revelation 2:5–7)',
          '**Second, churches must continually examine their spiritual condition according to God\'s standards**.',
          'Where compromise is found, there must be correction—especially when worldly thinking or immoral practices are tolerated among God\'s people. (Revelation 2:14–15)',
          '**Finally, spiritual decline can only be stopped and corrected through sincere repentance and a wholehearted return to the original love, truth, purity, and power of Jesus Christ and His Word**.',
          '(Revelation 2:5–7, Matthew 3:2)',
          '**May we not only serve God faithfully, but also love Him deeply—because first love should never die.**',
          '** Serving God is not the same as loving God. We can be active in ministry yet still lose intimacy with Jesus. (Revelation 2:2, 4)',
          '** First love must remain alive. Jesus desires not only our works, but our wholehearted devotion.',
          '** True love for Christ is personal. God wants a deep and sincere relationship, not mere religious routine.',
          '** Our priorities reveal our love. If Jesus is first, it will be evident in how we spend our time, energy, and attention.',
          '** Spiritual decline begins when passion fades. Losing our hunger for God leads to falling spiritually. (Revelation 2:5)',
          '** The solution is to return. Restoration happens when we repent and return to the things we did at first.',
          '** Churches must hear and obey the Spirit. Spiritual renewal begins when we listen to God\'s Word and respond in obedience. (Revelation 2:7)',
          '** Repentance restores purity and power. Decline is reversed through sincere repentance and a return to Christ-centered living. (Matthew 3:2)',
        ],
      },
    ],
    relatedSermons: ['13', '5'],
  },
  {
    id: '15',
    slug: 'promise-to-come',
    title: 'Promise To Come',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2026-02-22',
    duration: '45 min',
    series: 'Covenant',
    seriesDescription: 'Understanding the covenant relationship between God and His people.',
    excerpt: 'First fruit means "a promise to come." It is the first portion that guarantees a greater harvest ahead.',
    description: `**PROMISE TO COME**

Genesis 4:1–7

---

**1. JESUS WAS THE FIRST OF MANY**

Jesus is the First Fruit.

God gave His Son so that He could harvest many sons and daughters. The Father’s heart has always been for a big family. He gave His first so that He could gain many.

In John 3:16, God demonstrated His love by giving His best.

First fruit means “a promise to come.” It is the first portion that guarantees a greater harvest ahead.

Jesus is the firstborn among many.

When we give our first and our best, we reflect the heart of the Father.

How can we give a stingy offering to a generous God? Those who experience grace give generously.

---

**2. FIRST FRUIT IS BUILT INTO NATURE**

First fruit comes before the harvest. It requires faith.

In Genesis 4:1–7, Cain and Abel both brought offerings. But Scripture says, “in the process of time.” When you give and how you give matters.

Abel gave the firstborn of his flock—the best portion.
Cain gave an offering, but not necessarily the first and the best.

First fruit is before you see the full harvest.
Tithing is after you gather the harvest—when you are already blessed.

When you give your first fruit, you invite God into your future.
God stands by His promise and fulfils what He has spoken.

---

**3. WHEN WE HONOR HIM, GOD GIVES US COMPREHENSIVE INSURANCE**

“Honour the Lord with your wealth, with the firstfruits…” (Proverbs 3:9–10)

When we honor Him with our first and our best, He responds with provision.

In Jeremiah 2:3, the first fruits were holy to the Lord. What is holy belongs to God.

When we return the holy portion, God blesses and consecrates the rest.
He stands beside what is given to Him. He protects it.

Like Hannah in 1 Samuel 1:11 and 2:21, when she gave her first son to the Lord, God multiplied her blessing.

First fruit is not only about finances—it includes our plans, our time, and our future.

When we honor Him with our first and our best, He secures what concerns us.

First fruit is a promise to come.`,
    tags: ['First Fruit', 'Promise', 'Offering', 'Faith', 'Honor', 'Harvest', 'Generosity'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptr-jim.jpg',
    scriptures: [
      {
        verse: 'Genesis 4:1-7',
        text: 'Now Adam knew Eve his wife, and she conceived and bore Cain, and said, "I have acquired a man from the Lord." Then she bore again, this time his brother Abel. Now Abel was a keeper of sheep, but Cain was a tiller of the ground. And in the process of time it came to pass that Cain brought an offering of the fruit of the ground to the Lord. Abel also brought of the firstborn of his flock and of their fat. And the Lord respected Abel and his offering, but He did not respect Cain and his offering. And Cain was very angry, and his countenance fell. So the Lord said to Cain, "Why are you angry? And why has your countenance fallen? If you do well, will you not be accepted? And if you do not do well, sin lies at the door. And its desire is for you, but you should rule over it."'
      },
      {
        verse: 'John 3:16',
        text: 'For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.'
      },
      {
        verse: 'Proverbs 3:9-10',
        text: 'Honor the Lord with your possessions, And with the firstfruits of all your increase; So your barns will be filled with plenty, And your vats will overflow with new wine.'
      },
      {
        verse: 'Jeremiah 2:3',
        text: '"Israel was holiness to the Lord, The firstfruits of His increase. All that devour him will offend; Disaster will come upon them," says the Lord.'
      },
      {
        verse: '1 Samuel 1:11',
        text: 'Then she made a vow and said, "O Lord of hosts, if You will indeed look on the affliction of Your maidservant and remember me, and not forget Your maidservant, but will give Your maidservant a male child, then I will give him to the Lord all the days of his life, and no razor shall come upon his head."'
      },
      {
        verse: '1 Samuel 2:21',
        text: 'And the Lord visited Hannah, so that she conceived and bore three sons and two daughters. Meanwhile the child Samuel grew before the Lord.'
      }
    ],
    keyPoints: [
      'Jesus was the first of many',
      'First fruit is built into nature',
      'When we honor Him, God gives us comprehensive insurance',
      'First fruit means "a promise to come"'
    ],
    keyTakeaways: [
      'Jesus was the first of many',
      'First fruit is built into nature',
      'When we honor Him, God gives us comprehensive insurance',
      'First fruit means "a promise to come"',
    ],
    sections: [
      {
        id: 'promise-to-come',
        title: 'PROMISE TO COME',
        paragraphs: [
          'Genesis 4:1–7',
        ],
      },
      {
        id: 'jesus-was-the-first-of-many',
        title: '1. JESUS WAS THE FIRST OF MANY',
        paragraphs: [
          'Jesus is the First Fruit.',
          'God gave His Son so that He could harvest many sons and daughters. The Father\'s heart has always been for a big family. He gave His first so that He could gain many.',
          'In John 3:16, God demonstrated His love by giving His best.',
          'First fruit means "a promise to come." It is the first portion that guarantees a greater harvest ahead.',
          'Jesus is the firstborn among many.',
          'When we give our first and our best, we reflect the heart of the Father.',
          'How can we give a stingy offering to a generous God? Those who experience grace give generously.',
        ],
      },
      {
        id: 'first-fruit-is-built-into-nature',
        title: '2. FIRST FRUIT IS BUILT INTO NATURE',
        paragraphs: [
          'First fruit comes before the harvest. It requires faith.',
          'In Genesis 4:1–7, Cain and Abel both brought offerings. But Scripture says, "in the process of time." When you give and how you give matters.',
          'Abel gave the firstborn of his flock—the best portion.',
          'Cain gave an offering, but not necessarily the first and the best.',
          'First fruit is before you see the full harvest.',
          'Tithing is after you gather the harvest—when you are already blessed.',
          'When you give your first fruit, you invite God into your future.',
          'God stands by His promise and fulfils what He has spoken.',
        ],
      },
      {
        id: 'when-we-honor-him-god-gives-us-comprehensive-insurance',
        title: '3. WHEN WE HONOR HIM, GOD GIVES US COMPREHENSIVE INSURANCE',
        paragraphs: [
          '"Honour the Lord with your wealth, with the firstfruits…" (Proverbs 3:9–10)',
          'When we honor Him with our first and our best, He responds with provision.',
          'In Jeremiah 2:3, the first fruits were holy to the Lord. What is holy belongs to God.',
          'When we return the holy portion, God blesses and consecrates the rest.',
          'He stands beside what is given to Him. He protects it.',
          'Like Hannah in 1 Samuel 1:11 and 2:21, when she gave her first son to the Lord, God multiplied her blessing.',
          'First fruit is not only about finances—it includes our plans, our time, and our future.',
          'When we honor Him with our first and our best, He secures what concerns us.',
          'First fruit is a promise to come.',
        ],
      },
    ],
    relatedSermons: ['14', '2'],
  },
  {
    id: '16',
    slug: 'first-fruit-sunday',
    title: 'First Fruit Sunday',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2026-03-01',
    duration: '45 min',
    series: 'Covenant',
    seriesDescription: 'Understanding the covenant relationship between God and His people.',
    excerpt: 'God has always made us first in His heart. Because He prioritized us even before we were born, we are called to honor Him by putting Him first in every area of our lives.',
    description: `**FIRST FRUIT SUNDAY**

Matthew 6:24

---

**GOD IS FIRST**

From the very beginning, God established order — He is first.
Jeremiah 1:5 reminds us: "Before I formed you in the womb I knew you, before you were born I set you apart…"
Before we ever thought about God, He was already thinking about us. We were in His heart and mind. If we were not, Christ would not have gone to the cross for us. Because God made us a priority, He deserves to be our priority.
If God made us first in His heart, then He deserves to be first in our lives.

---

**YOU CANNOT SERVE TWO MASTERS**

In Matthew 6:24, Jesus makes it clear — we cannot divide our loyalty. We cannot serve both God and money.
We may say that God is first, but our actions reveal our true priorities. If He is not first in our finances, then He is not truly first. Lordship is demonstrated, not declared.
The principle of first fruits is about putting God first in every area — especially in our giving.

---

**THE PRINCIPLE OF FIRST FRUITS**

Proverbs 3:9–10 says: "Honor the Lord with your wealth, with the firstfruits of all your crops; then your barns will be filled to overflowing…"
When we give our first fruits:
* We honor God.
* We acknowledge that everything comes from Him.
* We demonstrate obedience and trust.
This principle is not about the result — it is about obedience. The blessing is a byproduct; obedience is the priority.
When you give your first fruit to God, He stands on it. He stands guard over what you entrust to Him.

---

**FROM PROMISE TO PROVISION**

God does not just give promises — He brings provision.
In Genesis 12:2, God promised Abraham that he would be blessed and become a blessing. The first fruit is the beginning of many more blessings to come. It is the first of what God will multiply.
Jeremiah 2:3 describes Israel as holy to the Lord, the firstfruits of His harvest — set apart and protected. When we give our first to God, we position ourselves under His covering and care.
God is bound to His Word. When we honor Him according to His principles, He responds according to His promises.

---

**SUPERNATURAL BLESSING**

First fruit giving opens the door for supernatural blessing — not merely financial increase, but divine provision, protection, and favor.
God desires to take us from promise to provision.
And often, a testimony of what God has done in someone’s life speaks louder than a thousand sermons. What God has done for us is living proof of His faithfulness.

---

**CLOSING CHARGE**

Honor God with your wealth.
Put Him first — not just in words, but in action. When God is first, everything else finds its proper place.


**KEY POINTS**

** God made us first** — He deserves our first.We were in His heart before we were born (Jeremiah 1:5), so He must be first in our lives.
** You cannot serve two masters**. Matthew 6:24 reminds us that our actions — especially in our finances — reveal who truly rules our hearts.
** First fruits is about obedience, not results**.We give to honor God, not to chase blessing. Obedience comes first; blessing follows (Proverbs 3:9–10).
** God moves us from promise to provision**.What begins with faith and surrender leads to divine multiplication and covering (Genesis 12:2).
** When God is first, everything finds its proper place**.Alignment brings provision, protection, and supernatural favor.
`,
    tags: ['First Fruits', 'Giving', 'Obedience', 'Provision', 'Blessing', 'Trust'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptr-jim.jpg',
    scriptures: [
      {
        verse: 'Matthew 6:24',
        text: 'No one can serve two masters; for either he will hate the one and love the other, or else he will be loyal to the one and despise the other. You cannot serve God and mammon.'
      },
      {
        verse: 'Jeremiah 1:5',
        text: 'Before I formed you in the womb I knew you; Before you were born I sanctified you; I ordained you a prophet to the nations.'
      },
      {
        verse: 'Proverbs 3:9-10',
        text: 'Honor the Lord with your possessions, And with the firstfruits of all your increase; So your barns will be filled with plenty, And your vats will overflow with new wine.'
      },
      {
        verse: 'Genesis 12:2',
        text: 'I will make you a great nation; I will bless you And make your name great; And you shall be a blessing.'
      },
      {
        verse: 'Jeremiah 2:3',
        text: '"Israel was holiness to the Lord, The firstfruits of His increase. All that devour him will offend; Disaster will come upon them," says the Lord.'
      }
    ],
    isFeatured: false,
    keyPoints: [
      'God made us first — He deserves our first',
      'You cannot serve two masters',
      'First fruits is about obedience, not results',
      'God moves us from promise to provision',
      'When God is first, everything finds its proper place'
    ],
    keyTakeaways: [
      'God made us first — He deserves our first',
      'You cannot serve two masters',
      'First fruits is about obedience, not results',
      'God moves us from promise to provision',
      'When God is first, everything finds its proper place',
    ],
    sections: [
      {
        id: 'first-fruit-sunday',
        title: 'FIRST FRUIT SUNDAY',
        paragraphs: [
          'Matthew 6:24',
        ],
      },
      {
        id: 'god-is-first',
        title: 'GOD IS FIRST',
        paragraphs: [
          'From the very beginning, God established order — He is first.',
          'Jeremiah 1:5 reminds us: "Before I formed you in the womb I knew you, before you were born I set you apart…"',
          'Before we ever thought about God, He was already thinking about us. We were in His heart and mind. If we were not, Christ would not have gone to the cross for us. Because God made us a priority, He deserves to be our priority.',
          'If God made us first in His heart, then He deserves to be first in our lives.',
        ],
      },
      {
        id: 'you-cannot-serve-two-masters',
        title: 'YOU CANNOT SERVE TWO MASTERS',
        paragraphs: [
          'In Matthew 6:24, Jesus makes it clear — we cannot divide our loyalty. We cannot serve both God and money.',
          'We may say that God is first, but our actions reveal our true priorities. If He is not first in our finances, then He is not truly first. Lordship is demonstrated, not declared.',
          'The principle of first fruits is about putting God first in every area — especially in our giving.',
        ],
      },
      {
        id: 'the-principle-of-first-fruits',
        title: 'THE PRINCIPLE OF FIRST FRUITS',
        paragraphs: [
          'Proverbs 3:9–10 says: "Honor the Lord with your wealth, with the firstfruits of all your crops; then your barns will be filled to overflowing…"',
          'When we give our first fruits:',
          '- We honor God.',
          '- We acknowledge that everything comes from Him.',
          '- We demonstrate obedience and trust.',
          'This principle is not about the result — it is about obedience. The blessing is a byproduct; obedience is the priority.',
          'When you give your first fruit to God, He stands on it. He stands guard over what you entrust to Him.',
        ],
      },
      {
        id: 'from-promise-to-provision',
        title: 'FROM PROMISE TO PROVISION',
        paragraphs: [
          'God does not just give promises — He brings provision.',
          'In Genesis 12:2, God promised Abraham that he would be blessed and become a blessing. The first fruit is the beginning of many more blessings to come. It is the first of what God will multiply.',
          'Jeremiah 2:3 describes Israel as holy to the Lord, the firstfruits of His harvest — set apart and protected. When we give our first to God, we position ourselves under His covering and care.',
          'God is bound to His Word. When we honor Him according to His principles, He responds according to His promises.',
        ],
      },
      {
        id: 'supernatural-blessing',
        title: 'SUPERNATURAL BLESSING',
        paragraphs: [
          'First fruit giving opens the door for supernatural blessing — not merely financial increase, but divine provision, protection, and favor.',
          'God desires to take us from promise to provision.',
          'And often, a testimony of what God has done in someone\'s life speaks louder than a thousand sermons. What God has done for us is living proof of His faithfulness.',
        ],
      },
      {
        id: 'closing-charge',
        title: 'CLOSING CHARGE',
        paragraphs: [
          'Honor God with your wealth.',
          'Put Him first — not just in words, but in action. When God is first, everything else finds its proper place.',
        ],
      },
      {
        id: 'key-points',
        title: 'KEY POINTS',
        paragraphs: [
          '** God made us first** — He deserves our first.We were in His heart before we were born (Jeremiah 1:5), so He must be first in our lives.',
          '** You cannot serve two masters**. Matthew 6:24 reminds us that our actions — especially in our finances — reveal who truly rules our hearts.',
          '** First fruits is about obedience, not results**.We give to honor God, not to chase blessing. Obedience comes first; blessing follows (Proverbs 3:9–10).',
          '** God moves us from promise to provision**.What begins with faith and surrender leads to divine multiplication and covering (Genesis 12:2).',
          '** When God is first, everything finds its proper place**.Alignment brings provision, protection, and supernatural favor.',
        ],
      },
    ],
    relatedSermons: ['15', '12'],
  },
  {
    id: '17',
    slug: 'filled-with-god',
    title: 'Filled with God',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2026-03-08',
    duration: '45 min',
    series: 'Covenant',
    isFeatured: false,
    seriesDescription: 'Understanding the covenant relationship between God and His people.',
    excerpt: 'God’s intention for His people has always been abundance, not fear or scarcity. Yet in Judges 6, the Israelites were living in fear and oppression because they had turned away from God and relied on their own strength.',
    description: `**FILLED WITH GOD**

Judges 6:15–16

God’s intention for His people has always been abundance, not fear or scarcity. Yet in Judges 6, the Israelites were living in fear and oppression because they had turned away from God and relied on their own strength.
Judges 6:1 shows that their situation was the result of disobedience. Because of this, the Midianites repeatedly invaded their land, destroyed their crops, and left the people of Israel in poverty and fear.
But even in their broken condition, God raised a deliverer—Gideon.
This story reminds us that God often calls people who feel weak, unqualified, and limited. Yet our limitations cannot prevent God from fulfilling His purpose.
As Jesus said in John 10:10:
"The thief comes only to steal and kill and destroy; I have come that they may have life, and have it to the full."
God’s desire is for His people to live in abundance and freedom, not in fear and scarcity.

---

**THE LIFE OF GIDEON**

When God called Gideon, he struggled to believe that he could be used. Gideon believed that his own limitations would prevent God from working through him.
He saw himself as the weakest in his family and from the least significant clan. His focus was on his natural circumstances rather than on God’s promise.
Because Gideon focused on what he lacked, his vision became limited. Yet God saw something greater in him.
God does not call us based on our ability — He calls us based on His purpose.

---

**WHAT WE CAN LEARN FROM GIDEON**

**1. God Calls in the Middle of Our Obedience**
Gideon was faithfully working when God appeared to him.
God often calls people who are already being faithful in small things. When we can be trusted with little, God entrusts us with more.
Faithfulness opens the door for greater responsibility.

**2. Our Limitations Cannot Prevent God**
Gideon believed his weaknesses disqualified him. But God responded with a powerful promise:
"I will be with you."
When God calls you, He also qualifies you and supplies everything you need.
In spite of our weaknesses and failures, God can still use us for His purpose.

**3. God Can Do Powerful Things Through Dedicated People**
In Judges 7:3–7, God reduced Gideon’s army from thousands to only 300 men.
This showed that victory would not depend on numbers but on God.
As Zechariah 4:6 reminds us:
"Not by might nor by power, but by my Spirit," says the Lord.
Dedication and spiritual awareness are more important to God than numbers or human strength.

---

**GIDEON’S LIMITED VISION AND HIS OBJECTIONS**

Gideon struggled with fear and doubt because his vision was limited by what he could see in the natural. Instead of focusing on God’s power and promise, he focused on his own weaknesses and circumstances.
Because of this limited perspective, Gideon raised several objections when God called him.

**1. Gideon’s feelings of responsibility for his family’s welfare**
Gideon was concerned about the safety and well-being of his family. Yet when God calls you, He also qualifies you and supplies everything you need.

**2. Doubts about the call itself**
Gideon doubted whether he was truly the one God had chosen. But God has a habit of calling people in their worst situations. He calls the desperate, and He is the one who qualifies them.

**3. Feelings of inadequacy for the task**
Gideon felt incapable of fulfilling the assignment. Yet when he chose to obey, he responded with resourcefulness, moved with speed, and acted with enthusiasm.

---

**GIDEON’S RESPONSE AND GOD’S STRATEGY**

Despite his fears and doubts, Gideon chose to obey God. His obedience opened the door for God to move in a powerful and unexpected way.
In Judges 7:1–7, God reduced Gideon’s army so that the victory would clearly belong to Him and not to human strength.
In Judges 7:15–19, God gave Gideon an unusual strategy. Instead of traditional weapons, the men carried jars, trumpets, and torches.
These items symbolized powerful truths:
* Trumpets – proclaiming and declaring God’s victory
* Torches – the light of God shining in darkness
* Jars – vessels that carried the light
Through faith and obedience, Gideon and his small army witnessed God bring victory in a miraculous way.

---

**LIVING A LIFE FILLED WITH GOD**

When we are filled with God, fear no longer controls us and our limitations no longer define us.
God’s intention for us is abundant life. He does not want us to live in fear or limit ourselves because of our circumstances.
If we allow fear to limit us, we may miss the opportunity to bless others. But when we trust God, He can use us far beyond what we imagine.
In the eyes of faith, we can believe that God is working even when we cannot see it — chains being broken, curses being stopped, angels being sent on assignments, and God intervening in our families.
Scripture reminds us in Hebrews 11, often called the Hall of Faith, that God works through people who trust Him.
God often calls things as they are not, even though they may seem impossible.

---

**CLOSING ENCOURAGEMENT**

God’s plan for His people is abundant life.
Do not allow your limitations, fears, or doubts to stop you from responding to God’s call. Just like Gideon, God can use ordinary people to accomplish extraordinary things.
When we dedicate ourselves to Him and walk in obedience, God will move in ways beyond our understanding.
When we are filled with God, our lives become vessels through which His power, light, and victory are revealed.

**Key Takeaways**
* God’s desire for us is abundant life.He calls us to live in freedom, not in fear or scarcity (John 10:10).
* Our limitations cannot prevent God from using us.Even when we feel weak or unqualified, God’s power is greater than our weaknesses.
* God often calls us in difficult seasons.Like Gideon, we may be called when we feel least prepared, but God equips those He calls.
* Dedication matters more than numbers.Victory does not come from human strength but from God’s Spirit (Zechariah 4:6).
* Obedience allows God to work through us.When we trust God and step forward in faith, He can accomplish extraordinary things through ordinary people.`,

    tags: ['Abundance', 'Faith', 'Obedience', 'Gideon', 'Limitations', 'Victory'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptr-jim.jpg',
    scriptures: [
      {
        verse: 'Judges 6:15-16',
        text: 'So he said to Him, “O my Lord, how can I save Israel? Indeed my clan is the weakest in Manasseh, and I am the least in my father’s house.” And the Lord said to him, “Surely I will be with you, and you shall defeat the Midianites as one man.”'
      },
      {
        verse: 'Judges 6:1',
        text: 'Then the children of Israel did evil in the sight of the Lord. So the Lord delivered them into the hand of Midian for seven years,'
      },
      {
        verse: 'John 10:10',
        text: 'The thief does not come except to steal, and to kill, and to destroy. I have come that they may have life, and that they may have it more abundantly.'
      },
      {
        verse: 'Judges 7:3-7',
        text: 'Now therefore, proclaim in the hearing of the people, saying, ‘Whoever is fearful and afraid, let him turn and depart at once from Mount Gilead.’ ” And twenty-two thousand of the people returned, and ten thousand remained. But the Lord said to Gideon, “The people are still too many; bring them down to the water, and I will test them for you there. Then it will be, that of whom I say to you, ‘This one shall go with you,’ the same shall go with you; and of whomever I say to you, ‘This one shall not go with you,’ the same shall not go.” So he brought the people down to the water. And the Lord said to Gideon, “Everyone who laps from the water with his tongue, as a dog laps, you shall set apart by himself; likewise everyone who gets down on his knees to drink.” And the number of those who lapped, putting their hand to their mouth, was three hundred men; but all the rest of the people got down on their knees to drink water. Then the Lord said to Gideon, “By the three hundred men who lapped I will save you, and deliver the Midianites into your hand. Let all the other people go, every man to his place.”'
      },
      {
        verse: 'Zechariah 4:6',
        text: 'So he answered and said to me: “This is the word of the Lord to Zerubbabel: ‘Not by might nor by power, but by My Spirit,’ Says the Lord of hosts."'
      },
      {
        verse: 'Judges 7:1-7',
        text: 'Then Jerubbaal (that is, Gideon) and all the people who were with him rose early and encamped beside the well of Harod, so that the camp of the Midianites was on the north side of them by the hill of Moreh in the valley. And the Lord said to Gideon, “The people who are with you are too many for Me to give the Midianites into their hands, lest Israel claim glory for itself against Me, saying, ‘My own hand has saved me.’ ” Now therefore, proclaim in the hearing of the people, saying, ‘Whoever is fearful and afraid, let him turn and depart at once from Mount Gilead.’ ” And twenty-two thousand of the people returned, and ten thousand remained. But the Lord said to Gideon, “The people are still too many; bring them down to the water, and I will test them for you there. Then it will be, that of whom I say to you, ‘This one shall go with you,’ the same shall go with you; and of whomever I say to you, ‘This one shall not go with you,’ the same shall not go.” So he brought the people down to the water. And the Lord said to Gideon, “Everyone who laps from the water with his tongue, as a dog laps, you shall set apart by himself; likewise everyone who gets down on his knees to drink.” And the number of those who lapped, putting their hand to their mouth, was three hundred men; but all the rest of the people got down on their knees to drink water. Then the Lord said to Gideon, “By the three hundred men who lapped I will save you, and deliver the Midianites into your hand. Let all the other people go, every man to his place.”'
      },
      {
        verse: 'Judges 7:15-19',
        text: 'And so it was, when Gideon heard the telling of the dream and its interpretation, that he worshiped. He returned to the camp of Israel, and said, “Arise, for the Lord has delivered the camp of Midian into your hand.” Then he divided the three hundred men into three companies, and he put a trumpet into every man’s hand, with empty pitchers, and torches inside the pitchers. And he said to them, “Look at me and do likewise; watch, and when I come to the edge of the camp you shall do as I do: When I blow the trumpet, I and all who are with me, then you also blow the trumpets on every side of the whole camp, and say, ‘The sword of the Lord and of Gideon!’” So Gideon and the hundred men who were with him came to the outpost of the camp at the beginning of the middle watch, just as they had posted the watch; and they blew the trumpets and broke the pitchers that were in their hands.'
      }
    ],
    keyPoints: [
      'God’s desire for us is abundant life',
      'Our limitations cannot prevent God from using us',
      'God often calls us in difficult seasons',
      'Dedication matters more than numbers',
      'Obedience allows God to work through us'
    ],
    keyTakeaways: [
      'God\u2019s desire for us is abundant life',
      'Our limitations cannot prevent God from using us',
      'God often calls us in difficult seasons',
      'Dedication matters more than numbers',
      'Obedience allows God to work through us',
    ],
    sections: [
      {
        id: 'filled-with-god',
        title: 'FILLED WITH GOD',
        paragraphs: [
          'Judges 6:15–16',
          'God\u2019s intention for His people has always been abundance, not fear or scarcity. Yet in Judges 6, the Israelites were living in fear and oppression because they had turned away from God and relied on their own strength.',
          'Judges 6:1 shows that their situation was the result of disobedience. Because of this, the Midianites repeatedly invaded their land, destroyed their crops, and left the people of Israel in poverty and fear.',
          'But even in their broken condition, God raised a deliverer—Gideon.',
          'This story reminds us that God often calls people who feel weak, unqualified, and limited. Yet our limitations cannot prevent God from fulfilling His purpose.',
          'As Jesus said in John 10:10:',
          '"The thief comes only to steal and kill and destroy; I have come that they may have life, and have it to the full."',
          'God\u2019s desire is for His people to live in abundance and freedom, not in fear and scarcity.',
        ],
      },
      {
        id: 'the-life-of-gideon',
        title: 'THE LIFE OF GIDEON',
        paragraphs: [
          'When God called Gideon, he struggled to believe that he could be used. Gideon believed that his own limitations would prevent God from working through him.',
          'He saw himself as the weakest in his family and from the least significant clan. His focus was on his natural circumstances rather than on God\u2019s promise.',
          'Because Gideon focused on what he lacked, his vision became limited. Yet God saw something greater in him.',
          'God does not call us based on our ability — He calls us based on His purpose.',
        ],
      },
      {
        id: 'what-we-can-learn-from-gideon',
        title: 'WHAT WE CAN LEARN FROM GIDEON',
        paragraphs: [
          '**1. God Calls in the Middle of Our Obedience**',
          'Gideon was faithfully working when God appeared to him.',
          'God often calls people who are already being faithful in small things. When we can be trusted with little, God entrusts us with more.',
          'Faithfulness opens the door for greater responsibility.',
          '**2. Our Limitations Cannot Prevent God**',
          'Gideon believed his weaknesses disqualified him. But God responded with a powerful promise:',
          '"I will be with you."',
          'When God calls you, He also qualifies you and supplies everything you need.',
          'In spite of our weaknesses and failures, God can still use us for His purpose.',
          '**3. God Can Do Powerful Things Through Dedicated People**',
          'In Judges 7:3–7, God reduced Gideon\u2019s army from thousands to only 300 men.',
          'This showed that victory would not depend on numbers but on God.',
          'As Zechariah 4:6 reminds us:',
          '"Not by might nor by power, but by my Spirit," says the Lord.',
          'Dedication and spiritual awareness are more important to God than numbers or human strength.',
        ],
      },
      {
        id: 'gideons-limited-vision-and-his-objections',
        title: 'GIDEON\u2019S LIMITED VISION AND HIS OBJECTIONS',
        paragraphs: [
          'Gideon struggled with fear and doubt because his vision was limited by what he could see in the natural. Instead of focusing on God\u2019s power and promise, he focused on his own weaknesses and circumstances.',
          'Because of this limited perspective, Gideon raised several objections when God called him.',
          '**1. Gideon\u2019s feelings of responsibility for his family\u2019s welfare**',
          'Gideon was concerned about the safety and well-being of his family. Yet when God calls you, He also qualifies you and supplies everything you need.',
          '**2. Doubts about the call itself**',
          'Gideon doubted whether he was truly the one God had chosen. But God has a habit of calling people in their worst situations. He calls the desperate, and He is the one who qualifies them.',
          '**3. Feelings of inadequacy for the task**',
          'Gideon felt incapable of fulfilling the assignment. Yet when he chose to obey, he responded with resourcefulness, moved with speed, and acted with enthusiasm.',
        ],
      },
      {
        id: 'gideons-response-and-gods-strategy',
        title: 'GIDEON\u2019S RESPONSE AND GOD\u2019S STRATEGY',
        paragraphs: [
          'Despite his fears and doubts, Gideon chose to obey God. His obedience opened the door for God to move in a powerful and unexpected way.',
          'In Judges 7:1–7, God reduced Gideon\u2019s army so that the victory would clearly belong to Him and not to human strength.',
          'In Judges 7:15–19, God gave Gideon an unusual strategy. Instead of traditional weapons, the men carried jars, trumpets, and torches.',
          'These items symbolized powerful truths:',
          '- Trumpets – proclaiming and declaring God\u2019s victory',
          '- Torches – the light of God shining in darkness',
          '- Jars – vessels that carried the light',
          'Through faith and obedience, Gideon and his small army witnessed God bring victory in a miraculous way.',
        ],
      },
      {
        id: 'living-a-life-filled-with-god',
        title: 'LIVING A LIFE FILLED WITH GOD',
        paragraphs: [
          'When we are filled with God, fear no longer controls us and our limitations no longer define us.',
          'God\u2019s intention for us is abundant life. He does not want us to live in fear or limit ourselves because of our circumstances.',
          'If we allow fear to limit us, we may miss the opportunity to bless others. But when we trust God, He can use us far beyond what we imagine.',
          'In the eyes of faith, we can believe that God is working even when we cannot see it — chains being broken, curses being stopped, angels being sent on assignments, and God intervening in our families.',
          'Scripture reminds us in Hebrews 11, often called the Hall of Faith, that God works through people who trust Him.',
          'God often calls things as they are not, even though they may seem impossible.',
        ],
      },
      {
        id: 'closing-encouragement',
        title: 'CLOSING ENCOURAGEMENT',
        paragraphs: [
          'God\u2019s plan for His people is abundant life.',
          'Do not allow your limitations, fears, or doubts to stop you from responding to God\u2019s call. Just like Gideon, God can use ordinary people to accomplish extraordinary things.',
          'When we dedicate ourselves to Him and walk in obedience, God will move in ways beyond our understanding.',
          'When we are filled with God, our lives become vessels through which His power, light, and victory are revealed.',
        ],
      },
      {
        id: 'key-takeaways',
        title: 'Key Takeaways',
        paragraphs: [
          '- God\u2019s desire for us is abundant life.He calls us to live in freedom, not in fear or scarcity (John 10:10).',
          '- Our limitations cannot prevent God from using us.Even when we feel weak or unqualified, God\u2019s power is greater than our weaknesses.',
          '- God often calls us in difficult seasons.Like Gideon, we may be called when we feel least prepared, but God equips those He calls.',
          '- Dedication matters more than numbers.Victory does not come from human strength but from God\u2019s Spirit (Zechariah 4:6).',
          '- Obedience allows God to work through us.When we trust God and step forward in faith, He can accomplish extraordinary things through ordinary people.',
        ],
      },
    ],
    relatedSermons: ['16', '12'],
  },
  {
    id: '18',
    slug: 'power-for-service',
    title: 'Power for Service',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2026-03-15',
    duration: '45 min',
    series: 'Covenant',
    isFeatured: false,
    seriesDescription: 'Understanding the covenant relationship between God and His people.',
    excerpt: 'The coming of the Holy Spirit was God’s empowerment for believers to serve and witness.',
    description: `**POWER FOR SERVICE**

Key Verse: Acts 2:1-4

The coming of the Holy Spirit was God’s empowerment for believers to serve and witness.
The Holy Spirit is a Person and part of the Trinity (Father, Son, and Holy Spirit).

God sent the Holy Spirit for a purpose: to empower His people for service.
Jesus died during the Passover. He is the true Lamb of God. After three days, He rose from the dead and remained on earth for forty days before ascending into heaven.
During that time, many people saw the risen Jesus. At one point, more than 500 people witnessed Him alive (1 Corinthians 15:6). Yet when the disciples gathered to wait for the promise of the Holy Spirit, about 120 believers were present in the upper room (Acts 1:15).

---

**Why the Holy Spirit Was Poured Out**
The pouring out of the Holy Spirit is connected to harvest.
The word Pentecost means “fifty.” It refers to the fiftieth day after Passover. In the Old Testament, Pentecost was known as the Feast of Weeks (Exodus 34:22).
This feast took place fifty days after Passover (Leviticus 23:15–16). While it celebrated the physical harvest of crops, it also points to a spiritual harvest.
Jesus spoke about this when He said:
“The harvest is plentiful, but the workers are few.” — Luke 10:2
The pouring out of the Holy Spirit prepares believers to become harvesters in God’s field.

---

**Speaking in Tongues at Pentecost**
On the day of Pentecost, the disciples were filled with the Holy Spirit and began to speak in other tongues (Acts 2:4).
People from different nations heard the message in their own languages. This showed that the gospel was meant for all nations, and that the Holy Spirit empowers believers to share the good news with the world.

---

**The Change in Peter**
Before Pentecost, Peter struggled with fear and weakness. When questioned about his association with Jesus, he denied Him (Luke 22:57).
The anointing he experienced before was temporary and did not last long. Peter even denied Jesus to a group of people and to a servant girl.
But on the day of Pentecost, everything changed. Peter was now connected to the source of power.
With boldness, he preached the gospel and called people to repentance (Acts 2:38).

---

**The Purpose of the Holy Spirit**
The Holy Spirit came to enable believers to serve and witness.
Jesus declared this mission when He read from the prophet Isaiah:
“The Spirit of the Lord is upon Me, because He has anointed Me to preach good news to the poor.” — Luke 4:18–19
In the same way, the Holy Spirit empowers believers today to preach the gospel, serve others, and participate in God’s work.

---

**Pentecost and the Harvest**
Pentecost is a celebration of the feast of harvest.
God poured out the Holy Spirit to prepare His people for the harvest. Through the power of the Spirit, believers are equipped to proclaim the good news and bring people into the kingdom of God.

---

**Three Themes Linked to the Spirit in the Old and New Testaments**
After understanding that Pentecost celebrates the feast of harvest, we see a consistent biblical pattern in how the Holy Spirit works. Throughout both the Old Testament and the New Testament, three themes appear whenever the Spirit is given: transfer of the Spirit for service, signs confirming God’s call, and ability from the Spirit.
These themes reveal that the Spirit of God empowers His people to carry out His mission.

**Theme 1: Transfer of the Spirit (for the work of serving)**
In Scripture, the Spirit is often transferred or given to individuals so they can serve God and lead His people.

**Old Testament**
* The Spirit was transferred from Moses to the seventy elders (Num. 11:10–30).
* The Spirit was transferred from Moses to Joshua (Num. 27:16–20; Deut. 34:9).
* The Spirit was transferred from Saul to David (1 Sam. 10:10; 16:13–14).
* The Spirit was transferred from Elijah to Elisha (2 Kings 2:8–9; 14–15).

**New Testament**
* The Spirit anointed Jesus to preach the good news, release the captives, heal, and set people free (Isa. 11:2; 42:1; Luke 4:18–19). At Pentecost, the Spirit was transferred from Jesus to His disciples.
* The Spirit was transferred from Jesus, through Peter and John, to Samaritan disciples (Acts 8:17).
* The Spirit was transferred from Jesus, through Ananias, to Saul (Acts 9:17).
* The Spirit was transferred from Jesus to Cornelius and other Gentiles (Acts 10:44–46).
* The Spirit was transferred from Jesus, through Paul, to Ephesian believers (Acts 19:6).

**Theme 2: Sign to Confirm the Spirit’s Presence and God’s Call to Serve**
When the Spirit comes upon people, Scripture often records signs that confirm God’s presence and His calling.

**Old Testament**
* The Spirit enabled the seventy elders to help bear the burden of the people (Num. 11:17).
* A sign is not recorded, but the people knew Joshua had been filled with the spirit of wisdom, so they listened to him (Deut. 34:9).
* When the Spirit came upon Saul, he prophesied (1 Sam. 10:1–6; 9–10). David also prophesied (2 Sam. 23:1–2).
* Elisha was able to part the Jordan River as Elijah had done (2 Kings 2:8, 14).

**New Testament**
* Luke records the sign of the dove coming upon Jesus (Luke 3:22). The 120 disciples spoke in tongues when the Spirit came upon them for service (Acts 2:4).
* Something happened that convinced Simon to offer money for the ability to impart the Spirit (Acts 8:18–19).
* Saul’s eyes were healed (Acts 9:18; see 1 Cor. 14:18).
* Cornelius and those with him spoke in tongues (Acts 10:44–46).
* The Ephesian believers spoke in tongues and prophesied (Acts 19:6).

**Theme 3: Ability from the Spirit**
The Holy Spirit not only comes with signs but also gives people the ability and power to serve God effectively.

**Old Testament**
* The seventy elders prophesied (Num. 11:25).
* The Spirit filled Joshua with wisdom to lead (Deut. 34:9).
* The Spirit changed Saul into a different person, making him fit to lead (1 Sam. 10:6). The Spirit also gave David power to lead (1 Sam. 16:13).
* The Spirit gave Elijah and Elisha power to prophesy and perform signs and wonders.

**New Testament**
* The Spirit gave the disciples the ability or power to witness for Jesus (Acts 1:8).
* The Spirit gave Samaritan believers the power to do their part in spreading the good news of Jesus.
* The Spirit equipped Saul to carry the Lord’s name to Gentiles and their kings (Acts 9:15).
* The Spirit enabled Gentile believers to be witnesses for Jesus.
* The Spirit gave the Ephesian believers power to witness for Jesus.


** KEY POINTS **
1. The Holy Spirit empowers believers for service.The Holy Spirit was sent to equip believers with power to serve God and participate in His mission (Acts 2:1–4).

2. Pentecost marks the beginning of a spiritual harvest.Just as the Feast of Weeks celebrated the harvest of crops, the outpouring of the Holy Spirit prepared believers to gather people into God’s kingdom (Luke 10:2).

3. The Holy Spirit connects believers to the true source of power.Before Pentecost, Peter was afraid and denied Jesus. After receiving the Holy Spirit, he boldly preached the gospel (Luke 22:57; Acts 2:38).

4. The gospel is for all people.When the disciples spoke in different languages at Pentecost, people from many nations heard the message. This shows that the good news of Jesus is for everyone (Acts 2:4).

5. The Holy Spirit enables believers to be witnesses.Just as the Spirit empowered Jesus to proclaim good news and serve others, the Spirit now empowers believers to continue that mission (Luke 4:18–19).
`,
    tags: ['Holy Spirit', 'Pentecost', 'Service', 'Empowerment', 'Harvest', 'Witness'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/sermon/power_for_service.jpg',
    scriptures: [
      {
        verse: 'Acts 2:1-4',
        text: 'When the Day of Pentecost had fully come, they were all with one accord in one place. And suddenly there came a sound from heaven, as of a rushing mighty wind, and it filled the whole house where they were sitting. Then there appeared to them divided tongues, as of fire, and one sat upon each of them. And they were all filled with the Holy Spirit and began to speak with other tongues, as the Spirit gave them utterance.'
      },
      {
        verse: '1 Corinthians 15:6',
        text: 'After that He was seen by over five hundred brethren at once, of whom the greater part remain to the present, but some have fallen asleep.'
      },
      {
        verse: 'Acts 1:15',
        text: 'And in those days Peter stood up in the midst of the disciples (altogether the number of names was about a hundred and twenty), and said,'
      },
      {
        verse: 'Exodus 34:22',
        text: 'And you shall observe the Feast of Weeks, of the firstfruits of wheat harvest, and the Feast of Ingathering at the year’s end.'
      },
      {
        verse: 'Leviticus 23:15-16',
        text: 'And you shall count for yourselves from the day after the Sabbath, from the day that you brought the sheaf of the wave offering: seven Sabbaths shall be completed. Count fifty days to the day after the seventh Sabbath; then you shall offer a new grain offering to the Lord.'
      },
      {
        verse: 'Luke 10:2',
        text: 'Then He said to them, “The harvest truly is great, but the laborers are few; therefore pray the Lord of the harvest to send out laborers into His harvest.”'
      },
      {
        verse: 'Luke 22:57',
        text: 'But he denied Him, saying, “Woman, I do not know Him.”'
      },
      {
        verse: 'Acts 2:38',
        text: 'Then Peter said to them, “Repent, and let every one of you be baptized in the name of Jesus Christ for the remission of sins; and you shall receive the gift of the Holy Spirit.”'
      },
      {
        verse: 'Luke 4:18-19',
        text: '“The Spirit of the Lord is upon Me, Because He has anointed Me To preach the gospel to the poor; He has sent Me to heal the brokenhearted, To proclaim liberty to the captives And recovery of sight to the blind, To set at liberty those who are oppressed; To proclaim the acceptable year of the Lord.”'
      }
    ],
    keyPoints: [
      'The Holy Spirit empowers believers for service.',
      'Pentecost marks the beginning of a spiritual harvest.',
      'The Holy Spirit connects believers to the true source of power.',
      'The gospel is for all people.',
      'The Holy Spirit enables believers to be witnesses.'
    ],
    keyTakeaways: [
      'The Holy Spirit empowers believers for service.',
      'Pentecost marks the beginning of a spiritual harvest.',
      'The Holy Spirit connects believers to the true source of power.',
      'The gospel is for all people.',
      'The Holy Spirit enables believers to be witnesses.',
    ],
    sections: [
      {
        id: 'power-for-service',
        title: 'POWER FOR SERVICE',
        paragraphs: [
          'Key Verse: Acts 2:1-4',
          'The coming of the Holy Spirit was God\u2019s empowerment for believers to serve and witness.',
          'The Holy Spirit is a Person and part of the Trinity (Father, Son, and Holy Spirit).',
          'God sent the Holy Spirit for a purpose: to empower His people for service.',
          'Jesus died during the Passover. He is the true Lamb of God. After three days, He rose from the dead and remained on earth for forty days before ascending into heaven.',
          'During that time, many people saw the risen Jesus. At one point, more than 500 people witnessed Him alive (1 Corinthians 15:6). Yet when the disciples gathered to wait for the promise of the Holy Spirit, about 120 believers were present in the upper room (Acts 1:15).',
        ],
      },
      {
        id: 'why-the-holy-spirit-was-poured-out',
        title: 'Why the Holy Spirit Was Poured Out',
        paragraphs: [
          'The pouring out of the Holy Spirit is connected to harvest.',
          'The word Pentecost means "fifty." It refers to the fiftieth day after Passover. In the Old Testament, Pentecost was known as the Feast of Weeks (Exodus 34:22).',
          'This feast took place fifty days after Passover (Leviticus 23:15–16). While it celebrated the physical harvest of crops, it also points to a spiritual harvest.',
          'Jesus spoke about this when He said:',
          '"The harvest is plentiful, but the workers are few." — Luke 10:2',
          'The pouring out of the Holy Spirit prepares believers to become harvesters in God\u2019s field.',
        ],
      },
      {
        id: 'speaking-in-tongues-at-pentecost',
        title: 'Speaking in Tongues at Pentecost',
        paragraphs: [
          'On the day of Pentecost, the disciples were filled with the Holy Spirit and began to speak in other tongues (Acts 2:4).',
          'People from different nations heard the message in their own languages. This showed that the gospel was meant for all nations, and that the Holy Spirit empowers believers to share the good news with the world.',
        ],
      },
      {
        id: 'the-change-in-peter',
        title: 'The Change in Peter',
        paragraphs: [
          'Before Pentecost, Peter struggled with fear and weakness. When questioned about his association with Jesus, he denied Him (Luke 22:57).',
          'The anointing he experienced before was temporary and did not last long. Peter even denied Jesus to a group of people and to a servant girl.',
          'But on the day of Pentecost, everything changed. Peter was now connected to the source of power.',
          'With boldness, he preached the gospel and called people to repentance (Acts 2:38).',
        ],
      },
      {
        id: 'the-purpose-of-the-holy-spirit',
        title: 'The Purpose of the Holy Spirit',
        paragraphs: [
          'The Holy Spirit came to enable believers to serve and witness.',
          'Jesus declared this mission when He read from the prophet Isaiah:',
          '"The Spirit of the Lord is upon Me, because He has anointed Me to preach good news to the poor." — Luke 4:18–19',
          'In the same way, the Holy Spirit empowers believers today to preach the gospel, serve others, and participate in God\u2019s work.',
        ],
      },
      {
        id: 'pentecost-and-the-harvest',
        title: 'Pentecost and the Harvest',
        paragraphs: [
          'Pentecost is a celebration of the feast of harvest.',
          'God poured out the Holy Spirit to prepare His people for the harvest. Through the power of the Spirit, believers are equipped to proclaim the good news and bring people into the kingdom of God.',
        ],
      },
      {
        id: 'three-themes-linked-to-the-spirit',
        title: 'Three Themes Linked to the Spirit in the Old and New Testaments',
        paragraphs: [
          'After understanding that Pentecost celebrates the feast of harvest, we see a consistent biblical pattern in how the Holy Spirit works. Throughout both the Old Testament and the New Testament, three themes appear whenever the Spirit is given: transfer of the Spirit for service, signs confirming God\u2019s call, and ability from the Spirit.',
          'These themes reveal that the Spirit of God empowers His people to carry out His mission.',
          '**Theme 1: Transfer of the Spirit (for the work of serving)**',
          'In Scripture, the Spirit is often transferred or given to individuals so they can serve God and lead His people.',
          '**Old Testament**',
          '- The Spirit was transferred from Moses to the seventy elders (Num. 11:10–30).',
          '- The Spirit was transferred from Moses to Joshua (Num. 27:16–20; Deut. 34:9).',
          '- The Spirit was transferred from Saul to David (1 Sam. 10:10; 16:13–14).',
          '- The Spirit was transferred from Elijah to Elisha (2 Kings 2:8–9; 14–15).',
          '**New Testament**',
          '- The Spirit anointed Jesus to preach the good news, release the captives, heal, and set people free (Isa. 11:2; 42:1; Luke 4:18–19). At Pentecost, the Spirit was transferred from Jesus to His disciples.',
          '- The Spirit was transferred from Jesus, through Peter and John, to Samaritan disciples (Acts 8:17).',
          '- The Spirit was transferred from Jesus, through Ananias, to Saul (Acts 9:17).',
          '- The Spirit was transferred from Jesus to Cornelius and other Gentiles (Acts 10:44–46).',
          '- The Spirit was transferred from Jesus, through Paul, to Ephesian believers (Acts 19:6).',
          '**Theme 2: Sign to Confirm the Spirit\u2019s Presence and God\u2019s Call to Serve**',
          'When the Spirit comes upon people, Scripture often records signs that confirm God\u2019s presence and His calling.',
          '**Old Testament**',
          '- The Spirit enabled the seventy elders to help bear the burden of the people (Num. 11:17).',
          '- A sign is not recorded, but the people knew Joshua had been filled with the spirit of wisdom, so they listened to him (Deut. 34:9).',
          '- When the Spirit came upon Saul, he prophesied (1 Sam. 10:1–6; 9–10). David also prophesied (2 Sam. 23:1–2).',
          '- Elisha was able to part the Jordan River as Elijah had done (2 Kings 2:8, 14).',
          '**New Testament**',
          '- Luke records the sign of the dove coming upon Jesus (Luke 3:22). The 120 disciples spoke in tongues when the Spirit came upon them for service (Acts 2:4).',
          '- Something happened that convinced Simon to offer money for the ability to impart the Spirit (Acts 8:18–19).',
          '- Saul\u2019s eyes were healed (Acts 9:18; see 1 Cor. 14:18).',
          '- Cornelius and those with him spoke in tongues (Acts 10:44–46).',
          '- The Ephesian believers spoke in tongues and prophesied (Acts 19:6).',
          '**Theme 3: Ability from the Spirit**',
          'The Holy Spirit not only comes with signs but also gives people the ability and power to serve God effectively.',
          '**Old Testament**',
          '- The seventy elders prophesied (Num. 11:25).',
          '- The Spirit filled Joshua with wisdom to lead (Deut. 34:9).',
          '- The Spirit changed Saul into a different person, making him fit to lead (1 Sam. 10:6). The Spirit also gave David power to lead (1 Sam. 16:13).',
          '- The Spirit gave Elijah and Elisha power to prophesy and perform signs and wonders.',
          '**New Testament**',
          '- The Spirit gave the disciples the ability or power to witness for Jesus (Acts 1:8).',
          '- The Spirit gave Samaritan believers the power to do their part in spreading the good news of Jesus.',
          '- The Spirit equipped Saul to carry the Lord\u2019s name to Gentiles and their kings (Acts 9:15).',
          '- The Spirit enabled Gentile believers to be witnesses for Jesus.',
          '- The Spirit gave the Ephesian believers power to witness for Jesus.',
        ],
      },
      {
        id: 'key-points',
        title: 'KEY POINTS',
        paragraphs: [
          '1. The Holy Spirit empowers believers for service.The Holy Spirit was sent to equip believers with power to serve God and participate in His mission (Acts 2:1–4).',
          '2. Pentecost marks the beginning of a spiritual harvest.Just as the Feast of Weeks celebrated the harvest of crops, the outpouring of the Holy Spirit prepared believers to gather people into God\u2019s kingdom (Luke 10:2).',
          '3. The Holy Spirit connects believers to the true source of power.Before Pentecost, Peter was afraid and denied Jesus. After receiving the Holy Spirit, he boldly preached the gospel (Luke 22:57; Acts 2:38).',
          '4. The gospel is for all people.When the disciples spoke in different languages at Pentecost, people from many nations heard the message. This shows that the good news of Jesus is for everyone (Acts 2:4).',
          '5. The Holy Spirit enables believers to be witnesses.Just as the Spirit empowered Jesus to proclaim good news and serve others, the Spirit now empowers believers to continue that mission (Luke 4:18–19).',
        ],
      },
    ],
    relatedSermons: ['17', '16'],
  },
  {
    id: '19',
    slug: 'anatomy-and-physiology-of-a-divine-vision',
    title: 'The Anatomy and Physiology of a Divine Vision',
    speaker: 'Doc. Vince Araneta',
    speakerRole: 'primary leader',
    date: '2026-03-29',
    duration: '45 min',
    series: 'Vision',
    isFeatured: false,
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'When God Redirects Your Path',
    description: `**INTRODUCTION**

Vision is not simply a good idea—it is God’s given picture and strategy for His people. It lays the foundation for growth, direction, and purpose. A divine vision does not rely on human strength or knowledge but on God’s guidance and timing.
Sometimes, God will say “no” to our good ideas to lead us to His greater plan. Vision is often birthed in moments of prayer, obedience, and time alone with God, where He speaks clearly and redirects our path.
As believers, we are reminded that God is our greatest healer, guide, and source of strength, and His vision always leads to growth and transformation.

Follow-up Verse:
Matthew 28:19

---

**THE ANATOMY AND PHYSIOLOGY OF A DIVINE VISION**

**1. The Preparation of the Visionary** (Acts 16:1–5)
Before God gives a global vision, He often focuses on local faithfulness and leadership multiplication.
God prepares the person before releasing the vision. Faithfulness in small responsibilities builds the foundation for greater assignments.

**Key Moments in Preparation:**
**a. The Selection of Timothy**
Paul identified a young leader with a good reputation. This represents the selection phase, where character and faithfulness are recognized before responsibility is given.

**b. The Circumcision of Timothy**
This decision was not about salvation but about removing barriers to reach others. Sometimes we must lay down personal rights or preferences for the sake of the mission.

**c. The Result**
The churches were strengthened in faith and grew in number daily.

**Key Truth:**
Vision always leads to growth.

---

**2. The Redirection of the Spirit** (Acts 16:6–10)
Sometimes God says “no” to a good idea to prepare you for a “God idea.”
Closed doors are not failures—they are often God’s protection or preparation for something greater.

**Key Moments in Redirection:**
**a. The Closed Doors**
The Holy Spirit prevented Paul and his team from preaching in certain regions. This shows that not every opportunity is God’s assignment.

**b. The Macedonian Call**
Paul received a vision of a man asking for help. This moment revealed that vision is often born from the needs of others.

**c. The Immediate Response**
They responded immediately in obedience.

**Key Truth:**
True vision requires instant obedience.

---

**3. The Firstfruits of the Vision** (Acts 16:11–15)
A God-given vision is validated when God opens the hearts of the people meant to hear it.

**Key Moments in Confirmation:**
**a. The Conversion of Lydia**
Paul expected to meet a man but instead encountered a woman. This reminds us that God’s plans may unfold differently than expected.

**b. The Open Heart**
The Lord opened Lydia’s heart to receive the message.

**Key Truth:**
Vision depends on God’s sovereignty, not just our strategy.

---

**4. The Conflict of the Vision** (Acts 16:16–24)
A God-given vision will always be challenged by the enemy.
Opposition is often a sign that the vision is moving forward and disrupting the status quo.

**Key Moments in Conflict:**
**a. The Spirit of Divination**
A slave girl mocked the mission using religious-sounding words, showing how deception can oppose truth.

**b. The Cost of Deliverance**
When Paul cast out the spirit, the girl’s owners lost profit and attacked the missionaries.

**c. The Inner Prison**
Paul and Silas were beaten and imprisoned. Vision is often tested in difficult seasons.

**Key Truth:**
If you aren’t facing opposition, you might not be moving forward in God’s vision.

---

**5. The Breakthrough of the Vision** (Acts 16:25–40)
Victory comes through praise and results in household salvation.
Breakthrough often happens in the darkest moments when faith and worship remain strong.

**Key Moments in Breakthrough:**
**a. Midnight Worship**
Paul and Silas sang hymns in prison. Praise became the key that unlocked the supernatural.

**b. The Earthquake**
God shook the prison’s foundations, bringing freedom not only to them but to others.

**c. The Jailer’s Household**
The jailer and his entire family believed and were saved.

**Key Truth:**
The ultimate goal of the vision is multiplication—reaching families, communities, and generations.
`,
    tags: ['Vision', 'Preparation', 'Redirection', 'Breakthrough', 'Growth', 'Obedience'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/sermon/anatomy.png',
    scriptures: [
      {
        verse: 'Acts 16:1-5',
        text: 'He came to Derbe and Lystra: and behold, a certain disciple was there, named Timothy, the son of a Jewess who believed; but his father was a Greek. The brothers who were at Lystra and Iconium gave a good testimony about him. Paul wanted to have him go out with him, and he took and circumcised him because of the Jews who were in those parts; for they all knew that his father was a Greek. As they went on their way through the cities, they delivered the decrees to them to keep which had been ordained by the apostles and elders who were at Jerusalem. So the assemblies were strengthened in the faith, and increased in number daily.'
      },
      {
        verse: 'Acts 16:6-10',
        text: 'When they had gone through the region of Phrygia and Galatia, they were forbidden by the Holy Spirit to speak the word in Asia. When they had come opposite Mysia, they tried to go into Bithynia, but the Spirit didn’t allow them. Passing by Mysia, they came down to Troas. A vision appeared to Paul in the night. There was a man of Macedonia standing, begging him, and saying, “Come over into Macedonia and help us.” When he had seen the vision, immediately we sought to go out to Macedonia, concluding that the Lord had called us to preach the Good News to them.'
      },
      {
        verse: 'Acts 16:11-15',
        text: 'Setting sail therefore from Troas, we made a straight course to Samothrace, and the day following to Neapolis; and from there to Philippi, which is a city of Macedonia, the foremost of the district, a Roman colony. We were staying some days in this city. On the Sabbath day we went outside of the city by a riverside, where we supposed there was a place of prayer, and we sat down, and spoke to the women who had come together. A certain woman named Lydia, a seller of purple, of the city of Thyatira, one who worshiped God, heard us; whose heart the Lord opened to listen to the things which were spoken by Paul. When she and her household were baptized, she begged us, saying, “If you have judged me to be faithful to the Lord, come into my house, and stay.” So she persuaded us.'
      },
      {
        verse: 'Acts 16:16-24',
        text: 'As we were going to prayer, a certain girl having a spirit of divination met us, who brought her masters much gain by fortune telling. Following Paul and us, she cried out, “These men are servants of the Most High God, who proclaim to us a way of salvation!” She was doing this for many days. But Paul, becoming greatly annoyed, turned and said to the spirit, “I command you in the name of Jesus Christ to come out of her!” It came out that very hour. But when her masters saw that the hope of their gain was gone, they seized Paul and Silas, and dragged them into the marketplace before the rulers. When they had brought them to the magistrates, they said, “These men, being Jews, are agitating our city, and advocate customs which it is not lawful for us to accept or to observe, being Romans.” The multitude rose up together against them, and the magistrates tore their clothes from them, and commanded them to be beaten with rods. When they had laid many stripes on them, they threw them into prison, charging the jailer to keep them safely, who, having received such a command, threw them into the inner prison, and secured their feet in the stocks.'
      },
      {
        verse: 'Acts 16:25-40',
        text: 'But about midnight Paul and Silas were praying and singing hymns to God, and the prisoners were listening to them. Suddenly there was a great earthquake, so that the foundations of the prison were shaken; and immediately all the doors were opened, and everyone’s bonds were loosened. The jailer, being roused out of sleep and seeing the prison doors open, drew his sword and was about to kill himself, supposing that the prisoners had escaped. But Paul cried with a loud voice, saying, “Don’t harm yourself, for we are all here!” He called for lights, sprang in, fell down trembling before Paul and Silas, brought them out, and said, “Sirs, what must I do to be saved?” They said, “Believe in the Lord Jesus Christ, and you will be saved, you and your household.” They spoke the word of the Lord to him, and to all who were in his house. He took them the same hour of the night, and washed their stripes, and was immediately baptized, he and all his household. He brought them up into his house, and set food before them, and rejoiced greatly, with all his household, having believed in God. But when it was day, the magistrates sent the sergeants, saying, “Let those men go.” The jailer reported these words to Paul, saying, “The magistrates have sent to let you go; now therefore come out, and go in peace.” But Paul said to them, “They have beaten us publicly, without a trial, men who are Romans, and have cast us into prison! Do they now release us secretly? No, most certainly, but let them come themselves and bring us out!” The sergeants reported these words to the magistrates, and they were afraid when they heard that they were Romans, and they came and begged them. When they had brought them out, they asked them to depart from the city. They went out of the prison, and entered into Lydia’s house. When they had seen the brothers, they encouraged them, and departed.'
      },
      {
        verse: 'Matthew 28:19',
        text: 'Go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit,'
      }
    ],
    keyPoints: [
      'God prepares you before He releases the vision.',
      'Closed doors may be God\u2019s protection or redirection.',
      'Vision is confirmed when hearts are open to receive the message.',
      'Opposition does not stop the vision\u2014it strengthens faith.',
      'Praise invites breakthrough and leads to salvation.'
    ],
    keyTakeaways: [
      'God prepares you before He releases the vision.',
      'Closed doors may be God\u2019s protection or redirection.',
      'Vision is confirmed when hearts are open to receive the message.',
      'Opposition does not stop the vision\u2014it strengthens faith.',
      'Praise invites breakthrough and leads to salvation.',
    ],
    sections: [
      {
        id: 'sec-intro',
        kicker: 'Introduction',
        title: 'Vision Is God\u2019s Given Strategy',
        unnumbered: true,
        paragraphs: [
          'Vision is not simply a good idea\u2014it is God\u2019s given picture and strategy for His people. It lays the foundation for growth, direction, and purpose. A divine vision does not rely on human strength or knowledge but on God\u2019s guidance and timing.',
          'Sometimes, God will say \u201cno\u201d to our good ideas to lead us to His greater plan. Vision is often birthed in moments of prayer, obedience, and time alone with God, where He speaks clearly and redirects our path.',
          'As believers, we are reminded that God is our greatest healer, guide, and source of strength, and His vision always leads to growth and transformation.',
          '**Follow-up Verse:** Matthew 28:19',
        ],
      },
      {
        id: 'sec-preparation',
        kicker: 'Principle 1 \u00b7 Preparation',
        title: 'The Preparation of the Visionary',
        paragraphs: [
          '**Acts 16:1\u20135** \u2014 Before God gives a global vision, He often focuses on local faithfulness and leadership multiplication.',
          'God prepares the person before releasing the vision. Faithfulness in small responsibilities builds the foundation for greater assignments.',
        ],
        subItems: [
          {
            title: 'The Selection of Timothy',
            text: 'Paul identified a young leader with a good reputation. This represents the selection phase, where character and faithfulness are recognized before responsibility is given.',
          },
          {
            title: 'The Circumcision of Timothy',
            text: 'This decision was not about salvation but about removing barriers to reach others. Sometimes we must lay down personal rights or preferences for the sake of the mission.',
          },
          {
            title: 'The Result',
            text: 'The churches were strengthened in faith and grew in number daily.',
          },
        ],
        callout: 'Vision always leads to growth.',
      },
      {
        id: 'sec-redirection',
        kicker: 'Principle 2 \u00b7 Redirection',
        title: 'The Redirection of the Spirit',
        paragraphs: [
          '**Acts 16:6\u201310** \u2014 Sometimes God says \u201cno\u201d to a good idea to prepare you for a \u201cGod idea.\u201d',
          'Closed doors are not failures\u2014they are often God\u2019s protection or preparation for something greater.',
        ],
        subItems: [
          {
            title: 'The Closed Doors',
            text: 'The Holy Spirit prevented Paul and his team from preaching in certain regions. This shows that not every opportunity is God\u2019s assignment.',
          },
          {
            title: 'The Macedonian Call',
            text: 'Paul received a vision of a man asking for help. This moment revealed that vision is often born from the needs of others.',
          },
          {
            title: 'The Immediate Response',
            text: 'They responded immediately in obedience.',
          },
        ],
        callout: 'True vision requires instant obedience.',
      },
      {
        id: 'sec-firstfruits',
        kicker: 'Principle 3 \u00b7 Confirmation',
        title: 'The Firstfruits of the Vision',
        paragraphs: [
          '**Acts 16:11\u201315** \u2014 A God-given vision is validated when God opens the hearts of the people meant to hear it.',
        ],
        subItems: [
          {
            title: 'The Conversion of Lydia',
            text: 'Paul expected to meet a man but instead encountered a woman. This reminds us that God\u2019s plans may unfold differently than expected.',
          },
          {
            title: 'The Open Heart',
            text: 'The Lord opened Lydia\u2019s heart to receive the message.',
          },
        ],
        callout: 'Vision depends on God\u2019s sovereignty, not just our strategy.',
      },
      {
        id: 'sec-conflict',
        kicker: 'Principle 4 \u00b7 Conflict',
        title: 'The Conflict of the Vision',
        paragraphs: [
          '**Acts 16:16\u201324** \u2014 A God-given vision will always be challenged by the enemy.',
          'Opposition is often a sign that the vision is moving forward and disrupting the status quo.',
        ],
        subItems: [
          {
            title: 'The Spirit of Divination',
            text: 'A slave girl mocked the mission using religious-sounding words, showing how deception can oppose truth.',
          },
          {
            title: 'The Cost of Deliverance',
            text: 'When Paul cast out the spirit, the girl\u2019s owners lost profit and attacked the missionaries.',
          },
          {
            title: 'The Inner Prison',
            text: 'Paul and Silas were beaten and imprisoned. Vision is often tested in difficult seasons.',
          },
        ],
        callout: 'If you aren\u2019t facing opposition, you might not be moving forward in God\u2019s vision.',
      },
      {
        id: 'sec-breakthrough',
        kicker: 'Principle 5 \u00b7 Breakthrough',
        title: 'The Breakthrough of the Vision',
        paragraphs: [
          '**Acts 16:25\u201340** \u2014 Victory comes through praise and results in household salvation.',
          'Breakthrough often happens in the darkest moments when faith and worship remain strong.',
        ],
        subItems: [
          {
            title: 'Midnight Worship',
            text: 'Paul and Silas sang hymns in prison. Praise became the key that unlocked the supernatural.',
          },
          {
            title: 'The Earthquake',
            text: 'God shook the prison\u2019s foundations, bringing freedom not only to them but to others.',
          },
          {
            title: 'The Jailer\u2019s Household',
            text: 'The jailer and his entire family believed and were saved.',
          },
        ],
        callout: 'The ultimate goal of the vision is multiplication\u2014reaching families, communities, and generations.',
      },
    ],
    scriptureGroups: [
      {
        kicker: 'Principle 1 \u00b7 Preparation',
        verse: 'Acts 16:1\u20135',
        text: 'He came to Derbe and Lystra: and behold, a certain disciple was there, named Timothy, the son of a Jewess who believed; but his father was a Greek. The brothers who were at Lystra and Iconium gave a good testimony about him. Paul wanted to have him go out with him, and he took and circumcised him because of the Jews who were in those parts; for they all knew that his father was a Greek. As they went on their way through the cities, they delivered the decrees to them to keep which had been ordained by the apostles and elders who were at Jerusalem. So the assemblies were strengthened in the faith, and increased in number daily.',
      },
      {
        kicker: 'Principle 2 \u00b7 Redirection',
        verse: 'Acts 16:6\u201310',
        text: 'When they had gone through the region of Phrygia and Galatia, they were forbidden by the Holy Spirit to speak the word in Asia. When they had come opposite Mysia, they tried to go into Bithynia, but the Spirit didn\u2019t allow them. Passing by Mysia, they came down to Troas. A vision appeared to Paul in the night. There was a man of Macedonia standing, begging him, and saying, \u201cCome over into Macedonia and help us.\u201d When he had seen the vision, immediately we sought to go out to Macedonia, concluding that the Lord had called us to preach the Good News to them.',
      },
      {
        kicker: 'Principle 3 \u00b7 Confirmation',
        verse: 'Acts 16:11\u201315',
        text: 'Setting sail therefore from Troas, we made a straight course to Samothrace, and the day following to Neapolis; and from there to Philippi, which is a city of Macedonia, the foremost of the district, a Roman colony. We were staying some days in this city. On the Sabbath day we went outside of the city by a riverside, where we supposed there was a place of prayer, and we sat down, and spoke to the women who had come together. A certain woman named Lydia, a seller of purple, of the city of Thyatira, one who worshiped God, heard us; whose heart the Lord opened to listen to the things which were spoken by Paul. When she and her household were baptized, she begged us, saying, \u201cIf you have judged me to be faithful to the Lord, come into my house, and stay.\u201d So she persuaded us.',
      },
      {
        kicker: 'Principle 4 \u00b7 Conflict',
        verse: 'Acts 16:16\u201324',
        text: 'As we were going to prayer, a certain girl having a spirit of divination met us, who brought her masters much gain by fortune telling. Following Paul and us, she cried out, \u201cThese men are servants of the Most High God, who proclaim to us a way of salvation!\u201d She was doing this for many days. But Paul, becoming greatly annoyed, turned and said to the spirit, \u201cI command you in the name of Jesus Christ to come out of her!\u201d It came out that very hour. But when her masters saw that the hope of their gain was gone, they seized Paul and Silas, and dragged them into the marketplace before the rulers. When they had brought them to the magistrates, they said, \u201cThese men, being Jews, are agitating our city, and advocate customs which it is not lawful for us to accept or to observe, being Romans.\u201d The multitude rose up together against them, and the magistrates tore their clothes from them, and commanded them to be beaten with rods. When they had laid many stripes on them, they threw them into prison, charging the jailer to keep them safely, who, having received such a command, threw them into the inner prison, and secured their feet in the stocks.',
      },
      {
        kicker: 'Principle 5 \u00b7 Breakthrough',
        verse: 'Acts 16:25\u201340',
        text: 'But about midnight Paul and Silas were praying and singing hymns to God, and the prisoners were listening to them. Suddenly there was a great earthquake, so that the foundations of the prison were shaken; and immediately all the doors were opened, and everyone\u2019s bonds were loosened. The jailer, being roused out of sleep and seeing the prison doors open, drew his sword and was about to kill himself, supposing that the prisoners had escaped. But Paul cried with a loud voice, saying, \u201cDon\u2019t harm yourself, for we are all here!\u201d He called for lights, sprang in, fell down trembling before Paul and Silas, brought them out, and said, \u201cSirs, what must I do to be saved?\u201d They said, \u201cBelieve in the Lord Jesus Christ, and you will be saved, you and your household.\u201d They spoke the word of the Lord to him, and to all who were in his house. He took them the same hour of the night, and washed their stripes, and was immediately baptized, he and all his household. He brought them up into his house, and set food before them, and rejoiced greatly, with all his household, having believed in God. But when it was day, the magistrates sent the sergeants, saying, \u201cLet those men go.\u201d The jailer reported these words to Paul, saying, \u201cThe magistrates have sent to let you go; now therefore come out, and go in peace.\u201d But Paul said to them, \u201cThey have beaten us publicly, without a trial, men who are Romans, and have cast us into prison! Do they now release us secretly? No, most certainly, but let them come themselves and bring us out!\u201d The sergeants reported these words to the magistrates, and they were afraid when they heard that they were Romans, and they came and begged them. When they had brought them out, they asked them to depart from the city. They went out of the prison, and entered into Lydia\u2019s house. When they had seen the brothers, they encouraged them, and departed.',
      },
      {
        kicker: 'Follow-up Verse',
        verse: 'Matthew 28:19',
        text: 'Go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit,',
      },
    ],
    relatedSermons: ['18', '17']
  },
  {
    id: '20',
    slug: 'signs-of-our-own-resurrection-life',
    title: 'Signs of Our Own Resurrection Life',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2026-04-05',
    duration: '45 min',
    series: 'Vision',
    isFeatured: false,
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'Because Jesus rose from the dead, we can experience our own resurrection life—a transformed life marked by humility, gratitude, and unity with others.',
    description: `**INTRODUCTION**

The message of the gospel is both plain and profound. It is the good story that brings hope, salvation, and new life to all who believe. The apostle Paul reminds us in 1 Corinthians 15:1–9 of the foundation of our faith—the death, burial, and resurrection of Jesus Christ.
Because Jesus rose from the dead, we can experience our own resurrection life—a transformed life marked by humility, gratitude, and unity with others.

---

**WHAT IS THE GOSPEL?**

The gospel is simply the good story of salvation through Jesus Christ—the story of how God makes a way for us to be reconciled to Him.
The word gospel comes from the Old English term gōdspel, which literally means “good story” (gōd meaning good and spel meaning story, message, or news).
This Old English word was used to translate the Latin word evangelium, which comes from the Koine Greek word euangelion (εὐαγγέλιον), also meaning “good news.” In the New Testament, it refers to the joyful announcement of salvation, the resurrection of Jesus Christ, and the coming Kingdom of God.
At its heart, the gospel can be expressed in FIVE SIMPLE POWERFUL WORDS:
**JESUS. DIED. AND. ROSE. AGAIN**.

---

**THE IMPORTANCE OF THE GOSPEL**

These points summarize why the gospel is central to our faith and daily living:


**1. Christ died for our sins, though He Himself committed no sin** (Hebrews 7:27).
* Jesus’ sacrifice was once and for all, bringing forgiveness and reconciliation with God.

**2. He was buried** (1 Corinthians 15:4)
* His burial confirms the reality of His death.

**3. He was raised from the dead** (Romans 4:25; Romans 6:4)
* The resurrection demonstrates God’s power and authority to give us new life.
* Jesus is the first fruit of many—His resurrection opens the way for our own resurrection life.
* Paul was the last of all apostles (1 Corinthians 15:8)
- Even the last person called by God can participate in this gospel.
- The gospel is for everyone, regardless of timing, status, or position.

---

**4 SIGNS THAT WE HAVE OUR OWN RESURRECTION LIFE**

According to Paul’s life and testimony, there are clear signs that a person is living in the power of the resurrection. These signs reflect a transformed heart and a life centered on Christ.

**1. Exhibited No Pride**
1 Corinthians 15:9
Paul exhibited no pride. This is one of the signs that you have your own resurrection life.
He openly admitted his unworthiness and refused to compete with his peers. Instead, he recognized his own weakness and depended fully on God.
Sometimes we may feel overlooked or unrecognized for our contributions, but our goal is not earthly recognition. Our goal is Christ-likeness and multiplication. Every good deed is recorded in heaven, and we have heavenly accountability.
**Key Truth:** Remove pride and entitlement from your thinking and heart.

**2. A Genuine and Deep Appreciation for God’s Grace**
1 Corinthians 15:10
Paul deeply appreciated God's grace and understood that everything he accomplished was because of it.
It is a serious matter to abuse God's grace. Instead, we are called to respond to grace with gratitude.
God’s theology is grace, and our response should always be gratitude. Paul attributed everything he had in his life to God's grace.
You can recognize a person who has found favor with God when they reflect His grace in their actions and relationships.
**Key Truth:** A grateful heart is evidence of a transformed life.

**3. A Humble Admission of Our Accomplishments**
1 Corinthians 15:10
Paul did not deny that he accomplished many things for the Lord, but he approached those accomplishments with humility.
His life was an open book. He acknowledged what God had done through him, yet he never sought personal recognition.
Instead, he was quick to point people to the true source of his accomplishments—the Lord.
**Key Truth:** Give glory to God for every achievement.

**4. Honest Appreciation for Others**
1 Corinthians 15:11
Paul emphasized his honest appreciation for others and valued the work of fellow believers.
A true sign of resurrection life is the ability to honor others sincerely, work together, and maintain unity in the body of Christ.
We are called to consider others better than ourselves and to serve with humility, unity, and harmony.
**Key Truth:** Sincere recognition and cooperation reflect the heart of Christ.

---

**CONCLUSION**

The resurrection of Jesus is not only a historical event—it is a living reality that transforms how we think, serve, and relate to others.
When we truly believe the gospel, it changes our hearts. We become people who walk in humility, appreciate God’s grace, honor others, and live for Christ.
Resurrection life is visible not only in what we believe, but in how we live.`,
    tags: ['Resurrection', 'Gospel', 'Humility', 'Grace', 'Gratitude', 'Unity'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/sermon/signs_of_ressurection.jpg',
    scriptures: [
      {
        verse: '1 Corinthians 15:1-9',
        text: 'Moreover, brethren, I declare to you the gospel which I preached to you, which also you received and in which you stand, by which also you are saved, if you hold fast that word which I preached to you—unless you believed in vain. For I delivered to you first of all that which I also received: that Christ died for our sins according to the Scriptures, and that He was buried, and that He rose again the third day according to the Scriptures, and that He was seen by Cephas, then by the twelve. After that He was seen by over five hundred brethren at once, of whom the greater part remain to the present, but some have fallen asleep. After that He was seen by James, then by all the apostles. Then last of all He was seen by me also, as by one born out of due time. For I am the least of the apostles, who am not worthy to be called an apostle, because I persecuted the church of God.'
      },
      {
        verse: 'Romans 1:16',
        text: 'For I am not ashamed of the gospel of Christ, for it is the power of God to salvation for everyone who believes, for the Jew first and also for the Greek.'
      },
      {
        verse: 'Romans 4:25',
        text: 'who was delivered up because of our offenses, and was raised because of our justification.'
      },
      {
        verse: 'Romans 6:4',
        text: 'Therefore we were buried with Him through baptism into death, that just as Christ was raised from the dead by the glory of the Father, even so we also should walk in newness of life.'
      },
      {
        verse: 'Hebrews 7:27',
        text: 'who does not need daily, as those high priests, to offer up sacrifices, first for His own sins and then for the people’s, for this He did once for all when He offered up Himself.'
      },
      {
        verse: '1 Corinthians 15:4',
        text: 'and that He was buried, and that He rose again the third day according to the Scriptures,'
      },
      {
        verse: '1 Corinthians 15:8',
        text: 'Then last of all He was seen by me also, as by one born out of due time.'
      },
      {
        verse: '1 Corinthians 15:9',
        text: 'For I am the least of the apostles, who am not worthy to be called an apostle, because I persecuted the church of God.'
      },
      {
        verse: '1 Corinthians 15:10',
        text: 'But by the grace of God I am what I am, and His grace toward me was not in vain; but I labored more abundantly than they all, yet not I, but the grace of God which was with me.'
      },
      {
        verse: '1 Corinthians 15:11',
        text: 'Therefore, whether it was I or they, so we preach and so you believed.'
      }
    ],
    keyPoints: [
      'The gospel is the good story that Jesus died and rose again.',
      'The resurrection of Jesus gives us new life and hope.',
      'True resurrection life is marked by humility and gratitude.',
      "Every accomplishment is made possible by God's grace.",
      'Honest appreciation for others reflects a Christ-like life.'
    ],
    keyTakeaways: [
      'The gospel is the good story that Jesus died and rose again.',
      'The resurrection of Jesus gives us new life and hope.',
      'True resurrection life is marked by humility and gratitude.',
      'Every accomplishment is made possible by God\'s grace.',
      'Honest appreciation for others reflects a Christ-like life.',
    ],
    sections: [
      {
        id: 'introduction',
        kicker: 'Introduction',
        title: 'INTRODUCTION',
        unnumbered: true,
        paragraphs: [
          'The message of the gospel is both plain and profound. It is the good story that brings hope, salvation, and new life to all who believe. The apostle Paul reminds us in 1 Corinthians 15:1–9 of the foundation of our faith—the death, burial, and resurrection of Jesus Christ.',
          'Because Jesus rose from the dead, we can experience our own resurrection life—a transformed life marked by humility, gratitude, and unity with others.',
        ],
      },
      {
        id: 'what-is-the-gospel',
        title: 'WHAT IS THE GOSPEL?',
        paragraphs: [
          'The gospel is simply the good story of salvation through Jesus Christ—the story of how God makes a way for us to be reconciled to Him.',
          'The word gospel comes from the Old English term g\u014dspel, which literally means "good story" (g\u014dd meaning good and spel meaning story, message, or news).',
          'This Old English word was used to translate the Latin word evangelium, which comes from the Koine Greek word euangelion (\u03b5\u1f50\u03b1\u03b3\u03b3\u03ad\u03bb\u03b9\u03bf\u03bd), also meaning "good news." In the New Testament, it refers to the joyful announcement of salvation, the resurrection of Jesus Christ, and the coming Kingdom of God.',
          'At its heart, the gospel can be expressed in FIVE SIMPLE POWERFUL WORDS:',
          '**JESUS. DIED. AND. ROSE. AGAIN**.',
        ],
      },
      {
        id: 'the-importance-of-the-gospel',
        title: 'THE IMPORTANCE OF THE GOSPEL',
        paragraphs: [
          'These points summarize why the gospel is central to our faith and daily living:',
          '**1. Christ died for our sins, though He Himself committed no sin** (Hebrews 7:27).',
          '- Jesus\u2019 sacrifice was once and for all, bringing forgiveness and reconciliation with God.',
          '**2. He was buried** (1 Corinthians 15:4)',
          '- His burial confirms the reality of His death.',
          '**3. He was raised from the dead** (Romans 4:25; Romans 6:4)',
          '- The resurrection demonstrates God\u2019s power and authority to give us new life.',
          '- Jesus is the first fruit of many—His resurrection opens the way for our own resurrection life.',
          '- Paul was the last of all apostles (1 Corinthians 15:8)',
          '- Even the last person called by God can participate in this gospel.',
          '- The gospel is for everyone, regardless of timing, status, or position.',
        ],
      },
      {
        id: 'four-signs-that-we-have-our-own-resurrection-life',
        title: '4 SIGNS THAT WE HAVE OUR OWN RESURRECTION LIFE',
        paragraphs: [
          'According to Paul\u2019s life and testimony, there are clear signs that a person is living in the power of the resurrection. These signs reflect a transformed heart and a life centered on Christ.',
        ],
        subItems: [
          {
            title: 'Exhibited No Pride',
            ref: '1 Corinthians 15:9',
            text: 'Paul exhibited no pride. This is one of the signs that you have your own resurrection life. He openly admitted his unworthiness and refused to compete with his peers. Instead, he recognized his own weakness and depended fully on God. Sometimes we may feel overlooked or unrecognized for our contributions, but our goal is not earthly recognition. Our goal is Christ-likeness and multiplication. Every good deed is recorded in heaven, and we have heavenly accountability.',
          },
          {
            title: 'A Genuine and Deep Appreciation for God\u2019s Grace',
            ref: '1 Corinthians 15:10',
            text: 'Paul deeply appreciated God\'s grace and understood that everything he accomplished was because of it. It is a serious matter to abuse God\'s grace. Instead, we are called to respond to grace with gratitude. God\u2019s theology is grace, and our response should always be gratitude. Paul attributed everything he had in his life to God\'s grace. You can recognize a person who has found favor with God when they reflect His grace in their actions and relationships.',
          },
          {
            title: 'A Humble Admission of Our Accomplishments',
            ref: '1 Corinthians 15:10',
            text: 'Paul did not deny that he accomplished many things for the Lord, but he approached those accomplishments with humility. His life was an open book. He acknowledged what God had done through him, yet he never sought personal recognition. Instead, he was quick to point people to the true source of his accomplishments—the Lord.',
          },
          {
            title: 'Honest Appreciation for Others',
            ref: '1 Corinthians 15:11',
            text: 'Paul emphasized his honest appreciation for others and valued the work of fellow believers. A true sign of resurrection life is the ability to honor others sincerely, work together, and maintain unity in the body of Christ. We are called to consider others better than ourselves and to serve with humility, unity, and harmony.',
          },
        ],
        callout: 'Sincere recognition and cooperation reflect the heart of Christ.',
      },
      {
        id: 'conclusion',
        kicker: 'Conclusion',
        title: 'CONCLUSION',
        paragraphs: [
          'The resurrection of Jesus is not only a historical event—it is a living reality that transforms how we think, serve, and relate to others.',
          'When we truly believe the gospel, it changes our hearts. We become people who walk in humility, appreciate God\u2019s grace, honor others, and live for Christ.',
          'Resurrection life is visible not only in what we believe, but in how we live.',
        ],
      },
    ],
    relatedSermons: ['19', '18']
  },
  {
    id: '21',
    slug: 'gods-blessings-for-true-worshippers',
    title: "God's Blessings for True Worshippers",
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2026-04-13',
    duration: '45 min',
    series: 'Worship',
    isFeatured: false,
    seriesDescription: 'Discovering what it means to worship God in spirit and truth, and the blessings that flow from a life of genuine worship.',
    excerpt: 'True worship begins with a heart of reverence for God and His Word. When we honor Him with our first and our best in sincere devotion, God responds with His presence, guidance, peace, joy, and answered prayers.',
    description: `**GOD'S BLESSINGS FOR TRUE WORSHIPPERS**

Key Verse: Nehemiah 8:5–6

---

**INTRODUCTION**

True worship begins with a heart of reverence for God and His Word. In the time of Nehemiah, when the Book of the Law was opened, the people stood up in honor and worship. This reminds us that worship is not just an action, it is an attitude of respect, humility, and devotion to the Lord.
It should be our habit to give reverence when reading and hearing the Word of God, recognizing His presence among us.

---

**A BRIEF HISTORY OF GOD'S PRESENCE**

From the very beginning, God designed humanity to live in His presence. The Garden of Eden was described as a delightful place. The word Eden means a delightful spot - a special place made beautiful because of the presence of God. It was more than a location; it was a home where God and man had fellowship.
Even in the garden, there was already a foreshadowing of atonement. After Adam and Eve sinned, God covered their shame by providing garments made from animal skins. This act pointed to the future sacrifice that would restore humanity to God.
The first Adam failed, but the second Adam, Jesus Christ came to undo what the first Adam had done. Through Jesus, God's original design for humanity is being restored.

---

**AN IMPORTANT PRINCIPLE: GOD CLAIMS THE FIRST**

Throughout Scripture, we see a consistent principle: God always claims the first. Our attitude matters in how we give our first to the Lord.
Abel offered his first and best to God, and the Lord was pleased with his offering. In the same way, when we offer the first day of the week to the Lord in worship, we honor Him above all else. When the first is blessed, the rest that follows is also blessed.
We are reminded not to give God our leftovers including our time, energy, and attention. Cain offered what he wanted rather than what honored God, and his offering was not pleasing to the Lord. True worship requires sincerity, priority, and wholehearted devotion.

---

**GOD'S BLESSINGS FOR TRUE WORSHIPPERS**

God responds to sincere worship with His presence and favor. The Bible reveals several blessings that belong to those who worship Him in spirit and truth.

**1. God Promises to Be with His Worshippers**
(Matthew 18:20; Revelation 3:20)
One of the greatest blessings of worship is the presence of God. When believers gather in His name, He promises to be among them. He also desires a close and personal relationship with each of us, inviting us to fellowship with Him daily.

**2. God Guides and Surrounds Them with His Glory**
(Exodus 40:35; 2 Chronicles 7:1; 1 Peter 4:14)
When the glory of God comes down, blessings follow. Throughout Scripture, God's presence filled places of worship and guided His people. His glory brings direction, protection, and assurance that He is with us.
Blessings happen when the glory of God is present in our lives.

**3. God Showers Them with Blessings and Peace**
(Ezekiel 34:26; Psalm 29:11)
God delights in blessing His people. Among the greatest blessings He gives is peace. True peace is not merely the absence of trouble, it is found in a Person, Jesus Christ.
Without God, there is no lasting peace. But when we walk closely with Him, His peace guards our hearts and minds.

**4. God Gives Them Overflowing Joy**
(Psalm 122:1; John 15:11)
True worship brings joy that goes beyond circumstances. The joy of the Lord strengthens us in every season of life. It renews our spirit, lifts our hearts, and reminds us of God's goodness.
We need the joy that comes from the Lord, because the joy of the Lord is our strength.

**5. God Answers Their Prayers Offered in Faith**
(Mark 11:24; James 5:15)
God hears and responds to the prayers of sincere worshippers. When we pray with faith, trusting in His power and goodness, He answers according to His will. Scripture teaches that prayers offered in faith bring healing, restoration, and breakthrough.
Faith-filled prayer connects us to the power of God.

---

**KEY TAKEAWAYS**

* True worship begins with reverence for God and His Word. Our attitude in worship reflects our honor and respect for the Lord.
* God designed us to live in His presence. What made Eden delightful was not the place itself, but the presence of God.
* Jesus, the Second Adam, restored what was lost. Through His sacrifice, God's original design for humanity is being renewed.
* God deserves our first and our best. When we prioritize Him especially with the first day of the week, we invite His blessing into the rest of our lives.
* We should never give God our leftovers. True worship is wholehearted, sincere, and offered with the right heart.
* God blesses true worshippers with His presence, guidance, peace, joy, and answered prayers. These blessings flow from a life that honors Him.`,
    tags: ['Worship', 'Blessing', 'Reverence', 'Prayer', 'Joy', 'Peace', 'Grace'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/sermon/true_worshipper.jpeg',
    scriptures: [
      {
        verse: 'Nehemiah 8:5-6',
        text: 'And Ezra opened the book in the sight of all the people, for he was standing above all the people; and when he opened it, all the people stood up. And Ezra blessed the Lord, the great God. Then all the people answered, "Amen, Amen!" while lifting up their hands. And they bowed their heads and worshiped the Lord with their faces to the ground.'
      },
      {
        verse: 'Matthew 18:20',
        text: 'For where two or three are gathered together in My name, I am there in the midst of them.'
      },
      {
        verse: 'Revelation 3:20',
        text: 'Behold, I stand at the door and knock. If anyone hears My voice and opens the door, I will come in to him and dine with him, and he with Me.'
      },
      {
        verse: 'Exodus 40:35',
        text: 'And Moses was not able to enter the tabernacle of meeting, because the cloud rested above it, and the glory of the Lord filled the tabernacle.'
      },
      {
        verse: '2 Chronicles 7:1',
        text: 'When Solomon had finished praying, fire came down from heaven and consumed the burnt offering and the sacrifices; and the glory of the Lord filled the temple.'
      },
      {
        verse: '1 Peter 4:14',
        text: 'If you are reproached for the name of Christ, blessed are you, for the Spirit of glory and of God rests upon you. On their part He is blasphemed, but on your part He is glorified.'
      },
      {
        verse: 'Ezekiel 34:26',
        text: 'I will make them and the places all around My hill a blessing; and I will cause showers to come down in their season; there shall be showers of blessing.'
      },
      {
        verse: 'Psalm 29:11',
        text: 'The Lord will give strength to His people; The Lord will bless His people with peace.'
      },
      {
        verse: 'Psalm 122:1',
        text: "I was glad when they said to me, 'Let us go into the house of the Lord.'"
      },
      {
        verse: 'John 15:11',
        text: 'These things I have spoken to you, that My joy may remain in you, and that your joy may be full.'
      },
      {
        verse: 'Mark 11:24',
        text: 'Therefore I say to you, whatever things you ask when you pray, believe that you receive them, and you will have them.'
      },
      {
        verse: 'James 5:15',
        text: 'And the prayer of faith will save the sick, and the Lord will raise him up. And if he has committed sins, he will be forgiven.'
      }
    ],
    keyPoints: [
      'True worship begins with reverence for God and His Word',
      'God designed us to live in His presence — Eden was delightful because of God',
      'Jesus, the Second Adam, restored what was lost through the fall',
      'God deserves our first and our best — when the first is blessed, the rest is blessed',
      'We should never give God our leftovers — true worship is wholehearted',
      'God blesses true worshippers with His presence, guidance, peace, joy, and answered prayers'
    ],
    relatedSermons: ['20', '17'],

    // Redesigned layout opt-in fields (Variation A — Modern Reader)
    seriesNumber: 7,
    subtitle: {
      prefix: "God's Blessings for",
      italic: 'True',
      suffix: 'Worshippers',
    },
    keyVerse: 'Nehemiah 8:5-6',
    sections: [
      {
        id: 'sec-intro',
        kicker: 'Introduction',
        title: 'The Heart of True Worship',
        unnumbered: true,
        paragraphs: [
          'True worship begins with a heart of reverence for God and His Word. In the time of Nehemiah, when the Book of the Law was opened, the people stood up in honor and worship. This reminds us that worship is not just an action — it is an attitude of respect, humility, and devotion to the Lord.',
          'It should be our habit to give reverence when reading and hearing the Word of God, recognizing His presence among us.',
        ],
      },
      {
        id: 'sec-history',
        kicker: 'Context',
        title: "A Brief History of God's Presence",
        unnumbered: true,
        paragraphs: [
          "From the very beginning, God designed humanity to live in His presence. The Garden of Eden was described as a delightful place. The word Eden means a delightful spot — a special place made beautiful because of the presence of God. It was more than a location; it was a home where God and man had fellowship.",
          'Even in the garden, there was already a foreshadowing of atonement. After Adam and Eve sinned, God covered their shame by providing garments made from animal skins. This act pointed to the future sacrifice that would restore humanity to God.',
          "Through Jesus, God's original design for humanity is being restored.",
        ],
        callout: "The first Adam failed, but the second Adam — Jesus Christ — came to undo what the first Adam had done.",
      },
      {
        id: 'sec-principle',
        kicker: 'Principle',
        title: 'God Claims the First',
        paragraphs: [
          'Throughout Scripture, we see a consistent principle: God always claims the first. Our attitude matters in how we give our first to the Lord.',
          'Abel offered his first and best to God, and the Lord was pleased with his offering. In the same way, when we offer the first day of the week to the Lord in worship, we honor Him above all else. When the first is blessed, the rest that follows is also blessed.',
          'We are reminded not to give God our leftovers — including our time, energy, and attention. Cain offered what he wanted rather than what honored God, and his offering was not pleasing to the Lord. True worship requires sincerity, priority, and wholehearted devotion.',
        ],
      },
      {
        id: 'sec-blessings',
        kicker: 'Main Teaching',
        title: 'Five Blessings for True Worshippers',
        paragraphs: [
          'God responds to sincere worship with His presence and favor. The Bible reveals several blessings that belong to those who worship Him in spirit and truth.',
        ],
        subItems: [
          {
            title: 'God Promises to Be with His Worshippers',
            ref: 'Matthew 18:20 · Revelation 3:20',
            text: 'One of the greatest blessings of worship is the presence of God. When believers gather in His name, He promises to be among them. He also desires a close and personal relationship with each of us.',
          },
          {
            title: 'God Guides and Surrounds Them with His Glory',
            ref: 'Exodus 40:35 · 2 Chronicles 7:1 · 1 Peter 4:14',
            text: 'When the glory of God comes down, blessings follow. His glory brings direction, protection, and assurance that He is with us. Blessings happen when the glory of God is present in our lives.',
          },
          {
            title: 'God Showers Them with Blessings and Peace',
            ref: 'Ezekiel 34:26 · Psalm 29:11',
            text: "God delights in blessing His people. True peace is not merely the absence of trouble — it is found in a Person, Jesus Christ. When we walk closely with Him, His peace guards our hearts and minds.",
          },
          {
            title: 'God Gives Them Overflowing Joy',
            ref: 'Psalm 122:1 · John 15:11',
            text: "True worship brings joy that goes beyond circumstances. The joy of the Lord strengthens us in every season of life. It renews our spirit, lifts our hearts, and reminds us of God's goodness.",
          },
          {
            title: 'God Answers Their Prayers Offered in Faith',
            ref: 'Mark 11:24 · James 5:15',
            text: 'God hears and responds to the prayers of sincere worshippers. When we pray with faith, trusting in His power and goodness, He answers according to His will. Scripture teaches that prayers offered in faith bring healing, restoration, and breakthrough. Faith-filled prayer connects us to the power of God.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'True worship begins with reverence for God and His Word.',
      'God designed us to live in His presence — Eden was delightful because of God.',
      'Jesus, the Second Adam, restored what was lost through the fall.',
      "God deserves our first and our best — when the first is blessed, the rest is blessed.",
      'We should never give God our leftovers — true worship is wholehearted.',
      'God blesses true worshippers with His presence, guidance, peace, joy, and answered prayers.',
    ],
    scriptureGroups: [
      {
        kicker: 'Key Verse',
        verse: 'Nehemiah 8:5-6',
        text: '"And Ezra opened the book in the sight of all the people... and all the people answered, Amen, Amen, with lifting up their hands."',
      },
      {
        kicker: 'Blessing 1 · Presence',
        verse: 'Matthew 18:20',
        text: '"For where two or three are gathered together in my name, there am I in the midst of them."',
      },
      {
        kicker: 'Blessing 1 · Presence',
        verse: 'Revelation 3:20',
        text: '"Behold, I stand at the door, and knock: if any man hear my voice, and open the door, I will come in to him."',
      },
      {
        kicker: 'Blessing 2 · Glory',
        verse: 'Exodus 40:35',
        text: '"And Moses was not able to enter into the tent of the congregation, because the cloud abode thereon, and the glory of the Lord filled the tabernacle."',
      },
      {
        kicker: 'Blessing 3 · Peace',
        verse: 'Ezekiel 34:26',
        text: '"And I will make them and the places round about my hill a blessing; and I will cause the shower to come down in his season; there shall be showers of blessing."',
      },
      {
        kicker: 'Blessing 4 · Joy',
        verse: 'Psalm 122:1',
        text: '"I was glad when they said unto me, Let us go into the house of the Lord."',
      },
      {
        kicker: 'Blessing 4 · Joy',
        verse: 'John 15:11',
        text: '"These things have I spoken unto you, that my joy might remain in you, and that your joy might be full."',
      },
      {
        kicker: 'Blessing 5 · Prayer',
        verse: 'Mark 11:24',
        text: '"What things soever ye desire, when ye pray, believe that ye receive them, and ye shall have them."',
      },
    ],
  },
  {
    id: '22',
    slug: 'gods-blessings-for-true-worshippers-part-2',
    title: "God's Blessings for True Worshippers (Part 2)",
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2026-04-19',
    duration: '45 min',
    series: 'Worship',
    isFeatured: true,
    seriesDescription: 'Discovering what it means to worship God in spirit and truth, and the blessings that flow from a life of genuine worship.',
    excerpt: 'Our worship to God benefits us and strengthens our faith. As we continue to honor God in worship, Scripture reveals additional blessings including the infilling of the Holy Spirit, divine guidance, and salvation.',
    description: `**GOD'S BLESSINGS FOR TRUE WORSHIPPERS (PART 2)**

(Continuation from Last Sunday’s Sermon)
Key Verse: Psalm 137:1–9

---

**WORSHIP BENEFITS THE WORSHIPPER**

Our worship to God is not only for Him—it is also for our benefit.
No matter what our situation is, we are worshippers. Worship is not limited to good times or comfortable seasons. True worship continues even in challenges and difficulties.

---

**DO NOT HOLD BACK YOUR PRAISE**

We should not hold back our song. In the Bible, Paul the Apostle and Silas were bound in chains in prison, yet they still praised God. They worshipped Him even in the dungeon. Their situation did not stop them from giving praise to the Lord.
In the same way, we should not hold back our praise because of what others might think of us. We are called to give our worship fully to the Lord, regardless of our circumstances.

---

**YOU BECOME WHAT YOU WORSHIP**

When you worship, you become your worship. When you worship the true God, your spirit changes because you become who you worship. A true worshipper begins to reflect the character of God.
Because Paul and Silas did not hold back their worship, God moved powerfully. Lives were changed, and people were delivered. This reminds us that when we worship sincerely, God’s presence works in ways that bring transformation to others.

---

**GOD’S BLESSINGS FOR TRUE WORSHIPPERS (CONTINUATION)**

As we continue to honor God in worship, Scripture reveals additional blessings that flow into the lives of true worshippers.

**6. To Give Them a Fresh Infilling of His Holy Spirit and Boldness to Live for Christ and Tell Others About Him** (Acts 4:31)
The infilling of the Holy Spirit is not only for our own benefit, but also for others. God empowers His people to live boldly and share the message of Christ.
We need the infilling of the Holy Spirit every day, because without Him, our efforts remain only human effort.

**7. To Work Among Them in Special and Obvious Ways Through the Holy Spirit** (1 Corinthians 12:7–13)
God works among His people through the Holy Spirit in special and visible ways. These works demonstrate His power and presence in the church.
When believers worship sincerely, the Holy Spirit moves among them, bringing unity and transformation in the lives of His people.

**8. To Guide Them Into All Truth Through the Holy Spirit** (John 15:26; 16:13)
The Holy Spirit guides believers into truth. He testifies to the Word of God and always points us to Jesus Christ.
True worshippers become more sensitive to His voice and more confident in His direction.

**9. To Purify, Develop, and Set Them Apart for His Purposes Through the Power and Instruction of His Word and the Holy Spirit** (John 17:17–19)
God uses His Word and the Holy Spirit to purify and develop His people. True worship leads to spiritual growth and maturity.
As we continue to worship God, He shapes our character and prepares us for His purposes.

**10. To Comfort, Encourage, and Strengthen Them** (Isaiah 40:1; 1 Corinthians 14:26; 2 Corinthians 1:3–4; 1 Thessalonians 5:11)
God brings comfort, encouragement, and strength to His people when they gather together in worship. His presence renews hearts and strengthens faith.
God desires that people leave the church not the same as when they came.

**11. To Expose the Reality of Sin, Righteousness, and Judgment** (John 16:8)
The Spirit of God reveals the truth about sin, righteousness, and judgment. He does not condemn people, but He lovingly convicts them and leads them to repentance.
Conviction is a sign of God’s grace, drawing people back to Him.

**12. To Spiritually Save People Who Respond in Faith When Their Sinfulness Is Revealed to Them During a Worship Service** (1 Corinthians 14:22–25)
When God’s people worship, His presence is among them. In His presence, hearts are touched and lives are changed.
One of the greatest blessings of true worship is salvation, as people respond in faith to the truth of God’s Word.

---

**KEY TAKEAWAYS**

* Our worship to God benefits us and strengthens our faith.
* No matter what our situation is, we remain worshippers.
* We should not hold back our praise, even in difficult circumstances.
* The Holy Spirit fills, guides, and strengthens true worshippers.
* God comforts and encourages His people when they gather together in worship.
* The Holy Spirit convicts hearts and leads people to repentance.
* When we worship God sincerely, His presence brings transformation and salvation.
* No matter what our situation is, God will put a song in our hearts.`,
    tags: ['Worship', 'Blessing', 'Holy Spirit', 'Praise', 'Transformation', 'Comfort', 'Salvation'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/sermon/true_worshipper.jpeg',
    scriptures: [
      {
        verse: 'Psalm 137:1-9',
        text: 'By the rivers of Babylon, There we sat down, yea, we wept When we remembered Zion. We hung our harps Upon the willows in the midst of it. For there those who carried us away captive asked of us a song, And those who plundered us requested mirth, Saying, "Sing us one of the songs of Zion!" How shall we sing the Lord\'s song In a foreign land? If I forget you, O Jerusalem, Let my right hand forget its skill! If I do not remember you, Let my tongue cling to the roof of my mouth—If I do not exalt Jerusalem Above my chief joy. Remember, O Lord, against the sons of Edom The day of Jerusalem, Who said, "Raze it, raze it, To its very foundation!" O daughter of Babylon, who are to be destroyed, Happy the one who repays you as you have served us! Happy the one who takes and dashes Your little ones against the rock.'
      },
      {
        verse: 'Acts 4:31',
        text: 'And when they had prayed, the place where they were assembled together was shaken; and they were all filled with the Holy Spirit, and they spoke the word of God with boldness.'
      },
      {
        verse: '1 Corinthians 12:7-13',
        text: 'But the manifestation of the Spirit is given to each one for the profit of all: for to one is given the word of wisdom through the Spirit, to another the word of knowledge through the same Spirit, to another faith by the same Spirit, to another gifts of healings by the same Spirit, to another the working of miracles, to another prophecy, to another discerning of spirits, to another different kinds of tongues, to another the interpretation of tongues. But one and the same Spirit works all these things, distributing to each one individually as He wills. For as the body is one and has many members, but all the members of that one body, being many, are one body, so also is Christ. For by one Spirit we were all baptized into one body—whether Jews or Greeks, whether slaves or free—and have all been made to drink into one Spirit.'
      },
      {
        verse: 'John 15:26',
        text: 'But when the Helper comes, whom I shall send to you from the Father, the Spirit of truth who proceeds from the Father, He will testify of Me.'
      },
      {
        verse: 'John 16:13',
        text: 'However, when He, the Spirit of truth, has come, He will guide you into all truth; for He will not speak on His own authority, but whatever He hears He will speak; and He will tell you things to come.'
      },
      {
        verse: 'John 17:17-19',
        text: 'Sanctify them by Your truth. Your word is truth. As You sent Me into the world, I also have sent them into the world. And for their sakes I sanctify Myself, that they also may be sanctified by the truth.'
      },
      {
        verse: 'Isaiah 40:1',
        text: '"Comfort, yes, comfort My people!" Says your God.'
      },
      {
        verse: '1 Corinthians 14:26',
        text: 'How is it then, brethren? Whenever you come together, each of you has a psalm, has a teaching, has a tongue, has a revelation, has an interpretation. Let all things be done for edification.'
      },
      {
        verse: '2 Corinthians 1:3-4',
        text: 'Blessed be the God and Father of our Lord Jesus Christ, the Father of mercies and God of all comfort, who comforts us in all our tribulation, that we may be able to comfort those who are in any trouble, with the comfort with which we ourselves are comforted by God.'
      },
      {
        verse: '1 Thessalonians 5:11',
        text: 'Therefore comfort each other and edify one another, just as you also are doing.'
      },
      {
        verse: 'John 16:8',
        text: 'And when He has come, He will convict the world of sin, and of righteousness, and of judgment:'
      },
      {
        verse: '1 Corinthians 14:22-25',
        text: 'Therefore tongues are for a sign, not to those who believe but to unbelievers; but prophesying is not for unbelievers but for those who believe. Therefore if the whole church comes together in one place, and all speak with tongues, and there come in those who are uninformed or unbelievers, will they not say that you are out of your mind? But if all prophesy, and an unbeliever or an uninformed person comes in, he is convinced by all, he is convicted by all. And thus the secrets of his heart are revealed; and so, falling down on his face, he will worship God and report that God is truly among you.'
      }
    ],
    keyPoints: [
      'Our worship to God benefits us and strengthens our faith',
      'No matter what our situation is, we remain worshippers',
      'We should not hold back our praise, even in difficult circumstances',
      'The Holy Spirit fills, guides, and strengthens true worshippers',
      'God comforts and encourages His people when they gather together in worship',
      'The Holy Spirit convicts hearts and leads people to repentance',
      'When we worship God sincerely, His presence brings transformation and salvation',
      'No matter what our situation is, God will put a song in our hearts'
    ],
    relatedSermons: ['21', '20'],
    seriesNumber: 8,
    subtitle: {
      prefix: "God's Blessings for",
      italic: 'True',
      suffix: 'Worshippers (Part 2)',
    },
    keyVerse: 'Psalm 137:1-9',
    sections: [
      {
        id: 'sec-intro',
        title: 'Worship Benefits the Worshipper',
        unnumbered: true,
        paragraphs: [
          '(Continuation from Last Sunday’s Sermon)',
          'Our worship to God is not only for Him—it is also for our benefit.',
          'No matter what our situation is, we are worshippers. Worship is not limited to good times or comfortable seasons. True worship continues even in challenges and difficulties.'
        ]
      },
      {
        id: 'sec-praise',
        title: 'Do Not Hold Back Your Praise',
        unnumbered: true,
        paragraphs: [
          'We should not hold back our song. In the Bible, Paul the Apostle and Silas were bound in chains in prison, yet they still praised God. They worshipped Him even in the dungeon. Their situation did not stop them from giving praise to the Lord.',
          'In the same way, we should not hold back our praise because of what others might think of us. We are called to give our worship fully to the Lord, regardless of our circumstances.'
        ]
      },
      {
        id: 'sec-become',
        title: 'You Become What You Worship',
        unnumbered: true,
        paragraphs: [
          'When you worship, you become your worship. When you worship the true God, your spirit changes because you become who you worship. A true worshipper begins to reflect the character of God.',
          'Because Paul and Silas did not hold back their worship, God moved powerfully. Lives were changed, and people were delivered. This reminds us that when we worship sincerely, God’s presence works in ways that bring transformation to others.'
        ]
      },
      {
        id: 'sec-blessings',
        kicker: 'Main Teaching',
        title: 'God’s Blessings for True Worshippers (Continuation)',
        paragraphs: [
          'As we continue to honor God in worship, Scripture reveals additional blessings that flow into the lives of true worshippers.'
        ],
        subItems: [
          {
            title: 'To Give Them a Fresh Infilling of His Holy Spirit and Boldness to Live for Christ and Tell Others About Him',
            ref: 'Acts 4:31',
            text: 'The infilling of the Holy Spirit is not only for our own benefit, but also for others. God empowers His people to live boldly and share the message of Christ. We need the infilling of the Holy Spirit every day, because without Him, our efforts remain only human effort.'
          },
          {
            title: 'To Work Among Them in Special and Obvious Ways Through the Holy Spirit',
            ref: '1 Corinthians 12:7-13',
            text: 'God works among His people through the Holy Spirit in special and visible ways. These works demonstrate His power and presence in the church. When believers worship sincerely, the Holy Spirit moves among them, bringing unity and transformation in the lives of His people.'
          },
          {
            title: 'To Guide Them Into All Truth Through the Holy Spirit',
            ref: 'John 15:26 · 16:13',
            text: 'The Holy Spirit guides believers into truth. He testifies to the Word of God and always points us to Jesus Christ. True worshippers become more sensitive to His voice and more confident in His direction.'
          },
          {
            title: 'To Purify, Develop, and Set Them Apart for His Purposes Through the Power and Instruction of His Word and the Holy Spirit',
            ref: 'John 17:17-19',
            text: 'God uses His Word and the Holy Spirit to purify and develop His people. True worship leads to spiritual growth and maturity. As we continue to worship God, He shapes our character and prepares us for His purposes.'
          },
          {
            title: 'To Comfort, Encourage, and Strengthen Them',
            ref: 'Isaiah 40:1 · 1 Corinthians 14:26 · 2 Corinthians 1:3-4 · 1 Thessalonians 5:11',
            text: 'God brings comfort, encouragement, and strength to His people when they gather together in worship. His presence renews hearts and strengthens faith. God desires that people leave the church not the same as when they came.'
          },
          {
            title: 'To Expose the Reality of Sin, Righteousness, and Judgment',
            ref: 'John 16:8',
            text: 'The Spirit of God reveals the truth about sin, righteousness, and judgment. He does not condemn people, but He lovingly convicts them and leads them to repentance. Conviction is a sign of God’s grace, drawing people back to Him.'
          },
          {
            title: 'To Spiritually Save People Who Respond in Faith When Their Sinfulness Is Revealed to Them During a Worship Service',
            ref: '1 Corinthians 14:22-25',
            text: 'When God’s people worship, His presence is among them. In His presence, hearts are touched and lives are changed. One of the greatest blessings of true worship is salvation, as people respond in faith to the truth of God’s Word.'
          }
        ]
      }
    ],
    keyTakeaways: [
      'Our worship to God benefits us and strengthens our faith.',
      'No matter what our situation is, we remain worshippers.',
      'We should not hold back our praise, even in difficult circumstances.',
      'The Holy Spirit fills, guides, and strengthens true worshippers.',
      'God comforts and encourages His people when they gather together in worship.',
      'The Holy Spirit convicts hearts and leads people to repentance.',
      'When we worship God sincerely, His presence brings transformation and salvation.',
      'No matter what our situation is, God will put a song in our hearts.'
    ],
    scriptureGroups: [
      {
        kicker: 'Key Verse',
        verse: 'Psalm 137:1-9',
        text: '"By the rivers of Babylon, There we sat down, yea, we wept When we remembered Zion..."'
      },
      {
        kicker: 'Blessing 6 · Infilling',
        verse: 'Acts 4:31',
        text: '"And when they had prayed, the place where they were assembled together was shaken..."'
      },
      {
        kicker: 'Blessing 7 · Works',
        verse: '1 Corinthians 12:7-13',
        text: '"But the manifestation of the Spirit is given to each one for the profit of all..."'
      },
      {
        kicker: 'Blessing 8 · Truth',
        verse: 'John 15:26',
        text: '"But when the Helper comes, whom I shall send to you from the Father..."'
      },
      {
        kicker: 'Blessing 8 · Truth',
        verse: 'John 16:13',
        text: '"However, when He, the Spirit of truth, has come, He will guide you into all truth..."'
      },
      {
        kicker: 'Blessing 9 · Set Apart',
        verse: 'John 17:17-19',
        text: '"Sanctify them by Your truth. Your word is truth..."'
      },
      {
        kicker: 'Blessing 10 · Comfort',
        verse: 'Isaiah 40:1',
        text: '"Comfort, yes, comfort My people! Says your God."'
      },
      {
        kicker: 'Blessing 10 · Comfort',
        verse: '1 Corinthians 14:26',
        text: '"How is it then, brethren? Whenever you come together, each of you has a psalm..."'
      },
      {
        kicker: 'Blessing 10 · Comfort',
        verse: '2 Corinthians 1:3-4',
        text: '"Blessed be the God and Father of our Lord Jesus Christ, the Father of mercies and God of all comfort..."'
      },
      {
        kicker: 'Blessing 10 · Comfort',
        verse: '1 Thessalonians 5:11',
        text: '"Therefore comfort each other and edify one another, just as you also are doing."'
      },
      {
        kicker: 'Blessing 11 · Conviction',
        verse: 'John 16:8',
        text: '"And when He has come, He will convict the world of sin, and of righteousness, and of judgment."'
      },
      {
        kicker: 'Blessing 12 · Salvation',
        verse: '1 Corinthians 14:22-25',
        text: '"Therefore tongues are for a sign, not to those who believe but to unbelievers..."'
      }
    ]
  }
];

export const getSermonById = (id: string): Sermon | undefined => {
  return sermons.find(sermon => sermon.id === id);
};

export const getSermonBySlug = (slug: string): Sermon | undefined => {
  return sermons.find(sermon => sermon.slug === slug);
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
