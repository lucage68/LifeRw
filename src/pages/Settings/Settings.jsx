// src/pages/Settings/Settings.jsx
import React from "react";
import translations from "../../translations";
import {
  Sun,
  Moon,
  Bell,
  Save,
  Globe,
  Download,
  Upload,
  Trash2,
  HardDrive,
  Monitor,
  Info,
  Clover
} from "lucide-react";

const Settings = () => {
  const [settings, setSettings] = React.useState({
    theme: "light",
    language: "en",
    notifications: true,
    autoSave: true,
  });

  const t = translations[settings.language];

  // Load settings from localStorage
  React.useEffect(() => {
    const savedSettings = localStorage.getItem("liferw-settings");
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      document.documentElement.classList.toggle("dark", parsedSettings.theme === "dark");
    }
  }, []);

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem("liferw-settings", JSON.stringify(newSettings));
    document.documentElement.classList.toggle("dark", newSettings.theme === "dark");
  };

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
    
    // Notify other components about language changes
    if (key === "language") {
      window.dispatchEvent(new CustomEvent("languageChanged", { 
        detail: { language: value } 
      }));
    }
  };

  const toggleTheme = () => updateSetting("theme", settings.theme === "light" ? "dark" : "light");

  const getStorageUsage = () => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length;
      }
    }
    return (total / 1024).toFixed(2);
  };

  const exportData = () => {
    const data = {
      settings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `liferw-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.settings) {
          saveSettings(data.settings);
        }
        alert(t.importSuccess);
        window.location.reload();
      } catch {
        alert(t.importError);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const clearAllData = () => {
    if (window.confirm(t.clearConfirm)) {
      localStorage.clear();
      alert(t.clearSuccess);
      window.location.reload();
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-black dark:text-white mb-2">{t.settingsTitle}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">{t.settingsDesc}</p>

      <div className="max-w-2xl mx-auto space-y-6">

        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
            <Monitor size={24} className="text-blue-500" /> {t.appearance}
          </h2>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.theme === "light" ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-blue-400" />}
              <span className="font-medium text-gray-800 dark:text-gray-200">{t.theme}</span>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.theme === "dark" ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.theme === "dark" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-800 dark:text-gray-200">{t.language}</span>
            </div>
            <select
              value={settings.language}
              onChange={(e) => updateSetting("language", e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="rw">Kinyarwanda</option>
            </select>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
            <Clover size={24} className="text-blue-500" /> {t.preferences}
          </h2>

          <div className="flex items-center justify-between mb-4">
            <span className="flex items-center gap-2"><Bell size={18} className="text-gray-600 dark:text-gray-400"/> {t.notifications}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => updateSetting("notifications", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2"><Save size={18} className="text-gray-600 dark:text-gray-400"/> {t.autoSave}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => updateSetting("autoSave", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* User Data */}
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
            <HardDrive size={24} className="text-blue-500"  /> {t.userData}
          </h2>

          <div className="flex items-center justify-between mb-4">
            <span className="font-medium text-gray-800 dark:text-gray-200">{t.storageUsage}</span>
            <span className="text-gray-600 dark:text-gray-400">{getStorageUsage()} KB</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={exportData}
              className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={18} /> {t.exportData}
            </button>

            <label className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <Upload size={18} /> {t.importData}
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
          </div>

          <button
            onClick={clearAllData}
            className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 mt-4"
          >
            <Trash2 size={18} /> {t.clearAllData}
          </button>
        </div>

        {/* App Info */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
            <Info size={24} className="text-purple-500" /> {t.appInfo}
          </h2>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between"><span>{t.version}</span><span>1.0.0</span></div>
            <div className="flex justify-between"><span>{t.builtWith}</span><span>React + Tailwind CSS</span></div>
            <div className="flex justify-between"><span>{t.lastUpdated}</span><span>{new Date().toLocaleDateString()}</span></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;