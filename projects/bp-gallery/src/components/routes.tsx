import { RouteConfig, RouteConfigComponentProps } from 'react-router-config';
import { Redirect } from 'react-router-dom';
import Demo from '../prototypes/demo';
import TimeLineDemo from '../prototypes/timeline-demo';
import { TagType } from '../types/additionalFlatTypes';
import { AdminView } from './views/admin/AdminView';
import { ArchivesView } from './views/admin/archive/ArchivesView';
import { ChangePasswordView } from './views/admin/user/ChangePasswordView';
import { ForgotPasswordView } from './views/admin/user/ForgotPasswordView';
import PermissionsView from './views/admin/user/PermissionsView';
import { ResetPasswordView } from './views/admin/user/ResetPasswordView';
import { UserView } from './views/admin/user/UserView';
import { UsersView } from './views/admin/user/UsersView';
import ArchiveEditView from './views/archives/ArchiveEditView';
import ArchiveView from './views/archives/ArchiveView';
import BrowseView from './views/browse/BrowseView';
import BulkEditView from './views/bulk-edit/BulkEditView';
import CollectionCuratingView from './views/collection-curating/CollectionCuratingView';
import ContactFormView from './views/contact/ContactFormView';
import DiscoverView from './views/discover/DiscoverView';
import GeoView from './views/geoguessr/GeoView';
import LatestPicturesView from './views/latest-pictures/LatestPicturesView';
import PictureView from './views/picture/PictureView';
import SearchView from './views/search/SearchView';
import ShowMoreView from './views/show-more/ShowMoreView';
import StartView from './views/start/StartView';
import TagTableView from './views/tag-table/TagTableView';
import TermsOfServiceView from './views/terms-of-service/TermsOfServiceView';
import UnverifiedCommentsView from './views/unverified-comments/UnverifiedCommentsView';
import UploadsView from './views/uploads/UploadsView';

export const FALLBACK_PATH = '/start';

const routes: RouteConfig[] = [
  {
    path: '/start',
    render: () => {
      return <StartView />;
    },
    exact: true,
  },
  {
    path: '/latest',
    render: () => {
      return <LatestPicturesView />;
    },
    exact: true,
  },
  {
    path: '/browse/:path+',
    // see https://stackoverflow.com/a/56162747 for details on the '+' in the path
    render: ({ match }: RouteConfigComponentProps<{ path: '' }>) => {
      const browseParams = match.params.path.split('/');
      return <BrowseView path={browseParams} />;
    },
  },
  {
    path: '/search',
    render: () => {
      return <SearchView />;
    },
    exact: true,
  },
  {
    path: '/uploads-overview',
    render: () => {
      return <UploadsView />;
    },
    exact: true,
  },
  {
    path: '/comment-overview',
    render: () => {
      return <UnverifiedCommentsView />;
    },
    exact: true,
  },
  {
    path: '/picture/:id',
    render: ({ match }: RouteConfigComponentProps<{ id: '' }>) => {
      return <PictureView initialPictureId={match.params.id} />;
    },
  },
  {
    path: '/bulk-edit/:ids',
    render: ({ match }: RouteConfigComponentProps<{ ids: '' }>) => {
      return <BulkEditView pictureIds={match.params.ids.split(',')} />;
    },
  },
  {
    path: '/tags/keywords',
    render: () => {
      return <TagTableView type={TagType.KEYWORD} />;
    },
  },
  {
    path: '/tags/locations',
    render: () => {
      return <TagTableView type={TagType.LOCATION} />;
    },
  },
  {
    path: '/tags/people',
    render: () => {
      return <TagTableView type={TagType.PERSON} />;
    },
  },
  {
    path: '/collections-overview',
    render: () => {
      return <CollectionCuratingView />;
    },
  },
  {
    path: '/terms-of-service',
    render: () => {
      return <TermsOfServiceView />;
    },
  },
  {
    path: '/contact',
    render: () => {
      return <ContactFormView />;
    },
  },
  {
    path: '/admin/user/:id/permissions',
    render({ match }: RouteConfigComponentProps<{ id: '' }>) {
      return <PermissionsView userId={match.params.id} />;
    },
  },
  {
    path: '/admin/user/:id',
    render({ match }: RouteConfigComponentProps<{ id: '' }>) {
      return <UserView id={match.params.id} />;
    },
  },
  {
    path: '/admin/users',
    render: () => {
      return <UsersView />;
    },
  },
  {
    path: '/admin/archives',
    render: () => {
      return <ArchivesView />;
    },
  },
  {
    path: '/admin',
    render: () => {
      return <AdminView />;
    },
  },
  {
    path: '/forgot-password',
    render: () => {
      return <ForgotPasswordView />;
    },
  },
  {
    path: '/reset-password',
    render: () => {
      return <ResetPasswordView />;
    },
  },
  {
    path: '/change-password',
    render: () => {
      return <ChangePasswordView />;
    },
  },
  {
    path: '/prototypes/demo',
    component: Demo,
  },
  {
    path: '/prototypes/timeline-demo',
    component: TimeLineDemo,
  },
  {
    path: '/archives/:id/edit',
    render: ({ match }: RouteConfigComponentProps<{ id: '' }>) => {
      return <ArchiveEditView archiveId={match.params.id} />;
    },
  },
  {
    path: '/archives/:id/show-more/:type/:categoryId?',
    render: ({ match }: RouteConfigComponentProps<{ id: ''; type: ''; categoryId: '' }>) => {
      return (
        <ShowMoreView
          archiveId={match.params.id}
          categoryType={match.params.type}
          categoryId={match.params.categoryId}
        />
      );
    },
  },
  {
    path: '/archives/:id',
    render: ({ match }: RouteConfigComponentProps<{ id: '' }>) => {
      return <ArchiveView archiveId={match.params.id} />;
    },
  },
  {
    path: '/show-more/:type/:categoryId?',
    render: ({ match }: RouteConfigComponentProps<{ type: ''; categoryId: '' }>) => {
      return <ShowMoreView categoryType={match.params.type} categoryId={match.params.categoryId} />;
    },
  },
  {
    path: '/discover',
    render: () => {
      return <DiscoverView />;
    },
    exact: true,
  },
  {
    path: '/geo',
    render: () => {
      return <GeoView />;
    },
    exact: true,
  },
  {
    // fallback component for unmatched routes
    render: () => {
      return <Redirect to={FALLBACK_PATH} />;
    },
  },
];

export default routes;
