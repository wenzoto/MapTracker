import { observer } from 'mobx-react-lite';
import { objectsStore } from '@/stores/objectsStore.ts';
import { ObjectMarker } from '@/components/ObjectMarker.tsx';

export const MarkersLayer = observer(() => {
    const objects = objectsStore.objectsArray;

    return (
        <>
            {
                objects.map(obj => <ObjectMarker key={obj.id} obj={obj} />)
            }
        </>
    );
});
