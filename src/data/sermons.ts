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
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
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
    isFeatured: true,
    keyPoints: [
      'Although He was God, He became a man',
      'Although He was rich, He became poor',
      'Although He was holy, He was accursed',
      'Although He was righteous, He became sin',
      'Although He was healthy, He bore our sickness and infirmities',
      'Although He was just, He died with the unjust',
      'Although He was perfect, He was broken for us'
    ],
    relatedSermons: ['12', '2'],
  },
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
