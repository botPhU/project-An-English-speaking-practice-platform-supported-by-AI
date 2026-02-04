import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import vocabularyService, { VocabularySet, Vocabulary, WordStats } from '../../services/vocabularyService';
import './VocabularyBuilder.css';

// Lazy load chart component
const WordsGrid = lazy(() => Promise.resolve({ default: WordsGridComponent }));

interface VocabularyBuilderProps {
  setId?: string;
  onSetSelect?: (set: VocabularySet) => void;
}

// Separate component for word grid to enable better memoization
const WordsGridComponent: React.FC<{
  words: Vocabulary[];
  onRemoveWord: (wordId: string) => void;
  onViewStats: (wordId: string) => void;
}> = ({ words, onRemoveWord, onViewStats }) => (
  <div className="words-grid">
    {words?.map((word) => (
      <div key={word.id} className="word-card">
        <div className="word-header">
          <h4>{word.word}</h4>
          <span className={`difficulty ${word.difficulty}`}>{word.difficulty}</span>
        </div>
        <p className="pronunciation">{word.pronunciation}</p>
        <p className="definition">{word.definition}</p>
        <p className="example">
          <em>Ex: {word.example}</em>
        </p>
        <div className="word-footer">
          <span className="part-of-speech">{word.partOfSpeech}</span>
          <div className="word-actions">
            <button
              className="btn-stats"
              onClick={() => onViewStats(word.id)}
              aria-label={`View stats for ${word.word}`}
            >
              📊 Stats
            </button>
            <button
              className="btn-remove"
              onClick={() => onRemoveWord(word.id)}
              aria-label={`Remove ${word.word}`}
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Memoized word card to prevent unnecessary re-renders
const MemoizedWordsGrid = React.memo(WordsGridComponent);

const VocabularyBuilder: React.FC<VocabularyBuilderProps> = ({ setId, onSetSelect }) => {
  const [sets, setSets] = useState<VocabularySet[]>([]);
  const [currentSet, setCurrentSet] = useState<VocabularySet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newSetTitle, setNewSetTitle] = useState('');
  const [showNewSetForm, setShowNewSetForm] = useState(false);
  const [selectedWordStats, setSelectedWordStats] = useState<WordStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newWord, setNewWord] = useState({
    word: '',
    definition: '',
    pronunciation: '',
    example: '',
    partOfSpeech: 'noun' as const,
    difficulty: 'intermediate' as const,
    category: '',
  });

  useEffect(() => {
    fetchVocabularySets();
  }, []);

  useEffect(() => {
    if (setId && sets.length > 0) {
      const set = sets.find((s) => s.id === setId);
      if (set) {
        setCurrentSet(set);
        onSetSelect?.(set);
      }
    }
  }, [setId, sets, onSetSelect]);

  const fetchVocabularySets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vocabularyService.getUserVocabularySets();
      setSets(data);
      if (data.length > 0 && !setId) {
        setCurrentSet(data[0]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load vocabulary sets';
      setError(errorMessage);
      console.error('Error fetching sets:', err);
    } finally {
      setLoading(false);
    }
  }, [setId]);

  const handleCreateSet = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newSetTitle.trim()) return;

      try {
        setError(null);
        const newSet = await vocabularyService.createVocabularySet({
          userId: 'current-user',
          title: newSetTitle,
          description: '',
          vocabularies: [],
          totalWords: 0,
          masteredWords: 0,
          difficulty: 'intermediate',
        });

        setSets([...sets, newSet]);
        setCurrentSet(newSet);
        setNewSetTitle('');
        setShowNewSetForm(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create set';
        setError(errorMessage);
        console.error('Error creating set:', err);
      }
    },
    [sets, newSetTitle]
  );

  const handleAddWord = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentSet || !newWord.word.trim()) return;

      try {
        setError(null);
        await vocabularyService.addWordToSet(currentSet.id, {
          id: '',
          ...newWord,
        });

        const updatedSet = await vocabularyService.getVocabularySet(currentSet.id);
        setCurrentSet(updatedSet);
        const updatedSets = sets.map((s) => (s.id === updatedSet.id ? updatedSet : s));
        setSets(updatedSets);

        // Reset form
        setNewWord({
          word: '',
          definition: '',
          pronunciation: '',
          example: '',
          partOfSpeech: 'noun',
          difficulty: 'intermediate',
          category: '',
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to add word';
        setError(errorMessage);
        console.error('Error adding word:', err);
      }
    },
    [currentSet, newWord, sets]
  );

  const handleRemoveWord = useCallback(
    async (wordId: string) => {
      if (!currentSet) return;

      try {
        setError(null);
        await vocabularyService.removeWordFromSet(currentSet.id, wordId);
        const updatedSet = await vocabularyService.getVocabularySet(currentSet.id);
        setCurrentSet(updatedSet);
        const updatedSets = sets.map((s) => (s.id === updatedSet.id ? updatedSet : s));
        setSets(updatedSets);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to remove word';
        setError(errorMessage);
        console.error('Error removing word:', err);
      }
    },
    [currentSet, sets]
  );

  const handleViewWordStats = useCallback(async (wordId: string) => {
    try {
      setError(null);
      const stats = await vocabularyService.getWordStats(wordId);
      setSelectedWordStats(stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stats';
      setError(errorMessage);
      console.error('Error fetching stats:', err);
    }
  }, []);

  const handleDeleteSet = useCallback(
    async (setIdToDelete: string) => {
      try {
        setError(null);
        await vocabularyService.deleteVocabularySet(setIdToDelete);
        const updatedSets = sets.filter((s) => s.id !== setIdToDelete);
        setSets(updatedSets);
        if (currentSet?.id === setIdToDelete) {
          setCurrentSet(updatedSets.length > 0 ? updatedSets[0] : null);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete set';
        setError(errorMessage);
        console.error('Error deleting set:', err);
      }
    },
    [currentSet, sets]
  );

  // Filter words by search query
  const filteredWords = useMemo(() => {
    if (!currentSet?.vocabularies || !searchQuery.trim()) {
      return currentSet?.vocabularies || [];
    }
    return currentSet.vocabularies.filter(
      (word) =>
        word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.definition.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentSet, searchQuery]);

  if (loading) {
    return <div className="vocabulary-builder loading">Loading vocabulary sets...</div>;
  }

  return (
    <div className="vocabulary-builder">
      <div className="vocab-container">
        {/* Sets Panel */}
        <div className="sets-panel">
          <div className="panel-header">
            <h2>📚 Vocabulary Sets</h2>
            <button
              className="btn-new-set"
              onClick={() => setShowNewSetForm(!showNewSetForm)}
              aria-label="Create new vocabulary set"
            >
              ➕ New Set
            </button>
          </div>

          {showNewSetForm && (
            <form onSubmit={handleCreateSet} className="form-new-set">
              <input
                type="text"
                placeholder="Set title..."
                value={newSetTitle}
                onChange={(e) => setNewSetTitle(e.target.value)}
                required
                aria-label="Set title"
              />
              <button type="submit" className="btn-create">
                Create
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowNewSetForm(false)}
              >
                Cancel
              </button>
            </form>
          )}

          <div className="sets-list">
            {sets.map((set) => (
              <div
                key={set.id}
                className={`set-item ${currentSet?.id === set.id ? 'active' : ''}`}
                onClick={() => {
                  setCurrentSet(set);
                  onSetSelect?.(set);
                }}
                role="button"
                tabIndex={0}
                aria-label={`Select vocabulary set ${set.title}`}
              >
                <div className="set-info">
                  <h4>{set.title}</h4>
                  <p className="set-stats">
                    {set.totalWords} words • {set.masteredWords} mastered
                  </p>
                </div>
                <button
                  className="btn-delete-set"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSet(set.id);
                  }}
                  aria-label={`Delete ${set.title}`}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Words Panel */}
        {currentSet && (
          <div className="words-panel">
            <div className="panel-header">
              <h2>📖 {currentSet.title}</h2>
              <span className="progress">
                {currentSet.masteredWords}/{currentSet.totalWords}
              </span>
            </div>

            {error && (
              <div className="error-banner">
                <p>{error}</p>
                <button onClick={() => setError(null)} className="btn-close-error">
                  ✕
                </button>
              </div>
            )}

            {/* Add Word Form */}
            <form onSubmit={handleAddWord} className="form-add-word">
              <h3>➕ Add New Word</h3>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Word"
                  value={newWord.word}
                  onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
                  required
                  aria-label="Word"
                />
                <input
                  type="text"
                  placeholder="Pronunciation"
                  value={newWord.pronunciation}
                  onChange={(e) => setNewWord({ ...newWord, pronunciation: e.target.value })}
                  aria-label="Pronunciation"
                />
              </div>
              <textarea
                placeholder="Definition"
                value={newWord.definition}
                onChange={(e) => setNewWord({ ...newWord, definition: e.target.value })}
                required
                aria-label="Definition"
              />
              <textarea
                placeholder="Example sentence"
                value={newWord.example}
                onChange={(e) => setNewWord({ ...newWord, example: e.target.value })}
                aria-label="Example"
              />
              <div className="form-row">
                <select
                  value={newWord.partOfSpeech}
                  onChange={(e) =>
                    setNewWord({ ...newWord, partOfSpeech: e.target.value as any })
                  }
                  aria-label="Part of speech"
                >
                  <option value="noun">Noun</option>
                  <option value="verb">Verb</option>
                  <option value="adjective">Adjective</option>
                  <option value="adverb">Adverb</option>
                  <option value="preposition">Preposition</option>
                  <option value="conjunction">Conjunction</option>
                </select>
                <select
                  value={newWord.difficulty}
                  onChange={(e) => setNewWord({ ...newWord, difficulty: e.target.value as any })}
                  aria-label="Difficulty"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <input
                  type="text"
                  placeholder="Category"
                  value={newWord.category}
                  onChange={(e) => setNewWord({ ...newWord, category: e.target.value })}
                  aria-label="Category"
                />
              </div>
              <button type="submit" className="btn-submit">
                Add Word
              </button>
            </form>

            {/* Search Filter */}
            {currentSet.vocabularies && currentSet.vocabularies.length > 0 && (
              <div className="search-container">
                <input
                  type="text"
                  placeholder="🔍 Search words..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  aria-label="Search words"
                />
                <span className="search-count">{filteredWords.length} found</span>
              </div>
            )}

            {/* Words Grid */}
            <Suspense fallback={<div className="loading-spinner">Loading words...</div>}>
              {filteredWords.length > 0 ? (
                <MemoizedWordsGrid
                  words={filteredWords}
                  onRemoveWord={handleRemoveWord}
                  onViewStats={handleViewWordStats}
                />
              ) : (
                <div className="empty-words">
                  <p>
                    {currentSet.vocabularies && currentSet.vocabularies.length > 0
                      ? 'No words match your search'
                      : 'No words in this set yet. Add one above! 📝'}
                  </p>
                </div>
              )}
            </Suspense>
          </div>
        )}

        {!currentSet && (
          <div className="empty-state">
            <p>Create a vocabulary set to get started! 🚀</p>
          </div>
        )}

        {/* Word Stats Modal */}
        {selectedWordStats && (
          <div className="modal-overlay" onClick={() => setSelectedWordStats(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="btn-close"
                onClick={() => setSelectedWordStats(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
              <h3>{selectedWordStats.word} - Statistics</h3>
              <div className="stats-grid">
                <div className="stat">
                  <span className="label">Correct Answers</span>
                  <span className="value">{selectedWordStats.correctAnswers}</span>
                </div>
                <div className="stat">
                  <span className="label">Total Attempts</span>
                  <span className="value">{selectedWordStats.totalAttempts}</span>
                </div>
                <div className="stat">
                  <span className="label">Accuracy</span>
                  <span className="value">
                    {selectedWordStats.totalAttempts > 0
                      ? Math.round(
                          (selectedWordStats.correctAnswers / selectedWordStats.totalAttempts) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="stat">
                  <span className="label">Mastery Level</span>
                  <span className="value">{selectedWordStats.masteryLevel}%</span>
                </div>
              </div>
              <p className="last-review">
                Last reviewed: {new Date(selectedWordStats.lastReviewDate).toLocaleDateString()}
              </p>
              <p className="next-review">
                Next review: {new Date(selectedWordStats.nextReviewDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabularyBuilder;
