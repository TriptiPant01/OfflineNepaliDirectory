import React, { useState } from 'react'

import { IndicTransliterate } from '@ai4bharat/indic-transliterate'

const App = () => {
  const [text, setText] = useState('')

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <IndicTransliterate
        value={text}
        onChangeText={(text) => {
          setText(text)
        }}
        lang="hi"
      />
    </div>
  )
}

export default App
