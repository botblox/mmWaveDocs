import {useEffect, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const capabilities = [
  {
    value: '4D',
    label: 'Radar imaging',
    detail: 'Range, velocity, azimuth, and elevation',
  },
  {
    value: '200 m',
    label: 'Maximum range',
    detail: 'With the long-range antenna configuration',
  },
  {
    value: '76–81 GHz',
    label: 'Frequency band',
    detail: 'High-performance mmWave sensing',
  },
  {
    value: '0.039 m',
    label: 'Range resolution',
    detail: 'Configurable for application requirements',
  },
  {
    value: '100BASE-TX',
    label: 'Ethernet output',
    detail: 'Built for embedded integration',
  },
];

const applications = [
  'Counter-UAS',
  'Autonomous navigation',
  'Aerial robotics',
];

export default function Home(): ReactNode {
  /*
   * useBaseUrl adds the configured Docusaurus baseUrl to these paths.
   *
   * Locally:
   * /img/mmwave/home/mmwave-core-render.png
   *
   * On GitHub Pages:
   * /botblox-mmwave-docs/img/mmwave/home/mmwave-core-render.png
   */
  const productRenderUrl = useBaseUrl(
    '/img/mmwave/home/mmwave-core-render.png',
  );

  const productStackUrl = useBaseUrl(
    '/img/mmwave/home/mmwave-core-stack.png',
  );

  /*
   * This class lets custom.css style the navbar differently on the
   * landing page. It is removed when the user navigates to the docs.
   */
  useEffect(() => {
    document.body.classList.add('mmwave-homepage');

    return () => {
      document.body.classList.remove('mmwave-homepage');
    };
  }, []);

  return (
    <Layout
      title="mmWave Core Documentation"
      description="Technical documentation, integration guides, and radar fundamentals for the BotBlox mmWave Core.">
      <main className={styles.page}>
        {/* Hero */}
        <section className={styles.hero}>
          <div
            className={styles.heroOverlay}
            aria-hidden="true"
          />

          <div className={`container ${styles.heroContainer}`}>
            <div className={styles.heroContent}>
              <p className={styles.eyebrow}>
                BOTBLOX SYSTEMS
              </p>

              <Heading as="h1" className={styles.heroTitle}>
                <span className={styles.heroTitleLine}>mmWave</span>
                <span className={styles.heroTitleLine}>Core</span>
              </Heading>

              <p className={styles.heroLead}>
                Compact, configurable 4D radar sensing for autonomous
                navigation, aerial robotics, and counter-UAS systems.
              </p>

              <div className={styles.heroButtons}>
                <Link
                  className="button button--primary button--lg"
                  to="/docs">
                  Explore the documentation
                </Link>

                <Link
                  className={`button button--outline button--secondary button--lg ${styles.secondaryButton}`}
                  to="/docs/quickstart">
                  Quick start
                </Link>
              </div>

              <p className={styles.heroNote}>
                Range · Velocity · Azimuth · Elevation
              </p>
            </div>

            <div className={styles.heroProduct}>
              <div
                className={styles.productGlow}
                aria-hidden="true"
              />

              <img
                src={productRenderUrl}
                alt="BotBlox mmWave Core radar module"
                fetchPriority="high"
              />
            </div>
          </div>

          <a
            className={styles.scrollCue}
            href="#capabilities"
            aria-label="Scroll to mmWave Core capabilities">
            <span>Scroll to explore</span>

            <span
              className={styles.scrollArrow}
              aria-hidden="true">
              ↓
            </span>
          </a>
        </section>

        {/* Capabilities */}
        <section
          id="capabilities"
          className={styles.capabilitiesSection}>
          <div className={`container ${styles.capabilitiesGrid}`}>
            {capabilities.map((capability) => (
              <article
                className={styles.capabilityCard}
                key={capability.label}>
                <p className={styles.capabilityValue}>
                  {capability.value}
                </p>

                <Heading
                  as="h2"
                  className={styles.capabilityLabel}>
                  {capability.label}
                </Heading>

                <p className={styles.capabilityDetail}>
                  {capability.detail}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Modular hardware */}
        <section className={styles.modularSection}>
          <div className={`container ${styles.splitLayout}`}>
            <div className={styles.sectionCopy}>
              <p className={styles.sectionEyebrow}>
                MODULAR HARDWARE
              </p>

              <Heading
                as="h2"
                className={styles.sectionTitle}>
                Tiny, modular, and stackable
              </Heading>

              <p className={styles.sectionLead}>
                Exchange antenna modules to support different ranges and
                fields of view while maintaining the same electrical and
                mechanical form factor.
              </p>

              <div className={styles.inlineStats}>
                <div>
                  <strong>46 × 46 mm</strong>
                  <span>Form factor</span>
                </div>

                <div>
                  <strong>12 V</strong>
                  <span>Supply voltage</span>
                </div>

                <div>
                  <strong>USB + Ethernet</strong>
                  <span>Host connectivity</span>
                </div>
              </div>
            </div>

            <div className={styles.modularImage}>
              <div
                className={styles.redGlow}
                aria-hidden="true"
              />

              <img
                src={productStackUrl}
                alt="Modular construction of the BotBlox mmWave Core"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Configurable performance */}
        <section className={styles.performanceSection}>
          <div
            className={styles.performanceDiagram}
            aria-hidden="true"
          />

          <div
            className={styles.performanceOverlay}
            aria-hidden="true"
          />

          <div className={`container ${styles.performanceContent}`}>
            <div className={styles.performanceCopy}>
              <p className={styles.sectionEyebrow}>
                CONFIGURABLE PERFORMANCE
              </p>

              <Heading
                as="h2"
                className={styles.sectionTitle}>
                Tune the radar for the mission
              </Heading>

              <p className={styles.sectionLead}>
                Configure radar profiles around range, resolution, field of
                view, velocity performance, and frame rate.
              </p>

              <div className={styles.performanceStats}>
                <div>
                  <strong>Up to 200 m</strong>
                  <span>Long-range detection</span>
                </div>

                <div>
                  <strong>Down to 3.9 cm</strong>
                  <span>Range resolution</span>
                </div>

                <div>
                  <strong>Down to 0.03 m/s</strong>
                  <span>Velocity resolution</span>
                </div>

                <div>
                  <strong>Up to 74° azimuth</strong>
                  <span>Configurable field of view</span>
                </div>
              </div>

              <Link
                className={`button button--primary button--lg ${styles.performanceButton}`}
                to="/docs/Radar%20Fundamentals/Range">
                Learn how radar configuration works
              </Link>
            </div>
          </div>
        </section>

        {/* Applications */}
        <section className={styles.applicationsSection}>
          <div
            className={styles.applicationsOverlay}
            aria-hidden="true"
          />

          <div className={`container ${styles.applicationsContent}`}>
            <p className={styles.sectionEyebrow}>
              BUILT FOR AUTONOMOUS SYSTEMS
            </p>

            <Heading
              as="h2"
              className={styles.applicationTitle}>
              Reliable sensing when optical sensors are challenged
            </Heading>

            <p className={styles.applicationLead}>
              mmWave Core measures object range, direction, and velocity
              while operating through darkness, fog, dust, and smoke.
            </p>

            <div className={styles.applicationTags}>
              {applications.map((application) => (
                <span key={application}>
                  {application}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Final call to action */}
        <section className={styles.finalCta}>
          <div className="container">
            <p className={styles.sectionEyebrow}>
              START BUILDING
            </p>

            <Heading
              as="h2"
              className={styles.ctaTitle}>
              Integrate mmWave Core
            </Heading>

            <p className={styles.ctaLead}>
              Follow the setup guide, learn radar fundamentals, and configure
              your first sensing profile.
            </p>

            <div className={styles.ctaButtons}>
              <Link
                className="button button--primary button--lg"
                to="/docs/quickstart">
                Open the quick-start guide
              </Link>

              <Link
                className="button button--outline button--secondary button--lg"
                to="/docs">
                Browse all documentation
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}