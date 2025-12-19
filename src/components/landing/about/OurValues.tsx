'use client';

import React from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';

interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

const coreValues: ValueItem[] = [
  {
    icon: 'pi pi-user',
    title: 'True Discipleship',
    description: 'I am a true disciple with Christ-like character and a multiplying ministry.',
  },
  {
    icon: 'pi pi-eye',
    title: 'Caught by the Vision',
    description: 'I understand, live, and transmit the vision of our church.',
  },
  {
    icon: 'pi pi-users',
    title: 'Committed to Cell Life',
    description: 'I embrace evangelism, leadership development, and multiplication.',
  },
  {
    icon: 'pi pi-heart-fill',
    title: 'Passionate Spirituality',
    description: 'I pursue daily devotions, fasting, prayer, and holiness.',
  },
  {
    icon: 'pi pi-shield',
    title: 'Submission to Authority',
    description: 'I love, honor, and respect my leaders.',
  },
  {
    icon: 'pi pi-clock',
    title: 'Committed to Time',
    description: 'I manage and invest my time for the Kingdom.',
  },
  {
    icon: 'pi pi-link',
    title: 'Lifelong Relationships',
    description: 'I am accountable and responsible in my relationships.',
  },
  {
    icon: 'pi pi-book',
    title: 'I Love Training & Equipping',
    description: 'Training is my happy hour—I pursue continuous growth.',
  },
  {
    icon: 'pi pi-sitemap',
    title: 'Leader of Twelve Disciples',
    description: 'I am born to multiply and raise up leaders.',
  },
  {
    icon: 'pi pi-flag',
    title: 'Accomplishing Church Goals',
    description: "I support, help, and fulfill our church's goals.",
  },
  {
    icon: 'pi pi-chart-line',
    title: 'I Want to See My Church Grow',
    description: 'I pray, work, and pay to see our church flourish.',
  },
  {
    icon: 'pi pi-star',
    title: 'The Importance of Young People',
    description: 'I will prepare and invest in the next generation.',
  },
];

interface BeliefItem {
  title: string;
  summary: string;
  description: string;
}

const beliefs: BeliefItem[] = [
  {
    title: 'The Scriptures Inspired',
    summary: 'The Bible is God\'s infallible Word to us.',
    description:
      'The Scriptures, both the Old and New Testaments, are verbally inspired of God and are the revelation of God to man, the infallible, authoritative rule of faith and conduct.',
  },
  {
    title: 'The One True God',
    summary: 'One God revealed in three persons.',
    description:
      'The one true God has revealed Himself as the eternally self-existent "I AM," the Creator of heaven and earth and the Redeemer of mankind. He has further revealed Himself as embodying the principles of relationship and association as Father, Son, and Holy Spirit.',
  },
  {
    title: 'The Deity of the Lord Jesus Christ',
    summary: 'Jesus Christ is fully God and fully man.',
    description:
      'The Lord Jesus Christ is the eternal Son of God. The Scriptures declare: His virgin birth, His sinless life, His miracles, His substitutionary work on the cross, His bodily resurrection from the dead, and His exaltation to the right hand of God.',
  },
  {
    title: 'The Fall of Man',
    summary: 'Humanity fell through disobedience.',
    description:
      'Man was created good and upright; for God said, "Let us make man in our own image, after our likeness." However, man by voluntary transgression fell and thereby incurred not only physical death but also spiritual death, which is separation from God.',
  },
  {
    title: 'The Salvation of Man',
    summary: 'Salvation through faith in Jesus Christ.',
    description:
      "Man's only hope of redemption is through the shed blood of Jesus Christ the Son of God. Salvation is received through repentance toward God and faith toward the Lord Jesus Christ. By the washing of regeneration and renewing of the Holy Spirit, being justified by grace through faith, man becomes an heir of God.",
  },
  {
    title: 'The Ordinances of the Church',
    summary: 'Baptism and Communion commanded by Christ.',
    description:
      'Baptism in Water: The ordinance of baptism by immersion is commanded by the Scriptures. All who repent and believe on Christ as Savior and Lord are to be baptized. Holy Communion: The Lord\'s Supper, consisting of the elements—bread and the fruit of the vine—is the symbol expressing our sharing the divine nature of our Lord Jesus Christ.',
  },
  {
    title: 'The Baptism in the Holy Spirit',
    summary: 'A distinct experience for all believers.',
    description:
      'All believers are entitled to and should ardently expect and earnestly seek the promise of the Father, the baptism in the Holy Spirit and fire, according to the command of our Lord Jesus Christ. This was the normal experience of all in the early Christian Church. With it comes the enduement of power for life and service.',
  },
  {
    title: 'The Initial Physical Evidence',
    summary: 'Speaking in tongues as initial evidence.',
    description:
      'The baptism of believers in the Holy Spirit is witnessed by the initial physical sign of speaking with other tongues as the Spirit of God gives them utterance. The speaking in tongues in this instance is the same in essence as the gift of tongues, but is different in purpose and use.',
  },
  {
    title: 'Sanctification',
    summary: 'Living a holy and separated life.',
    description:
      'Sanctification is an act of separation from that which is evil, and of dedication unto God. Scriptures teach a life of "holiness without which no man shall see the Lord." By the power of the Holy Spirit we are able to obey the command: "Be ye holy, for I am holy."',
  },
  {
    title: 'The Church and Its Mission',
    summary: 'The Body of Christ with a divine mission.',
    description:
      'The Church is the Body of Christ, the habitation of God through the Spirit, with divine appointments for the fulfillment of her great commission. Each believer, born of the Spirit, is an integral part of the General Assembly and Church of the Firstborn, which are written in heaven.',
  },
  {
    title: 'The Ministry',
    summary: 'God-called leaders to equip the saints.',
    description:
      'A divinely called and scripturally ordained ministry has been provided by our Lord for the fourfold purpose of leading the Church in: (1) Evangelization of the world, (2) Worship of God, (3) Building a body of saints being perfected in the image of His Son, (4) Meeting human need with ministries of love and compassion.',
  },
  {
    title: 'Divine Healing',
    summary: 'Healing provided in the atonement.',
    description:
      'Divine healing is an integral part of the gospel. Deliverance from sickness is provided for in the atonement, and is the privilege of all believers. "He Himself took our infirmities and bore our sicknesses."',
  },
  {
    title: 'The Blessed Hope',
    summary: 'The rapture of the Church.',
    description:
      'The resurrection of those who have fallen asleep in Christ and their translation together with those who are alive and remain unto the coming of the Lord is the imminent and blessed hope of the Church.',
  },
  {
    title: 'The Millennial Reign of Christ',
    summary: 'Christ will reign on earth for 1,000 years.',
    description:
      'The second coming of Christ includes the rapture of the saints, which is our blessed hope, followed by the visible return of Christ with His saints to reign on earth for one thousand years. This millennial reign will bring the salvation of national Israel and the establishment of universal peace.',
  },
  {
    title: 'The Final Judgment',
    summary: 'All will stand before God.',
    description:
      'There will be a final judgment in which the wicked dead will be raised and judged according to their works. Whosoever is not found written in the Book of Life, together with the devil and his angels, the beast and the false prophet, will be consigned to the everlasting punishment in the lake which burneth with fire and brimstone.',
  },
  {
    title: 'The New Heavens and New Earth',
    summary: 'God will create all things new.',
    description:
      '"We, according to His promise, look for new heavens and a new earth, wherein dwelleth righteousness." This is the ultimate fulfillment of God\'s redemptive plan, where believers will dwell with God for eternity.',
  },
];

export const OurValues: React.FC = () => {
  return (
    <section id="our-values" className="our-values-section animate-on-scroll">
      <div className="landing-container">
        <div className="values-header">
          <span className="section-label">Our Values</span>
          <h2>What Shapes Us</h2>
          <p className="values-subtitle">
            These core values guide everything we do and who we are as a community.
          </p>
        </div>

        <div className="values-grid">
          {coreValues.map((value, index) => (
            <div key={index} className="value-card">
              <div className="value-icon">
                <i className={value.icon}></i>
              </div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>

        <div id="what-we-believe" className="beliefs-section">
          <div className="beliefs-header">
            <span className="section-label">What We Believe</span>
            <h2>16 Fundamental Truths</h2>
            <p className="beliefs-subtitle">
              Based on the Assemblies of God Statement of Fundamental Truths
            </p>
          </div>

          <div className="beliefs-accordion">
            <Accordion multiple>
              {beliefs.map((belief, index) => (
                <AccordionTab
                  key={index}
                  header={
                    <div className="belief-accordion-header">
                      <span className="belief-number">{index + 1}</span>
                      <div className="belief-header-content">
                        <span className="belief-title">{belief.title}</span>
                        <span className="belief-summary">{belief.summary}</span>
                      </div>
                    </div>
                  }
                >
                  <div className="belief-accordion-content">
                    <p>{belief.description}</p>
                  </div>
                </AccordionTab>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurValues;
