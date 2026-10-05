import { Category, Question } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-prompting',
    name: 'Prompting & LLMs',
    color: '#06b6d4', // Cyan
  },
  {
    id: 'cat-didaktik',
    name: 'KI im Schulzimmer',
    color: '#a855f7', // Purple
  },
  {
    id: 'cat-ethik',
    name: 'Ethik, Recht & Limits',
    color: '#10b981', // Emerald
  },
];

export const DEFAULT_QUESTIONS: Question[] = [
  // KATEGORIE 1: Prompting & LLMs
  {
    id: 'q-prompt-1',
    categoryId: 'cat-prompting',
    level: 1,
    points: 100,
    question: 'Was versteht man unter "Zero-Shot Prompting"?',
    options: [
      'Ein Prompt ganz ohne Text, nur mit Emojis',
      'Eine direkte Aufgabenstellung ohne vorherige Beispiele',
      'Das Löschen des Modell-Gedächtnisses vor der Anfrage',
      'Ein Prompt, der mit null Tokens berechnet wird',
    ],
    correctIndex: 1,
    explanation:
      'Beim Zero-Shot Prompting formuliert man die Aufgabe direkt (z. B. "Übersetze folgenden Text ins Französische"), ohne dem Modell vorab Lernbeispiele (Few-Shot) mitzugeben.',
  },
  {
    id: 'q-prompt-2',
    categoryId: 'cat-prompting',
    level: 2,
    points: 200,
    question: 'Was bezeichnet man bei grossen Sprachmodellen als "Halluzination"?',
    options: [
      'Wenn das Modell wegen Überlastung den Dienst einstellt',
      'Ein grafischer Darstellungsfehler im Chat-Interface',
      'Überzeugend formulierte, aber sachlich völlig falsche Aussagen',
      'Das Erkennen von Gesichtern in zufälligen Pixelmustern',
    ],
    correctIndex: 2,
    explanation:
      'Sprachmodelle sagen immer das statistisch wahrscheinlichste nächste Token voraus. Wenn ihnen Fakten fehlen, erfinden sie plausibel klingende, aber frei erfundene Inhalte.',
  },
  {
    id: 'q-prompt-3',
    categoryId: 'cat-prompting',
    level: 3,
    points: 300,
    question: 'Welches Vorgehen kennzeichnet "Chain-of-Thought" (Gedankenkette) Prompting?',
    options: [
      'Das Modell wird aufgefordert, Schritt für Schritt laut nachzudenken',
      'Mehrere Sprachmodelle werden in einer Kette hintereinandergeschaltet',
      'Das Verknüpfen von Prompts mit externen SQL-Datenbanken',
      'Ein wiederholtes Einfügen desselben Wortes im Prompt',
    ],
    correctIndex: 0,
    explanation:
      'Durch Zusätze wie "Denke Schritt für Schritt nach" zerlegt das Modell komplexe logische Aufgaben in Zwischenschritte, was Rechen- und Denkfehler drastisch reduziert.',
  },
  {
    id: 'q-prompt-4',
    categoryId: 'cat-prompting',
    level: 4,
    points: 400,
    question: 'Was bewirkt ein höherer "Temperature"-Wert (z. B. 0.9 statt 0.2) bei einem LLM?',
    options: [
      'Die GPU des Rechenzentrums taktet schneller und verbraucht mehr Strom',
      'Das Modell antwortet deterministischer und sachlich konservativer',
      'Die Antworten werden kreativer, variabler und überraschender',
      'Die maximale Zeichenanzahl der Ausgabe verdoppelt sich',
    ],
    correctIndex: 2,
    explanation:
      'Die Temperature steuert die Zufallsauswahl unter den wahrscheinlichsten Folgewörtern: Ein tiefer Wert (0.0–0.2) wählt fast immer das wahrscheinlichste Token (faktentreu), ein hoher Wert sorgt für mehr Kreativität.',
  },

  // KATEGORIE 2: KI im Schulzimmer
  {
    id: 'q-didaktik-1',
    categoryId: 'cat-didaktik',
    level: 1,
    points: 100,
    question: 'Wie fungiert KI am wirkungsvollsten als "Sokratischer Tutor"?',
    options: [
      'Indem sie die fertigen Hausaufgaben komplett für Lernende löst',
      'Indem sie durch gezielte Rückfragen das eigene Nachdenken anregt',
      'Indem sie Noten automatisch ohne Lehrperson vergibt',
      'Indem sie alle Rechtschreibfehler stillschweigend korrigiert',
    ],
    correctIndex: 1,
    explanation:
      'Statt fertige Antworten zu liefern, gibt ein sokratischer KI-Tutor Denkanstösse, stellt Leitfragen und hilft Schülerinnen und Schülern, selbst auf die Lösung zu kommen.',
  },
  {
    id: 'q-didaktik-2',
    categoryId: 'cat-didaktik',
    level: 2,
    points: 200,
    question: 'Welcher Aspekt rückt bei der Beurteilung in den Fokus, wenn Lernende KI nutzen dürfen?',
    options: [
      'Reine Textmenge und Seitenzahl der Abgabe',
      'Die blosse Abwesenheit grammatikalischer Fehler',
      'Der Entstehungsprozess, Reflexion und mündliche Erklärungsfähigkeit',
      'Wie schnell das Resultat generiert wurde',
    ],
    correctIndex: 2,
    explanation:
      'In Zeiten generativer KI verliert das reine Produkt an Aussagekraft. Entscheidend werden Reflexion, Prompt-Dokumentation, kritisches Prüfen und mündliches Erläutern des Themas.',
  },
  {
    id: 'q-didaktik-3',
    categoryId: 'cat-didaktik',
    level: 3,
    points: 300,
    question: 'Auf welcher SAMR-Stufe befindet sich der Einsatz von KI, wenn Lernende historische Persönlichkeiten interviewen?',
    options: [
      'Substitution (Ersetzung)',
      'Augmentation (Erweiterung)',
      'Modification (Änderung)',
      'Redefinition (Neugestaltung)',
    ],
    correctIndex: 3,
    explanation:
      'Redefinition ermöglicht Aufgaben, die ohne Technologie unvorstellbar wären: Ein interaktiver Rollenspiel-Dialog mit Albert Einstein oder Ada Lovelace eröffnet völlig neue Lernchancen.',
  },
  {
    id: 'q-didaktik-4',
    categoryId: 'cat-didaktik',
    level: 4,
    points: 400,
    question: 'Was versteht man unter didaktischem "Cognitive Offloading" durch KI?',
    options: [
      'Das vollständige Vergessen von Inhalten nach einer Prüfung',
      'Das Auslagern von Routine-Denkarbeit an KI, um Kapazität für Höheres zu gewinnen',
      'Das Abschalten des Internets während des Unterrichts',
      'Ein Ermüdungssyndrom von Lehrpersonen bei neuen Apps',
    ],
    correctIndex: 1,
    explanation:
      'Cognitive Offloading bedeutet, niederschwellige Denkleistung (z. B. Nachschlagen, Formatieren) auszulagern, um kognitive Kapazitäten für Problemlösung, Synthese und Reflexion freizumachen.',
  },

  // KATEGORIE 3: Ethik, Recht & Limits
  {
    id: 'q-ethik-1',
    categoryId: 'cat-ethik',
    level: 1,
    points: 100,
    question: 'Was gilt gemäss Schweizer Datenschutzgesetz (nDSG) bei Schülerdaten in öffentlichen KI-Diensten?',
    options: [
      'Schülernamen und Noten dürfen bedenkenlos eingegeben werden',
      'Echte Personendaten von Minderjährigen dürfen nicht in ungesicherte Public Clouds eingegeben werden',
      'Das nDSG gilt nur für Banken, nicht für Volksschulen',
      'Nur Fotos sind geschützt, Texte und Noten sind frei',
    ],
    correctIndex: 1,
    explanation:
      'Personendaten von Lernenden (Namen, Leistungsdaten, Verhaltensbeobachtungen) sind besonders schützenswert und dürfen nicht in öffentliche KI-Chats ohne Datenschutzvereinbarung fliessen.',
  },
  {
    id: 'q-ethik-2',
    categoryId: 'cat-ethik',
    level: 2,
    points: 200,
    question: 'Wer besitzt in der Schweiz das Urheberrecht an rein KI-generierten Inhalten ohne menschliche Schöpfungshöhe?',
    options: [
      'Niemand, da nur Werke menschlicher Schöpfung urheberrechtlich geschützt sind',
      'Automatisch die Herstellerfirma des KI-Modells (z. B. OpenAI)',
      'Die Person, die den Strom bezahlt hat',
      'Die kantonale Bildungsdirektion',
    ],
    correctIndex: 0,
    explanation:
      'Gemäss Schweizer Urheberrechtsgesetz (URG) sind nur geistige Schöpfungen der Natur des Menschen geschützt. Reine KI-Generierungen sind gemeinfrei (Public Domain).',
  },
  {
    id: 'q-ethik-3',
    categoryId: 'cat-ethik',
    level: 3,
    points: 300,
    question: 'Was versteht man unter "Algorithmic Bias" in generativen KI-Modellen?',
    options: [
      'Dass KI-Modelle schneller rechnen als herkömmliche Computer',
      'Stereotype und gesellschaftliche Verzerrungen, die aus den Trainingsdaten übernommen werden',
      'Ein Rechenfehler bei der Umwandlung von Text in Binärcode',
      'Dass Sprachmodelle ausschliesslich Englisch sprechen können',
    ],
    correctIndex: 1,
    explanation:
      'Da LLMs auf riesigen Datenmengen aus dem Internet trainiert wurden, spiegeln sie historische Vorurteile, Klischees und Unterrepräsentationen ungefiltert wider.',
  },
  {
    id: 'q-ethik-4',
    categoryId: 'cat-ethik',
    level: 4,
    points: 400,
    question: 'Was beschreibt der Begriff "Model Collapse" (Modell-Kollaps) in der KI-Forschung?',
    options: [
      'Ein plötzlicher Hardware-Defekt aller Server eines Rechenzentrums',
      'Die Qualitätsdegeneration, wenn zukünftige Modelle primär mit KI-generierten Daten trainiert werden',
      'Das juristische Verbot von Sprachmodellen durch die EU',
      'Ein Bug, bei dem das Modell nur noch Zahlen ausgibt',
    ],
    correctIndex: 1,
    explanation:
      'Wenn neue KI-Generationen auf Texten trainiert werden, die selbst von KIs erzeugt wurden, häufen sich statistische Fehler und seltene Nuancen gehen verloren, bis das Modell unbrauchbar wird.',
  },
];
