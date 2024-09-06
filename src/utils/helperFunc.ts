import {Text} from 'react-native';

export const formatDate = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    // Less than a minute
    return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    // Less than an hour
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    // Less than a day
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays > 3) {
    // More than 3 days
    return date.toLocaleDateString(); // Adjust this format as needed
  }

  // Less than 3 days but more than 1 day
  return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
};

export function chunkArray<T>(items: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  return chunks;
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export function convertStringToArray(inputString: string): string[] {
  try {
    // Parse the input string as JSON
    const parsedArray = JSON.parse(inputString);

    // Ensure the parsed value is an array
    if (Array.isArray(parsedArray)) {
      return parsedArray;
    } else {
      throw new Error('Parsed value is not an array.');
    }
  } catch (error) {
    // Handle any parsing errors
    throw new Error('Invalid input string. Could not convert to array.');
  }
}
