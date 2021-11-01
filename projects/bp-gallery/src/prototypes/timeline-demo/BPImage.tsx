import React, { Component, createRef } from 'react';
import dayjs from 'dayjs';

interface TimeRangeTagType {
  id: number;
  start: string;
  end: string;
}

export default class BPImage extends Component<
  {
    image: any;
    index: number;
    apiBase: string;
    onToggleView: (open: boolean) => void;
  },
  {
    imgPosBuffer: DOMRect | null;
  }
> {
  state = {
    imgPosBuffer: null,
  };

  private containerRef: any = createRef<HTMLDivElement>();

  private onImageViewToggle() {
    if (this.props.image.isCurrentImage) {
      this.removeCurrent();
    } else {
      this.makeCurrent();
    }
  }

  componentDidMount() {
    (this.containerRef.current as HTMLDivElement).addEventListener(
      'wheel',
      this.wheelHandler.bind(this),
      {
        passive: false,
      }
    );
  }

  private formatTimeStamp(timeStamp: TimeRangeTagType) {
    const duration = dayjs(timeStamp.end).diff(dayjs(timeStamp.start), 'days');
    if (duration === 0) {
      return dayjs(timeStamp.start).format('DD.MM.YYYY');
    } else if (duration > 27 && duration < 40) {
      return dayjs(timeStamp.start).format('MM.YYYY');
    } else if (duration > 350 && duration < 400) {
      return dayjs(timeStamp.start).format('YYYY');
    } else if (duration > 400 && duration < 3700) {
      return dayjs(timeStamp.start).format('YYYY').slice(0, 3) + 'X';
    } else {
      return '19XX';
    }
  }

  private wheelHandler(event: WheelEvent) {
    if (this.props.image.isCurrentImage) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  removeCurrent() {
    if (!this.props.image.isCurrentImage) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.state.imgPosBuffer) {
      const rect: DOMRect = this.state.imgPosBuffer;
      this.containerRef.current.style.left = `${rect.left}px`;
      this.containerRef.current.style.top = `${rect.top}px`;
      this.containerRef.current.style.width = `${rect.width}px`;
      this.containerRef.current.style.height = `${rect.height}px`;
    }
    setTimeout(() => {
      this.props.onToggleView(false);
      this.containerRef.current.style.left =
        this.containerRef.current.style.top =
        this.containerRef.current.style.width =
        this.containerRef.current.style.height =
          null;
    }, 400);
  }

  makeCurrent() {
    if (this.props.image.isCurrentImage) {
      return;
    }
    const rect: DOMRect = (this.containerRef.current as HTMLDivElement).getBoundingClientRect();
    this.containerRef.current.style.left = `${rect.left}px`;
    this.containerRef.current.style.top = `${rect.top}px`;
    this.containerRef.current.style.width = `${rect.width}px`;
    this.containerRef.current.style.height = `${rect.height}px`;
    this.props.onToggleView(true);
    this.setState({ imgPosBuffer: rect });
    setTimeout(() => {
      this.containerRef.current.style.left =
        this.containerRef.current.style.top =
        this.containerRef.current.style.width =
        this.containerRef.current.style.height =
          null;
    }, 0);
  }

  render() {
    let delaysum = 1;
    return (
      <div className='image-placeholder'>
        <div
          ref={this.containerRef}
          onClick={event => {
            this.onImageViewToggle();
          }}
          className={`image-container${this.props.image.isCurrentImage ? ' view' : ''}`}
          style={{
            animationDelay: `${Math.min(2, this.props.index * 0.03)}s`,
          }}
        >
          <img
            alt={this.props.image.title.text}
            src={`${this.props.apiBase}${
              (this.props.image.isCurrentImage
                ? this.props.image.media.url
                : this.props.image.media.formats.thumbnail.url) as string
            }`}
          />
          <img
            alt={`blur_${this.props.image.title.text as string}`}
            className='blur-background'
            src={`${this.props.apiBase}${this.props.image.media.formats.thumbnail.url as string}`}
          />
          <div className='gradient-overlay' />
          {this.props.image?.time_range_tag ? (
            <div className='time-ind'>
              {this.formatTimeStamp(this.props.image.time_range_tag as TimeRangeTagType)}
            </div>
          ) : null}
          <div className='image-info'>
            <h1>{this.props.image.title.text}</h1>
            {(this.props.image.descriptions as any[]).map((desc: any, index: number) => {
              return (
                <p key={index} style={{ transitionDelay: `${(delaysum += 0.2)}s` }}>
                  {desc.text}
                </p>
              );
            })}
            <div className='tags'>
              {(this.props.image.keyword_tags as any[]).map((tag: any, index: number) => {
                return (
                  <span
                    key={index}
                    style={{ transitionDelay: `${(delaysum += 0.2)}s` }}
                    className='tag keyword'
                  >
                    {tag.name}{' '}
                  </span>
                );
              })}
              {(this.props.image.category_tags as any[]).map((tag: any, index: number) => {
                return (
                  <span
                    key={index}
                    style={{ transitionDelay: `${(delaysum += 0.2)}s` }}
                    className='tag category'
                  >
                    {tag.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
