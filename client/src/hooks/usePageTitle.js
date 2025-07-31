import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    const baseTitle = 'Wishify';
    document.title = title ? `${baseTitle} | ${title}` : baseTitle;
  }, [title]);
};

export default usePageTitle; 