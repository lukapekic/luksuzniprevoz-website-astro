---
routeKey: delegationTransportation
locale: sr
pageType: service
status: published
translationState: reviewed
reviewedOn: 2026-09-13
noindex: false

seoTitle: "Prevoz delegacija u Beogradu"
seoDescription: "Prevoz delegacija u Beogradu uz namenskog koordinatora, više vozila i usaglašen raspored. Aerodrom, hotel i sastanci prema planu vaše posete."

hero:
  title: "Prevoz delegacija u Beogradu"
  description: "Prevoz za delegacije i rukovodioce sa više lokacija u programu. Različite klase vozila i jedna kontakt osoba za koordinaciju celog plana."
  primaryCta:
    label: "Započnite rezervaciju"
    target: { type: flow, flowKey: booking }
  secondaryCta:
    label: "Zatražite ponudu"
    target: { type: flow, flowKey: quote }

overview:
  heading:
    title: "Jedan plan za sve vožnje delegacije"
    intro: "Članovi delegacije mogu putovati odvojeno, sa različitih adresa i u različito vreme."
  body: "Svakoj grupi dodeljujemo odgovarajuće vozilo i vreme polaska. Koordinator prati kako se pojedinačne vožnje uklapaju u program delegacije."

sections:
  - key: audience
    heading:
      title: "Za delegacije i organizatore poseta"
      intro: "Za posete u kojima je potrebno uskladiti više vozila sa programom delegacije."
    body: "Organizator sa jednom kontakt osobom dogovara vozila, adrese i polaske za sve grupe. To olakšava planiranje kada članovi delegacije imaju različite obaveze."
    items:
      - {
          title: "Diplomatske misije i ambasade",
          text: "Za organizaciju prevoza gostiju i delegacija kada profesionalan nastup, raspored i diskrecija imaju poseban značaj.",
        }
      - {
          title: "Zvanične i institucionalne delegacije",
          text: "Za posete u kojima kretanje više članova treba uskladiti sa zajedničkim programom.",
        }
      - {
          title: "Međunarodne organizacije",
          text: "Za goste, predstavnike i timove kojima je potreban organizovan prevoz između tačaka programa.",
        }
      - {
          title: "Poslovne delegacije i rukovodstvo",
          text: "Za rukovodioce, partnere i poslovne grupe koje tokom posete koriste različite automobile ili putuju odvojeno.",
        }
      - {
          title: "Domaćini, asistenti i koordinatori",
          text: "Za osobe koje pripremaju posetu i žele da prevoz svih članova dogovaraju sa jednim koordinatorom.",
        }

  - key: movement
    heading:
      title: "Od dolaska do završetka posete"
      intro: "Neke vožnje mogu biti zajedničke, a druge odvojene. U rasporedu određujemo ko putuje, kojim vozilom i na koju adresu."
    body: "Primer prikazuje način koordinacije. Konačan plan pripremamo prema programu, grupama i lokacijama koje pošaljete."

  - key: mixedFleet
    heading:
      title: "Limuzine i kombi za članove delegacije"
      intro: "Izbor zavisi od broja putnika, njihovih obaveza i toga ko putuje zajedno."
    body: "Rukovodioci mogu putovati odvojeno, dok ostali članovi delegacije koriste zajedničko vozilo. Kombinaciju proveravamo prema broju putnika, prtljagu i programu."
    items:
      - {
          title: "Reprezentativna limuzina",
          text: "Za rukovodioca ili člana delegacije sa zasebnim rasporedom.",
        }
      - {
          title: "Poslovna limuzina",
          text: "Za članove delegacije koji na sastanke putuju odvojeno.",
        }
      - {
          title: "Mercedes-Benz V-Class",
          text: "Za članove delegacije koji na dogovorena odredišta putuju zajedno.",
        }

  - key: discretion
    heading:
      title: "Diskrecija i unapred dogovoreni uslovi"
      intro: "Formalne zahteve poverljivosti navedite pre dogovora o prevozu."
    body: "Vozači su obučeni za diskretan odnos prema putnicima. Ugovor o poverljivosti (NDA) ili druge pisane uslove razmatramo unapred; važe tek kada su usaglašeni i potvrđeni pisanim putem."

  - key: briefing
    heading:
      title: "Šta nam je potrebno za ponudu"
      intro: "Pošaljite program posete, čak i ako pojedini termini još nisu konačni."
    body: "Navedite adrese, termine, broj putnika i ko putuje zajedno. Dodajte željena vozila i posebne zahteve. Na osnovu toga proveravamo raspoloživost i pripremamo ponudu."

vehicleRecommendations:
  heading:
    title: "Vozila za vašu delegaciju"
    intro: "Mercedes-Benz S-Class, E-Class i V-Class za pojedinačne putnike i manje grupe, prema programu delegacije."
  vehicleIds: [mercedes-s-class, mercedes-e-class, mercedes-v-class-7-plus-1-extra-long]
  cta:
    label: "Pogledajte sva vozila"
    target: { type: route, routeKey: fleet }

faq:
  heading: "Česta pitanja o prevozu delegacija"
  items:
    - {
        question: "Možete li organizovati više vozila za jednu delegaciju?",
        answer: "{multipleVehiclesAnswer}",
      }
    - { question: "Mogu li se kombinovati različite klase vozila?", answer: "{mixedClassesAnswer}" }
    - {
        question: "Da li imamo kontakt osobu za koordinaciju prevoza?",
        answer: "{coordinatorAnswer}",
      }
    - {
        question: "Koje podatke treba da pošaljem za pripremu ponude?",
        answer: "Pošaljite datume, vremena, lokacije, broj putnika, raspored grupa i željena vozila. Navedite sve posebne zahteve koji utiču na organizaciju ili poverljivost.",
      }
    - {
        question: "Mogu li grupe putovati sa različitih adresa?",
        answer: "{groupMovementAnswer}",
      }
    - {
        question: "Možemo li zahtevati ugovor o poverljivosti?",
        answer: "{ndaAnswer}",
      }
    - { question: "Da li je zahtev potvrđen odmah nakon slanja?", answer: "{confirmationAnswer}" }
    - {
        question: "Da li prevoz delegacija uključuje uslugu obezbeđenja ili zaštite?",
        answer: "{securityAnswer}",
      }

finalCta:
  heading: "Dogovorimo prevoz delegacije"
  text: "Pošaljite program posete, broj putnika, adrese i posebne zahteve. Pripremićemo ponudu nakon provere rasporeda i vozila."
  primaryCta:
    label: "Započnite rezervaciju"
    target: { type: flow, flowKey: booking }
  secondaryCta:
    label: "Zatražite ponudu"
    target: { type: flow, flowKey: quote }
---
