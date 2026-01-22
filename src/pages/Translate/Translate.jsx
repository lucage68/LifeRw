import React from 'react'
import { Languages, Copy, RotateCcw, Trash2, History, Zap, ArrowLeftRight, BookOpen, Clock, CheckCircle2, Globe, Sparkles } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'

const Translate = () => {
  const [sourceText, setSourceText] = React.useState('')
  const [translatedText, setTranslatedText] = React.useState('')
  const [sourceLang, setSourceLang] = React.useState('en')
  const [targetLang, setTargetLang] = React.useState('rw')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [translationHistory, setTranslationHistory] = React.useState([])
  const [copiedField, setCopiedField] = React.useState('')
  const { t } = useTranslation()

  // Languages supported by the free API
  const languages = [
    { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'sw', name: 'Swahili', flag: '🇹🇿' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
    { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
    { code: 'pl', name: 'Polish', flag: '🇵🇱' },
    { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
    { code: 'da', name: 'Danish', flag: '🇩🇰' },
    { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
    { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
    { code: 'cs', name: 'Czech', flag: '🇨🇿' },
    { code: 'ro', name: 'Romanian', flag: '🇷🇴' },
    { code: 'hu', name: 'Hungarian', flag: '🇭🇺' },
    { code: 'bg', name: 'Bulgarian', flag: '🇧🇬' },
    { code: 'el', name: 'Greek', flag: '🇬🇷' },
    { code: 'he', name: 'Hebrew', flag: '🇮🇱' },
    { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
    { code: 'ms', name: 'Malay', flag: '🇲🇾' },
    { code: 'th', name: 'Thai', flag: '🇹🇭' },
    { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' }
  ]

  // Enhanced phrase database for fallback
  const phraseDictionary = {
    'en-rw': {
      'hello': 'Muraho',
      'hi': 'Muraho',
      'good morning': 'Mwiriwe',
      'good afternoon': 'Mwiriwe',
      'good evening': 'Mwiriwe neza',
      'good night': 'Muramuke',
      'how are you': 'Amakuru',
      'i am fine': 'Ndameze neza',
      'thank you': 'Murakoze',
      'thanks': 'Murakoze',
      'please': 'Nyamuneka',
      'sorry': 'Mbabarira',
      'excuse me': 'Mbabarira',
      'yes': 'Yego',
      'no': 'Oya',
      'okay': 'Nibyo',
      'what is your name': 'Witwa nde',
      'my name is': 'Nitwa',
      'where are you from': 'Uva he',
      'i am from': 'Mva',
      'how old are you': 'Ufite imyaka ingahe',
      'where is': 'Iri he',
      'how much': 'Ni ikihe giciro',
      'what time is it': 'Ni isaha ngaha',
      'i love you': 'Ndagukunda',
      'i love rwanda': 'Nkunda Rwanda',
      'beautiful': 'Cyiza',
      'water': 'Amazi',
      'food': 'Ibiryo',
      'house': 'Inzu',
      'car': 'Imodoka',
      'money': 'Amafaranga',
      'market': 'Isoko',
      'hospital': 'Ibitaro',
      'police': 'Polisi',
      'help': 'Fasha',
      'emergency': 'Gihutirwa'
    },
    'rw-en': {
      'muraho': 'Hello',
      'mwiriwe': 'Good morning',
      'muramuke': 'Good night',
      'amakuru': 'How are you',
      'murakoze': 'Thank you',
      'nyamuneka': 'Please',
      'mbabarira': 'Sorry',
      'yego': 'Yes',
      'oya': 'No',
      'nibyo': 'Okay',
      'witwa nde': 'What is your name',
      'nitwa': 'My name is',
      'uva he': 'Where are you from',
      'iri he': 'Where is',
      'igiciro': 'Price',
      'isaha': 'Time',
      'ndagukunda': 'I love you',
      'nkunda rwanda': 'I love Rwanda',
      'cyiza': 'Beautiful',
      'amazi': 'Water',
      'ibiryo': 'Food',
      'inzu': 'House'
    }
  }

  // Load history from localStorage
  React.useEffect(() => {
    const savedHistory = localStorage.getItem('translationHistory')
    if (savedHistory) {
      setTranslationHistory(JSON.parse(savedHistory))
    }
  }, [])

  const translateWithFreeAPI = async (text, fromLang, toLang) => {
    // Try multiple free translation APIs as fallbacks
    
    // API 1: LibreTranslate (most reliable free option)
    try {
      const response = await fetch('https://libretranslate.com/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: fromLang,
          target: toLang,
          format: 'text'
        })
      })

      if (response.ok) {
        const data = await response.json()
        return { success: true, text: data.translatedText, api: 'libretranslate' }
      }
    } catch (error) {
      console.log('LibreTranslate failed, trying next API...')
    }

    // API 2: MyMemory (good fallback)
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`
      )
      
      const data = await response.json()
      if (data.responseStatus === 200 && data.responseData.translatedText) {
        return { success: true, text: data.responseData.translatedText, api: 'mymemory' }
      }
    } catch (error) {
      console.log('MyMemory failed, using dictionary...')
    }

    // Fallback to enhanced dictionary
    return { success: false, text: '', api: 'none' }
  }

  const getEnhancedTranslation = (text, fromLang, toLang) => {
    const key = `${fromLang}-${toLang}`
    const lowerText = text.toLowerCase().trim()
    
    // Exact match
    if (phraseDictionary[key] && phraseDictionary[key][lowerText]) {
      return phraseDictionary[key][lowerText]
    }
    
    // Word-by-word translation for simple phrases
    const words = text.split(' ')
    if (words.length <= 5) {
      const translatedWords = words.map(word => {
        const lowerWord = word.toLowerCase()
        return phraseDictionary[key] && phraseDictionary[key][lowerWord] 
          ? phraseDictionary[key][lowerWord] 
          : word
      })
      
      // If we translated at least one word, return the result
      if (translatedWords.some((word, index) => word !== words[index])) {
        return translatedWords.join(' ')
      }
    }
    
    // Smart fallback based on language
    if (toLang === 'rw') {
      return `"${text}" - Igisobanuro: ${text.split(' ').map(word => 
        phraseDictionary[key] && phraseDictionary[key][word.toLowerCase()] 
          ? phraseDictionary[key][word.toLowerCase()] 
          : word
      ).join(' ')}`
    }
    
    return `[${fromLang.toUpperCase()}→${toLang.toUpperCase()}] ${text}`
  }

  const translateText = async () => {
    if (!sourceText.trim()) {
      setError(t.pleaseEnterText)
      return
    }

    setLoading(true)
    setError('')

    try {
      // Try free APIs first
      const apiResult = await translateWithFreeAPI(sourceText, sourceLang, targetLang)
      
      if (apiResult.success) {
        setTranslatedText(apiResult.text)
        addToHistory(sourceText, apiResult.text, sourceLang, targetLang, apiResult.api, 'high')
      } else {
        // Use enhanced dictionary as final fallback
        const enhancedTranslation = getEnhancedTranslation(sourceText, sourceLang, targetLang)
        setTranslatedText(enhancedTranslation)
        addToHistory(sourceText, enhancedTranslation, sourceLang, targetLang, 'dictionary', 'medium')
      }

    } catch (err) {
      // Ultimate fallback to dictionary
      const enhancedTranslation = getEnhancedTranslation(sourceText, sourceLang, targetLang)
      setTranslatedText(enhancedTranslation)
      addToHistory(sourceText, enhancedTranslation, sourceLang, targetLang, 'dictionary', 'medium')
    } finally {
      setLoading(false)
    }
  }

  const addToHistory = (original, translated, fromLang, toLang, source, confidence) => {
    const fromLangName = languages.find(l => l.code === fromLang)?.name || fromLang
    const toLangName = languages.find(l => l.code === toLang)?.name || toLang

    const newTranslation = {
      id: Date.now(),
      original,
      translated,
      fromLang: fromLangName,
      toLang: toLangName,
      fromCode: fromLang,
      toCode: toLang,
      timestamp: new Date().toISOString(),
      source: source,
      confidence: confidence
    }

    setTranslationHistory(prev => {
      const updatedHistory = [newTranslation, ...prev].slice(0, 25)
      localStorage.setItem('translationHistory', JSON.stringify(updatedHistory))
      return updatedHistory
    })
  }

  const swapLanguages = () => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  const clearAll = () => {
    setSourceText('')
    setTranslatedText('')
    setError('')
  }

  const clearHistory = () => {
    setTranslationHistory([])
    localStorage.removeItem('translationHistory')
  }

  const removeFromHistory = (id) => {
    setTranslationHistory(prev => {
      const updatedHistory = prev.filter(item => item.id !== id)
      localStorage.setItem('translationHistory', JSON.stringify(updatedHistory))
      return updatedHistory
    })
  }

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(''), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const past = new Date(timestamp)
    const diffInMinutes = Math.floor((now - past) / (1000 * 60))
    
    if (diffInMinutes < 1) return t.justNow
    if (diffInMinutes < 60) return `${diffInMinutes}${t.minutesAgo}`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}${t.hoursAgo}`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}${t.daysAgo}`
  }

  const getSourceColor = (source) => {
    switch (source) {
      case 'libretranslate': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400'
      case 'mymemory': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400'
      case 'dictionary': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400'
    }
  }

  const getSourceName = (source) => {
    switch (source) {
      case 'libretranslate': return t.freeAPI
      case 'mymemory': return t.freeAPI
      case 'dictionary': return t.smartDictionary
      default: return source
    }
  }

  const quickPhrases = [
    {
      category: t.greetings,
      phrases: [
        { en: 'Hello', rw: 'Muraho' },
        { en: 'Good morning', rw: 'Mwiriwe' },
        { en: 'How are you', rw: 'Amakuru' }
      ]
    },
    {
      category: t.courtesy,
      phrases: [
        { en: 'Thank you', rw: 'Murakoze' },
        { en: 'Please', rw: 'Nyamuneka' },
        { en: 'Sorry', rw: 'Mbabarira' }
      ]
    },
    {
      category: t.questions,
      phrases: [
        { en: 'What is your name', rw: 'Witwa nde' },
        { en: 'How much', rw: 'Ni ikihe giciro' },
        { en: 'Where is the market', rw: 'Isoko iri he' }
      ]
    },
    {
      category: t.feelings,
      phrases: [
        { en: 'I love you', rw: 'Ndagukunda' },
        { en: 'I am happy', rw: 'Nimeze neza' },
        { en: 'I am hungry', rw: 'Mfite inzara' }
      ]
    }
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
          {t.translate}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t.translateDesc}
        </p>
      </div>

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-300 dark:border-green-700 rounded-lg p-6 mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-1">
              {t.completelyFree}
            </h3>
            <p className="text-green-700 dark:text-green-300 text-sm">
              {t.poweredByAPIs}
            </p>
          </div>
        </div>
      </div>

      {/* Translation Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Source Text */}
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold">
              {t.from}:
            </label>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder={t.enterText}
            className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
          />
          
          <div className="flex justify-between items-center mt-3">
            <button
              onClick={() => copyToClipboard(sourceText, 'source')}
              disabled={!sourceText}
              className="flex items-center gap-2 p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white disabled:opacity-50 transition-colors"
            >
              {copiedField === 'source' ? (
                <CheckCircle2 size={16} className="text-green-500" />
              ) : (
                <Copy size={16} />
              )}
              {copiedField === 'source' ? t.copied : t.copy}
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {sourceText.length} {t.characters}
            </span>
          </div>
        </div>

        {/* Target Text */}
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold">
              {t.to}:
            </label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          <textarea
            value={translatedText}
            readOnly
            placeholder={t.translationPlaceholder}
            className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white"
          />
          
          <div className="flex justify-between items-center mt-3">
            <button
              onClick={() => copyToClipboard(translatedText, 'translated')}
              disabled={!translatedText}
              className="flex items-center gap-2 p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white disabled:opacity-50 transition-colors"
            >
              {copiedField === 'translated' ? (
                <CheckCircle2 size={16} className="text-green-500" />
              ) : (
                <Copy size={16} />
              )}
              {copiedField === 'translated' ? t.copied : t.copy}
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {translatedText.length} {t.characters}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <button
          onClick={translateText}
          disabled={loading || !sourceText.trim()}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {t.translating}
            </>
          ) : (
            <>
              <Zap size={20} />
              {t.translateText}
            </>
          )}
        </button>

        <button
          onClick={swapLanguages}
          className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-6 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          <ArrowLeftRight size={20} />
          {t.swapLanguages}
        </button>

        <button
          onClick={clearAll}
          className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-6 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          <Trash2 size={20} />
          {t.clearAll}
        </button>
      </div>

      {/* Quick Phrases */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-300 dark:border-purple-700 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-400 mb-4 flex items-center gap-2">
          <BookOpen size={20} />
          {t.quickPhrases}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickPhrases.map((section, index) => (
            <div key={index}>
              <p className="text-sm text-purple-700 dark:text-purple-300 mb-3 font-medium">
                {section.category}:
              </p>
              <div className="space-y-2">
                {section.phrases.map((phrase, phraseIndex) => (
                  <button 
                    key={phraseIndex}
                    onClick={() => {
                      setSourceText(phrase.en)
                      setSourceLang('en')
                      setTargetLang('rw')
                    }}
                    className="block text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 text-left w-full text-sm p-2 rounded hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-colors"
                  >
                    <div className="font-medium">{phrase.en}</div>
                    <div className="text-purple-500 dark:text-purple-400 text-xs">→ {phrase.rw}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Translation History */}
      {translationHistory.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-black dark:text-white flex items-center gap-2">
              <History size={20} />
              {t.translationHistory}
            </h2>
            <button
              onClick={clearHistory}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1"
            >
              <Trash2 size={16} />
              {t.clearHistory}
            </button>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {translationHistory.map((item) => (
              <div
                key={item.id}
                className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.fromCode} → {item.toCode}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getSourceColor(item.source)}`}>
                      {getSourceName(item.source)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {formatTimeAgo(item.timestamp)}
                    </span>
                    <button
                      onClick={() => removeFromHistory(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      title={t.removeFromHistory}
                    >
                      ×
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t.original}:</p>
                    <p className="text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900 p-2 rounded text-sm">{item.original}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t.translated}:</p>
                    <p className="text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900 p-2 rounded text-sm">{item.translated}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      setSourceText(item.original)
                      setSourceLang(item.fromCode)
                      setTargetLang(item.toCode)
                    }}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <RotateCcw size={12} />
                    {t.useAgain}
                  </button>
                  <button
                    onClick={() => copyToClipboard(item.translated, 'history')}
                    className="text-xs bg-gray-300 dark:bg-gray-600 text-black dark:text-white px-3 py-1 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors flex items-center gap-1"
                  >
                    <Copy size={12} />
                    {t.copyTranslation}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Translate