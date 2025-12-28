'use client';

import { IconButton, useTheme } from '@mui/material';
import { WbSunny, NightlightRound } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../libs/stores';
import { toggleTheme } from '../../libs/stores/slices/theme.slice';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();
  const theme = useTheme();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={mode}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <IconButton
          onClick={() => dispatch(toggleTheme())}
          sx={{
            color: mode === 'light' ? '#fbbf24' : '#60a5fa',
            bgcolor: mode === 'light' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(96, 165, 250, 0.1)',
            '&:hover': {
              bgcolor: mode === 'light' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(96, 165, 250, 0.2)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {mode === 'light' ? (
            <WbSunny sx={{ fontSize: 24 }} />
          ) : (
            <NightlightRound sx={{ fontSize: 24 }} />
          )}
        </IconButton>
      </motion.div>
    </AnimatePresence>
  );
}
