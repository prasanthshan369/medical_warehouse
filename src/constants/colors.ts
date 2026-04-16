export const colors = {
    primary: '#0F7635',         // Main Green
    textDeep: '#1A1A1A',        // Headings / Darkest Text
    textMain: '#222222',        // Body Text
    textSecondary: '#6A6A6A',   // Secondary Text / Labels / Subtitles
    textMuted: '#969696',       // Placeholders / Inactive states
    border: '#E6E6E6',          // Standard Borders
    borderLight: '#EEEEEE',     // Subtle Dividers / Skeletons
    bgMain: '#F9F9F9',          // Screen background
    bgGray: '#F2F2F2',          // Secondary buttons / inactive containers
    blueInfo: '#2196F3',        // Information / Links
    
    // Status - Warning / Partial
    warning: '#D9A95D',         // Muted Amber for icons/accents
    warningBg: '#F5F2DC',       // Light yellow/tan for backgrounds
    
    // Status - Success / Completed
    successBg: '#E8F4EC',
    successBorder: '#A0C9AF',
    
    // Status - Card backgrounds for States
    partialBg: '#FDF2E2',
    partialBorder: '#EAD2AF',
    completedBg: '#E8F4EC',
    completedBorder: '#A0C9AF'
} as const;

export type AppColor = keyof typeof colors;
