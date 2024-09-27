import { uD, iW, cR } from './words'
import { sW } from './sw'

// this function takes a sentence (sent) and processes it word by word.
//It splits the sentence into words, replaces specific patterns (like ri^ with ari^), handles special transformations based on smart converter rules, and uses helper functions to map each word into Unicode characters.
//If the smart converter is turned on (sW['smartconverter_on'] == 'true'), the function applies additional word processing rules.
function TranslateWords(sent, html) {
  sent = sent.replace(/\s*\./g, ' .').replace(/\s*\?/g, ' ?')
  var words = sent.split(' ')
  var rVal = ''
  var subs
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].replace(/ri\^/g, 'ari^')
    if (hasSW(words[i]));
    else if (iW[words[i]]) words[i] = iW[words[i]]
    else if (words[i].length > 3) {
      var ec_0, ec_1, ec_2, ec_3
      ec_0 = words[i].charAt(words[i].length - 1).toLowerCase()
      ec_1 = words[i].charAt(words[i].length - 2).toLowerCase()
      ec_2 = words[i].charAt(words[i].length - 3).toLowerCase()
      ec_3 = words[i].charAt(words[i].length - 4).toLowerCase()
      if (
        (ec_0 == 'a' || ec_0 == 'e' || ec_0 == 'u') &&
        ec_1 == 'h' &&
        ec_2 == 'c'
      )
        /*cha->chha, chu->chhu*/
        words[i] = words[i].substring(0, words[i].length - 3) + 'chh' + ec_0
      else if (ec_0 == 'y')
        /*y->ee, ry=ree*/
        words[i] = words[i].substring(0, words[i].length - 1) + 'ree'
      else if (ec_0 == 'a' && ec_1 == 'h' && ec_2 == 'h');
      else if (ec_0 == 'a' && ec_1 == 'n' && ec_2 == 'k');
      else if (ec_0 == 'a' && ec_1 == 'n' && ec_2 == 'h');
      else if (ec_0 == 'a' && ec_1 == 'n' && ec_2 == 'r');
      else if (ec_0 == 'a' && ec_1 == 'r' && ec_2 == 'd' && ec_3 == 'n');
      else if (ec_0 == 'a' && ec_1 == 'r' && ec_2 == 't' && ec_3 == 'n');
      else if (
        ec_0 == 'a' &&
        (ec_1 == 'm' ||
          (!isVowel(ec_1) && !isVowel(ec_3) && ec_1 != 'y' && ec_2 != 'e'))
      )
        /*ntra->nothing..swatantra*/
        words[i] += 'a'
      if (ec_0 == 'i' && !isVowel(ec_1))
        /*ending i->ee*/
        words[i] = words[i].substring(0, words[i].length - 1) + 'ee'
    }

    subs = words[i].split('/')
    for (let j = 0; j < subs.length; j++)
      if (subs[j].length != 0) rVal += getAllUnicode(subs[j], html)
    rVal += ' '
  }
  return rVal
}

//This helper function checks if a string contains special words based on the sW dictionary.
function hasSW(s) {
  var sIndex
  for (sIndex = s.length - 2; sIndex >= 0; sIndex--) {
    if (sW[s.substring(sIndex)]) return true
  }
  return false
}

//This function converts a transliteration or key from the dictionary into Unicode, handling potential HTML encoding.
// It processes strings broken down by the "+" symbol, which may indicate separate components of a Unicode character.
function getUnicode(t, ll, html) {
  var u = ''
  var stopPos = 0
  var ar = t.split('+')
  if (
    ll &&
    ar &&
    ar.length > 1 &&
    sW['smartconverter_on'] == 'true' &&
    ar[ar.length - 1] == '2381'
  )
    /* remove trailing short characther so that swagatam = swagatama */
    stopPos = 1
  if (ar)
    for (let k = 0; k < ar.length - stopPos; k++)
      if (ar[k].length > 0 && !html) u += String.fromCharCode(ar[k])
      else if (ar[k].length > 0 && html) u += '&#' + ar[k] + ';'
  return u
}

//This function takes a string and converts it to Unicode by checking the uD dictionary, which contains mappings from keys (e.g., ka, sha) to their Unicode equivalents.
//It also handles character transformations, converting common replacements into Unicode form and building the final Unicode string step by step.
function getAllUnicode(s, html) {
  var allUnicode = ''
  var u
  var tryString = s
  tryString = tryString
    .replace(/T/g, '^^t^^')
    .replace(/D/g, '^^d^^')
    .replace(/N/g, '^^n^^')
    .replace(/SH/g, '^^sh^^')
    .replace(/Sh/g, '^^sh^^')
  tryString = tryString.toLowerCase()
  tryString = tryString
    .replace(/\^\^t\^\^/g, 'T')
    .replace(/\^\^d\^\^/g, 'D')
    .replace(/\^\^n\^\^/g, 'N')
    .replace(/\^\^sh\^\^/g, 'Sh')
  var nextTryString = ''
  while (tryString.length > 0) {
    u = uD[tryString]
    if (u || tryString.length <= 1) {
      if (u)
        allUnicode += getUnicode(
          u,
          !(nextTryString.replace(/^\s+|\s+|\\$/, '').length > 0),
          html
        )
      else allUnicode += tryString
      tryString = nextTryString
      nextTryString = ''
    } else {
      nextTryString = tryString.charAt(tryString.length - 1) + nextTryString
      tryString = tryString.substring(0, tryString.length - 1)
    }
  }
  if (allUnicode.length == 0) return s
  else return allUnicode
}

// This is the main function to handle input and output translation. It takes a source text, processes it by replacing placeholders, and calls TranslateWords to convert everything into Unicode.
// It also supports masking and token replacement for special cases using {} or [].
// function translate(source, destination, html, smart) {
//   var input = source.value
//   var beginIndex = 0
//   var endIndex = -1
//   var engTokens = new Object()
//   var token = ''
//   var tokenCount = 1
//   var mask = ''
//   while (beginIndex > -1 && endIndex < input.length - 1) {
//     beginIndex = input.indexOf('{', endIndex + 1)
//     if (beginIndex > -1) {
//       endIndex = input.indexOf('}', beginIndex + 1)
//       if (endIndex == -1) endIndex = input.length - 1
//       token = input.substring(beginIndex, endIndex + 1)
//       mask = '$-' + tokenCount + '-$'
//       engTokens[mask] = token.substring(1, token.length - 1)
//       input = input.replace(token, mask)
//       endIndex = endIndex - token.length + mask.length
//       tokenCount++
//     }
//   }
//   var nonSmartTokens = new Object()
//   if (smart) {
//     smartConverter(false)
//     beginIndex = 0
//     endIndex = -1
//     token = ''
//     mask = ''
//     while (beginIndex > -1 && endIndex < input.length - 1) {
//       beginIndex = input.indexOf('[', endIndex + 1)
//       if (beginIndex > -1) {
//         endIndex = input.indexOf(']', beginIndex + 1)
//         if (endIndex == -1) endIndex = input.length - 1
//         token = input.substring(beginIndex, endIndex + 1)
//         mask = '$-' + tokenCount + '-$'
//         nonSmartTokens[mask] = TranslateWords(
//           token.substring(1, token.length - 1),
//           html
//         )
//         input = input.replace(token, mask)
//         endIndex = endIndex - token.length + mask.length
//         tokenCount++
//       }
//     }
//     smartConverter(true)
//   }
//   var unicode = TranslateWords(input, html)
//   if (smart) {
//     for (let mask in nonSmartTokens) {
//       unicode = unicode.replace(
//         TranslateWords(mask, html).replace(' ', ''),
//         nonSmartTokens[mask].replace(/\s$/, '')
//       )
//     }
//   }
//   for (let mask in engTokens) {
//     unicode = unicode.replace(
//       TranslateWords(mask, html).replace(' ', ''),
//       engTokens[mask]
//     )
//   }
//   destination.value = unicode
// }

//Checks if a character is a vowel (for transformation logic in other functions).
function isVowel(c) {
  c = c.toLowerCase()
  if ((c && c == 'a') || c == 'e' || c == 'i' || c == 'o' || c == 'u')
    return true
  return false
}

//This function toggles the smart converter mode on or off, updating the uD dictionary based on the sW dictionary's contents.
// function smartConverter(smartflag) {
//   if (smartflag) {
//     for (var specialWord in sW) uD[specialWord] = sW[specialWord]
//     sW['smartconverter_on'] = 'true'
//   } else {
//     for (var specialWord in sW) if (uD[specialWord]) uD[specialWord] = null
//     sW['smartconverter_on'] = null
//   }
// }

for (var conso in cR) {
  if (!uD[conso]) uD[conso] = cR[conso]
  if (!uD[conso + 'a']) uD[conso + 'a'] = cR[conso] + '+2366'
  var consoMinusA = conso.substring(0, conso.length - 1)
  var consoVal = cR[conso]
  if (!uD[consoMinusA + 'i']) uD[consoMinusA + 'i'] = consoVal + '+2367'
  if (!uD[consoMinusA + 'ee']) uD[consoMinusA + 'ee'] = consoVal + '+2368'
  if (!uD[consoMinusA + 'u']) uD[consoMinusA + 'u'] = consoVal + '+2369'
  if (!uD[consoMinusA + 'oo']) uD[consoMinusA + 'oo'] = consoVal + '+2370'
  if (!uD[consoMinusA + 'ri']) uD[consoMinusA + 'ri'] = consoVal + '+2371'
  if (!uD[consoMinusA + 'e']) uD[consoMinusA + 'e'] = consoVal + '+2375'
  if (!uD[consoMinusA + 'ai']) uD[consoMinusA + 'ai'] = consoVal + '+2376'
  if (!uD[consoMinusA + 'o']) uD[consoMinusA + 'o'] = consoVal + '+2379'
  if (!uD[consoMinusA + 'au']) uD[consoMinusA + 'au'] = consoVal + '+2380'
  if (!uD[consoMinusA]) uD[consoMinusA] = consoVal + '+2381'
}

export { TranslateWords, hasSW, getUnicode, getAllUnicode }
