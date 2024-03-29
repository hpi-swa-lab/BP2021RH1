import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { useGetRootCollectionQuery } from '../../../graphql/APIConnector';
import { useCanUseCollectionCuratingView } from '../../../hooks/can-do-hooks';
import ProtectedRoute from '../../common/ProtectedRoute';
import './CollectionCuratingView.scss';
import CollectionsPanel from './CollectionsPanel';

const CollectionCuratingView = () => {
  const [panels, setPanels] = useState<string[]>([]);

  const { data: rootCollection } = useGetRootCollectionQuery();

  useEffect(() => {
    // No flattening since we only need the id here
    const id = rootCollection?.browseRootCollection?.data?.attributes?.current?.data?.id;
    if (id) {
      setPanels([id]);
    }
  }, [rootCollection]);

  const { canUseCollectionCuratingView, loading: canUseCollectionCuratingViewLoading } =
    useCanUseCollectionCuratingView();

  return (
    <ProtectedRoute
      canUse={canUseCollectionCuratingView}
      canUseLoading={canUseCollectionCuratingViewLoading}
    >
      <div className='panel-container'>
        {Object.values(panels).map((collectionId, index) => (
          <CollectionsPanel
            key={index}
            parentId={collectionId}
            onSelectChild={child => {
              setPanels(oldPanels => {
                if (index + 1 >= oldPanels.length) {
                  oldPanels.push(child.id);
                } else {
                  oldPanels[index + 1] = child.id;
                }
                oldPanels = oldPanels.slice(0, index + 2);
                return cloneDeep(oldPanels);
              });
            }}
          />
        ))}
      </div>
    </ProtectedRoute>
  );
};

export default CollectionCuratingView;
