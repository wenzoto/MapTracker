import { Box, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { List } from 'react-window';

import { objectsStore } from '@/stores/objectsStore';
import { ObjectListRow } from './ObjectListRow';

export const ObjectList = observer(() => {
    const objects = objectsStore.objectsArray;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
                <Typography variant="h6">Обʼєкти ({objects.length})</Typography>
            </Box>

            <Box sx={{ flex: 1, minHeight: 0 }}>
                <List
                    rowCount={ objects.length }
                    rowHeight={ 73.02 }
                    rowComponent={ ObjectListRow }
                    rowProps={ { objects } }
                    overscanCount={ 8 }
                    style={{ height: '100%', width: '100%' }}
                />
            </Box>
        </Box>
    );
});
