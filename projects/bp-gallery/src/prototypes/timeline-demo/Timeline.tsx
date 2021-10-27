import { Component, createRef, MutableRefObject } from "react";

export default class Timeline extends Component<
    {
        handleChange: (start: number, end: number) => void
    },
    {
        currentPivot?: EventTarget,
        selection: {
            start: number,
            end: number
        }
    }
> {

    private timeLineRef: MutableRefObject<HTMLDivElement>;

    state = {
        currentPivot: null,
        selection: {
            start: 0,
            end: 1
        }
    }

    constructor(props) {
        super(props);
        this.timeLineRef = createRef();
    }

    componentDidMount() {
        document.body.addEventListener('mousemove', this.mouseMoveListener.bind(this));
        document.body.addEventListener('mouseup', this.mouseUpListener.bind(this));
        document.body.addEventListener('mouseleave', this.mouseUpListener.bind(this));
    }

    getYear(perc) {
        return Math.round(perc * 99 + 1900);
    }

    componentWillUnmount() {
        document.body.removeEventListener('mousemove', this.mouseMoveListener);
        document.body.removeEventListener('mouseup', this.mouseUpListener);
        document.body.removeEventListener('mouseleave', this.mouseUpListener);
    }

    private mouseMoveListener(evt) {
        if (!this.state.currentPivot) {return; }
        const rect = this.timeLineRef.current.getBoundingClientRect();
        const progress = (evt.clientX - rect.left) / rect.width;
        if (this.state.currentPivot.id === 'pivot-1') {
            this.setState({selection: {
                start: Math.max(Math.min(this.state.selection.end, progress), 0),
                end: this.state.selection.end
            }});
        } else {
            this.setState({selection: {
                start: this.state.selection.start,
                end: Math.max(Math.min(1, progress), this.state.selection.start)
            }});
        }
    }

    private mouseUpListener() {
        if (!this.state.currentPivot) {return; }
        this.setState({currentPivot: null});
        this.props.handleChange(
            this.getYear(this.state.selection.start),
            this.getYear(this.state.selection.end)
        );
    }

    render() {
        const diff = (this.state.selection.end - this.state.selection.start) * 100;

        return <div id='timeline' ref={this.timeLineRef}>
                <div className='line'></div>
                <div className='pivot'
                    id="pivot-1"
                    style={{left: (this.state.selection.start * 100) + '%'}}
                    onMouseDown={(event) => {this.setState({currentPivot: event.target})}}
                >
                    <div className='pivot-label'>{this.getYear(this.state.selection.start)}</div>
                </div>
                <div
                    className='pivot'
                    id="pivot-2" style={{left: (this.state.selection.end * 100) + '%'}}
                    onMouseDown={(event) => {this.setState({currentPivot: event.target})}}
                >
                    <div className='pivot-label'>{this.getYear(this.state.selection.end)}</div>
                </div>
                <div id='selection' style={
                    {left: (this.state.selection.start * 100) + '%', width: diff + '%'}}></div>
            </div>;
    }

}
