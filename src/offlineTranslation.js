import React, { useState } from 'react'
import { TranslateWords } from './TranslateWords' // Import the transliteration function

const UnicodeTextInput = () => {
  const [inputText, setInputText] = useState('')
  const [unicodeText, setUnicodeText] = useState('')

  // Function to handle text change and transliteration
  const handleTextChange = (event) => {
    const text = event.target.value
    setInputText(text) // Set input text state
    const convertedText = TranslateWords(text, false) // Call the transliteration function
    setUnicodeText(convertedText) // Update the Unicode state with transliterated text
  }

  return (
    <div style={styles.container}>
      <label style={styles.label}>Type in the text input:</label>
      <input
        style={styles.input}
        type="text"
        value={inputText}
        onChange={handleTextChange} // Handle the text input changes
        placeholder="Enter text here"
      />

      <label style={styles.label}>Unicode Output:</label>
      <input
        style={styles.input}
        type="text"
        value={unicodeText} // Display transliterated text
        readOnly // Make it read-only
        placeholder="Unicode output will appear here"
      />
    </div>
  )
}

// Simple inline styles for the inputs and container
const styles = {
  container: {
    padding: '20px',
  },
  label: {
    fontSize: '16px',
    marginBottom: '10px',
    display: 'block',
  },
  input: {
    width: '100%',
    height: '40px',
    padding: '10px',
    fontSize: '16px',
    marginBottom: '20px',
    border: '1px solid gray',
    borderRadius: '4px',
  },
}

export default UnicodeTextInput
