import dayjs from "dayjs";
import { Component, createRef } from "react";

export default class BPImage extends Component<
    {
        image: any,
        index: number,
        apiBase: string
    },
    {
        isCurrentImage: boolean,
        imgPosBuffer?: DOMRect
    }
> {

    state = {
        isCurrentImage: false,
        imgPosBuffer: null
    }

    private containerRef = createRef<HTMLDivElement>();

    private onImageViewToggle(event: any, img: any) {
        let target = event.target as HTMLElement;
        while (!target.classList.contains('image-container')) {
            target = target.parentElement;
        }
        if (this.state.isCurrentImage) {
            if (this.state.imgPosBuffer) {
                const rect = this.state.imgPosBuffer;
                target.style.left = `${rect.left}px`;
                target.style.top = `${rect.top}px`;
                target.style.width = `${rect.width}px`;
                target.style.height = `${rect.height}px`;
            }
            setTimeout(() => {
                this.setState({isCurrentImage: false});
                target.style.left = target.style.top
                = target.style.width = target.style.height = null;
            }, 400);
        } else {
            const rect = target.getBoundingClientRect();
            target.style.left = `${rect.left}px`;
            target.style.top = `${rect.top}px`;
            target.style.width = `${rect.width}px`;
            target.style.height = `${rect.height}px`;
            this.setState({isCurrentImage: true, imgPosBuffer: rect});
            setTimeout(() => {
                target.style.left = target.style.top
                = target.style.width = target.style.height = null;
            }, 0);
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
        if (this.state.isCurrentImage) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    render(){
        let delaysum = 1;
        return <div className='image-placeholder'>
                <div
                ref={this.containerRef}
                onClick={(event) => {this.onImageViewToggle(event, this.props.image)}}
                className={'image-container' + (this.state.isCurrentImage ? ' view' : '')}
                style={{
                    animationDelay: (Math.min(2, this.props.index * 0.03)) + 's'
                }}
            >
                <img alt={this.props.image.title.text} src={this.props.apiBase +
                    (this.state.isCurrentImage ? this.props.image.media.url : this.props.image.media.formats.thumbnail.url)
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
