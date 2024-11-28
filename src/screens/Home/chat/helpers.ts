import AsyncStorage from '@react-native-async-storage/async-storage';

export const blockedKeywordsSet = new Set([
  'meet up',
  "let's meet",
  'can we meet?',
  "let's catch up",
  'in-person meeting',
  'face-to-face',
  'meet outside',
  'physical meeting',
  'whatsapp',
  'facebook',
  'fb',
  'insta',
  'instagram',
  'telegram',
  'tg',
  'messenger',
  'snapchat',
  'contact number',
  'phone number',
  'mobile number',
  'call me',
  "let's talk on the phone",
  'video call',
  'where should we meet?',
  'meet me at',
  "let's grab a coffee",
  'meet for coffee',
  "let's hang out",
  'see you outside',
]);

export const warnUser = async () => {
  try {
    const value = await AsyncStorage.getItem('warn-user');
    if (value === 'true') {
      return true;
    } else {
      await AsyncStorage.setItem('warn-user', 'true');
      return false;
    }
  } catch (error) {}
};

export const checkForBlockedKeywords = async (message: string) => {
  // Normalize message: lowercase and remove punctuation
  const normalizedMessage = message.toLowerCase().replace(/[.,?!]/g, '');

  // Check if any single word in the message is in the set
  const messageWords = normalizedMessage.split(' ');
  const containsSingleWord = messageWords.some(word =>
    blockedKeywordsSet.has(word),
  );

  // Check if the entire message contains any multi-word phrases
  const containsPhrase = Array.from(blockedKeywordsSet).some(keyword =>
    normalizedMessage.includes(keyword),
  );

  return containsSingleWord || containsPhrase;
};

export function capitalizeFirstLetter(input: string): string {
  if (!input) return ''; // Handle empty string case

  // Convert first letter to uppercase and concatenate with the rest of the string
  return input.charAt(0).toUpperCase() + input.slice(1);
}
