import React from 'react';
import Box from '@mui/material/Box';
import ShortcutBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import classes from './style.module.css';
import Tooltip from '@mui/material/Tooltip';

interface AppBarProps {
	onUndo: () => void;
	onRedo: () => void;
	canUndo: boolean;
	canRedo: boolean;
}

export function ActionBar({ onUndo, canUndo, onRedo, canRedo }: AppBarProps) {
	return (
		<ShortcutBar position='absolute' color='transparent' elevation={1}>
			<Toolbar variant='dense'>
        <Tooltip title="Undo">
          <IconButton edge='start' color='inherit' disabled={canUndo} onClick={onUndo}>
            <UndoIcon fontSize='small' />
          </IconButton>
				</Tooltip>
				<Box className={classes.pipe} />
        <Tooltip title="Redo">
          <IconButton edge='start' color='inherit' disabled={canRedo} onClick={onRedo}>
            <RedoIcon fontSize='small' />
          </IconButton>
				</Tooltip>
			</Toolbar>
		</ShortcutBar>
	);
}
