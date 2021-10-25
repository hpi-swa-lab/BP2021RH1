import dayjs from "dayjs";
import { Component, createRef } from "react";

export default class BPImage extends Component<
    {
        image: any,
        index: number,
        apiBase: string,
        onToggleView: (open: boolean) => void
    },
    {
        imgPosBuffer?: DOMRect
    }
> {

    state = {
        imgPosBuffer: null
    }

    private containerRef = createRef<HTMLDivElement>();

    private onImageViewToggle() {
        if (this.props.image.isCurrentImage) {
            this.removeCurrent();
        } else {
            this.makeCurrent();
        }
    }

    componentDidMount() {
        this.containerRef.current.addEventListener('wheel', this.wheelHandler.bind(this), {passive: false});
    }

    private formatTimeStamp(timeStamp) {
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

    private wheelHandler(event) {
        if (this.props.image.isCurrentImage) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    removeCurrent() {
        if (!this.props.image.isCurrentImage){return; }
        if (this.state.imgPosBuffer) {
            const rect = this.state.imgPosBuffer;
            this.containerRef.current.style.left = `${rect.left}px`;
            this.containerRef.current.style.top = `${rect.top}px`;
            this.containerRef.current.style.width = `${rect.width}px`;
            this.containerRef.current.style.height = `${rect.height}px`;
        }
        setTimeout(() => {
            this.props.onToggleView(false);
            this.containerRef.current.style.left = this.containerRef.current.style.top
            = this.containerRef.current.style.width = this.containerRef.current.style.height = null;
        }, 400);
    }

    makeCurrent() {
        if (this.props.image.isCurrentImage){return; }
        const rect = this.containerRef.current.getBoundingClientRect();
        this.containerRef.current.style.left = `${rect.left}px`;
        this.containerRef.current.style.top = `${rect.top}px`;
        this.containerRef.current.style.width = `${rect.width}px`;
        this.containerRef.current.style.height = `${rect.height}px`;
        this.props.onToggleView(true);
        this.setState({imgPosBuffer: rect});
        setTimeout(() => {
            this.containerRef.current.style.left = this.containerRef.current.style.top
            = this.containerRef.current.style.width = this.containerRef.current.style.height = null;
        }, 0);
    }

    render(){
        let delaysum = 1;
        return <div className='image-placeholder'>
                <div
                ref={this.containerRef}
                onClick={(event) => {this.onImageViewToggle()}}
                className={'image-container' + (this.props.image.isCurrentImage ? ' view' : '')}
                style={{
                    animationDelay: (Math.min(2, this.props.index * 0.03)) + 's'
                }}
            >
                <img alt={this.props.image.title.text} src={this.props.apiBase +
                    (this.props.image.isCurrentImage ? this.props.image.media.url : this.props.image.media.formats.thumbnail.url)
                }/>
                <img alt={'blur_' + this.props.image.title.text}className='blur-background' src={this.props.apiBase + this.props.image.media.formats.thumbnail.url}/>
                <div className='gradient-overlay'></div>
                {this.props?.image?.time_range_tag ? <div className='time-ind'>{this.formatTimeStamp(this.props.image.time_range_tag)}</div> : null}
                <div className='image-info'>
                    <h1>{this.props.image.title.text}</h1>
                    {this.props.image.descriptions.map((desc, index) => {
                        return <p key={index} style={{transitionDelay: (delaysum += 0.2) + 's'}}>{desc.text}</p>;
                    })}
                    <div className='tags'>
                        {
                            this.props.image.keyword_tags.map((tag, index) => {
                                return <span key={index} style={{transitionDelay: (delaysum += 0.2) + 's'}} className='tag keyword'>{tag.name} </span>;
                            })
                        }
                        {
                            this.props.image.category_tags.map((tag, index) => {
                                return <span key={index} style={{transitionDelay: (delaysum += 0.2) + 's'}} className='tag category'>{tag.name}</span>;
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    }

}
