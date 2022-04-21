import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Location } from 'history';
import { FlatPicture } from '../../graphql/additionalFlatTypes';
import { useGetRootCollectionQuery } from '../../graphql/APIConnector';
import { useTranslation } from 'react-i18next';
import { IconButton, styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import QueryErrorDisplay from '../../components/QueryErrorDisplay';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import BrowseView from '../gallery/browse/BrowseView';
import CollectionDescription from '../gallery/browse/CollectionDescription';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import Loading from '../../components/Loading';
import SearchView from '../gallery/search/SearchView';

const MainView = ({ scrollPos, scrollHeight }: { scrollPos: number; scrollHeight: number }) => {
  const [searchSnippet, setSearchSnippet] = useState<string>('');
  const [previewPicture, setPreviewPicture] = useState<FlatPicture>();
  const [isSearchBarVisible, setIsSearchBarVisible] = useState<boolean>(true);
  const { search }: Location = useLocation();
  const { t } = useTranslation();

  const searchParams = useMemo(() => {
    return new URLSearchParams(search);
  }, [search]);

  const { data, loading, error } = useGetRootCollectionQuery();
  const collection = useSimplifiedQueryResponseData(data)?.browseRootCollection.current;
  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
    return <Loading />;
  }

  const SearchInfoTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }}>
      <IconButton className={'info-icon'}>
        <HelpOutlineIcon />
      </IconButton>
    </Tooltip>
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 220,

      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));

  return (
    <div>
      <CollectionDescription description={collection.description ?? ''} name={collection.name} />
      <SearchView scrollPos={0} scrollHeight={0} />
      <h3> {t('common.browse')} </h3>
      <BrowseView
        path={[]}
        scrollPos={0}
        scrollHeight={0}
        communityView={false}
        hideDescription={true}
      />
    </div>
  );
};

export default MainView;
