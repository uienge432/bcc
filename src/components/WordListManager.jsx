import { useState } from 'react'

function WordListManager({ wordLists, setWordLists }) {
  const [newListName, setNewListName] = useState('')
  const [newListWords, setNewListWords] = useState('')
  const [editingList, setEditingList] = useState(null)

  const createNewList = () => {
    if (!newListName || !newListWords) return
    
    setWordLists({
      ...wordLists,
      [newListName]: newListWords.split(',').map(word => word.trim())
    })
    
    setNewListName('')
    setNewListWords('')
  }

  const deleteList = (listName) => {
    const newLists = { ...wordLists }
    delete newLists[listName]
    setWordLists(newLists)
  }

  const updateList = (listName) => {
    if (!editingList) return
    
    setWordLists({
      ...wordLists,
      [listName]: editingList.split(',').map(word => word.trim())
    })
    
    setEditingList(null)
  }

  return (
    <div className="word-list-manager">
      <h2>Manage Word Lists</h2>
      
      <div className="create-list">
        <h3>Create New List</h3>
        <input
          type="text"
          placeholder="List Name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />
        <textarea
          placeholder="Enter words separated by commas"
          value={newListWords}
          onChange={(e) => setNewListWords(e.target.value)}
        />
        <button onClick={createNewList}>Create List</button>
      </div>

      <div className="existing-lists">
        <h3>Existing Lists</h3>
        {Object.entries(wordLists).map(([listName, words]) => (
          <div key={listName} className="list-item">
            <h4>{listName}</h4>
            {editingList !== null ? (
              <>
                <textarea
                  value={editingList}
                  onChange={(e) => setEditingList(e.target.value)}
                />
                <button onClick={() => updateList(listName)}>Save</button>
                <button onClick={() => setEditingList(null)}>Cancel</button>
              </>
            ) : (
              <>
                <p>{words.join(', ')}</p>
                <button onClick={() => setEditingList(words.join(', '))}>Edit</button>
                <button onClick={() => deleteList(listName)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default WordListManager 