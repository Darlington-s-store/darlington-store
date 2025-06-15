
import { useEffect } from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';

const FaviconUpdater = () => {
  const { settings } = useAppSettings();

  useEffect(() => {
    if (settings?.favicon_url) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = settings.favicon_url;
    }
  }, [settings?.favicon_url]);

  return null;
};

export default FaviconUpdater;
