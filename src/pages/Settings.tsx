import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { User, Bell, Globe, Moon, Sun, Shield, Save, Plus, Loader2, Check } from 'lucide-react';
import { useBlockchain } from '../lib/blockchain/blockchain-context';
import profileService, { UserProfile } from '../lib/profile-service';
import ProfileImageUpload from '../components/ProfileImageUpload';

const Settings: React.FC = () => {
  const { walletInfo, activeNetwork, blockchains } = useBlockchain();
  
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    displayName: '',
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
    wallets: [],
    lastUpdated: Date.now(),
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile data if available
  useEffect(() => {
    const loadProfile = async () => {
      if (!walletInfo?.address) {
        setIsLoading(false);
        return;
      }

      try {
        // Load or create profile for this wallet
        const userProfile = await profileService.ensureProfileExists(
          walletInfo.address, 
          walletInfo.blockchain
        );
        
        if (userProfile) {
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [walletInfo]);

  // Handle profile updates
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      
      if (section === 'socialLinks') {
        setProfile(prev => ({
          ...prev,
          socialLinks: {
            ...prev.socialLinks,
            [field]: value,
          },
        }));
      } else if (section === 'preferences') {
        setProfile(prev => ({
          ...prev,
          preferences: {
            ...prev.preferences!,
            [field]: value,
          },
        }));
      }
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle preference changes
  const handlePreferenceChange = (field: string, value: string | boolean) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences!,
        [field]: value,
      }
    }));
  };

  // Handle image upload
  const handleImageUpload = (imageUrl: string) => {
    setProfile(prev => ({
      ...prev,
      avatar: imageUrl,
    }));
  };

  // Save profile
  const saveProfile = async () => {
    if (!walletInfo?.address) {
      setSaveError('Please connect your wallet to save profile');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Add current wallet if not already in the wallets array
      const walletExists = profile.wallets.some(
        w => w.address.toLowerCase() === walletInfo.address.toLowerCase()
      );

      const updatedProfile = { ...profile };
      
      if (!walletExists) {
        updatedProfile.wallets = [
          ...updatedProfile.wallets,
          {
            address: walletInfo.address,
            blockchain: walletInfo.blockchain,
          }
        ];
      }

      // Save profile
      await profileService.saveProfile(updatedProfile);
      
      // Update local state
      setProfile(updatedProfile);
      setSaveSuccess(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveError('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Get blockchain icon
  const getBlockchainIcon = (chainId: string) => {
    const blockchain = blockchains.find(b => b.id === chainId);
    return blockchain?.icon || '';
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="ml-2">Loading profile data...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
          
          <button 
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 transition-colors duration-200"
            onClick={saveProfile}
            disabled={isSaving || !walletInfo}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
        
        {!walletInfo && (
          <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-700 p-4 rounded mb-6">
            <p>Please connect your wallet to access and save settings.</p>
          </div>
        )}
        
        {saveSuccess && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6 flex items-center">
            <Check className="w-5 h-5 mr-2 text-green-500" />
            <p>Settings saved successfully!</p>
          </div>
        )}
        
        {saveError && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
            <p>{saveError}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Settings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
                  <User className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  Profile Information
                </h2>
              </div>
              
              <div className="px-6 py-5">
                <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center">
                  <div className="mb-4 sm:mb-0 sm:mr-6">
                    <ProfileImageUpload 
                      currentImage={profile.avatar} 
                      onImageUpload={handleImageUpload} 
                    />
                  </div>
                  
                  <div className="flex-1 w-full">
                    <div className="mb-4">
                      <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        id="displayName"
                        name="displayName"
                        value={profile.displayName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your display name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={profile.bio || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tell us about yourself"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Social Links</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Twitter
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">@</span>
                        </div>
                        <input
                          type="text"
                          id="twitter"
                          name="socialLinks.twitter"
                          value={profile.socialLinks?.twitter || ''}
                          onChange={handleInputChange}
                          className="block w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="username"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="github" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        GitHub
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">@</span>
                        </div>
                        <input
                          type="text"
                          id="github"
                          name="socialLinks.github"
                          value={profile.socialLinks?.github || ''}
                          onChange={handleInputChange}
                          className="block w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="username"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Website
                      </label>
                      <input
                        type="text"
                        id="website"
                        name="socialLinks.website"
                        value={profile.socialLinks?.website || ''}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://your-website.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  Connected Wallets
                </h2>
              </div>
              
              <div className="px-6 py-5">
                <div className="space-y-3">
                  {profile.wallets.map((wallet, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      {getBlockchainIcon(wallet.blockchain) && (
                        <img 
                          src={getBlockchainIcon(wallet.blockchain)} 
                          alt={wallet.blockchain} 
                          className="w-6 h-6 mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {wallet.blockchain.charAt(0).toUpperCase() + wallet.blockchain.slice(1)} Wallet
                        </div>
                        <div className="text-xs font-mono text-gray-500 dark:text-gray-400">
                          {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {activeNetwork && walletInfo && !profile.wallets.some(
                    w => w.address.toLowerCase() === walletInfo.address.toLowerCase()
                  ) && (
                    <button 
                      className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                      onClick={() => {
                        setProfile(prev => ({
                          ...prev,
                          wallets: [
                            ...prev.wallets,
                            {
                              address: walletInfo.address,
                              blockchain: walletInfo.blockchain,
                            }
                          ]
                        }));
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" /> 
                      Add current wallet
                    </button>
                  )}
                </div>
                
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  Your wallet is your identity. Connect multiple wallets to access your account from different blockchains.
                </div>
              </div>
            </div>
          </div>
          
          {/* Preferences & Security */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  App Preferences
                </h2>
              </div>
              
              <div className="px-6 py-5 space-y-5">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profile.preferences?.notifications}
                      onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enable notifications</span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Receive notifications about new messages and important updates
                  </p>
                </div>
                
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Globe className="w-4 h-4 inline mr-1" /> 
                    Language
                  </label>
                  <select
                    id="language"
                    value={profile.preferences?.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Select language"
                    title="Select language"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="zh">中文</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Moon className="w-4 h-4 inline mr-1" /> 
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      className={`flex items-center justify-center px-3 py-2 rounded-md ${
                        profile.preferences?.theme === 'light'
                          ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300'
                          : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => handlePreferenceChange('theme', 'light')}
                    >
                      <Sun className="w-4 h-4 mr-1" /> Light
                    </button>
                    <button
                      type="button"
                      className={`flex items-center justify-center px-3 py-2 rounded-md ${
                        profile.preferences?.theme === 'dark'
                          ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300'
                          : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => handlePreferenceChange('theme', 'dark')}
                    >
                      <Moon className="w-4 h-4 mr-1" /> Dark
                    </button>
                    <button
                      type="button"
                      className={`flex items-center justify-center px-3 py-2 rounded-md ${
                        profile.preferences?.theme === 'system'
                          ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300'
                          : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => handlePreferenceChange('theme', 'system')}
                    >
                      System
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  Security & Privacy
                </h2>
              </div>
              
              <div className="px-6 py-5">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center mb-2">
                    Data Storage
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Your profile data is stored securely in your browser's local storage. 
                    It's only accessible from this device and isn't shared with any third parties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
