import React from 'react'
import { FileText, Search, Plus, Trash2, Edit3, Save, Clock } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'

const Notes = () => {
  const [notes, setNotes] = React.useState([])
  const [newNote, setNewNote] = React.useState('')
  const [searchTerm, setSearchTerm] = React.useState('')
  const [editingNote, setEditingNote] = React.useState(null)
  const { t } = useTranslation()

  // Load notes from localStorage
  React.useEffect(() => {
    const savedNotes = localStorage.getItem('liferw-notes')
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  // Save notes to localStorage
  const saveNotes = (updatedNotes) => {
    setNotes(updatedNotes)
    localStorage.setItem('liferw-notes', JSON.stringify(updatedNotes))
  }

  const addNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        content: newNote.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      const updatedNotes = [note, ...notes]
      saveNotes(updatedNotes)
      setNewNote('')
    }
  }

  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id)
    saveNotes(updatedNotes)
  }

  const updateNote = (id, newContent) => {
    const updatedNotes = notes.map(note => 
      note.id === id 
        ? { ...note, content: newContent, updatedAt: new Date().toISOString() }
        : note
    )
    saveNotes(updatedNotes)
  }

  const startEditing = (note) => {
    setEditingNote({ ...note })
  }

  const saveEdit = () => {
    if (editingNote && editingNote.content.trim()) {
      updateNote(editingNote.id, editingNote.content)
      setEditingNote(null)
    }
  }

  const cancelEdit = () => {
    setEditingNote(null)
  }

  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
          {t.notes}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t.notesDesc}
        </p>
      </div>

      {/* Add Note */}
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-6">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder={t.whatsOnMind}
          className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white mb-4"
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {newNote.length} {t.characters}
          </span>
          <button
            onClick={addNote}
            disabled={!newNote.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus size={20} />
            {t.saveNote}
          </button>
        </div>
      </div>

      {/* Search */}
      {notes.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchNotes}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
            />
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map(note => (
          <div key={note.id} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 group hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock size={12} />
                {formatDate(note.updatedAt)}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEditing(note)}
                  className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                  title={t.edit}
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title={t.delete}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            {editingNote?.id === note.id ? (
              <div className="space-y-3">
                <textarea
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
                  className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <Save size={14} />
                    {t.save}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-300 dark:bg-gray-600 text-black dark:text-white px-3 py-1 rounded text-sm"
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div 
                  onClick={() => startEditing(note)}
                  className="w-full h-40 p-2 border border-gray-200 dark:border-gray-600 rounded cursor-text text-gray-800 dark:text-gray-200 overflow-y-auto whitespace-pre-wrap"
                >
                  {note.content}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                  <Edit3 size={12} />
                  {t.clickToEdit} • {t.autoSaves}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Empty States */}
      {notes.length === 0 && (
        <div className="text-center p-8 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={32} className="text-blue-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">{t.noNotes}</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">{t.writeFirstNote}</p>
        </div>
      )}

      {notes.length > 0 && filteredNotes.length === 0 && (
        <div className="text-center p-8 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-gray-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">{t.noMatchingNotes}</p>
        </div>
      )}
    </div>
  )
}

export default Notes