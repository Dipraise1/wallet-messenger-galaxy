import { v4 as uuidv4 } from 'uuid';

export interface UserProfile {
  id: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    website?: string;
  };
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: string;
  };
  wallets: {
    address: string;
    blockchain: string;
  }[];
  lastUpdated: number;
}

class ProfileService {
  private LOCAL_STORAGE_KEY = 'wallet-messenger-profile-data';
  private IMAGES_KEY = 'wallet-messenger-profile-images';

  /**
   * Get profile for a wallet address
   */
  async getProfile(walletAddress: string): Promise<UserProfile | null> {
    try {
      const profiles = this.getAllProfiles();
      const normalizedAddress = walletAddress.toLowerCase();
      
      // Find profile that has this wallet
      return profiles.find(profile => 
        profile.wallets.some(wallet => wallet.address.toLowerCase() === normalizedAddress)
      ) || null;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  }

  /**
   * Save a user profile
   */
  async saveProfile(profile: UserProfile): Promise<string> {
    try {
      const profiles = this.getAllProfiles();
      
      // Check if profile with this ID already exists
      const existingIndex = profiles.findIndex(p => p.id === profile.id);
      
      // If profile doesn't have an id, generate one
      if (!profile.id) {
        profile.id = uuidv4();
      }
      
      // Update last updated timestamp
      profile.lastUpdated = Date.now();
      
      if (existingIndex >= 0) {
        // Update existing profile
        profiles[existingIndex] = profile;
      } else {
        // Add new profile
        profiles.push(profile);
      }
      
      // Save to localStorage
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(profiles));
      
      return profile.id;
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  }
  
  /**
   * Get all profiles stored in localStorage
   */
  getAllProfiles(): UserProfile[] {
    try {
      const profileData = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      return profileData ? JSON.parse(profileData) : [];
    } catch (error) {
      console.error('Error getting all profiles:', error);
      return [];
    }
  }
  
  /**
   * Store a profile image
   * Returns a data URL for the image
   */
  async saveProfileImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          if (!event.target?.result) {
            reject(new Error('Failed to read file'));
            return;
          }
          
          const dataUrl = event.target.result as string;
          
          // Save to localStorage
          const images = this.getStoredImages();
          const imageId = uuidv4();
          images[imageId] = dataUrl;
          
          localStorage.setItem(this.IMAGES_KEY, JSON.stringify(images));
          
          resolve(`local://profile-image/${imageId}`);
        };
        
        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };
        
        reader.readAsDataURL(file);
      } catch (error) {
        reject(error);
      }
    });
  }
  
  /**
   * Get a profile image by URL
   * If it's a local URL (local://profile-image/xxx), return the data URL from localStorage
   * Otherwise return the original URL
   */
  getProfileImageUrl(url: string): string {
    if (!url) return '';
    
    if (url.startsWith('local://profile-image/')) {
      const imageId = url.replace('local://profile-image/', '');
      const images = this.getStoredImages();
      return images[imageId] || '';
    }
    
    return url;
  }
  
  /**
   * Get all stored images
   */
  private getStoredImages(): Record<string, string> {
    try {
      const imagesData = localStorage.getItem(this.IMAGES_KEY);
      return imagesData ? JSON.parse(imagesData) : {};
    } catch (error) {
      console.error('Error getting stored images:', error);
      return {};
    }
  }
  
  /**
   * Create a profile for a wallet if none exists
   */
  async ensureProfileExists(walletAddress: string, blockchain: string): Promise<UserProfile> {
    const existingProfile = await this.getProfile(walletAddress);
    
    if (existingProfile) {
      return existingProfile;
    }
    
    // Create a new profile
    const newProfile: UserProfile = {
      id: uuidv4(),
      displayName: walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4),
      bio: '',
      avatar: '',
      socialLinks: {
        twitter: '',
        github: '',
        website: '',
      },
      preferences: {
        theme: 'system',
        notifications: true,
        language: 'en',
      },
      wallets: [
        {
          address: walletAddress,
          blockchain: blockchain,
        }
      ],
      lastUpdated: Date.now(),
    };
    
    await this.saveProfile(newProfile);
    return newProfile;
  }
}

// Singleton instance
const profileService = new ProfileService();
export default profileService; 