'use client';

import { useState } from 'react';
import { useHotkeys } from '@/commons/hooks/use-hotkeys';
import { CommandPaletteDialog } from '@/components/dialogs/system/command-palette-dialog';

export function HotkeysProvider() {
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useHotkeys({
    onOpenCommandPalette: () => setIsCommandOpen(true),
  });

  return (
    <CommandPaletteDialog
      open={isCommandOpen}
      onOpenChange={setIsCommandOpen}
    />
  );
}
