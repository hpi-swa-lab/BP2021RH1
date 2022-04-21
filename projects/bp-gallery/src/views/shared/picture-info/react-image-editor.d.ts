declare module '@toast-ui/react-image-editor' {
  import ImageEditor from 'tui-image-editor';

  type Props = ConstructorParameters<typeof ImageEditor>[1] & { ref: any };

  export default function BaseImageEditor(props: Props): JSX.Element;
}
