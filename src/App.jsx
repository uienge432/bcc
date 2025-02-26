import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { motion, AnimatePresence } from 'framer-motion'

const chunk = (array, size) => {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
};

function App() {
  const [wordLists, setWordLists] = useState([
    {
      id: uuidv4(),
      name: 'Fruits',
      words: [
        'Apple', 'Banana', 'Orange', 'Mango', 'Grape', 'Pineapple', 'Strawberry', 'Blueberry', 'Peach', 'Pear',
        'Watermelon', 'Kiwi', 'Plum', 'Cherry', 'Lemon', 'Lime', 'Raspberry', 'Blackberry', 'Apricot', 'Coconut',
        'Pomegranate', 'Fig', 'Guava', 'Papaya', 'Dragon Fruit'
      ]
    },
    {
      id: uuidv4(),
      name: 'States',
      words: [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
        'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
        'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri'
      ]
    },
    {
      id: uuidv4(),
      name: 'Jobs',
      words: [
        'Teacher', 'Doctor', 'Engineer', 'Chef', 'Artist', 'Lawyer', 'Nurse', 'Pilot', 'Architect', 'Programmer',
        'Dentist', 'Electrician', 'Plumber', 'Mechanic', 'Accountant', 'Scientist', 'Writer', 'Designer', 'Firefighter', 'Police Officer',
        'Veterinarian', 'Pharmacist', 'Photographer', 'Carpenter', 'Psychologist'
      ]
    },
    {
      id: uuidv4(),
      name: 'Numbers',
      words: Array.from({ length: 25 }, (_, i) => (i + 1).toString())
    }
  ])
  
  const [selectedListId, setSelectedListId] = useState('')
  const [numberOfCards, setNumberOfCards] = useState(1)
  const [generatedCards, setGeneratedCards] = useState([])
  const [editingListId, setEditingListId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreatingList, setIsCreatingList] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [newListWords, setNewListWords] = useState('')
  const [cardsPerPage, setCardsPerPage] = useState(1)

  const generateBingoCards = (listId) => {
    if (!listId) return
    
    const list = wordLists.find(list => list.id === listId)
    if (!list) return

    const cards = []
    const words = list.words
    
    for (let i = 0; i < numberOfCards; i++) {
      const shuffled = [...words].sort(() => Math.random() - 0.5)
      const cardWords = shuffled.slice(0, 24)
      cardWords.splice(12, 0, 'FREE')
      cards.push(cardWords)
    }
    
    setGeneratedCards(cards)
    setSelectedListId(listId)
  }

  const deleteList = (listId) => {
    setWordLists(lists => lists.filter(list => list.id !== listId))
  }

  const startEditing = (listId) => {
    const list = wordLists.find(list => list.id === listId)
    if (!list) return
    
    setEditingListId(listId)
    setEditingText(list.words.join(', '))
  }

  const saveEdit = () => {
    if (!editingListId) return
    
    setWordLists(lists => lists.map(list => 
      list.id === editingListId
        ? { ...list, words: editingText.split(',').map(word => word.trim()).filter(Boolean) }
        : list
    ))
    setEditingListId(null)
    setEditingText('')
  }

  const canGenerateCards = (list) => {
    return list.words.length >= 25
  }

  const handleCreateList = () => {
    if (!newListName.trim() || !newListWords.trim()) return
    
    const newList = {
      id: uuidv4(),
      name: newListName.trim(),
      words: newListWords.split(',').map(word => word.trim()).filter(Boolean)
    }

    setWordLists(lists => [newList, ...lists])
    setNewListName('')
    setNewListWords('')
    setIsCreatingList(false)
  }

  const filteredLists = wordLists.filter(list => 
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Bingo Cards - ${selectedListId}</title>
          <style>
            @media print {
              @page {
                size: letter;
                margin: 0.2in;
              }
              
              body {
                font-family: system-ui, -apple-system, sans-serif;
                margin: 0;
                padding: 0;
                background: white;
                max-width: 8.1in;
                margin: 0 auto;
              }

              .cards-container {
                display: grid;
                grid-template-columns: repeat(${cardsPerPage === 4 ? 2 : cardsPerPage}, 1fr);
                gap: ${cardsPerPage === 1 ? '0.4in' : '0.2in'};
                page-break-after: always;
                width: 100%;
              }

              .bingo-card {
                page-break-inside: avoid;
                border: 1px solid #333;
                overflow: hidden;
                width: ${cardsPerPage === 1 ? '7.7in' : cardsPerPage === 2 ? '3.85in' : '3.85in'};
                aspect-ratio: 1.1;
              }

              .bingo-header {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 1px;
                background: #333;
              }

              .bingo-header div {
                background: linear-gradient(135deg, #7c3aed, #4f46e5);
                color: white;
                font-weight: bold;
                font-size: ${cardsPerPage === 1 ? '24px' : cardsPerPage === 2 ? '20px' : '16px'};
                padding: ${cardsPerPage === 1 ? '16px' : cardsPerPage === 2 ? '12px' : '8px'};
                text-align: center;
                letter-spacing: 1px;
                aspect-ratio: 1;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .grid {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 1px;
                background: #333;
              }

              .cell {
                background: white;
                aspect-ratio: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                font-size: ${cardsPerPage === 1 ? '14px' : cardsPerPage === 2 ? '12px' : '10px'};
                font-weight: 500;
                color: #333;
                padding: 4px;
                word-break: break-word;
                line-height: 1.2;
                border: 0.5px solid #e5e7eb;
              }

              .free-space {
                background: #f5f3ff;
                font-weight: bold;
                color: #7c3aed;
                font-size: ${cardsPerPage === 1 ? '16px' : cardsPerPage === 2 ? '14px' : '12px'};
              }

              /* Ensure proper sizing for different layouts */
              @page {
                size: letter portrait;
              }
            }
          </style>
        </head>
        <body>
          ${chunk(generatedCards, cardsPerPage).map(pageCards => `
            <div class="cards-container">
              ${pageCards.map((card) => `
                <div class="bingo-card">
                  <div class="bingo-header">
                    ${['B', 'I', 'N', 'G', 'O'].map(letter => `
                      <div>${letter}</div>
                    `).join('')}
                  </div>
                  <div class="grid">
                    ${card.map((word, index) => `
                      <div class="cell ${index === 12 ? 'free-space' : ''}">
                        ${index === 12 ? 'FREE' : word}
                      </div>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          `).join('')}
          <script>
            window.onload = () => window.print();
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-5 font-sans">
        <header className="text-center py-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text"
          >
            Bingo Card Creator
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-600"
          >
            Create beautiful bingo cards for your classroom, events, or fun
          </motion.p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="word-lists space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Word Lists</h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsCreatingList(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl 
                    hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New List
                </motion.button>
              </div>

              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search lists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-5 py-4 pr-12 bg-gray-50 border-0 rounded-xl text-gray-600 
                    placeholder-gray-400 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                />
                <svg 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </div>

              <AnimatePresence>
                {isCreatingList && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-gray-50 p-6 rounded-xl mb-6"
                  >
                    <input
                      type="text"
                      placeholder="Give your list a name..."
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      className="w-full px-4 py-3 mb-4 bg-white border-0 rounded-lg shadow-sm 
                        focus:ring-2 focus:ring-purple-200"
                    />
                    <textarea
                      placeholder="Enter words separated by commas..."
                      value={newListWords}
                      onChange={(e) => setNewListWords(e.target.value)}
                      className="w-full min-h-[120px] p-4 mb-4 bg-white border-0 rounded-lg shadow-sm 
                        focus:ring-2 focus:ring-purple-200 resize-none"
                    />
                    <div className="flex gap-3">
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCreateList}
                        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 
                          text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        Create List
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setIsCreatingList(false)
                          setNewListName('')
                          setNewListWords('')
                        }}
                        className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg 
                          hover:bg-gray-300 transition-all duration-200"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <AnimatePresence>
                  {filteredLists.map(list => (
                    <motion.div
                      key={list.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm 
                        hover:shadow-md transition-all duration-200 p-6 group"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                          {list.name}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {list.words.length} words
                        </span>
                      </div>
                      
                      {editingListId === list.id ? (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-4"
                        >
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            placeholder="Enter words separated by commas"
                            className="w-full min-h-[120px] p-4 bg-gray-50 border-0 rounded-xl mb-4 
                              text-sm resize-none focus:ring-2 focus:ring-purple-200 transition-all"
                          />
                          <div className="flex gap-2">
                            <motion.button 
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={saveEdit}
                              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 
                                text-white rounded-lg shadow-sm hover:shadow-md transition-all"
                            >
                              Save Changes
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setEditingListId(null)}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg 
                                hover:bg-gray-200 transition-all"
                            >
                              Cancel
                            </motion.button>
                          </div>
                        </motion.div>
                      ) : (
                        <>
                          <div className="mt-3 space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {list.words.slice(0, 8).map(word => (
                                <span key={word} className="px-3 py-1 bg-gray-50 rounded-full text-sm text-gray-600">
                                  {word}
                                </span>
                              ))}
                              {list.words.length > 8 && (
                                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm">
                                  +{list.words.length - 8} more
                                </span>
                              )}
                            </div>
                            
                            {list.words.length < 25 && (
                              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 
                                rounded-lg p-3 text-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                  />
                                </svg>
                                <span>Need {25 - list.words.length} more words for bingo</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                            <div className="flex-1 flex items-center gap-3">
                              <input 
                                type="number" 
                                min="1"
                                placeholder="# of cards"
                                value={selectedListId === list.id ? numberOfCards : 1}
                                onChange={(e) => {
                                  setSelectedListId(list.id)
                                  setNumberOfCards(parseInt(e.target.value))
                                }}
                                className="w-24 px-3 py-2 bg-gray-50 border-0 rounded-lg text-sm
                                  focus:ring-2 focus:ring-purple-200 transition-all"
                              />
                              <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => generateBingoCards(list.id)}
                                disabled={!canGenerateCards(list)}
                                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                                  canGenerateCards(list)
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm hover:shadow-md'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                  />
                                </svg>
                                Generate
                              </motion.button>
                            </div>

                            <div className="flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => startEditing(list.id)}
                                className="p-2 text-gray-500 hover:text-purple-600 transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => deleteList(list.id)}
                                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </motion.button>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredLists.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-gray-500"
                  >
                    No lists found matching &ldquo;{searchTerm}&rdquo;
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {generatedCards.length > 0 && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="generated-cards sticky top-5"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold">Generated Bingo Cards</h2>
                    <p className="text-gray-600 mt-1">
                      {generatedCards.length} card{generatedCards.length !== 1 ? 's' : ''} generated
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200">
                      {[1, 2, 4].map((number) => (
                        <motion.button
                          key={number}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCardsPerPage(number)}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap
                            ${cardsPerPage === number 
                              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm' 
                              : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          {number} per page
                        </motion.button>
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePrint}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 
                        text-white rounded-xl shadow-sm hover:shadow-md transition-all 
                        flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                    >
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" 
                        />
                      </svg>
                      Print Cards
                    </motion.button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">
                  {generatedCards.map((card) => (
                    <motion.div 
                      key={uuidv4()} 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white overflow-hidden shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300"
                    >
                      <div className="grid grid-cols-5 gap-[1px] bg-gray-300">
                        {['B', 'I', 'N', 'G', 'O'].map((letter) => (
                          <div 
                            key={`${letter}-${uuidv4()}`}
                            className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-4 
                              flex items-center justify-center font-bold text-2xl"
                          >
                            {letter}
                          </div>
                        ))}
                        
                        {card.map((word, index) => (
                          <div 
                            key={`${word}-${index}-${uuidv4()}`}
                            className={`aspect-square bg-white p-2 flex items-center justify-center text-center
                              group transition-all duration-200 hover:bg-gray-50 border-[0.5px] border-gray-200
                              ${index === 12 
                                ? 'bg-gradient-to-br from-purple-50 to-indigo-50 font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-indigo-600' 
                                : 'text-gray-700'}`}
                          >
                            <span className="text-sm font-medium group-hover:scale-105 transition-transform duration-200">
                              {index === 12 ? 'FREE' : word}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
