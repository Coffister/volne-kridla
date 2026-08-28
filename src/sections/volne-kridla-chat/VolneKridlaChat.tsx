import { useEffect, useRef } from "react";
import { Box, Container, Stack, Text, Section, Squircle } from "@/ui/primitives";
import Badge from "@/ui/components/Badge";
import PlusIcon from "@/ui/icons/PlusIcon";
import CameraIcon from "@/ui/icons/CameraIcon";
import MicrophoneIcon from "@/ui/icons/MicrophoneIcon";

import { chatMessages, typingMessages } from "./messages";

import styles from "./VolneKridlaChat.module.css";

const DISPLAY_TIME = 2000; // gap between messages appearing
const LOOP_DELAY = 1500; // pause before the reveal loop restarts
const RESET_SCROLL_DURATION = 400; // ms, smooth scroll back to top

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function VolneKridlaChat() {
  const containerRef = useRef<HTMLDivElement>(null);
  const typingTextRef = useRef<HTMLSpanElement>(null);

  // message reveal loop — ported from the original vanilla-JS widget, driven
  // by direct DOM manipulation (matching how the source script worked) rather
  // than React state, since it's a continuous self-playing animation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const messages = Array.from(container.children) as HTMLElement[];

    const startChatLoop = () => {
      messages.forEach((msg) => msg.classList.remove(styles.messageShow));
      container.scrollTop = 0;
      let index = 0;

      const showNext = () => {
        if (cancelled) return;

        if (index < messages.length) {
          const msg = messages[index];
          msg.classList.add(styles.messageShow);

          const msgBottom = msg.offsetTop + msg.offsetHeight;
          const containerBottom = container.scrollTop + container.clientHeight;

          if (msgBottom > containerBottom) {
            const paddingOffset = 20;
            container.scrollTo({
              top: msgBottom - container.clientHeight + paddingOffset,
              behavior: "smooth",
            });
          }

          index++;
          timeoutId = setTimeout(showNext, DISPLAY_TIME);
        } else {
          timeoutId = setTimeout(() => {
            const start = container.scrollTop;
            const startTime = performance.now();

            const animate = (now: number) => {
              if (cancelled) return;

              const elapsed = Math.min(1, (now - startTime) / RESET_SCROLL_DURATION);
              const eased = easeInOutCubic(elapsed);
              container.scrollTop = start * (1 - eased);

              if (elapsed < 1) {
                requestAnimationFrame(animate);
              } else {
                messages.forEach((msg) => msg.classList.remove(styles.messageShow));
                container.scrollTop = 0;
                timeoutId = setTimeout(startChatLoop, 200);
              }
            };

            requestAnimationFrame(animate);
          }, LOOP_DELAY);
        }
      };

      showNext();
    };

    startChatLoop();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  // typing/deleting effect in the fake input bar
  useEffect(() => {
    const typingText = typingTextRef.current;
    if (!typingText) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    let messageIndex = 0;
    let isDeleting = false;
    let charIndex = 0;

    const typeStep = () => {
      if (cancelled) return;

      const currentMessage = typingMessages[messageIndex];

      if (isDeleting) {
        typingText.textContent = currentMessage.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          messageIndex = (messageIndex + 1) % typingMessages.length;
          timeoutId = setTimeout(typeStep, 500);
        } else {
          timeoutId = setTimeout(typeStep, 50);
        }
      } else {
        typingText.textContent = currentMessage.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentMessage.length) {
          isDeleting = true;
          timeoutId = setTimeout(typeStep, 2000);
        } else {
          timeoutId = setTimeout(typeStep, 100);
        }
      }
    };

    typeStep();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <Section className={styles.section}>
      <Container>
        <Stack direction="row" justify="center" align="center" className={styles.heading}>
          <Badge>Reakcie ľudí po tréningu</Badge>
        </Stack>

        <Squircle
          radius="2xl"
          borderWidth={4}
          borderColor="var(--color-border-primary)"
          className={styles.chatBox}
        >
          <Squircle radius="xl" className={styles.chatBoxHeader}>
            <Stack direction="row" align="center">
              <Box className={styles.avatar} />
              <Text as="span" className={styles.titlePill}>
                Správy od spokojných majiteľov
              </Text>
            </Stack>
          </Squircle>

          <Box className={styles.divider} />

          <Squircle radius="lg" className={styles.chatContainerWrap}>
            <div className={styles.chatContainer} ref={containerRef}>
              {chatMessages.map((message, index) => (
                <div
                  key={message}
                  className={`${styles.message} ${index % 2 === 0 ? styles.messageLeft : styles.messageRight}`}
                >
                  {message}
                </div>
              ))}
            </div>
          </Squircle>

          <Box className={styles.divider} />

          <Stack direction="row" align="center" gap="sm" className={styles.chatFunctions}>
            <Squircle radius="sm" className={styles.plusBtn}>
              <PlusIcon />
            </Squircle>

            <Squircle radius="md" className={styles.textInput}>
              <span className={styles.typingText} ref={typingTextRef} />
              <span className={styles.cursor} />
            </Squircle>

            <Stack direction="row" align="center" gap="sm" className={styles.trailingIcons}>
              <CameraIcon />
              <MicrophoneIcon />
            </Stack>
          </Stack>
        </Squircle>
      </Container>
    </Section>
  );
}
