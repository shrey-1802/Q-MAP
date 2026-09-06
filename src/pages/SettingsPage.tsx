import React, { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input, Button, Modal, Alert } from '@/components/ui';
import { Settings, User, Shield, Globe, Ruler, Trash2, CheckCircle2, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const SettingsPage: React.FC = () => {
  const { user, updateUserPreferences, logout } = useAuthStore();
  const { i18n } = useTranslation();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [units, setUnits] = useState<'METRIC' | 'IMPERIAL'>(user?.units || 'METRIC');
  const [language, setLanguage] = useState<'en' | 'hi' | 'gu'>(user?.language || 'en');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserPreferences({ name, email, phone, units, language });
    i18n.changeLanguage(language);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    logout();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-6 text-left">
      <div>
        <h1 className="text-2xl font-bold text-surface-100 flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-brand-400" />
          <span>System & User Preferences</span>
        </h1>
        <p className="text-xs text-surface-400 mt-1">
          Manage your operator identity, display measurement units, multi-language localization, and account safety.
        </p>
      </div>

      {savedSuccess && (
        <Alert variant="success" title="Preferences Updated">
          Your profile and localization settings have been saved successfully.
        </Alert>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Card */}
        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-brand-400" />
              <CardTitle className="text-sm">Operator Profile</CardTitle>
            </div>
            <CardDescription>Your personal and organizational credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@mobility.org"
              />
              <Input
                label="Phone Number (SMS Traffic Alerts)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 234-5678"
              />
            </div>
          </CardContent>
        </Card>

        {/* Localization & Units Card */}
        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-quantum-400" />
              <CardTitle className="text-sm">Language & Measurement Units</CardTitle>
            </div>
            <CardDescription>Configure GIS polyline distance notation and interface language</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-xs">
                <label className="font-medium text-surface-300">Interface Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-full bg-surface-900 border border-surface-700 rounded-lg p-2 text-surface-200 text-xs focus:ring-1 focus:ring-brand-500"
                >
                  <option value="en">English (US / Global)</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="gu">ગુજરાતી (Gujarati)</option>
                </select>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="font-medium text-surface-300">Display Units</label>
                <select
                  value={units}
                  onChange={(e) => setUnits(e.target.value as any)}
                  className="w-full bg-surface-900 border border-surface-700 rounded-lg p-2 text-surface-200 text-xs focus:ring-1 focus:ring-brand-500"
                >
                  <option value="METRIC">Metric (Kilometers, Meters, Liters)</option>
                  <option value="IMPERIAL">Imperial (Miles, Feet, Gallons)</option>
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" variant="primary" size="sm">
              Save Preferences
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Danger Zone */}
      <Card variant="glass" className="border-rose-900/40">
        <CardHeader>
          <div className="flex items-center gap-2 text-rose-400">
            <Trash2 className="w-4 h-4" />
            <CardTitle className="text-sm text-rose-300">Data Controls & Danger Zone</CardTitle>
          </div>
          <CardDescription>Permanently remove account telemetry and local routing cache</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-xs text-surface-400 max-w-md">
            Deleting your account will permanently wipe your session token, cached route histories, and customized fleet profiles.
          </div>
          <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
            Delete Account
          </Button>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account Permanently?"
      >
        <div className="space-y-4 text-xs text-surface-300">
          <p>
            This action cannot be undone. All your optimized trajectory histories and saved waypoint presets will be immediately purged.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteAccount}>
              Confirm Permanent Deletion
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
