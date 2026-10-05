import React, { useState } from 'react';
import {
  Sparkles,
  RotateCcw,
  Download,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Category, Question } from '../types';
import { PromptGeneratorModal } from './PromptGeneratorModal';

interface QuestionsEditorProps {
  categories: Category[];
  questions: Question[];
  onUpdateCategories: (categories: Category[]) => void;
  onUpdateQuestions: (questions: Question[]) => void;
  onRestoreOriginalQuestions: () => void;
  onProceedToTeams: () => void;
}

export const QuestionsEditor: React.FC<QuestionsEditorProps> = ({
  categories,
  questions,
  onUpdateCategories,
  onUpdateQuestions,
  onRestoreOriginalQuestions,
  onProceedToTeams,
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0]?.id || 'cat-prompting');
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const activeQuestions = questions.filter((q) => q.categoryId === selectedCatId);
  const activeCategory = categories.find((c) => c.id === selectedCatId) || categories[0];

  const handleCategoryNameChange = (catId: string, newName: string) => {
    onUpdateCategories(
      categories.map((c) => (c.id === catId ? { ...c, name: newName } : c))
    );
  };

  const handleQuestionChange = (
    qId: string,
    field: keyof Question,
    value: any
  ) => {
    onUpdateQuestions(
      questions.map((q) => (q.id === qId ? { ...q, [field]: value } : q))
    );
  };

  const handleOptionChange = (qId: string, optIndex: number, newText: string) => {
    onUpdateQuestions(
      questions.map((q) => {
        if (q.id !== qId) return q;
        const newOptions = [...q.options] as [string, string, string, string];
        newOptions[optIndex] = newText;
        return { ...q, options: newOptions };
      })
    );
  };

  const handleExportJson = () => {
    const data = {
      categories,
      questions,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ki-quiz-fragen-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Banner & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <div>
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            Schritt 1: Fragenverwaltung
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mt-0.5">
            Kategorien & Fragen bearbeiten
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Passe die 3 Kategorien und je 4 Stufen für deine Kursgruppe an. Du kannst jederzeit mit einem Klick auf die ursprünglichen Standardfragen zurücksetzen.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* KI-Prompt-Generator */}
          <button
            onClick={() => setIsPromptModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>KI-Prompt-Generator</span>
          </button>

          {/* Ursprungsfragen wiederherstellen Button */}
          <button
            onClick={onRestoreOriginalQuestions}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Die ursprünglichen 12 Fragen für das Modul wiederherstellen"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
            <span>Ursprungsfragen laden</span>
          </button>

          {/* Exportieren */}
          <button
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Fragen als JSON sichern"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* 3 Categories selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            3 Kategorien
          </span>
          <span className="text-xs text-slate-400">
            Jede Kategorie umfasst 4 Fragen (100–400 Punkte)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {categories.map((cat, idx) => {
            const isSelected = cat.id === selectedCatId;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                className={`cursor-pointer p-3.5 sm:p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-white border-indigo-500 ring-2 ring-indigo-100 shadow-sm'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span className="font-mono text-[11px]">Kategorie {idx + 1}</span>
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                </div>
                <input
                  type="text"
                  value={cat.name}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleCategoryNameChange(cat.id, e.target.value)}
                  className="w-full text-sm sm:text-base font-bold font-display bg-transparent text-slate-900 border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors"
                  placeholder="Kategoriename eingeben"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Questions list for selected category */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-display text-slate-900">
            Fragen für: <span className="text-indigo-600">{activeCategory?.name}</span>
          </h3>
          <span className="text-xs text-slate-400">
            Klicke auf eine Frage, um Optionen oder Erklärung zu editieren
          </span>
        </div>

        <div className="space-y-3">
          {([1, 2, 3, 4] as const).map((level) => {
            const question = activeQuestions.find((q) => q.level === level);
            if (!question) return null;

            const isExpanded = editingQuestionId === question.id;
            const points = level * 100;

            return (
              <div
                key={question.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs transition-all"
              >
                {/* Collapsed Header */}
                <div
                  onClick={() =>
                    setEditingQuestionId(isExpanded ? null : question.id)
                  }
                  className="flex items-center justify-between p-3.5 sm:p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <span className="px-2 py-0.5 text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md shrink-0">
                      {points} Pkt
                    </span>
                    <span className="text-xs font-semibold text-slate-400 shrink-0">
                      Stufe {level}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-slate-800 truncate">
                      {question.question}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 hidden sm:inline">
                      Richtig: {String.fromCharCode(65 + question.correctIndex)}
                    </span>
                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-slate-700"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Editor Form */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 space-y-4 bg-slate-50/50">
                    {/* Question text */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Fragetext (Stufe {level} · {points} Punkte)
                      </label>
                      <textarea
                        value={question.question}
                        onChange={(e) =>
                          handleQuestionChange(question.id, 'question', e.target.value)
                        }
                        rows={2}
                        className="w-full p-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                      />
                    </div>

                    {/* 4 Options */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Antwortoptionen (Grüner Buchstabe = richtige Lösung)
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {question.options.map((opt, optIdx) => {
                          const isCorrect = question.correctIndex === optIdx;
                          const letter = String.fromCharCode(65 + optIdx);
                          return (
                            <div
                              key={optIdx}
                              className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                                isCorrect
                                  ? 'bg-emerald-50/70 border-emerald-300'
                                  : 'bg-white border-slate-200'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  handleQuestionChange(
                                    question.id,
                                    'correctIndex',
                                    optIdx
                                  )
                                }
                                className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer transition-colors ${
                                  isCorrect
                                    ? 'bg-emerald-600 text-white shadow-2xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                                title="Als richtige Antwort markieren"
                              >
                                {letter}
                              </button>
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) =>
                                  handleOptionChange(
                                    question.id,
                                    optIdx,
                                    e.target.value
                                  )
                                }
                                className="w-full text-xs bg-transparent text-slate-800 focus:outline-none"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Explanation */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-indigo-600" />
                        Didaktische Erklärung / Hintergrund
                      </label>
                      <textarea
                        value={question.explanation}
                        onChange={(e) =>
                          handleQuestionChange(
                            question.id,
                            'explanation',
                            e.target.value
                          )
                        }
                        rows={2}
                        className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Nav CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <span className="text-xs text-slate-500">
          Wird automatisch im Browser gespeichert.
        </span>
        <button
          onClick={onProceedToTeams}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <span>Weiter zu den Gruppen</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* AI Prompt Generator Modal */}
      <PromptGeneratorModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        categories={categories}
        onImportQuestions={(newCats, newQuestions) => {
          onUpdateCategories(newCats);
          onUpdateQuestions(newQuestions);
          setSelectedCatId(newCats[0].id);
        }}
      />
    </div>
  );
};
