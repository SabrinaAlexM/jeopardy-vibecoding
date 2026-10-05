import React, { useState } from 'react';
import { Sparkles, Copy, Check, X, AlertCircle, Upload } from 'lucide-react';
import { Category, Question } from '../types';

interface PromptGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onImportQuestions: (categories: Category[], questions: Question[]) => void;
}

export const PromptGeneratorModal: React.FC<PromptGeneratorModalProps> = ({
  isOpen,
  onClose,
  categories,
  onImportQuestions,
}) => {
  const [targetAudience, setTargetAudience] = useState('CAS PICTS Teilnehmende & Lehrpersonen');
  const [topicFocus, setTopicFocus] = useState('Künstliche Intelligenz in Schule & Unterricht');
  const [cat1, setCat1] = useState(categories[0]?.name || 'Prompting & LLMs');
  const [cat2, setCat2] = useState(categories[1]?.name || 'KI im Schulzimmer');
  const [cat3, setCat3] = useState(categories[2]?.name || 'Ethik, Recht & Limits');
  
  const [copied, setCopied] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  if (!isOpen) return null;

  const generatedPrompt = `Du bist Experte für Bildungstechnologie und Dozent im CAS PICTS (Pädagogischer ICT-Support).
Erstelle für ein interaktives Quiz im Jeopardy-Stil genau 12 Fragen (3 Kategorien mit jeweils 4 ansteigenden Schwierigkeitsstufen).

Rahmenbedingungen:
- Zielgruppe: ${targetAudience}
- Themenschwerpunkt: ${topicFocus}
- Schweizer Rechtschreibung beachten (immer "ss" statt "ß", z. B. "gross", "Schliessen", "Spass")
- 3 Kategorien:
  1. "${cat1}"
  2. "${cat2}"
  3. "${cat3}"
- Jede Kategorie benötigt genau 4 Stufen:
  * Stufe 1 (100 Punkte): Einfache Grundlagen / Definition
  * Stufe 2 (200 Punkte): Grundlegendes Verständnis & typische Fallstricke
  * Stufe 3 (300 Punkte): Praxisnahe Anwendung im Unterricht & Didaktik
  * Stufe 4 (400 Punkte): Anspruchsvolle Expertenfrage / Knacknuss

Formatierungsanweisung:
Gib ausschliesslich ein valides JSON-Array ohne Markdown-Codeblöcke aus mit exakt folgendem Schema:

{
  "categories": [
    { "id": "cat-1", "name": "${cat1}", "color": "#0284c7" },
    { "id": "cat-2", "name": "${cat2}", "color": "#9333ea" },
    { "id": "cat-3", "name": "${cat3}", "color": "#059669" }
  ],
  "questions": [
    {
      "id": "q-1-1",
      "categoryId": "cat-1",
      "level": 1,
      "points": 100,
      "question": "Fragetext...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 1,
      "explanation": "Kurze, didaktische Erklärung, warum diese Antwort stimmt."
    }
  ]
}`;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const handleImportJson = () => {
    setImportError(null);
    setImportSuccess(false);

    if (!jsonInput.trim()) {
      setImportError('Bitte füge zuerst den JSON-Code aus deiner KI ein.');
      return;
    }

    try {
      let cleaned = jsonInput.trim();
      if (cleaned.startsWith('```json')) cleaned = cleaned.substring(7);
      else if (cleaned.startsWith('```')) cleaned = cleaned.substring(3);
      if (cleaned.endsWith('```')) cleaned = cleaned.substring(0, cleaned.length - 3);
      cleaned = cleaned.trim();

      const parsed = JSON.parse(cleaned);

      if (!parsed.categories || !Array.isArray(parsed.categories) || parsed.categories.length !== 3) {
        throw new Error('Es müssen exakt 3 Kategorien enthalten sein.');
      }
      if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length < 3) {
        throw new Error('Es müssen mindestens Fragen im Format enthalten sein.');
      }

      const validQuestions: Question[] = parsed.questions.map((q: any, idx: number) => {
        if (!q.question || !Array.isArray(q.options) || q.options.length !== 4) {
          throw new Error(`Frage #${idx + 1} ist unvollständig oder hat keine 4 Antwortoptionen.`);
        }
        return {
          id: q.id || `q-imported-${idx}`,
          categoryId: q.categoryId,
          level: (q.level || ((idx % 4) + 1)) as 1 | 2 | 3 | 4,
          points: q.points || ((q.level || 1) * 100),
          question: q.question,
          options: [String(q.options[0]), String(q.options[1]), String(q.options[2]), String(q.options[3])],
          correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
          explanation: q.explanation || 'Keine Erklärung angegeben.',
        };
      });

      onImportQuestions(parsed.categories, validQuestions);
      setImportSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setImportError(err.message || 'Ungültiges JSON-Format. Bitte überprüfe die KI-Ausgabe.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-2xl text-slate-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-slate-900">KI-Prompt-Generator</h2>
              <p className="text-xs text-slate-500">
                Lass dir von ChatGPT, Gemini oder Claude Fragen generieren
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Zielgruppe
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Themenschwerpunkt
              </label>
              <input
                type="text"
                value={topicFocus}
                onChange={(e) => setTopicFocus(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              3 Quiz-Kategorien
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={cat1}
                onChange={(e) => setCat1(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-sky-50/60 border border-sky-300 rounded-lg text-sky-900 focus:outline-none"
              />
              <input
                type="text"
                value={cat2}
                onChange={(e) => setCat2(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-purple-50/60 border border-purple-300 rounded-lg text-purple-900 focus:outline-none"
              />
              <input
                type="text"
                value={cat3}
                onChange={(e) => setCat3(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-emerald-50/60 border border-emerald-300 rounded-lg text-emerald-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Copy Prompt */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-700">
                1. Prompt kopieren & in deiner KI einfügen
              </span>
              <button
                onClick={handleCopyPrompt}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    Kopiert!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Kopieren
                  </>
                )}
              </button>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono text-slate-700 max-h-32 overflow-y-auto whitespace-pre-wrap select-all">
              {generatedPrompt}
            </div>
          </div>

          {/* Paste JSON */}
          <div className="pt-2 border-t border-slate-200">
            <span className="block text-xs font-semibold text-slate-700 mb-1">
              2. Antwort der KI (JSON) einfügen & direkt importieren
            </span>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Füge hier die JSON-Ausgabe der KI ein..."
              rows={3}
              className="w-full p-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-500 resize-none"
            />

            {importError && (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            {importSuccess && (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-lg">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Erfolgreich importiert! Fragen werden geladen...</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50 shrink-0">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Schliessen
          </button>
          <button
            onClick={handleImportJson}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Fragen laden</span>
          </button>
        </div>
      </div>
    </div>
  );
};
