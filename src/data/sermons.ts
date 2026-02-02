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
    title: 'Sunday Service',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2026-01-25',
    duration: '45 min',
    series: 'Faith Foundation',
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'A call to vigilance, focus, and holy passion. This is a season that demands watchfulness.',
    description: `a. Burnout disguised as faithfulness- enduring, not enjoying, not bearing fruits . Enjoy the ministry, not endure the ministry . Humans are not meant to depend upon human strength. When God created us, He created us in a way that we should be power assisted. b. Compromise justified as strategy They do not announce themselves as sin. They often appear as opportunities, responsibilities, sympathetic actions, growth, relevance, or even blessings. Yet they slowly pull the called away from prayer, consecration, holiness, and divine focus. (]) We must sensitively desist- from any questionable conduct that dilutes or harms our Christian witness to unbelievers (I Cor. 10:27-33). (2) All association with or appearance of idolatry- must be decisively avoided (1 Cor. 8:10; 10:7, 12, 14, 18-20). (3) The law of love- will cause us to limit voluntarily our Christian freedom in order not to lead by example another believer into compromising their convictions, defiling their conscience and thereby going down a path to spiritual ruin (1 Cor. 8:9-13; 10:24; cf. Rom. 14:1-15:3). Those who have not prepared their minds and hearts to stay true to God and his Word- Will find it difficult to resist sin and to avoid conforming to the world's ungodly ideas and lifestyles. c. Isolation masked as independence Daniel 10:4-20- the spirit prince of the kingdoms.. Angels on assignment.. The devil's strategy is Isolation but God's antidote is connection. Proverbs 18:1 Whoever isolates himself seeks his own desire; he breaks out against all sound judgment. This reveals the motivation and consequence for willful isolation. We isolate ourselves primarily because of selfish desires for comfort, protection, and self-rule. d. Pride camouflaged as confidence Daniel 4:20-33 Proverbs 16:18 Pride goes before destruction, and haughtiness before a fall. Romans 12:16 Live in harmony with one another. Do not be proud, but be willing to associate with people of low position. Do not be conceited. e. Moral looseness excused as grace Daniel 4:27 "'King Nebuchadnezzar, please accept my advice. Stop sinning and do what is right. Break from your wicked past and be merciful to the poor. Perhaps then you will continue to prosper.' Romans 6 Well then, should we keep on sinning so that God can show us more and more of his wonderful grace? 2 Of course not! Since we have died to sin, how can we continue to live in it? 3 Or have you forgotten that when we were joined with Christ Jesus in baptism, we joined him in his death? 4 For we died and were buried with Christ by baptism. And just as Christ was raised from the dead by the glorious power of the Father, now we also may live new lives. These traps are designed not just to destroy ministers—but to wound the flocks committed to their care. "Smite the shepherd, and the sheep shall be scattered." (Zechariah 13:7, KJV) Conclusion/Application A Call to Vigilance, Focus, and Holy Passion This is a season that demands watchfulness. "13 Watch, stand fast in the faith, be brave, be strong. 14 Let all that you do be done with love." (1 Corinthians 16:13, KJV) 13 Be on guard. Stand firm in the faith. Be courageous. Be strong. 14 And do everything with love. NLT To every Gate-keeper: a. Guard your prayer life fiercely b. Protect your private consecration c. Discipline your time and attention d. Refuse every distraction that steals spiritual depth e. Reignite your first love The end-time ministry will not be carried by the gifted alone—but by the faithful, focused, and fiery!`,
    tags: ['Ministry', 'Leadership', 'Burnout', 'Compromise', 'Pride', 'Vigilance', 'Holiness'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    scriptures: [
      {
        verse: '1 Corinthians 10:27-33',
        text: 'We must sensitively desist from any questionable conduct that dilutes or harms our Christian witness to unbelievers.'
      },
      {
        verse: '1 Corinthians 8:9-13',
        text: 'The law of love will cause us to limit voluntarily our Christian freedom in order not to lead by example another believer into compromising their convictions.'
      },
      {
        verse: 'Proverbs 18:1',
        text: 'Whoever isolates himself seeks his own desire; he breaks out against all sound judgment.'
      },
      {
        verse: 'Proverbs 16:18',
        text: 'Pride goes before destruction, and haughtiness before a fall.'
      },
      {
        verse: 'Romans 12:16',
        text: 'Live in harmony with one another. Do not be proud, but be willing to associate with people of low position. Do not be conceited.'
      },
      {
        verse: 'Romans 6:1-4',
        text: 'Well then, should we keep on sinning so that God can show us more and more of his wonderful grace? Of course not! Since we have died to sin, how can we continue to live in it?'
      },
      {
        verse: 'Zechariah 13:7',
        text: 'Smite the shepherd, and the sheep shall be scattered.'
      },
      {
        verse: '1 Corinthians 16:13-14',
        text: 'Be on guard. Stand firm in the faith. Be courageous. Be strong. And do everything with love.'
      }
    ],
    isFeatured: true,
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
    title: 'Consecration of the First Born',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2025-03-23',
    duration: '45 min',
    series: 'Faith Foundation',
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'Redemption Consecration of the Firstborn - The Lord said to Moses, "Consecrate to me every firstborn male. The first offspring of every womb among the Israelites belongs to me."',
    description: `Redemption Consecration of the Firstborn Exodus 13 Consecration of the Firstborn The Lord said to Moses, 2 "Consecrate to me every firstborn male. The first offspring of every womb among the Israelites belongs to me, whether human or animal." 11 "After the Lord brings you into the land of the Canaanites and gives it to you, as he promised on oath to you and your ancestors, 12 you are to give over to the Lord the first offspring of every womb. All the firstborn males of your livestock belong to the Lord. 13 Redeem with a lamb every firstborn donkey, but if you do not redeem it, break its neck. Redeem every firstborn among your sons. 14 "In days to come, when your son asks you, 'What does this mean?' say to him, 'With a mighty hand the Lord brought us out of Egypt, out of the land of slavery. 15 When Pharaoh stubbornly refused to let us go, the Lord killed the firstborn of both people and animals in Egypt. This is why I sacrifice to the Lord the first male offspring of every womb and redeem each of my firstborn sons.' 16 And it will be like a sign on your hand and a symbol on your forehead that the Lord brought us out of Egypt with his mighty hand." Consecrate- emphatic the Hebrew language is here, but it belongs to me (emphatic) It is my property. It is mine. The first born is mine. You go down to verse 12- 12 you are to give over to the Lord the first offspring of every womb. All the firstborn males of your livestock belong to the Lord. again this shall be the property of the Lord It belongs to Him, just stay with me and we'll get to the new testament principle But every first born of a donkey you shall redeem with a lamb and if you will not redeem it, do you shall break its neck. In other words you're going to lose it anyway you're gonna lose it if you don't dedicate it to God Very Important Principle 1. The first born must be sacrificed or redeemed- That's what we just read, and again we will bring this up to a new testament, there's a principle behind it and that's what you're looking for, the principle How do you know what you should sacrifice or redeem? what God gives two classifications of animals that are examples of a clean animal or an unclean animal? for instance lambs represented clean animal. donkeys represented unclean animals. the first born is a clean animal, it has to be sacrificed, if it's an unclean animal it has to be redeemed or purchased back from God because God owns it. Redeemed means to buy back, not just to buy, but to buy back it has to be redeemed with the sacrifice of a clean animal. The first of a clean animal had to be sacrificed. The first born of unclean animals had to be redeemed by the sacrifice of a clean this is written about 4000 years ago, so what in the world does this have to do with us today? you and I were born spiritually speaking in our spiritual state before God, We were born unclean, you don't have to teach your children to be bad, it come naturally. for them being bad comes natural (lie, steal, selfish). You don't have to teach them to be bad, it comes naturally. You have to teach them to be good right? Galasians 6: 9 So let's not get tired of doing what is good. At just the right time we will reap a harvest of blessing if we don't give up. 10 Therefore, whenever we have the opportunity, we should do good to everyone—especially to those in the family of faith. So we were all born unclean. Was Jesus born unclean or clean? Jesus had to be sacrificed so that the unclean could be redeemed. Through the blood of Jesus, we also have redemption (Ephesians 1:7. The word redemption means "freedom that is bought through the payment of a ransom" (Vine 1984, 946). Jesus redeemed us by paying His blood; He freed us from sin. We need to know four truths about our redemption: 1. Our redemption price was paid to God. Some have taught that Jesus paid the ransom to Satan, but we have never been indebted to Satan. Our debt is to the holiness and justice of God. Whereas God's holiness demanded a payment for sin, His love and grace paid the debt for us through the blood of Jesus. 2. Redemption sets us free from the consequences of sin. Paul wrote, "There is now no condemnation for those who are in Christ Jesus" (Romans 8:1). Rom 8:1-2 The Holy Spirit brings freedom from sin Condemned - hinukman, mauwaw mo duol sa Ginoo Greek word used for No - special negative, stronger than the ordinary no, very emphatic, double emphasis Condemnation is already out of question Law- principles, controlling power "Has set you free", not, will set you free- greek word verb (Eliotherosem)- already happened in the past- you have been set free Training young elephants- chained around a huge post Condition their mind Why God set us free? V4- live according to the Spirit V6 mind controlled by the Spirit not go around the huge post Here, condemnation means "judgment or penalty." We could paraphrase this by saying, "Now there is no punishment for sin for those who are in Christ Jesus." Paul restated this truth in Romans 6:23: "For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord." 3. Redemption frees us from the power of sin. Suppose a cocaine addict is arrested for drug possession and then is freed on a technicality. While he momentarily escapes the consequences of his sin, he is not freed from the power of the addiction that controls him. Within weeks, he is arrested again for the same crime. In contrast, our redemption is complete. God frees us not only from the punishment for sin but also from sin's controlling power in our lives. Colossians 1:13-14 reads, "For he has rescued us from the dominion of darkness and brought us into the kingdom of the Son he loves, in whom we have redemption, the forgiveness of sins." When we were controlled by our sinful nature, we could not please God. Now, however, we are controlled by the Spirit if the Spirit lives in us (Romans 8:8-9). 4. Redemption sets us free from an empty life. God redeemed us "from the empty way of life handed down" from our forefathers (1 Peter 1:18). Jesus himself said, "I have come that they may have life, and have it to the full" (John 10:10). Through redemption, we find true meaning and purpose for our lives. Conclusions Verses 11–16 introduce the concept of redemption. What does that term mean, and why is it significant? Explore: Read 1 Peter 1:17–21. How do those verses add to your understanding of both redemption in general and your redemption specifically? 17 And remember that the heavenly Father to whom you pray has no favorites. He will judge or reward you according to what you do. So you must live in reverent fear of him during your time here as "temporary residents." 18 For you know that God paid a ransom to save you from the empty life you inherited from your ancestors. And it was not paid with mere gold or silver, which lose their value. 19 It was the precious blood of Christ, the sinless, spotless Lamb of God. 20 God chose him as your ransom long before the world began, but now in these last days he has been revealed for your sake. 21 Through Christ you have come to trust in God. And you have placed your faith and hope in God because he raised Christ from the dead and gave him great glory. How do verses 17–22 reveal God's care for His people? Crossing the Sea 17 When Pharaoh let the people go, God did not lead them on the road through the Philistine country, though that was shorter. For God said, "If they face war, they might change their minds and return to Egypt." 18 So God led the people around by the desert road toward the Red Sea. The Israelites went up out of Egypt ready for battle. 19 Moses took the bones of Joseph with him because Joseph had made the Israelites swear an oath. He had said, "God will surely come to your aid, and then you must carry my bones up with you from this place." 20 After leaving Sukkoth they camped at Etham on the edge of the desert. 21 By day the Lord went ahead of them in a pillar of cloud to guide them on their way and by night in a pillar of fire to give them light, so that they could travel by day or night. 22 Neither the pillar of cloud by day nor the pillar of fire by night left its place in front of the people. Go You have access to a pillar of fire or cloud, (the Holy Spirit) but what steps can you take to seek out God's presence this week? Where has God been trying to move or lead you in recent days, weeks, or months?`,
    tags: ['Redemption', 'Consecration', 'Sacrifice', 'Exodus', 'Freedom', 'Holy Spirit'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    scriptures: [
      {
        verse: 'Exodus 13:2, 11-16',
        text: 'Consecrate to me every firstborn male. The first offspring of every womb among the Israelites belongs to me, whether human or animal.'
      },
      {
        verse: 'Galatians 6:9-10',
        text: 'So let\'s not get tired of doing what is good. At just the right time we will reap a harvest of blessing if we don\'t give up. Therefore, whenever we have the opportunity, we should do good to everyone—especially to those in the family of faith.'
      },
      {
        verse: 'Ephesians 1:7',
        text: 'Through the blood of Jesus, we also have redemption. The word redemption means "freedom that is bought through the payment of a ransom."'
      },
      {
        verse: 'Romans 8:1-2',
        text: 'There is now no condemnation for those who are in Christ Jesus. The Holy Spirit brings freedom from sin.'
      },
      {
        verse: 'Romans 6:23',
        text: 'For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord.'
      },
      {
        verse: 'Colossians 1:13-14',
        text: 'For he has rescued us from the dominion of darkness and brought us into the kingdom of the Son he loves, in whom we have redemption, the forgiveness of sins.'
      },
      {
        verse: '1 Peter 1:17-21',
        text: 'For you know that God paid a ransom to save you from the empty life you inherited from your ancestors. And it was not paid with mere gold or silver, which lose their value. It was the precious blood of Christ, the sinless, spotless Lamb of God.'
      },
      {
        verse: 'John 10:10',
        text: 'I have come that they may have life, and have it to the full.'
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
    title: 'The Great Commission',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2025-04-06',
    duration: '45 min',
    series: 'Faith Foundation',
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'All authority. Jesus promises that his followers—now his representatives on earth—would have his authority and power to proclaim and spread his message throughout the world.',
    description: `THE GREAT COMMISSION 28:18 All authority. Jesus promises that his followers— now his representatives on earth-would have his authority and power to proclaim and spread his message throughout the world (vv. 19-20). But first they must obey Jesus' command to wait for the Father to fulfill his promise and send the Holy Spirit to empower them (this promise was fulfilled at Pentecost, see Luke 24:47-49; Acts 1:8; 2:4; see article on BAPTISM IN THE HOLY SPIRIT, p. 1794). We cannot expect the power described in Acts 1:8 to accompany our efforts to take Christ's message to the nations without first following the pattern of Acts 1:4. Acts 1:8 But you will receive power when the Holy Spirit comes upon you. And you will be my witnesses, telling people about me everywhere—in Jerusalem, throughout Judea, in Samaria, and to the ends of the earth." Acts 1:4 Once when he was eating with them, he commanded them, "Do not leave Jerusalem until the Father sends you the gift he promised, as I told you before. 5 John baptized with water, but in just a few days you will be baptized with the Holy Spirit." 28:19 Go ... make disciples... baptizing. These words are referred to as Christ's Great Commission (i.e., his primary command, instruction and task-along with the authority to carry it out). This command applies to all his followers of every generation. In his final instructions, Christ states the goal and responsibility of his church (i.e., all his faithful followers-individually, in local congregations and as a worldwide community). They are to take his message to people of all nations and cultures. (1) The church is to go into all the world and spread the message of Christ as revealed in his own teaching and through the teaching of his apostles (i.e., those he personally appointed to establish his original church and message, see Acts 14:4, note) as revealed throughout the NT (see Eph. 2:20, note). This task includes the responsibility of sending missionaries into every nation (Acts 13:1-4). (2) The preaching of the gospel is centered on "repentance and forgiveness of sins" (Luke 24:47; see 26:28, note), the promise of receiving "the gift of the Holy Spirit" (Acts 2:38) and the challenge to live in a way that is uniquely different from the spiritually corrupt world (Acts 2:40). We must also preach with an expectancy of Jesus' return for his church (Acts 3:19- 20; 1 Thess. 1:10). (3) The primary purpose of Christ's commission was to make disciples (Gk. matheteusate) - disciplined "learners" and followers of Jesus who live by his commands and are continually growing in their relationship with him. To make disciples is the only direct command in this passage (the word "go" could be translated "as you are going"). Many people talk about the Great Commission as a call to evangelism, (i.e., to spread Christ's message of forgiveness and new life with the aim that people will respond positively and accept Christ). But Christ's words here are really a commission to the deeper aspect of discipleship-which goes beyond evangelism and on to solid teaching and continual spiritual nurturing that produces growth and progress. Effective evangelism cannot be separated from true discipleship. Christ does not intend for his followers to simply make converts to Christianity; he wants them to train and mentor (i.e., train by teaching and example) other people who will faithfully follow Christ and lead others to him as well. If individuals who accept Christ do not grow beyond that starting point, they will almost certainly abandon their faith and likely become spiritually hardened toward God. A church's spiritual energies and efforts must not be focused merely on enlarging church membership, but in making true disciples-life-long followers of Christ who avoid evil, follow Christ's commands and pursue his purposes with all their heart, mind and will (see 22:37, note; cf. John 8:31). (4) Christ commands us to concentrate on reaching spiritually lost men and women with his message of hope, but this does not mean that believers are called to Christianize society or to expect that all of the world will become Christians. While we must strive to make a positive difference in the world, we also must understand that the world system will remain defiant toward God until he returns to earth for the final time to destroy evil and judge the wicked. Until then, God's people must separate themselves from the corrupt beliefs, behaviors and lifestyles that surround them. Believers should devote themselves wholeheartedly to God and his purposes (Rom. 13:12; 2 Cor. 6:14; see articles on SPIRITUAL SEPARATION FOR BELIEVERS, p. 1988, and THE CHRISTIAN'S RELATIONSHIP TO THE WORLD, p. 2213). Devotion to Christ includes not hesitating to expose the evil and shame in the world so as to encourage others to avoid it (Eph. 5:11-12). (5) Those who believe in Christ, who accept his message by faith and actively yield their lives to him-are to be "baptized" with water. (The word translated "baptized" literally speaks of being immersed, or put completely under the water.) This act of obedience serves as a public statement of faith in Christ—a sign that a person is identifying with Jesus in his death, burial (going under the water; see Col. 2:12) and resurrection (coming up out of the water). It represents a person's spiritual pledge to turn away from sin and immorality, to die to one's own sinful nature and, with God's help, to be raised up to live a new life (see Rom. 6:4, note). In this new life, the believer is completely committed to Christ and his purposes (see Acts 22:16, note). (6) Christ will be with his obedient followers through the presence and power of the Holy Spirit (cf. v. 20; 1:23; 18:20). They will be able to fulfill their task to take Christ's message wherever they go, even to all people and all nations, only after they are "clothed with power from on high" (Luke 24:49; see Acts 1:8, notes). 28:20 I am with you. This promise is Christ's assurance to his followers who are actively involved in reaching and "winning" those who are spiritually lost (i.e., gaining them for Christ's kingdom) and teaching them to obey his standards of truth. Jesus has risen from the dead and is now alive and active in his followers' lives. God is personally interested in each one of his children and has promised to be with them in the person of the Holy Spirit (John 14:16, 26; for more details on the Father, Son and Holy Spirit, see articles on THE ATTRIBUTES OF GOD, p. 932, JESUS AND THE HOLY SPIRIT, p. 1678, and THE DOCTRINE OF THE HOLY SPIRIT, p. 1814). God is also with us through his Word (John 14:23). No matter what your status or condition-rich, poor, weak, humble, famous or relatively unknown—he cares for you and watches every detail of your life with loving care. He knows and understands your difficulties and struggles, and he will give you the strength to endure anything with his help (see 2 Cor. 12:9). In fact, God's presence can fill every believer with joy in any circumstances (Ps. 16:11; 21:6). It is both challenging and comforting to know that we cannot escape God's presence (Ps. 139:7). Jesus' promise to be "with you" is the Christian's answer to every fear, every doubt, every trouble, every heartache and every discouragement.`,
    tags: ['Great Commission', 'Discipleship', 'Holy Spirit', 'Evangelism', 'Baptism', 'Authority'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    scriptures: [
      {
        verse: 'Matthew 28:18-20',
        text: 'All authority in heaven and on earth has been given to me. Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.'
      },
      {
        verse: 'Acts 1:8',
        text: 'But you will receive power when the Holy Spirit comes upon you. And you will be my witnesses, telling people about me everywhere—in Jerusalem, throughout Judea, in Samaria, and to the ends of the earth.'
      },
      {
        verse: 'Acts 1:4-5',
        text: 'Do not leave Jerusalem until the Father sends you the gift he promised, as I told you before. John baptized with water, but in just a few days you will be baptized with the Holy Spirit.'
      },
      {
        verse: 'Luke 24:47-49',
        text: 'The preaching of the gospel is centered on repentance and forgiveness of sins. They will be clothed with power from on high.'
      },
      {
        verse: 'Acts 2:38, 40',
        text: 'The promise of receiving the gift of the Holy Spirit and the challenge to live in a way that is uniquely different from the spiritually corrupt world.'
      },
      {
        verse: 'John 14:16, 23, 26',
        text: 'God is personally interested in each one of his children and has promised to be with them in the person of the Holy Spirit.'
      },
      {
        verse: 'Psalm 139:7',
        text: 'It is both challenging and comforting to know that we cannot escape God\'s presence.'
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
    title: 'Sunday Service',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2025-04-13',
    duration: '45 min',
    series: 'Faith Foundation',
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'Elisha and the Widow\'s Oil - A certain woman of the wives of the sons of the prophets cried out to Elisha, saying, "Your servant my husband is dead, and you know that your servant feared the Lord."',
    description: `2 Kings 4 New King James Version Elisha and the Widow's Oil 4 A certain woman of the wives of the sons of the prophets cried out to Elisha, saying, "Your servant my husband is dead, and you know that your servant feared the Lord. And the creditor is coming to take my two sons to be his slaves." 2 So Elisha said to her, "What shall I do for you? Tell me, what do you have in the house?" And she said, "Your maidservant has nothing in the house but a jar of oil." 3 Then he said, "Go, borrow vessels from everywhere, from all your neighbors—empty vessels; do not gather just a few. 4 And when you have come in, you shall shut the door behind you and your sons; then pour it into all those vessels, and set aside the full ones." 5 So she went from him and shut the door behind her and her sons, who brought the vessels to her; and she poured it out. 6 Now it came to pass, when the vessels were full, that she said to her son, "Bring me another vessel." And he said to her, "There is not another vessel." So the oil ceased. 7 Then she came and told the man of God. And he said, "Go, sell the oil and pay your debt; and you and your sons live on the rest." NLT Acts 9:10 Now there was a believer in Damascus named Ananias. The Lord spoke to him in a vision, calling, "Ananias!" "Yes, Lord!" he replied. 11 The Lord said, "Go over to Straight Street, to the house of Judas. When you get there, ask for a man from Tarsus named Saul. He is praying to me right now. 12 I have shown him a vision of a man named Ananias coming in and laying hands on him so he can see again." 13 "But Lord," exclaimed Ananias, "I've heard many people talk about the terrible things this man has done to the believers in Jerusalem! 14 And he is authorized by the leading priests to arrest everyone who calls upon your name." 15 But the Lord said, "Go, for Saul is my chosen instrument to take my message to the Gentiles and to kings, as well as to the people of Israel. 16 And I will show him how much he must suffer for my name's sake." 17 So Ananias went and found Saul. He laid his hands on him and said, "Brother Saul, the Lord Jesus, who appeared to you on the road, has sent me so that you might regain your sight and be filled with the Holy Spirit." 18 Instantly something like scales fell from Saul's eyes, and he regained his sight. Then he got up and was baptized. 19 Afterward he ate some food and regained his strength. NKJV Ananias Baptizes Saul 10 Now there was a certain disciple at Damascus named Ananias; and to him the Lord said in a vision, "Ananias." And he said, "Here I am, Lord." 11 So the Lord said to him, "Arise and go to the street called Straight, and inquire at the house of Judas for one called Saul of Tarsus, for behold, he is praying. 12 And in a vision he has seen a man named Ananias coming in and putting his hand on him, so that he might receive his sight." 13 Then Ananias answered, "Lord, I have heard from many about this man, how much harm he has done to Your saints in Jerusalem. 14 And here he has authority from the chief priests to bind all who call on Your name." 15 But the Lord said to him, "Go, for he is a chosen vessel of Mine to bear My name before Gentiles, kings, and the children of Israel. 16 For I will show him how many things he must suffer for My name's sake." 17 And Ananias went his way and entered the house; and laying his hands on him he said, "Brother Saul, the Lord Jesus, who appeared to you on the road as you came, has sent me that you may receive your sight and be filled with the Holy Spirit." 18 Immediately there fell from his eyes something like scales, and he received his sight at once; and he arose and was baptized. 19 So when he had received food, he was strengthened. Then Saul spent some days with the disciples at Damascus.`,
    tags: ['Faith', 'Obedience', 'Provision', 'Miracles', 'Holy Spirit'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    scriptures: [
      {
        verse: '2 Kings 4:1-7',
        text: 'A certain woman of the wives of the sons of the prophets cried out to Elisha, saying, "Your servant my husband is dead, and you know that your servant feared the Lord. And the creditor is coming to take my two sons to be his slaves."'
      },
      {
        verse: 'Acts 9:10-19',
        text: 'Now there was a believer in Damascus named Ananias. The Lord spoke to him in a vision, calling, "Ananias!" "Yes, Lord!" he replied. The Lord said, "Go over to Straight Street, to the house of Judas."'
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
    title: 'The Renewed Heart',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2025-05-18',
    duration: '45 min',
    series: 'Faith Foundation',
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'God\'s answer to the sinfulness of the human heart is regeneration, which happens in individuals who truly repent, turn to God by faith and accept Jesus as the Forgiver of their sins and Leader of their lives.',
    description: `THE RENEWED HEART God's answer to the sinfulness of the human heart is regeneration, which happens in individuals who truly repent, turn to God by faith and accept Jesus as the Forgiver of their sins and Leader of their lives. Regeneration refers to a heart that has been spiritually reborn, renewed, revitalized, reformed and redeveloped (all being necessary processes of the newness) to where it is right with God (see article on REGENERATION: 1. Regeneration refers to the heart being "born again" (John 3:3). Those who repent from their heart of all sin and confess in their heart that Jesus is Lord (Rom. 10:9) are "born again" spiritually and receive a new spiritual heart from God (cf. Ps. 51:10; Ezek. 11:19). 2. For those who experience this spiritual birth, God creates within them a desire to love him and to obey him. Repeatedly God makes it clear to his people the necessity of expressing a love that comes from the heart (see Deut. 4:29, note; 6:6, note). This type of true love for God and devotion to him cannot be separated from obedience to his Word (cf. Ps. 119:34, 69, 112). True love for God and faithful obedience to God are like two sides of the same coin (John 14:15, 23; 1 John 2:5; 5:3). Jesus said the way to fulfill all the law of God is to love God wholeheartedly and love others unselfishly (Matt. 22:37-40). (3) Love from the heart is the necessary part of obedience to God. But it is often the part that is lacking. Too often God's people try to substitute a practice of religious rituals and regulations (such as sacred feast days, offerings and sacrifices) for a genuine love from the heart (see Isa. 1:10-17; Amos 5:21-26; Mic. 6:6-8; see Deut. 10:12, note). Outward activity without an inner desire to serve God is not true love and devotion. In fact, it is being boastful and false, and it is greatly condemned by Jesus (see Matt. 23:13-28; see Luke 21:1-4, note). (4) Many other spiritual activities take place in the hearts of those who are spiritually transformed. They praise God with all their heart (Ps. 9:1), meditate on God's Word in their heart (Ps. 19:14), cry out to God from the heart (Ps. 84:2), seek God with all their heart (Ps. 119:2, 10), hide God's Word in their heart (Ps. 119:11; see Deut. 6:6, note), trust in the Lord with all their heart (Prov. 3:5), forgive others from their heart (Matt. 18:35), experience God's love poured into their heart (Rom. 5:5), give to God from their heart (2 Cor. 9:7), sing to God in their heart (Eph. 5:19; Col. 3:16) and love other Christians from their heart (1 Pet. 1:22). Above all, they`,
    tags: ['Regeneration', 'Heart', 'Born Again', 'Love', 'Obedience', 'Transformation'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    scriptures: [
      {
        verse: 'John 3:3',
        text: 'Regeneration refers to the heart being "born again".'
      },
      {
        verse: 'Romans 10:9',
        text: 'Those who repent from their heart of all sin and confess in their heart that Jesus is Lord are "born again" spiritually.'
      },
      {
        verse: 'Psalm 51:10',
        text: 'Receive a new spiritual heart from God.'
      },
      {
        verse: 'Ezekiel 11:19',
        text: 'God gives a new heart to those who turn to Him.'
      },
      {
        verse: 'John 14:15, 23',
        text: 'True love for God and faithful obedience to God are like two sides of the same coin.'
      },
      {
        verse: '1 John 2:5; 5:3',
        text: 'True love for God cannot be separated from obedience to his Word.'
      },
      {
        verse: 'Matthew 22:37-40',
        text: 'Jesus said the way to fulfill all the law of God is to love God wholeheartedly and love others unselfishly.'
      },
      {
        verse: 'Proverbs 3:5',
        text: 'Trust in the Lord with all their heart.'
      },
      {
        verse: 'Romans 5:5',
        text: 'Experience God\'s love poured into their heart.'
      },
      {
        verse: '1 Peter 1:22',
        text: 'Love other Christians from their heart.'
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
    title: 'Exposed',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2025-05-25',
    duration: '45 min',
    series: 'Faith Foundation',
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'Before restoration and healing, comes revelation and exposing of sins and crimes of God\'s people. Whenever I would restore the fortunes of my people, the sins of Ephraim are exposed.',
    description: `EXPOSED! Hosea 6:11-7:1 - before restoration and healing, comes revelation and exposing of sins and crimes of God's people. 1 1 "Also for you, Judah, a harvest is appointed. "Whenever I would restore the fortunes of my people, 7 1 whenever I would heal Israel, the sins of Ephraim are exposed and the crimes of Samaria revealed. They practice deceit, thieves break into houses, bandits rob in the streets; 6:11b-7:16 The Paralysis of Sin 6:11b-7:16 The Paralysis of Sin Hosea moves on to a devastating indictment of Israel, giving details of the wrongs and injustices perpetrated by the nation's leaders. It makes sad reading. 6:11b-7:7 Deceit and intrigues The Lord longs to help Israel, but he recognizes that the nation has become incapable of repentance and change: Whenever I would restore the fortunes of my people … the sins of Ephraim are exposed (6:11-7:1a). Nothing can be done for a nation that will not admit its sin. The people in general are engaged in deceit, theft and banditry (7:1b). They think that they can get away with it, but they are mistaken, for the Lord remembers all their evil deeds and will judge them (7:2). God's memory is not a vague recollection of past events; it is vivid and a spur to action, for their sins … are always before me. The people, however, are simply following the example their leaders set at the royal court, which is a hotbed of wickedness, lies and adultery (7:3-4a). The emphasis is not simply on what these leaders are doing, but on the intrigues, scheming, plotting and planning that takes place night and day (7:4b-6). Leaders like this are not passionate about justice but about injustice. Their unbridled and wicked ambition is captured in the image of a burning oven (7:6). 13:13 Not kept the command of the Lord. God had told Saul exactly what to do: wait in Gilgal for the arrival of Samuel, who would offer sacrifices and give further instructions (10:8). God tested Saul's obedience by delaying Samuel beyond the seven days. Acting out of a feeling of hopelessness, misguided assumption and with a degree of arrogance, Saul overstepped his God-given role and offered a sacrifice contrary to God's word. Because Saul failed to follow God's instructions, Samuel told him that God would take the kingdom away from him (vv. 13-14). Though Saul remained king for the rest of his life, his son, Jonathan, would not follow him to the throne. 13:14 A man after his own heart. (1) David is this man. He was one who was always seeking a deep relationship with God and a knowledge of his purposes in the following ways: (a) He had great boldness because he had great faith in God from his youth (17:34-37). (b) He was a man of deep spiritual hunger and passion for God. From a life of prayer and a deep relationship with God came his many psalms. (c) In contrast to Saul, he desired to please God rather than to appear great in the eyes of the people. (d) He had an unshakable confidence in God's faithfulness and purpose for his life. (e) He was humble though he had great success (18:12-18). (f) He stubbornly searched for and relied on God's presence and counsel (23:2, 4; 30:8; 2 Sam. 2:1; 5:19, 23). (g) He worshiped God with his whole heart and life and directed all of Israel to do the same (1 Chr. 15-16). (h) He was a man of character, courage (16:18) and loyalty and inspired these traits in others (20:2; 2 Sam. 9; 1 Chr. 11). (i) He humbly recognized that God was the real King of Israel and that he was only God's representative (2 Sam. 5:12). (j) In his public conduct, he sought to obey the Lord and carry out his plans (cf. Acts 13:22). David's heart should be an example for all of Christ's followers today. (2) This does not mean that David was perfect and flawless. Later in his life, David caused God grief on several occasions. For example, he defied God's commands by committing the sins of adultery and murder (2 Sam. 11) and by taking a census (official count of the population) of Israel without God's authorization (1 Chr. 21:1-17). In these ways, he certainly was not behaving like a man after God's own heart, and he suffered some horrible experiences as a result (cf. 2 Sam. 12:10- 15). Yet even during this time in his life, David continued to show the true presence of a humble and teachable spirit. This allowed him to accept God's judgment and receive correction (2 Sam. 12:7-13; 1 Chr. 21:8-17).`,
    tags: ['Repentance', 'Sin', 'Restoration', 'David', 'Humility', 'Judgment'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    scriptures: [
      {
        verse: 'Hosea 6:11-7:1',
        text: 'Whenever I would restore the fortunes of my people, whenever I would heal Israel, the sins of Ephraim are exposed and the crimes of Samaria revealed.'
      },
      {
        verse: '1 Samuel 13:13-14',
        text: 'God had told Saul exactly what to do: wait in Gilgal for the arrival of Samuel. Because Saul failed to follow God\'s instructions, Samuel told him that God would take the kingdom away from him.'
      },
      {
        verse: 'Acts 13:22',
        text: 'David was a man after God\'s own heart. In his public conduct, he sought to obey the Lord and carry out his plans.'
      },
      {
        verse: '2 Samuel 12:7-13',
        text: 'David continued to show the true presence of a humble and teachable spirit. This allowed him to accept God\'s judgment and receive correction.'
      },
      {
        verse: '1 Chronicles 21:1-17',
        text: 'David defied God\'s commands by taking a census of Israel without God\'s authorization, yet he accepted God\'s judgment and received correction.'
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
    title: 'Cross the Finish Line With Joy',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2025-07-20',
    duration: '45 min',
    series: 'Faith Foundation',
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'Joy in your spirit, peace in your soul, and refreshment along the way. The power of ministry is THE HOLY SPIRIT. Your course is your life in God and your calling in God.',
    description: `Cross the Finish Line With Joy! Acts 20:24 (17-25) NKJV . Joy in your spirit, peace in your soul, and refreshment along the way v24 NKJV . The power of ministry is THE HOLY SPIRIT v22-23 . Your course is your life in God and your calling in God v24 . God has made it His responsibility to provide for all your needs v20:33, Matt. 6:33 . Course First, then Ministry v24 . No Comparison 2 Cor. 10:12 . Distance, Direction, and Duration e. g. The life of Paul, the disciples and Jesus . Steps To Stay on Course Proverbs 4 NKJV Contained within verses 20 through 27 are specific rules for successfully staying on our course. We are given the following guidelines for . our ears- Listen to God's Word (v20) . our eyes- Give attention to what God is saying (v20,21, 25) . our mouth- Read God's Word (v24) . our entire man- Hold on to God's Word in your heart, Seek the God-kind of life (v21,23) Just like Paul, . we found our lives by losing it and love our lives by not counting it dear (Matt. 16:24, 25; Phil. 1:21–24; 3:7–12). Paul had learned to . love God's will over everything else, and he realized that . obeying his Savior yielded the greatest joy and fulfillment. The Lord wants us to be like the apostle Paul, being so devoted in our love and service that nothing could ever keep us from obeying Him wholeheartedly. Paul no longer desired to hold on to his life. He sought only the furtherance of God's kingdom and the honor of Christ, no matter what the earthly cost was. None of these things move me, neither count I my life dear unto myself. Paul would rather die because he had done God's will than live for many more years outside of His will. "We run to add life to your days, rather than adding days to your life." Living for Jesus makes life more meaningful! v20:24 I do not account my life of any value. Paul's main concern was not preserving his own life; what counted most was that he might finish the work to which God had called him, Wherever and however it ended, even if it cost him his life, he would finish his course with joy. On his lips and in his life would be the prayer that "Christ will be honored in my body, whether by life or by death" (Phil. 1:20). For Paul, life and service for Christ are represented as a race that must be run with absolute perseverance, endurance and faithfulness to the Lord (cf. 13:24-25; 1 Cor. 9:24; 2 Tim. 4.7; Heb. 12:1). Acts 13:24 after John had first preached, before His coming, the baptism of repentance to all the people of Israel. 25 And as John was finishing his course, he said, 'Who do you think I am? I am not He. But behold, there comes One after me, the sandals of whose feet I am not worthy to loose.' NKJV Striving for a Crown 1 Cor. 9:24 Do you not know that those who run in a race all run, but one receives the prize? Run in such a way that you may obtain it. 25 And everyone who competes for the prize is temperate in all things. Now they do it to obtain a perishable crown, but we for an imperishable crown. 26 Therefore I run thus: not with uncertainty. Thus I fight: not as one who beats the air. 27 But I discipline my body and bring it into subjection, lest, when I have preached to others, I myself should become disqualified. NKJV Paul's Valedictory 2 Tim. 4:6 For I am already being poured out as a drink offering, and the time of my departure is at hand. 7 I have fought the good fight, I have finished the race, I have kept the faith. 8 Finally, there is laid up for me the crown of righteousness, which the Lord, the righteous Judge, will give to me on that Day, and not to me only but also to all who have loved His appearing. NKJV Hebrews 12 Therefore, since we are surrounded by such a great cloud of witnesses, let us throw off everything that hinders and the sin that so easily entangles. And let us run with perseverance the race marked out for us, 2 fixing our eyes on Jesus, the pioneer and perfecter of faith. For the joy set before him he endured the cross, scorning its shame, and sat down at the right hand of the throne of God. 3 Consider him who endured such opposition from sinners, so that you will not grow weary and lose heart. NIV`,
    tags: ['Perseverance', 'Joy', 'Ministry', 'Holy Spirit', 'Race', 'Calling'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    scriptures: [
      {
        verse: 'Acts 20:24',
        text: 'I do not account my life of any value. Paul\'s main concern was not preserving his own life; what counted most was that he might finish the work to which God had called him.'
      },
      {
        verse: 'Matthew 6:33',
        text: 'God has made it His responsibility to provide for all your needs.'
      },
      {
        verse: '2 Corinthians 10:12',
        text: 'No Comparison.'
      },
      {
        verse: 'Proverbs 4:20-27',
        text: 'Specific rules for successfully staying on our course: Listen to God\'s Word, Give attention to what God is saying, Read God\'s Word, Hold on to God\'s Word in your heart.'
      },
      {
        verse: 'Philippians 1:20-24; 3:7-12',
        text: 'We found our lives by losing it and love our lives by not counting it dear. Christ will be honored in my body, whether by life or by death.'
      },
      {
        verse: '1 Corinthians 9:24-27',
        text: 'Do you not know that those who run in a race all run, but one receives the prize? Run in such a way that you may obtain it.'
      },
      {
        verse: '2 Timothy 4:6-8',
        text: 'I have fought the good fight, I have finished the race, I have kept the faith. Finally, there is laid up for me the crown of righteousness.'
      },
      {
        verse: 'Hebrews 12:1-3',
        text: 'Let us throw off everything that hinders and the sin that so easily entangles. And let us run with perseverance the race marked out for us, fixing our eyes on Jesus.'
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
    title: 'Lost',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2025-07-27',
    duration: '45 min',
    series: 'Faith Foundation',
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'God\'s Priorities should be our priorities too. Rejoice with the heavens when even one person admits their helpless condition, accepts Christ\'s forgiveness, turns from their own way and begins to follow him.',
    description: `Lost Luke 15 1. God's Priorities should be our priorities too 2. Rejoice with the heavens! even one person admits their helpless condition, accepts Christ's forgiveness, turns from their own way and begins to follow him. V17-21 2 Peter 3:9 The Lord is not slow to fulfill his promise as some count slowness, but is patient toward you, not wishing that any should perish, but that all should reach repentance. (2 Peter 3:9, ESV) 3. A deep desire to reach out to people 15:8 Seek diligently until she finds. We should pray that the Holy Spirit will fill us with a deep desire to reach out to people with the message and compassion of Jesus so we can help them find spiritual salvation through a personal relationship with him. 4. A life of sin and selfishness rejects God's love, companionship and authority. 15:13 Journey into a far country. In this parable, Jesus teaches that a life of sin (i.e., going our own way and rebelling against God and his standards) and selfishness rejects God's love, companionship and authority. 5. Recognize our true condition 15:17 He came to himself. Before those who are spiritually lost can come to God, they must recognize their true condition of slavery to sin and separation from God (vv. 14-17). They must humbly return to the Fa-ther, admit their sin and be willing to do whatever the Father requires (vv. 17-19). Though God's people can help lead and influence people to turn (or return) to Christ, it is, in reality, the Holy Spirit's work to bring sinners to this realization (John 16:7-11). 6. Keep praying for our spiritually lost 15:20 While he was still a long way off. Every Christian father and mother must understand that God loves their spiritually wayward child and desires his or her spiritual salvation even more than the parents do. We must keep praying for our spiritually lost loved ones, trusting God to pursue them until each one returns to the heavenly Father. 7. Have the Father's heartbeat for the lost 15:20 His father saw him and felt compassion. Jesus' description of the father's response to the son's return`,
    tags: ['Lost', 'Salvation', 'Prodigal Son', 'Evangelism', 'Prayer', 'Compassion'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    scriptures: [
      {
        verse: 'Luke 15',
        text: 'The parables of the lost sheep, lost coin, and prodigal son.'
      },
      {
        verse: '2 Peter 3:9',
        text: 'The Lord is not slow to fulfill his promise as some count slowness, but is patient toward you, not wishing that any should perish, but that all should reach repentance.'
      },
      {
        verse: 'Luke 15:8',
        text: 'Seek diligently until she finds. We should pray that the Holy Spirit will fill us with a deep desire to reach out to people.'
      },
      {
        verse: 'Luke 15:13',
        text: 'Journey into a far country. A life of sin and selfishness rejects God\'s love, companionship and authority.'
      },
      {
        verse: 'Luke 15:17-21',
        text: 'He came to himself. Before those who are spiritually lost can come to God, they must recognize their true condition of slavery to sin and separation from God.'
      },
      {
        verse: 'John 16:7-11',
        text: 'It is the Holy Spirit\'s work to bring sinners to the realization of their true condition.'
      },
      {
        verse: 'Luke 15:20',
        text: 'His father saw him and felt compassion. Jesus\' description of the father\'s response to the son\'s return.'
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
    title: 'Enthusiastic Determination',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2025-11-23',
    duration: '45 min',
    series: 'Faith Foundation',
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'Enthusiastic determination grows out of being delivered by the Lord. When we come to an impasse in life, we should recall the way God has delivered us from these things in the past.',
    description: `ENTHUSIASTIC DETERMINATION First, enthusiastic determination grows out of being delivered by the Lord (2 Cor. 4:13). When we come to an impasse (An impasse is a situation where no progress can be made, especially because of a disagreement or deadlock.) in life, in which we feel weighed down by the burdens or bogged down by the difficulties, we should recall the way God has delivered us from these things in the past. Second, enthusiastic determination grows when we focus on our future resurrection (2 Cor. 4:14). As Bible-believing Christians, we anticipate that day when we will all be changed in a moment, in the twinkling of an eye (1 Cor. 15:52). Third, enthusiastic determination grows when we invest in the lives of others (2 Cor. 4:15). When we take seriously the temporary nature of our present life and the glories of our future resurrection life, it should motivate us to "die" to ourselves and "live" for others. When this hap- pens, teachers are resurrected in the lives of their students, parents in the lives of their children, pastors in the lives of their congregations.`,
    tags: ['Determination', 'Resurrection', 'Investment', 'Sacrifice', 'Faith'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    scriptures: [
      {
        verse: '2 Corinthians 4:13',
        text: 'Enthusiastic determination grows out of being delivered by the Lord.'
      },
      {
        verse: '2 Corinthians 4:14',
        text: 'Enthusiastic determination grows when we focus on our future resurrection.'
      },
      {
        verse: '1 Corinthians 15:52',
        text: 'We anticipate that day when we will all be changed in a moment, in the twinkling of an eye.'
      },
      {
        verse: '2 Corinthians 4:15',
        text: 'Enthusiastic determination grows when we invest in the lives of others.'
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
    title: 'Vision Sunday',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2025-12-07',
    duration: '45 min',
    series: 'Faith Foundation',
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'Be in your best position to hear and receive. The watchman and watchtower are pictures of Habakkuk\'s attitude of patient waiting and watching for God\'s response.',
    description: `Habakkuk 1:14 Habakkuk 2:2-3 . BE IN YOUR BEST POSITION TO HEAR AND RECEIVE Hab 2:1 The watchman and watchtower, isn often used by the prophets to show an attitude of expectation (Isa 21:8, 11; Jer 6:17; Ezek 3:17), are pictures of Habakkuk's attitude of patient waiting and watching for God's response. Habakkuk wanted to be in the best position to receive God's message. . TRUST GOD Hab 2:3 Evil and injustice seem to have the upper hand in the world. Like Habakkuk, Christians often feel angry and discouraged as they see what goes on. Habakkuk complained vigorously to God about the situation. God's answer to Habakkuk is the same answer he would give us, "If it seems slow in coming, wait patiently, for it will surely take place." It isn't easy to be patient, but it helps to remember that God hates sin even more than we do. Punishment of sin will certainly come. As God told Habakkuk, "Wait patiently." We must trust God even when we don't understand why events occur as they do. . LIVE BY FAITH The righteous shall live by his faith. 2:4 In light of God's revelation about how (and when) he is working, his people are to be patient and live by faith. (1) It is "the righteous"-those who entrust their lives to God and do what is right according to his standards— who will come through victorious in the end. (2) The righteous are contrasted with the proud and the un-godly, whose life choices and direction oppose God. The hearts of the righteous are devoted to God; they want to be his children, to have close fellowship with him andoto obey his plans and desires. (3) The righteous must rely on God to accomplish his purposes for them in this world. This kind of "faith" implies an active and lasting trust in God. It is evidence of a personal loyalty to him as Savior and Lord (i.e., the Leader and authority over their lives) and a moral commitment to follow his plans. (4) This phrase, "the righteous shall live by his faith," or a form of it, is used throughout the NT to support the teaching that people are saved by grace (i.e., God's undeserved favor) through faith in Christ (cf. Eph. 2:8). Paul develops the theme in Rom. 1:17 and Gal. 3:11, and the writer to the Hebrews emphasizes that God's people must continue to live by faith in order to please God (see Heb. 10:38; 11:6)`,
    tags: ['Vision', 'Faith', 'Patience', 'Trust', 'Watchfulness'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    scriptures: [
      {
        verse: 'Habakkuk 2:1',
        text: 'The watchman and watchtower are pictures of Habakkuk\'s attitude of patient waiting and watching for God\'s response.'
      },
      {
        verse: 'Habakkuk 2:2-3',
        text: 'If it seems slow in coming, wait patiently, for it will surely take place.'
      },
      {
        verse: 'Habakkuk 2:4',
        text: 'The righteous shall live by his faith.'
      },
      {
        verse: 'Isaiah 21:8, 11',
        text: 'The watchman shows an attitude of expectation.'
      },
      {
        verse: 'Romans 1:17',
        text: 'The righteous shall live by faith.'
      },
      {
        verse: 'Galatians 3:11',
        text: 'People are saved by grace through faith in Christ.'
      },
      {
        verse: 'Ephesians 2:8',
        text: 'Saved by grace through faith.'
      },
      {
        verse: 'Hebrews 10:38; 11:6',
        text: 'God\'s people must continue to live by faith in order to please God.'
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
    title: 'Twelve Tips to Conquer the New Year',
    speaker: 'Ptr. Jim Baloran',
    speakerRole: 'senior pastor',
    date: '2025-12-28',
    duration: '45 min',
    series: 'Faith Foundation',
    seriesDescription: 'Building a strong foundation of faith through biblical teaching and practical application.',
    excerpt: 'Twelve practical tips from the book of Proverbs to help you conquer the new year with wisdom, discipline, and dependence on God.',
    description: `Proverbs 1:1-5 1. BE A PERSON WITH FIRM DETERMINATIONS (PROVERBS 1:10) 2. ASK FOR INTELLIGENCE (PROVERBS 2: 3-5) 3. DEPEND COMPLETELY ON GOD (PROVERBS 3:5) 4. BE GENEROUS WITH GOD (PROVERBS 3:9-10) 5. GUARD YOUR MIND (PROVERBS 4:23) 6. PROTECT YOUR MARRIAGE (PROVERBS 5:18-19) 7. GUARD YOUR WORDS (PROVERBS 6:2) 8. MEMORIZE THE WORD (PROVERBS 7:2-3) 9. TRAIN YOURSELF IN THE WORD (PROVERBS 8:10) 10. CAST OUT THAT WHICH DOES NOT EDIFY (PROVERBS 9:6) 11. REPRODUCE LIFE (PROVERBS 10:16) 12. ENJOY GOD'S BLESSING (PROVERBS 10:22) APPLICATION 1. Pray the Lord will give you new and creative ideas as well as the grace to put them into action. 2. Come up with a plan that will cause you to completely depend on God. 3. Purpose in your heart to be generous in your giving to God. 4. Discipline yourself in daily reading of the Word with the purpose of keeping your mind pure, protecting every area of your life, and memorizing scripture. 5. Write up a list of all of the unedifying things you do daily and work towards eradicating them from your life.`,
    tags: ['New Year', 'Proverbs', 'Wisdom', 'Discipline', 'Generosity', 'Marriage'],
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
    scriptures: [
      {
        verse: 'Proverbs 1:1-5, 10',
        text: 'Be a person with firm determinations.'
      },
      {
        verse: 'Proverbs 2:3-5',
        text: 'Ask for intelligence.'
      },
      {
        verse: 'Proverbs 3:5',
        text: 'Depend completely on God.'
      },
      {
        verse: 'Proverbs 3:9-10',
        text: 'Be generous with God.'
      },
      {
        verse: 'Proverbs 4:23',
        text: 'Guard your mind.'
      },
      {
        verse: 'Proverbs 5:18-19',
        text: 'Protect your marriage.'
      },
      {
        verse: 'Proverbs 6:2',
        text: 'Guard your words.'
      },
      {
        verse: 'Proverbs 7:2-3',
        text: 'Memorize the Word.'
      },
      {
        verse: 'Proverbs 8:10',
        text: 'Train yourself in the Word.'
      },
      {
        verse: 'Proverbs 9:6',
        text: 'Cast out that which does not edify.'
      },
      {
        verse: 'Proverbs 10:16',
        text: 'Reproduce life.'
      },
      {
        verse: 'Proverbs 10:22',
        text: 'Enjoy God\'s blessing.'
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
