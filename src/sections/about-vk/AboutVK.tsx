import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Box, Container, Stack, Text, Image, Section, Squircle } from "@/ui/primitives";
import Button from "@/ui/components/Button";
import Badge from "@/ui/components/Badge";

import { tabs, type TabId } from "./tabs";

import styles from "./AboutVK.module.css";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function AboutVK() {
  // `activeTab` flips instantly on click (so the button highlights right away);
  // `displayTab` is what the panel actually shows and only catches up once the
  // outgoing content has animated away
  const [activeTab, setActiveTab] = useState<TabId>("flight");
  const [displayTab, setDisplayTab] = useState<TabId>("flight");
  const contentRef = useRef<HTMLDivElement | null>(null);

  // tabs go full-width below this breakpoint, so the panel's top-right corner
  // needs to turn sharp too — Squircle takes its radius as a prop, not CSS
  const [isTabsFullWidth, setIsTabsFullWidth] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)");
    const update = () => setIsTabsFullWidth(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // route change picked a different tab -> fade the current panel out, swap, in
  useEffect(() => {
    if (activeTab === displayTab) return;

    const element = contentRef.current;
    if (!element || prefersReducedMotion()) {
      setDisplayTab(activeTab);
      return;
    }

    const swap = () => setDisplayTab(activeTab);

    const tween = gsap.to(element, {
      opacity: 0,
      y: 10,
      filter: "blur(4px)",
      duration: 0.18,
      ease: "power2.in",
      overwrite: true,
      onComplete: swap,
    });

    // safety net for a throttled rAF loop (e.g. backgrounded tab)
    const safety = window.setTimeout(swap, 500);

    return () => {
      window.clearTimeout(safety);
      tween.kill();
    };
  }, [activeTab, displayTab]);

  // play the entrance whenever the shown tab actually changes
  useLayoutEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    if (prefersReducedMotion()) {
      gsap.set(element, { opacity: 1, y: 0, filter: "blur(0px)" });
      return;
    }

    const tween = gsap.fromTo(
      element,
      { opacity: 0, y: -10, filter: "blur(4px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.3,
        ease: "power2.out",
        overwrite: true,
        onComplete: () => gsap.set(element, { clearProps: "opacity,filter,transform" }),
      },
    );

    // safety net for a throttled rAF loop (e.g. backgrounded tab): drop every
    // tween on the node and force it to the finished, visible state
    const safety = window.setTimeout(() => {
      gsap.killTweensOf(element);
      gsap.set(element, { opacity: 1, y: 0, filter: "none" });
    }, 700);

    return () => {
      window.clearTimeout(safety);
      tween.kill();
    };
  }, [displayTab]);

  const currentTab = tabs.find((tab) => tab.id === displayTab) ?? tabs[0];
  const isVideoTabMedia = /\.(webm|mp4|mov|ogg)$/i.test(currentTab.tabimage);

  return (
    <Section className={styles.section}>
      <Container className={styles.container}>
        <Stack direction="column" align="center" className={styles.sectionheader}>
          <Text as="h2" variant="sectionTitle" className={styles.title}>
            O Voľných Krídlach
          </Text>
          <Badge>Aký druh tréningu je pre vás vhodný?</Badge>
        </Stack>

        <Box className={styles.tabsWrapper}>
          <Squircle
            radius={{ topLeft: 18, topRight: 18, bottomRight: 0, bottomLeft: 0 }}
            className={styles.tabShell}
          >
            <Stack direction="row" className={styles.tabs} gap="xs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`${styles.tabButton} ${
                    activeTab === tab.id ? styles.tabButtonActive : ""
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </Stack>
          </Squircle>

          <Squircle
            radius={{
              topLeft: 0,
              topRight: isTabsFullWidth ? 0 : 40,
              bottomRight: 40,
              bottomLeft: 40,
            }}
            className={styles.panel}
          >
            <div ref={contentRef} className={styles.contentGrid}>
              <Squircle radius={18} className={styles.mediaCard}>
                <Text as="h3" variant="sectionTitle" className={styles.mediaTitle}>
                  {currentTab.imageTitle}
                </Text>

                <Box className={styles.mediaFrame}>
                  {isVideoTabMedia ? (
                    <video
                      src={currentTab.tabimage}
                      className={styles.mediaVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <Image
                      src={currentTab.tabimage}
                      alt={currentTab.imageTitle}
                      className={styles.mediaImage}
                    />
                  )}
                </Box>
              </Squircle>

              <Squircle radius={26} className={styles.infoCard}>
                <Text as="h2" variant="sectionTitle"  className={styles.infoTitle}>
                  {currentTab.title}
                </Text>

                <Text as="p" variant="body" className={styles.infoText}>
                  {currentTab.description}
                </Text>

                <div className={styles.divider} />

                <Stack direction="column" gap="sm" className={styles.benefitsList}>
                  {currentTab.benefits.map((benefit) => (
                    <Squircle key={benefit.title} radius={16} className={styles.benefitItem}>
                      <Image
                        src={benefit.image}
                        alt={benefit.title}
                        className={styles.benefitIcon}
                      />

                      <Box className={styles.benefitTextWrap}>
                        <Text as="h4" className={styles.benefitTitle}>
                          {benefit.title}
                        </Text>
                        <Text as="p" variant="caption" className={styles.benefitText}>
                          {benefit.description}
                        </Text>
                      </Box>
                    </Squircle>
                  ))}
                </Stack>

                <Button className={styles.ctaButton} variant="primary" size="sm">
                  {currentTab.cta}
                </Button>
              </Squircle>
            </div>
          </Squircle>
        </Box>
      </Container>
    </Section>
  );
}