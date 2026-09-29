import { Box, Container, Stack, Text, Section, Squircle, Image } from "@/ui/primitives";
import Badge from "@/ui/components/Badge";
import Button from "@/ui/components/Button";
import Carousel from "@/ui/components/Carousel";
import { useKonzultaciaModal } from "@/features/konzultacia-modal";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { galleryImages } from "@/pages/Fotogaleria/images";

// no page-specific CSS — reuses the O mne sections' styles so this page
// stays visually identical to the rest of the site
import introStyles from "@/sections/o-mne-intro/OMneIntro.module.css";
import cardStyles from "@/sections/o-mne-freedom/OMneFreedom.module.css";
import cardAltStyles from "@/sections/o-mne-start/OMneStart.module.css";

// ponytail: placeholder photos from the gallery until the client sends
// photos from actual school/organization presentations
const introCarousel = galleryImages.slice(0, 6);
const ctaCarousel = galleryImages.slice(6);
const [, , whatPhoto, , philosophyPhoto] = galleryImages;

export default function PreSkoly() {
  useDocumentMeta({
    title: "Pre školy a organizácie",
    description:
      "Zážitkové prezentácie o papagájoch pre školy, centrá voľného času, domovy seniorov, komunitné centrá a ďalšie organizácie.",
    path: "/pre-skoly",
  });
  const { open: openKonzultacia } = useKonzultaciaModal();

  return (
    <>
      <Section id="pre-skoly" className={introStyles.section}>
        <Container>
          <Stack direction="column" gap="md" className={introStyles.stack}>
            <Stack direction="column" align="center" gap="xs" className={cardStyles.heading}>
              <Badge>Pre školy a organizácie 🦜</Badge>
            </Stack>

            <Squircle radius="2xl" className={introStyles.carouselWrapper}>
              <Carousel
                images={introCarousel}
                radius="xl"
                className={introStyles.carousel}
                borderWidth={2}
                borderColor="var(--color-surface-primary)"
              />
            </Squircle>

            <Squircle radius="xl" className={introStyles.textCard}>
              <Stack direction="column" align="center" gap="md">
                <Text as="h1" variant="sectionTitle" className={cardStyles.infoTitle}>
                  Objavte svet papagájov tak, ako ho ešte nepoznáte
                </Text>
                <Text as="p" variant="body" className={introStyles.text}>
                  {
                    "Papagáj nie je ozdoba ani „vták do klietky“. Je inteligentný, zvedavý, spoločenský a plný osobnosti. Keď mu začneme rozumieť, otvorí sa nám úplne nový svet.\n\nVo Voľných krídlach prinášame zážitkové prezentácie pre školy, centrá voľného času, domovy seniorov, komunitné centrá a ďalšie organizácie."
                  }
                </Text>
              </Stack>
            </Squircle>
          </Stack>
        </Container>
      </Section>

      <Section id="co-vas-caka" className={cardStyles.section}>
        <Container>
          <Squircle radius="2xl" className={cardStyles.card}>
            <Squircle radius="lg" className={cardStyles.mediaPanel}>
              <Image src={whatPhoto.src} alt={whatPhoto.alt} className={cardStyles.mediaImage} />
            </Squircle>

            <Box className={cardStyles.infoPanel}>
              <Text as="h2" variant="sectionTitle" className={cardStyles.infoTitle}>
                Čo vás čaká?
              </Text>
              <Text as="p" variant="body" className={cardStyles.infoText}>
                {
                  "Spoločne nahliadneme do života papagájov v prírode aj doma. Ukážeme si:\n\n• čo papagáj potrebuje, aby bol spokojný,\n• ako komunikuje a čo nám hovorí rečou tela,\n• prečo hryzie, kričí alebo ničí veci,\n• ako funguje dôvera a tréning,\n• prečo potrebuje pohyb, lietanie a zamestnanie,\n• ako mu vytvoriť bezpečné a podnetné prostredie,\n• a čo znamená dať papagájovi skutočnú slobodu.\n\nNebude to len rozprávanie. Prezentácie sú interaktívne, plné zaujímavostí, otázok a konkrétnych príkladov zo života s papagájmi. Obsah prispôsobíme veku aj publiku – deťom, mladým ľuďom aj seniorom."
                }
              </Text>
            </Box>
          </Squircle>
        </Container>
      </Section>

      <Section id="nasa-filozofia" className={cardAltStyles.section}>
        <Container>
          <Squircle radius="2xl" className={cardAltStyles.card}>
            <Squircle radius="lg" className={cardAltStyles.mediaPanel}>
              <Image
                src={philosophyPhoto.src}
                alt={philosophyPhoto.alt}
                className={cardAltStyles.mediaImage}
              />
            </Squircle>

            <Box className={cardAltStyles.infoPanel}>
              <Text as="h2" variant="sectionTitle" className={cardAltStyles.infoTitle}>
                Naša filozofia
              </Text>
              <Text as="p" variant="body" className={cardStyles.infoText}>
                {
                  "Voľné krídla nie sú iba o voľnom lietaní. Sú o rešpekte, dôvere a porozumení.\n\nChceme ľuďom ukázať, že papagáj môže byť oveľa viac než krásny vták v klietke. Je to osobnosť, ktorá potrebuje priestor, podnety, vzťah a možnosť správať sa prirodzene.\n\nAby mohol byť jednoducho papagájom. 🦜"
                }
              </Text>
            </Box>
          </Squircle>
        </Container>
      </Section>

      <Section id="pre-koho" className={cardStyles.section}>
        <Container>
          <Stack direction="column" gap="md" className={introStyles.stack}>
            <Squircle radius="xl" className={introStyles.textCard}>
              <Stack direction="column" align="center" gap="md">
                <Text as="h2" variant="sectionTitle" className={cardStyles.infoTitle}>
                  Pre koho sú prezentácie určené?
                </Text>
                <Text as="p" variant="body" className={introStyles.text}>
                  {
                    "Pre materské, základné a stredné školy, školské kluby, centrá voľného času, domovy seniorov, tábory, komunitné centrá, záujmové skupiny a chovateľské podujatia.\n\nProgram prispôsobíme veku účastníkov, počtu ľudí aj vašim časovým možnostiam."
                  }
                </Text>
              </Stack>
            </Squircle>

            <Squircle radius="2xl" className={introStyles.carouselWrapper}>
              <Carousel
                images={ctaCarousel}
                radius="xl"
                className={introStyles.carousel}
                borderWidth={2}
                borderColor="var(--color-surface-primary)"
              />
            </Squircle>

            <Squircle radius="xl" className={introStyles.textCard}>
              <Stack direction="column" align="center" gap="md">
                <Text as="h2" variant="sectionTitle" className={cardStyles.infoTitle}>
                  Chcete zažiť svet papagájov zblízka?
                </Text>
                <Text as="p" variant="body" className={introStyles.text}>
                  {
                    "Pozvite Voľné krídla k vám a rezervujte si termín prezentácie.\n\nStačí nám napísať správu s názvom vašej organizácie, mestom, približným počtom a vekom účastníkov a preferovaným termínom. Ozveme sa vám s návrhom programu a dohodneme všetky podrobnosti.\n\nRezervujte si prezentáciu ešte dnes a doprajte svojej skupine zážitok, ktorý zmení pohľad na papagáje.\n\nMožno po našom stretnutí už nikdy neuvidíte papagája len ako farebného vtáka v klietke. Uvidíte v ňom inteligentného, citlivého a fascinujúceho spoločníka 🦜"
                  }
                </Text>
                <Button onClick={() => openKonzultacia()}>Rezervovať prezentáciu</Button>
              </Stack>
            </Squircle>
          </Stack>
        </Container>
      </Section>
    </>
  );
}
