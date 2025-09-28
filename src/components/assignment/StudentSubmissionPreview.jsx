import { useEffect } from 'react';
import DownloadPreviewer from './DownloadPreviewer';

export default function StudentSubmissionPreview() {
  useEffect(() => {
    const DP = new DownloadPreviewer({ enableTools: false });
    return () => {
      try { DP.remove(); } catch (_) {}
    };
  }, []);
  return null;
}

