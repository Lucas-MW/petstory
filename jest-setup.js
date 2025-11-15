// Setup file for Jest tests

// Mock Expo modules
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
  },
  Link: 'Link',
  Redirect: 'Redirect',
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('lucide-react-native', () => ({
  Dog: 'Dog',
  Cat: 'Cat',
}));

// Mock Image
jest.mock('react-native/Libraries/Image/Image', () => 'Image');
