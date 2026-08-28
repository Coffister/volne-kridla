import {
  Container,
  Stack,
  Text,
  Section,
  Squircle,
  Image,
} from "@/ui/primitives";
import Carousel from "@/ui/components/Carousel";

import vkTypelogo from "@/assets/hero/volne-kridla.svg";
import { heroCarouselImages } from "@/sections/hero/carousel";

import styles from "./VolneKridlaIntro.module.css";

export default function VolneKridlaIntro() {
  return (
    <Section id="hero" className={styles.section}>
      <Container>
        <Stack direction="column" gap="md" className={styles.stack}>
          <Image src={vkTypelogo} alt="Voľné krídla" className={styles.title} />

          <Squircle radius="2xl" className={styles.carouselWrapper}>
            <Carousel
              images={heroCarouselImages}
              radius="xl"
              className={styles.carousel}
              borderWidth={2}
              borderColor="var(--color-surface-primary)"
            />
          </Squircle>

          <Squircle radius="xl" className={styles.textCard}>
            <Text as="p" variant="body" className={styles.text}>
              {
                "Po viac než dvadsiatich rokoch každodenného života s papagájmi som sa naučila vnímať ich povahu, rešpektovať ich jedinečnosť a chápať, že aj keď majú spoločné črty, každý z nich je osobnosťou. Každý papagáj má svoj vlastný spôsob interakcie či už v kŕdli alebo s človekom, ktorý sa mu stane spoločníkom.\n\nNa tejto stránke s vami zdieľam skúsenosti a poznatky, ktoré Vám môžu pomôcť lepšie porozumieť vášmu papagájovi, nájsť rovnováhu medzi slobodou a hranicami a vytvoriť vzťah založený na dôvere a komunikácii."
              }
            </Text>
          </Squircle>
        </Stack>
      </Container>
    </Section>
  );
}
