
import React from 'react';
import { Layout } from '../components/Layout';
import { 
  Bell, 
  Lock, 
  Wallet, 
  Globe, 
  LogOut, 
  Moon, 
  Monitor, 
  ChevronRight, 
  CheckCircle2,
  User,
  Shield
} from 'lucide-react';

const Settings = () => {
  return (
    <Layout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <h1 className="text-xl font-semibold">Settings</h1>
        
        <div className="glass-card rounded-xl p-6 animate-fade-in">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-darkBg3 flex items-center justify-center text-2xl">
              A
            </div>
            <div>
              <h2 className="text-lg font-semibold">Anonymous User</h2>
              <p className="text-sm text-gray-400">0x7890...5678</p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-neonGreen" />
                <span className="text-sm">Wallet Connected</span>
              </div>
              <button className="button-hover text-neonBlue bg-neonBlue/10 hover:bg-neonBlue/20 rounded-lg px-4 py-2 text-sm">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Account Settings</h2>
          
          <div className="glass-card rounded-xl divide-y divide-white/10 animate-fade-in">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-neonBlue/20 flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-neonBlue" />
                </div>
                <div>
                  <h3 className="font-medium">Profile Information</h3>
                  <p className="text-xs text-gray-400">Update your profile details</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-neonPurple/20 flex items-center justify-center mr-3">
                  <Wallet className="w-5 h-5 text-neonPurple" />
                </div>
                <div>
                  <h3 className="font-medium">Connected Wallets</h3>
                  <p className="text-xs text-gray-400">Manage your blockchain wallets</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-neonGreen/20 flex items-center justify-center mr-3">
                  <Bell className="w-5 h-5 text-neonGreen" />
                </div>
                <div>
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-xs text-gray-400">Configure notification preferences</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <h2 className="text-lg font-semibold mt-6">App Settings</h2>
          
          <div className="glass-card rounded-xl divide-y divide-white/10 animate-fade-in">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-neonBlue/20 flex items-center justify-center mr-3">
                  <Globe className="w-5 h-5 text-neonBlue" />
                </div>
                <div>
                  <h3 className="font-medium">Language</h3>
                  <p className="text-xs text-gray-400">English (US)</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-neonPurple/20 flex items-center justify-center mr-3">
                  <Moon className="w-5 h-5 text-neonPurple" />
                </div>
                <div>
                  <h3 className="font-medium">Theme</h3>
                  <p className="text-xs text-gray-400">Dark Mode</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="p-2 rounded-md bg-neonPurple/20 text-neonPurple">
                  <Moon className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-md bg-darkBg3">
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <h2 className="text-lg font-semibold mt-6">Security</h2>
          
          <div className="glass-card rounded-xl divide-y divide-white/10 animate-fade-in">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-neonGreen/20 flex items-center justify-center mr-3">
                  <Lock className="w-5 h-5 text-neonGreen" />
                </div>
                <div>
                  <h3 className="font-medium">Security Settings</h3>
                  <p className="text-xs text-gray-400">Configure security options</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-neonPink/20 flex items-center justify-center mr-3">
                  <Shield className="w-5 h-5 text-neonPink" />
                </div>
                <div>
                  <h3 className="font-medium">Privacy</h3>
                  <p className="text-xs text-gray-400">Manage your privacy settings</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <button className="button-hover bg-darkBg3 hover:bg-darkBg3/80 rounded-lg px-6 py-3 flex items-center text-neonPink">
              <LogOut className="w-5 h-5 mr-2" />
              Disconnect Wallet
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
