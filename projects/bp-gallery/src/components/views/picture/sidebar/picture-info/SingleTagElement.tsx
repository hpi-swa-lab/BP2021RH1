import { ArrowRight } from '@mui/icons-material';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatTag } from '../../../../../types/additionalFlatTypes';

type TagOption = {
  id?: string;
  name: string;
  icon?: ReactNode;
};

const RootTagElement = ({ option, label }: { option: TagOption; label: string }) => {
  return (
    <div className='recommendation-item-name'>
      {option.icon}
      {label}
    </div>
  );
};

const SinglePathTagElement = ({
  tagSupertags,
  option,
  label,
}: {
  tagSupertags: FlatTag[][];
  option: TagOption;
  label: string;
}) => {
  return (
    <div className='recommendation-item-parents'>
      {tagSupertags[0].map((tag, index) => (
        <div key={index} className='recommendation-item'>
          {index >= 1 && <ArrowRight />}
          <div className='recommendation-item-name'>{tag.name}</div>
        </div>
      ))}
      {option.icon}
      {tagSupertags[0].length ? <ArrowRight /> : null}
      <div className='recommendation-item-name'>{label}</div>
    </div>
  );
};

const MultiPathTagElement = ({
  tagSupertags,
  option,
  highlighted,
}: {
  tagSupertags: FlatTag[][];
  option: TagOption;
  highlighted?: boolean;
}) => {
  const { t } = useTranslation();
  const [isHover, setIsHover] = useState<boolean>(false);

  return (
    <div
      className='recommendation-item-parents'
      onMouseLeave={() => {
        setIsHover(false);
      }}
    >
      <div
        className='recommendation-item-multiple-paths'
        onMouseEnter={() => {
          setIsHover(true);
        }}
      >
        {t('tag-panel.multiple-paths')}
      </div>
      <ArrowRight />
      <div className='recommendation-item-name'>{option.name}</div>
      {(highlighted || (typeof highlighted === 'undefined' && isHover)) &&
        tagSupertags.map((path, i) => (
          <div className='recommendation-item-parents' key={i}>
            <div className='recommendation-item-separator'></div>
            {path.map((tag, j) => (
              <div key={j} className='recommendation-item'>
                {j >= 1 && <ArrowRight />}
                <div className='recommendation-item-name'>{tag.name}</div>
              </div>
            ))}
            {path.length ? <ArrowRight /> : null}
            <div className='recommendation-item-name'>{option.name}</div>
          </div>
        ))}
    </div>
  );
};

const SingleTagElement = ({
  tagSupertags,
  option,
  label,
  highlighted,
}: {
  tagSupertags?: FlatTag[][];
  option: TagOption;
  label: string;
  highlighted?: boolean;
}) => {
  return (
    <div className='recommendation-item-container'>
      <div className='recommendation-item-content'>
        {tagSupertags && typeof option.id === 'string' && tagSupertags.length > 0 ? (
          <>
            {tagSupertags.length > 1 ? (
              <MultiPathTagElement
                tagSupertags={tagSupertags}
                option={option}
                highlighted={highlighted}
              />
            ) : (
              <SinglePathTagElement tagSupertags={tagSupertags} option={option} label={label} />
            )}
          </>
        ) : (
          <RootTagElement option={option} label={label} />
        )}
      </div>
    </div>
  );
};

export default SingleTagElement;
