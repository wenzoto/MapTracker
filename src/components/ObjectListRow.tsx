import { ListItem, ListItemText, Chip } from '@mui/material';
import type { RowComponentProps } from 'react-window';

import type { TRowProps } from '@/types/trackable';

export const ObjectListRow = ({
    index,
    style,
    objects,
}: RowComponentProps<TRowProps>) => {
    const obj = objects[index];

    return (
        <div style={ style }>
            <ListItem
                divider
                secondaryAction={
                    <Chip
                        size="small"
                        label={ obj.status === 'active' ? 'Активний' : 'Втрачено' }
                        color={ obj.status === 'active' ? 'success' : 'default' }
                    />
                }
            >
                <ListItemText
                    primary={ obj.id }
                    secondary={ `${obj.lat.toFixed(4)}, ${obj.lng.toFixed(4)} · ${Math.round(obj.direction)}°` }
                />
            </ListItem>
        </div>
    );
};
